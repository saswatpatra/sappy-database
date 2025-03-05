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
                const headers = data.values[0];
                const appsData = data.values.slice(1);
                const categories = {};

                appsData.forEach(appRow => {
                    const app = {};
                    headers.forEach((header, index) => {
                        app[header] = appRow[index];
                    });
                    const category = app.Category || 'Uncategorized';
                    if (!categories[category]) {
                        categories[category] = [];
                    }
                    categories[category].push(app);
                });

                displayCategories(categories);
            } else {
                appListContainer.innerHTML = '<p>No applications data found in the sheet.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data from Google Sheets:', error);
            appListContainer.innerHTML = '<p>Error loading applications.</p>';
        });

    function displayCategories(categories) {
        appListContainer.innerHTML = '';
        Object.keys(categories).forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.classList.add('app-card', 'category-card');
            categoryCard.textContent = category;
            categoryCard.addEventListener('click', () => {
                displayTools(categories[category]);
            });
            appListContainer.appendChild(categoryCard);
        });
    }

    function displayTools(tools) {
        appListContainer.innerHTML = '';
        tools.forEach(tool => {
            appListContainer.appendChild(createAppCard(tool));
        });
        const backButton = document.createElement('button');
        backButton.textContent = "Back to categories";
        backButton.addEventListener('click', () => {
            fetch(apiUrl) // The problematic fetch call was here, fixed below.
                .then(response => response.json())
                .then(data => {
                    if (data.values && data.values.length > 1) {
                        const headers = data.values[0];
                        const appsData = data.values.slice(1);
                        const categories = {};
                        appsData.forEach(appRow => {
                            const app = {};
                            headers.forEach((header, index) => {
                                app[header] = appRow[index];
                            });
                            const category = app.Category || 'Uncategorized';
                            if (!categories[category]) {
                                categories[category] = [];
                            }
                            categories[category].push(app);
                        });
                        displayCategories(categories);
                    }
                });
        });
        appListContainer.appendChild(backButton);
    }

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
