document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/data.json')
        .then(response => response.json())
        .then(data => {
            renderChart(data);

            const toggleButton = document.getElementById('toggle-button');
            toggleButton.addEventListener('click', () => {
                const tableContainer = document.getElementById('table-container');
                if (tableContainer.classList.contains('hidden')) {
                    tableContainer.classList.remove('hidden');
                    toggleButton.textContent = 'Hide Data Table';
                    renderTable(data);
                } else {
                    tableContainer.classList.add('hidden');
                    toggleButton.textContent = 'Show Data Table';
                }
            });
        })
        .catch(error => console.error('Error loading data:', error));
});
