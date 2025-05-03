import os
import json
import csv
from datetime import datetime


def log(message, log_path):
    with open(log_path, 'a', encoding='utf-8') as f:
        f.write(f"[{datetime.utcnow().isoformat()}] {message}\n")


def extract_fields(application):
    """
    Flatten application dict into a consistent row of strings or empty fields.
    """
    return {k: (v if v is not None else "") for k, v in application.items()}


def generate_csv(engine_dir, output_csv, log_file):
    headers = set()
    rows = []

    for fname in os.listdir(engine_dir):
        if not fname.endswith(".json"):
            continue

        path = os.path.join(engine_dir, fname)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            log(f"ERROR: Could not parse {fname}: {e}", log_file)
            continue

        engine_code = data.get("engine", "UNKNOWN")
        status = data.get("status", "unknown")
        applications = data.get("applications", [])

        for app in applications:
            row = extract_fields(app)
            row["engine"] = engine_code
            row["status"] = status
            rows.append(row)
            headers.update(row.keys())

    headers = sorted(headers)
    try:
        with open(output_csv, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=headers)
            writer.writeheader()
            writer.writerows(rows)
        log(f"SUCCESS: Wrote {len(rows)} rows to {output_csv}", log_file)
    except Exception as e:
        log(f"ERROR: Failed to write CSV: {e}", log_file)


if __name__ == '__main__':
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'data', 'engines'))
    OUTPUT_CSV = os.path.join(BASE_DIR, '..', 'data', 'engines.csv')
    LOG_PATH = os.path.join(BASE_DIR, 'logs', 'generate_csv.log')

    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    generate_csv(DATA_DIR, OUTPUT_CSV, LOG_PATH)
