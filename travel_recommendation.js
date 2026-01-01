// Task 6, 7, 8, 9: JavaScript for search functionality and recommendations

let travelData = null;

// Fetch data from JSON file when page loads
fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        travelData = data;
        console.log('Travel data loaded successfully:', data);
    })
    .catch(error => console.error('Error loading travel data:', error));

// Task 7: Search function with keyword matching
function searchRecommendations() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');

    if (!searchInput) {
        alert('Please enter a search keyword (beach, temple, or country)');
        return;
    }

    if (!travelData) {
        alert('Data is still loading. Please try again.');
        return;
    }

    // Clear previous results
    resultsContainer.innerHTML = '';

    let results = [];
    let searchType = '';

    // Task 7: Handle keyword variations (beaches/beach, temples/temple, countries/country)
    if (searchInput.includes('beach')) {
        results = travelData.beaches;
        searchType = 'Beaches';
    } else if (searchInput.includes('temple')) {
        results = travelData.temples;
        searchType = 'Temples';
    } else if (searchInput.includes('country') || searchInput.includes('countries')) {
        // For countries, we'll show cities from all countries
        results = [];
        travelData.countries.forEach(country => {
            country.cities.forEach(city => {
                results.push({
                    name: city.name + ', ' + country.name,
                    imageUrl: city.imageUrl,
                    description: city.description,
                    timeZone: city.timeZone
                });
            });
        });
        searchType = 'Countries';
    } else {
        // Check if the search matches a specific country name
        const matchedCountry = travelData.countries.find(country => 
            country.name.toLowerCase().includes(searchInput)
        );

        if (matchedCountry) {
            results = matchedCountry.cities.map(city => ({
                name: city.name + ', ' + matchedCountry.name,
                imageUrl: city.imageUrl,
                description: city.description,
                timeZone: city.timeZone
            }));
            searchType = matchedCountry.name;
        } else {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <h2>No results found for "${searchInput}"</h2>
                    <p>Try searching for: beach, temple, country, Japan, or Australia</p>
                </div>
            `;
            return;
        }
    }

    // Task 8: Display results
    displayResults(results, searchType);
}

// Task 8: Display recommendations with images and descriptions
function displayResults(results, searchType) {
    const resultsContainer = document.getElementById('searchResults');

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">No results found.</p>';
        return;
    }

    let html = `
        <h2 style="text-align: center; color: #667eea; margin-bottom: 2rem;">
            ${searchType} Recommendations
        </h2>
        <div class="results-grid">
    `;

    results.forEach(item => {
        // Task 10 (Optional): Display local time for destinations with timezone
        let timeDisplay = '';
        if (item.timeZone) {
            const options = { 
                timeZone: item.timeZone, 
                hour12: true, 
                hour: 'numeric', 
                minute: 'numeric', 
                second: 'numeric' 
            };
            const localTime = new Date().toLocaleTimeString('en-US', options);
            timeDisplay = `<p style="color: #764ba2; font-weight: bold; margin-top: 0.5rem;">
                Local Time: ${localTime}
            </p>`;
        }

        html += `
            <div class="result-card">
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="result-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    ${timeDisplay}
                    <a href="#" class="visit-btn">Visit Now</a>
                </div>
            </div>
        `;
    });

    html += '</div>';
    resultsContainer.innerHTML = html;

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Task 9: Clear/Reset button functionality
function clearResults() {
    const resultsContainer = document.getElementById('searchResults');
    const searchInput = document.getElementById('searchInput');

    resultsContainer.innerHTML = '';
    searchInput.value = '';

    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Allow search on Enter key press
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchRecommendations();
            }
        });
    }
});