fetch('../data/k-series-engines.csv')
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split('\n');
    const headers = rows.shift().split(',');
    const table = document.getElementById('engineTable');
    const thead = table.createTHead();
    const tbody = table.createTBody();

    const headRow = thead.insertRow();
    headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      headRow.appendChild(th);
    });

    rows.forEach(r => {
      const row = tbody.insertRow();
      r.split(',').forEach(cell => {
        const td = row.insertCell();
        td.textContent = cell;
      });
    });

    document.getElementById('search').addEventListener('input', function () {
      const val = this.value.toLowerCase();
      Array.from(tbody.rows).forEach(row => {
        row.style.display = [...row.cells].some(cell => 
          cell.textContent.toLowerCase().includes(val)) ? '' : 'none';
      });
    });
  });