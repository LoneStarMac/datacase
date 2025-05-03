import os
import json
from jsonschema import validate, Draft7Validator, exceptions as jsonschema_exceptions

SCHEMA_FILE = "tools/engine_schema.json"
ENGINES_DIR = "data/engines"
BACKUP_DIR = "data/engines_backup"

# Load schema
with open(SCHEMA_FILE, "r") as f:
    schema = json.load(f)

# Validator instance
validator = Draft7Validator(schema)

# Ensure backup folder exists
os.makedirs(BACKUP_DIR, exist_ok=True)

# Process all .json files
for filename in os.listdir(ENGINES_DIR):
    if not filename.endswith(".json"):
        continue

    path = os.path.join(ENGINES_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"✖ Failed to parse {filename}: {e}")
            continue

    original_data = json.loads(json.dumps(data))  # Deep copy
    modified = False

    # Validate top-level keys
    top_level_keys = schema.get("properties", {}).keys()
    for key in list(data.keys()):
        if key not in top_level_keys:
            data[f"{key}_invalid"] = data.pop(key)
            modified = True

    # Validate each application
    if "applications" in data:
        for app in data["applications"]:
            for key in list(app.keys()):
                if key not in schema["properties"]["applications"]["items"]["properties"]:
                    app[f"{key}_invalid"] = app.pop(key)
                    modified = True

            # Fill missing fields with blank strings
            for expected in schema["properties"]["applications"]["items"]["properties"]:
                if expected not in app:
                    app[expected] = ""
                    modified = True

    # Re-validate
    try:
        validate(instance=data, schema=schema)
        if modified:
            # Backup original
            with open(os.path.join(BACKUP_DIR, filename), "w", encoding="utf-8") as backup:
                json.dump(original_data, backup, indent=2)

            # Write updated version
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=True)
            print(f"✔ Updated: {filename}")
        else:
            print(f"✓ Valid: {filename}")

    except jsonschema_exceptions.ValidationError as e:
        print(f"✖ Schema error in {filename}: {e.message}")
