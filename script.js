document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.querySelector('#svg-map');
    const bookInfoDiv = document.querySelector('#book-info');
    const genreSelect = document.querySelector('#genre-select');

    // Fetch the book data from the JSON file
    fetch('https://avauga03.github.io/Universal-Lore-Draft/assets/bookdata.json')
        .then(response => response.json()) // Parse JSON data
        .then(data => {
            // Setup genre selection event listener
            genreSelect.addEventListener('change', () => {
                const genre = genreSelect.value;
                highlightCountriesByGenre(genre, data, svgMap); // Highlight countries by genre
                const selectedPath = svgMap.querySelector('.selected');
                if (selectedPath) {
                    displayBooksForCountry(selectedPath.id, data, bookInfoDiv, genre);
                }
            });

            // Initialize the map highlighting based on the initial genre selection
            highlightCountriesByGenre(genreSelect.value, data, svgMap);

            // Setup interactions for each country path in the SVG map
            svgMap.querySelectorAll('path').forEach(path => {
                path.addEventListener('mouseenter', () => path.classList.add('hover-effect'));
                path.addEventListener('mouseleave', () => path.classList.remove('hover-effect'));
                path.addEventListener('click', function() {
                    svgMap.querySelectorAll('.selected').forEach(p => p.classList.remove('selected'));
                    this.classList.add('selected'); // Visually mark the path as selected
                    const countryIdentifier = this.getAttribute('name') || this.getAttribute('class');
                    displayBooksForCountry(countryIdentifier, data, bookInfoDiv, genreSelect.value);
                });
            });
        })
        .catch(error => console.error('Failed to fetch book data:', error));
});

function displayBooksForCountry(countryIdentifier, bookData, bookInfoDiv, genre) {
    const continent = findContinentForCountry(countryIdentifier, bookData);
    bookInfoDiv.innerHTML = '';
    if (continent) {
        const books = bookData[continent][genre] || [];
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book';
            bookElement.innerHTML = `
                <strong>Rank:</strong> ${book.rank}<br>
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
        bookInfoDiv.innerHTML = `<p>No book information available for ${countryIdentifier}.</p>`;
    }
}

function findContinentForCountry(countryIdentifier, bookData) {
    for (let continent in bookData) {
        if (Object.values(bookData[continent]).flat().some(book => book.country === countryIdentifier)) {
            return continent;
        }
    }
    return null; // Return null if no continent is found
}

function highlightCountriesByGenre(genre, bookData, svgMap) {
    // Remove any existing highlights
    svgMap.querySelectorAll('.genre-highlight').forEach(path => {
        path.classList.remove('genre-highlight');
    });

    // Apply new highlights based on the selected genre
    Object.keys(bookData).forEach(continent => {
        const genreBooks = bookData[continent][genre];
        if (genreBooks) {
            genreBooks.forEach(book => {
                const countryPath = svgMap.querySelector(`[name="${book.country}"], [class="${book.country}"]`);
                if (countryPath) {
                    countryPath.classList.add('genre-highlight');
                }
            });
        }
    });
}
