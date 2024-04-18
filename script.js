// Wait until the document is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.querySelector('#svg-map'); // Select the SVG map element
    const bookInfoDiv = document.querySelector('#book-info'); // Select the div where book info will be displayed
    const genreSelect = document.querySelector('#genre-select'); // Select the genre dropdown menu

    // Fetch book data from a JSON file
    fetch('https://avauga03.github.io/Universal-Lore-Draft/assets/bookdata.json')
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            // Attach event listeners to each path in the SVG
            svgMap.querySelectorAll('path').forEach(path => {
                path.addEventListener('mouseenter', () => path.classList.add('hover-effect')); // Add hover effect
                path.addEventListener('mouseleave', () => path.classList.remove('hover-effect')); // Remove hover effect
                path.addEventListener('click', () => displayBooksForCountry(path.dataset.country, data, bookInfoDiv, genreSelect.value)); // Handle click
            });

            // Handle changes in genre selection
            genreSelect.addEventListener('change', () => highlightCountriesByGenre(genreSelect.value, data, svgMap));
            highlightCountriesByGenre(genreSelect.value, data, svgMap); // Initial highlighting
        })
        .catch(error => console.error('Error fetching the book data:', error)); // Handle errors
});

// Display book information for a selected country
function displayBooksForCountry(country, bookData, bookInfoDiv, genre) {
    const continent = findContinentForCountry(country, bookData); // Determine the continent
    bookInfoDiv.innerHTML = `<h2>Country: ${country}</h2>`; // Display the country name
    if (continent) {
        const books = bookData[continent][genre] || [];
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book';
            bookElement.innerHTML = `
                <strong>Popularity Rank in Continent:</strong> ${book['Popularity Rank in Continent']}<br>
                <strong>Title:</strong> ${book.title}<br>
                <strong>Author:</strong> ${book.author}<br>
                <strong>Rating:</strong> ${book.rating} Stars<br>
                <strong>Year:</strong> ${book.year}<br>
                <strong>Reviews:</strong> ${book.reviews}<br>
                <a href="${book.link}" target="_blank">View on Amazon</a>
            `;
            bookInfoDiv.appendChild(bookElement);
        });
    } else {
        bookInfoDiv.innerHTML += `<p>No books found for ${genre} in ${country}.</p>`;
    }
}

// Determine the continent for a given country
function findContinentForCountry(country, bookData) {
    for (let continent in bookData) {
        if (Object.values(bookData[continent]).flat().some(book => book.country === country)) {
            return continent;
        }
    }
    return null; // Return null if no continent is found
}

// Highlight countries that have books available in a selected genre
function highlightCountriesByGenre(genre, bookData, svgMap) {
    svgMap.querySelectorAll('.genre-highlight').forEach(path => path.classList.remove('genre-highlight'));
    Object.keys(bookData).forEach(continent => {
        const genreBooks = bookData[continent][genre];
        genreBooks.forEach(book => {
            const countryPath = svgMap.querySelector(`[data-country="${book.country}"]`);
            if (countryPath) {
                countryPath.classList.add('genre-highlight');
            }
        });
    });
}
