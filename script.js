document.addEventListener('DOMContentLoaded', () => {
    const sheetId = '16R25b5wjSTyjYXQ7piF6eqoencURtsqimNjRFhPGb0M'; // Replace with your Sheet ID (from the shareable link)
    const apiKey = 'AIzaSyAcZ8hSHtEWOmEDh9ybD0mUyIz3AouwyEw';       // Replace with your Google Sheets API Key
    const range = 'Sheet1';               // Replace with your sheet name if it's not 'Sheet1'
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
            if (data.values && data.values.length > 1) { // Check if there's data beyond headers
                appListContainer.innerHTML = ''; // Clear "Loading..." message
                const headers = data.values[0]; // First row is headers
                const appsData = data.values.slice(1); // Data starts from the second row

                appsData.forEach(appRow => {
                    const app = {};
                    headers.forEach((header, index) => {
                        app[header] = appRow[index]; // Create app object
                    });
                    appListContainer.appendChild(createAppCard(app)); // Create and append card
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
        nameElement.textContent = app.Name || 'No Name';  // <-- Using app.Name (Google Sheet Header)

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = app.Description || 'No description provided.'; // <-- Using app.Description (Google Sheet Header)

        const categoriesElement = document.createElement('p');
        categoriesElement.classList.add('categories');
        categoriesElement.textContent = app.Category ? `Categories: ${app.Category}` : 'No categories listed.'; // <-- Using app.Category (Google Sheet Header)

        // You can add more elements here for other data fields (e.g., operating systems, pricing, website link)

        card.appendChild(nameElement);
        card.appendChild(descriptionElement);
        card.appendChild(categoriesElement);

        return card;
    }
});
