# 🧠 datakase: Engine Data Archive

`datakase` is a structured engine specification project focused on organizing detailed metadata for internal combustion engines—beginning with the Honda K-series family. It includes tools for validating, transforming, visualizing, and filtering engine data in JSON and CSV formats.

## Features

* Engine JSON database (1 file per engine code)
* Automated schema validation and migration script
* JSON Schema definitions
* GitHub Pages-powered website for interactive browsing
* CI/CD pipelines for schema enforcement and CSV generation
* CSV generation of all engine records
* Extendable for any manufacturer or engine type (LS, 4BT, etc.)

---

## Project Structure

```bash
.
├── data/
│   └── engines/           # All engine JSON files (e.g., honda.k20a.json)
│
├── docs/                 # GitHub Pages website content
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── schemas/              # JSON Schemas by folder/project
│   └── engines.schema.json
│
├── tools/                # Python utility scripts
│   ├── validate_and_migrate.py
│   ├── export_to_csv.py
│   └── logs/
│       ├── validate_and_migrate.log
│       └── export_to_csv.log
│
├── .github/workflows/    # GitHub Actions for automation
│   └── main.yaml
│
└── README.md             # This file
```

---

## GitHub Actions

Two automated scripts run upon every push to `main`:

### Schema Validator

* Scans all `.json` files in `data/engines/`
* Loads schema from either:

  * `/schemas/engines.schema.json` (if matching folder name)
  * or `./engines.schema.json` in local directory
* Fixes structure issues, renames invalid keys, appends log
* Respects fields like `*_old`, `*_invalid`, or missing fields

### CSV Generator

* Generates `engines.csv` from the latest JSON files
* Stored in `/data/engines.csv`
* Logged in `/tools/logs/export_to_csv.log`

---

## How to Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/datakase.git
cd datakase/tools
python validate_and_migrate.py  # Validates & patches JSONs
python export_to_csv.py         # Rebuilds engines.csv
```

Make sure Python 3.8+ is installed and your working directory has access to the schema and JSON folders.

---

## GitHub Pages Website

The site lives under the `docs/` directory and is hosted at:

```
https://<your-username>.github.io/datakase/
```

It supports:

* Search
* Free-text filtering
* Column sorting
* (Soon) Faceted filtering by engine metadata

To preview locally:

```bash
cd docs
python3 -m http.server
```

Then visit `http://localhost:8000`.

---

## Contributing Engines

1. Add new JSON files to `data/engines/`, following the format of existing files.
2. Validate using `validate_and_migrate.py`
3. Submit a PR with any source citations if possible

File names should use this format:

```
<manufacturer>.<engine_code>.json  # e.g., honda.k24a.json
```

---

## Data Sources

This repository aggregates engine data from a wide range of publicly available sources. While we aim for accuracy, all contributed or derived data should be verified against official specifications before use in critical applications.

**Primary references include:**

* **Wikipedia** – for general engine specs, historical production details, and cross-market naming differences
* **Honda official websites** – especially crate engine product pages and regional vehicle catalogs

  * [Honda Performance Development (HPD)](https://hpd.honda.com)
  * [Honda Global](https://global.honda/)
* **Manufacturer Technical Docs** – where available (owner’s manuals, service bulletins, etc.)
* **Honda Enthusiast Communities**:

  * [K20A.org](https://www.k20a.org)
  * [Honda-Tech.com](https://www.honda-tech.com)
  * [Club RSX](https://www.clubrsx.com)
  * [CR-V Owners Club](https://www.crvownersclub.com)
  * [AcuraZine](https://acurazine.com)
* **Fan-curated sites and engine databases**:

  * [My Wiki Garage](https://mywikigarage.com)
  * [EngineLabs.com](https://www.enginelabs.com/)
  * [Hondata](https://www.hondata.com)
  * [Hybrid Racing](https://www.hybrid-racing.com)

We welcome contributors to cite new or corrected data sources in PRs to improve transparency and quality.

---

## License

MIT License — see `LICENSE` for full terms.

---

## Future Plans

* SVG + 3D engine/bellhousing diagrams (origin-centered)
* Swap fitment guides
* Data confidence levels
* Full vehicle cross-lookup by VIN year/model

---

PRs and feedback welcome!
