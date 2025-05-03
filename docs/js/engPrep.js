// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// To update this file, modify the engine_schema.json file and run the GitHub Action.

const engineSchema = [
    "engine",
    "manufacturer",
    "displacement",
    "configuration",
    "valves_per_cyl",
    "fuel_system",
    "block_material",
    "head_material",
    "bore",
    "stroke",
    "compression",
    "induction",
    "induction_type",
    "induction_pressure",
    "induction_pressure_type",
    "vvt",
    "vvt_type",
    "vvt_engage",
    "pwr_hp",
    "pwr_kw",
    "pwr_type",
    "torque",
    "power_rpm",
    "torque_rpm",
    "redline",
    "rev_limit",
    "status"
  ];
  
  function buildEngineForm() {
    const formContainer = document.getElementById("engineForm");
    if (!formContainer) return;
  
    const form = document.createElement("form");
    form.setAttribute("id", "engine-entry-form");
  
    engineSchema.forEach((key) => {
      const label = document.createElement("label");
      label.textContent = key.replace(/_/g, " ");
      label.setAttribute("for", key);
  
      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("id", key);
      input.setAttribute("name", key);
      input.classList.add("form-input");
  
      form.appendChild(label);
      form.appendChild(input);
    });
  
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Download JSON";
    submitBtn.setAttribute("type", "button");
    submitBtn.onclick = generateJSON;
  
    form.appendChild(submitBtn);
    formContainer.appendChild(form);
  }
  
  document.addEventListener("DOMContentLoaded", buildEngineForm);
  
  function generateJSON() {
    const output = {};
    engineSchema.forEach((key) => {
      output[key] = document.getElementById(key).value || "";
    });
  
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${output.engine || "engine"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  