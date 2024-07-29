function renderChart(data) {
    const dates = Object.keys(data);
    const columns = new Set();

    // Collect all unique columns
    dates.forEach(date => {
        Object.values(data[date]).forEach(record => {
            Object.keys(record).forEach(key => columns.add(key));
        });
    });

    const columnNames = Array.from(columns);
    const hourlySums = {};

    dates.forEach(date => {
        Object.entries(data[date]).forEach(([time, values]) => {
            const dateTime = new Date(time);
            const hour = dateTime.getHours();
            const dateKey = date + `T${hour.toString().padStart(2, '0')}:00:00`;

            if (!hourlySums[dateKey]) {
                hourlySums[dateKey] = {};
                columnNames.forEach(col => hourlySums[dateKey][col] = 0);
            }

            columnNames.forEach(col => {
                const value = values[col] || 0;
                hourlySums[dateKey][col] += value;
            });
        });
    });

    const hours = Object.keys(hourlySums);
    const traces = columnNames.map(col => ({
        x: hours,
        y: hours.map(hour => hourlySums[hour][col]),
        type: 'bar',
        name: col,
        visible: true // Initially, all traces are visible
    }));

    const layout = {
        title: 'Interactive Data Display',
        barmode: 'group',
        xaxis: { title: 'Time' },
        yaxis: { title: 'Count' },
        showlegend: true,
        legend: {
            orientation: 'h',
            x: 0,
            y: -0.3,
            xanchor: 'left',
            yanchor: 'top'
        }
    };

    const chartDiv = document.getElementById('chart');
    const loadingDiv = document.getElementById('loading');

    // Show loading indicator
    loadingDiv.style.display = 'flex';

    Plotly.newPlot(chartDiv, traces, layout)
        .then(() => {
            // Hide loading indicator after the chart is rendered
            loadingDiv.style.display = 'none';
        });

    // Handle legend click events to toggle visibility
    chartDiv.on('plotly_legendclick', function(eventData) {
        const index = eventData.curveNumber;
        const visibility = traces[index].visible === true ? 'legendonly' : true;
        traces[index].visible = visibility;

        Plotly.restyle(chartDiv, 'visible', traces.map(trace => trace.visible));
        return false; // Prevent default legend click behavior
    });
}
