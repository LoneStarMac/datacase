import json
import os
from datetime import datetime

SCHEMA_FILE = "../../engine_schema.json"
OUTPUT_JS_FILE = "../../docs/js/engPrep.js"
LOG_FILE = "../logs/build_engprep_js.log"

HEADER = """// This file is auto-generated from engine_schema.json\n// Do not edit directly. Use tools/build_engprep_js.py\n\n"""

TEMPLATE_START = """
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("engineForm");
  form.innerHTML = "";
"""

TEMPLATE_END = """
  const generateJSONBtn = document.createElement("button");
  generateJSONBtn.textContent = "Download JSON";
  generateJSONBtn.onclick = function () {
    const data = {};
    form.querySelectorAll("input, select").forEach((el) => {
      data[el.name] = el.value;
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${data.engine || "engine"}.json`;
    a.click();
  };
  form.appendChild(generateJSONBtn);
});
"""


def input_type(field_type):
    return {
        "str": "text",
        "int": "number",
        "float": "number",
        "bool": "checkbox",
    }.get(field_type, "text")


def generate_js():
    try:
        with open(SCHEMA_FILE, "r") as f:
            schema = json.load(f)
    except Exception as e:
        log(f"❌ Failed to read schema: {e}")
        return

    lines = [HEADER, TEMPLATE_START]

    for field, ftype in schema.items():
        field_type = ftype if isinstance(ftype, str) else ftype.get("type", "str")
        field_input = input_type(field_type)
        label = field.replace("_", " ").capitalize()

        # Dropdown support
        options = ftype.get("options") if isinstance(ftype, dict) else None
        if options:
            lines.append(f"  const {field}Select = document.createElement(\"select\");")
            lines.append(f"  {field}Select.name = \"{field}\";")
            for opt in options:
                lines.append(f"  {field}Select.innerHTML += `<option value=\"{opt}\">{opt}</option>`;")
            lines.append(f"  form.appendChild({field}Select);")
        else:
            lines.append(f"  const {field}Input = document.createElement(\"input\");")
            lines.append(f"  {field}Input.type = \"{field_input}\";")
            lines.append(f"  {field}Input.name = \"{field}\";")
            lines.append(f"  {field}Input.placeholder = \"{label}\";")
            lines.append(f"  form.appendChild({field}Input);")

        lines.append("  form.appendChild(document.createElement(\"br\"));")

    lines.append(TEMPLATE_END)

    try:
        with open(OUTPUT_JS_FILE, "w") as f:
            f.write("\n".join(lines))
        log(f"✅ Successfully generated {OUTPUT_JS_FILE}")
    except Exception as e:
        log(f"❌ Failed to write JS file: {e}")


def log(message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a") as logf:
        logf.write(f"[{timestamp}] {message}\n")


if __name__ == "__main__":
    generate_js()
