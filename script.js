document.addEventListener('DOMContentLoaded', () => {
  const sheetId = '16R25b5wjSTyjYXQ7piF6eqoencURtsqimNjRFhPGb0M';
  const apiKey = 'AIzaSyAcZ8hSHtEWOmEDh9ybD0mUyIz3AouwyEw';
  const range = 'Sheet1';
  const appListContainer = document.getElementById('app-list');
  const searchBar = document.getElementById('searchBar');
  const backButtonContainer = document.getElementById('back-button-container');
  const backButton = document.getElementById('back-button');
  let allApps = [];
  let categories = {}; // Store categories data in memory

  const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  // Fetch data from Google Sheets
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
          allApps.push(app);
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

  // Display categories
  function displayCategories(categories) {
    appListContainer.innerHTML = '';
    backButtonContainer.classList.remove('visible'); // Hide back button
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

  // Display tools in a category
  function displayTools(tools) {
    appListContainer.innerHTML = '';
    backButtonContainer.classList.add('visible'); // Show back button
    tools.forEach(tool => {
      appListContainer.appendChild(createAppCard(tool));
    });
  }

  // Handle "Back to Categories" button click
  backButton.addEventListener('click', () => {
    displayCategories(categories); // Reuse stored categories data
  });

  // Create an app card
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

  // Search functionality
  searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredApps = allApps.filter(app => {
      return (
        app.Name.toLowerCase().includes(searchTerm) ||
        app.Category.toLowerCase().includes(searchTerm)
      );
    });
    displayTools(filteredApps);
  });
});
