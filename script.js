document.addEventListener('DOMContentLoaded', () => {
  const sheetId = '16R25b5wjSTyjYXQ7piF6eqoencURtsqimNjRFhPGb0M';
  const apiKey = 'AIzaSyAcZ8hSHtEWOmEDh9ybD0mUyIz3AouwyEw';
  const range = 'Sheet1';
  const appListContainer = document.getElementById('app-list');
  const searchBar = document.getElementById('searchBar');
  const backButtonContainer = document.getElementById('back-button-container');
  const backButton = document.getElementById('back-button');

  let allApps = [];
  let categories = {};

  const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  // ✅ Fetch data from Google Sheets
  async function fetchData() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);

      const data = await response.json();
      if (data.values && data.values.length > 1) {
        const headers = data.values[0];
        const appsData = data.values.slice(1);

        appsData.forEach((appRow) => {
          const app = {};
          headers.forEach((header, index) => {
            app[header] = appRow[index];
          });

          // ✅ Handle multiple categories properly
          if (typeof app.Category === 'string') {
            app.Category = app.Category.split(',').map((cat) => cat.trim());
          }
          if (!Array.isArray(app.Category)) app.Category = [app.Category];

          // ✅ Store in categories
          app.Category.forEach((category) => {
            if (!categories[category]) categories[category] = [];
            categories[category].push(app);
          });

          allApps.push(app);
        });

        displayCategories(Object.keys(categories).sort());
      } else {
        appListContainer.innerHTML = '<p>No data available.</p>';
      }
    } catch (error) {
      console.error('Error loading data:', error);
      appListContainer.innerHTML = '<p>Error loading applications.</p>';
    }
  }

  // ✅ Display categories
  function displayCategories(categoriesArray) {
    appListContainer.innerHTML = '';
    backButtonContainer.classList.remove('visible'); // Hide back button

    categoriesArray.forEach((category) => {
      const card = document.createElement('div');
      card.classList.add('app-card', 'category-card');
      card.textContent = category;

      // ✅ Handle category click
      card.addEventListener('click', () => {
        displayTools(categories[category]);
      });

      appListContainer.appendChild(card);
    });
  }

  // ✅ Display apps in a category
  function displayTools(tools) {
    appListContainer.innerHTML = '';
    backButtonContainer.classList.add('visible'); // Show back button

    tools.forEach((tool) => {
      appListContainer.appendChild(createAppCard(tool));
    });
  }

  // ✅ Create app card (Fixed Links)
  function createAppCard(app) {
    const card = document.createElement('div');
    card.classList.add('app-card');

    // ✅ Ensure the link starts with http:// or https://
    const validLink = app.Link && (app.Link.startsWith('http://') || app.Link.startsWith('https://'))
      ? app.Link
      : `https://${app.Link}`;

    card.innerHTML = `
      <h2 class="app-name">${app.Name || 'No Name'}</h2>
      <p class="app-description">${app.Description || 'No description available.'}</p>
      <p class="categories">Categories: ${app.Category.join(', ') || 'None'}</p>
      <p class="app-price">Price: ${app.Pricing || 'N/A'}</p>
      <a href="${validLink || '#'}" target="_blank" rel="noopener noreferrer" class="app-link">Visit Website</a>
    `;

    return card;
  }

  // ✅ Back button to go back to categories
  backButton.addEventListener('click', () => {
    displayCategories(Object.keys(categories).sort());
  });

  // ✅ Search functionality
  searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm === '') {
      displayCategories(Object.keys(categories).sort());
      return;
    }

    const filteredApps = allApps.filter((app) =>
      app.Name.toLowerCase().includes(searchTerm) ||
      app.Category.some((category) => category.toLowerCase().includes(searchTerm)) ||
      (app.Pricing && app.Pricing.toLowerCase().includes(searchTerm)) ||
      (app.Link && app.Link.toLowerCase().includes(searchTerm))
    );

    displayTools(filteredApps);
  });

  // ✅ Load data on page load
  fetchData();
});
