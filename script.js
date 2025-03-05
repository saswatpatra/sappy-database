document.addEventListener('DOMContentLoaded', () => {
    const sheetId = '16R25b5wjSTyjYXQ7piF6eqoencURtsqimNjRFhPGb0M';
    const apiKey = 'AIzaSyAcZ8hSHtEWOmEDh9ybD0mUyIz3AouwyEw';
    const range = 'Sheet1';
    const appListContainer = document.getElementById('app-list');

    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.values && data.values.length > 1) {
                appListContainer.innerHTML = '';
                const headers = data.values[0];
                const appsData = data.values.slice(1);

                appsData.forEach(appRow => {
                    const app = {};
                    headers.forEach((header, index) => {
                        app[header] = appRow[index];
                    });
                    appListContainer.appendChild(createAppCard(app));
                });
            } else {
                appListContainer.innerHTML = '<p>No applications data found in the sheet.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data from Google Sheets:', error);
            appListContainer.innerHTML = '<p>Error loading applications.</p>';
        });

    function createAppCard(app) {
        const card = document.createElement('div');
        card.classList.add('app-card');

        const nameElement = document.createElement('h2');
        nameElement.textContent = app.Name || 'No Name';

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = app.Description || 'No description provided.';

        const categoriesElement = document.createElement('p');
        categoriesElement.classList.add('categories');
        categoriesElement.textContent = app.Category ? `Categories: ${app.Category}` : 'No categories listed.';

        card.appendChild(nameElement);
        card.appendChild(descriptionElement);
        card.appendChild(categoriesElement);

        return card;
    }
});
