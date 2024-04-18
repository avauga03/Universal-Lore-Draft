document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.querySelector('#svg-map');
    const bookInfoDiv = document.querySelector('#book-info');
    const genreSelect = document.querySelector('#genre-select');

    // Fetch the book data from the JSON file
    fetch('https://avauga03.github.io/Universal-Lore-Draft/assets/bookdata.json')
        .then(response => response.json())
        .then(data => {
            svgMap.querySelectorAll('path').forEach(path => {
                // Hover effects
                path.addEventListener('mouseenter', () => path.classList.add('hover-effect'));
                path.addEventListener('mouseleave', () => path.classList.remove('hover-effect'));

                // Click event to show books for the country
                path.addEventListener('click', function() {
                    displayBooksForCountry(this.dataset.country, data, bookInfoDiv, genreSelect.value);
                });
            });

            // Handle genre selection change
            genreSelect.addEventListener('change', () => {
                highlightCountriesByGenre(genreSelect.value, data, svgMap);
            });

            // Initial highlighting based on the selected genre
            highlightCountriesByGenre(genreSelect.value, data, svgMap);
        })
        .catch(error => console.error('Error fetching the book data:', error));
});

function displayBooksForCountry(country, bookData, bookInfoDiv, genre) {
    const continent = findContinentForCountry(country, bookData);
    bookInfoDiv.innerHTML = ''; // Clear previous data
    if (continent) {
        const books = bookData[continent][genre] || [];
        const filteredBooks = books.filter(book => book.country === country); // Filter books specific to the country
        if (filteredBooks.length > 0) {
            // Add country name at the top
            bookInfoDiv.innerHTML += `<h2>Country: ${country}</h2>`;
            filteredBooks.forEach(book => {
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
    } else {
        bookInfoDiv.innerHTML = `<p>No continent data available for ${country}.</p>`;
    }
}

function findContinentForCountry(country, bookData) {
    for (let continent in bookData) {
        if (Object.values(bookData[continent]).flat().some(book => book.country === country)) {
            return continent;
        }
    }
    return null; // Return null if no continent is found
}

function highlightCountriesByGenre(genre, bookData, svgMap) {
    svgMap.querySelectorAll('.genre-highlight').forEach(path => path.classList.remove('genre-highlight'));
    Object.keys(bookData).forEach(continent => {
        const genreBooks = bookData[continent][genre];
        if (genreBooks) {
            genreBooks.forEach(book => {
                const countryPath = svgMap.querySelector(`[data-country="${book.country}"]`);
                if (countryPath) {
                    countryPath.classList.add('genre-highlight');
                }
            });
        }
    });
}
