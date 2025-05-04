// engTable.js
// Tabulator setup for Datakase engine database

// Create Tabulator instance
document.addEventListener("DOMContentLoaded", async () => {
    const tableContainer = document.getElementById("engineTable");
    if (!tableContainer) return;
  
    const response = await fetch("data/engines.csv");
    const csvText = await response.text();
  
    const table = new Tabulator("#engineTable", {
      data: parseCSV(csvText),
      layout: "fitColumns",
      pagination: "local",
      paginationSize: 25,
      movableColumns: true,
      resizableRows: true,
      columns: generateColumnsFromCSV(csvText),
    });
  
    // Hook search box
    const searchBox = document.getElementById("mainSearchBox");
    if (searchBox) {
      searchBox.addEventListener("input", () => {
        const query = searchBox.value.toLowerCase();
        table.setFilter((rowData) => {
          return Object.values(rowData).some(val => String(val).toLowerCase().includes(query));
        });
      });
    }
  
    // Expose export button
    window.exportVisibleCSV = function () {
      table.download("csv", "filtered_engines.csv");
    };
  });
  
  function parseCSV(csv) {
    const lines = csv.split("\n").filter(line => line.trim() !== "");
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map(line => {
      const values = line.split(",");
      const obj = {};
      headers.forEach((header, i) => {
        obj[header.trim()] = values[i] ? values[i].trim() : "";
      });
      return obj;
    });
    return rows;
  }
  
  function generateColumnsFromCSV(csv) {
    const firstLine = csv.split("\n")[0];
    const headers = firstLine.split(",").map(h => h.trim());
    return headers.map(header => ({
      title: header,
      field: header,
      headerFilter: true,
      sorter: "string",
    }));
  }
  