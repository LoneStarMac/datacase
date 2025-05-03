import json
import os
import datetime
from pathlib import Path

LOG_DIR = Path(__file__).parent / "logs"
LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / "schema_check.log"

SCHEMA_DIR = Path(__file__).parents[1] / "schemas"
DATA_DIR = Path(__file__).parents[1] / "data" / "engines"


def log(message: str):
    timestamp = datetime.datetime.now().isoformat()
    with open(LOG_FILE, "a") as f:
        f.write(f"[{timestamp}] {message}\n")


def load_schema():
    schema_file = None
    # Priority 1: Look for matching schema in ../schemas/<folder>.json
    schema_guess = SCHEMA_DIR / f"{DATA_DIR.name}.json"
    if schema_guess.exists():
        schema_file = schema_guess
    # Priority 2: Look for .schema.json in current directory
    elif (DATA_DIR / ".schema.json").exists():
        schema_file = DATA_DIR / ".schema.json"
    else:
        log("ERROR: No schema file found.")
        exit(1)

    try:
        with open(schema_file, "r") as f:
            schema = json.load(f)
        return schema
    except Exception as e:
        log(f"ERROR: Failed to load schema file: {e}")
        exit(1)


def try_cast(value, expected_type):
    if expected_type == "str":
        return "" if value is None else str(value)
    elif expected_type == "int":
        try:
            return int(float(value))
        except:
            return None
    elif expected_type == "float":
        try:
            return float(value)
        except:
            return None
    elif expected_type == "bool":
        return bool(value)
    elif expected_type == "list":
        return value if isinstance(value, list) else []
    else:
        return value


def validate_and_fix_json(fpath, schema):
    try:
        with open(fpath, "r") as f:
            data = json.load(f)
    except Exception as e:
        log(f"ERROR reading {fpath}: {e}")
        return False

    modified = False

    for key, val in data.items():
        if key not in schema:
            new_key = key + "_old"
            data[new_key] = val
            del data[key]
            modified = True
            log(f"Renamed unknown key '{key}' to '{new_key}' in {fpath}")

    for key, valtype in schema.items():
        if key not in data:
            data[key] = try_cast(None, valtype)
            modified = True
            log(f"Added missing key '{key}' in {fpath}")
        else:
            fixed = try_cast(data[key], valtype)
            if fixed is None:
                data[f"{key}_invalid"] = data[key]
                data[key] = try_cast(None, valtype)
                modified = True
                log(f"Fixed invalid type for key '{key}' in {fpath}")

    if modified:
        try:
            with open(fpath, "w") as f:
                json.dump(data, f, indent=2)
            log(f"Updated {fpath}")
        except Exception as e:
            log(f"ERROR writing {fpath}: {e}")
            return False

    return True


def main():
    schema = load_schema()
    success = True
    for file in DATA_DIR.glob("*.json"):
        ok = validate_and_fix_json(file, schema)
        if not ok:
            success = False

    if not success:
        log("Validation completed with errors.")
        exit(1)
    else:
        log("Validation completed successfully.")
        exit(0)


if __name__ == "__main__":
    main()
