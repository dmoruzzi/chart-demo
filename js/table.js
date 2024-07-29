function renderTable(data) {
    const dates = Object.keys(data);
    const columns = new Set();

    // Collect all unique columns
    dates.forEach(date => {
        Object.values(data[date]).forEach(record => {
            Object.keys(record).forEach(key => columns.add(key));
        });
    });

    const columnNames = Array.from(columns);
    generateTableHeader(columnNames);
    generateTableFooter(columnNames);

    const tableBody = document.getElementById('data-body');
    const hourlySums = {};
    const dailySums = {};
    const runningAverages = {};

    dates.forEach(date => {
        dailySums[date] = {};
        runningAverages[date] = {};
        columnNames.forEach(col => {
            dailySums[date][col] = 0;
            runningAverages[date][col] = [];
        });

        Object.entries(data[date]).forEach(([time, values]) => {
            const hour = time.slice(0, 13);
            if (!hourlySums[hour]) {
                hourlySums[hour] = {};
                columnNames.forEach(col => hourlySums[hour][col] = 0);
            }

            columnNames.forEach(col => {
                const value = values[col] || 0;
                hourlySums[hour][col] += value;
                dailySums[date][col] += value;
                runningAverages[date][col].push(value);
            });

            const row = document.createElement('tr');
            row.innerHTML = `<td class="border px-4 py-2">${time}</td>` +
                columnNames.map(col => `<td class="border px-4 py-2">${values[col] || 0}</td>`).join('') +
                columnNames.map(col => `<td class="border px-4 py-2">${getRunningAverage(runningAverages[date][col])}</td>`).join('');
            tableBody.appendChild(row);
        });
    });

    updateTableFooter(dailySums);
}

function generateTableHeader(columns) {
    const tableHead = document.getElementById('table-head');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th class="border px-4 py-2">Time</th>` +
        columns.map(col => `<th class="border px-4 py-2">${col}</th>`).join('') +
        columns.map(col => `<th class="border px-4 py-2">Daily ${col}</th>`).join('');
    tableHead.appendChild(headerRow);
}

function generateTableFooter(columns) {
    const tableFoot = document.getElementById('table-foot');
    const footerRow = document.createElement('tr');
    footerRow.innerHTML = `<th class="border px-4 py-2">Totals</th>` +
        columns.map(col => `<th class="border px-4 py-2" id="total-${col.toLowerCase()}"></th>`).join('') +
        columns.map(() => `<th class="border px-4 py-2"></th>`).join('');
    tableFoot.appendChild(footerRow);
}

function updateTableFooter(dailySums) {
    const totalSums = {};
    Object.values(dailySums).forEach(dailySum => {
        Object.entries(dailySum).forEach(([col, sum]) => {
            if (!totalSums[col]) totalSums[col] = 0;
            totalSums[col] += sum;
        });
    });

    Object.entries(totalSums).forEach(([col, sum]) => {
        document.getElementById(`total-${col.toLowerCase()}`).textContent = sum;
    });
}

function getRunningAverage(arr) {
    const sum = arr.reduce((a, b) => a + b, 0);
    return (sum / arr.length).toFixed(2);
}
