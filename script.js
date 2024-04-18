document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.querySelector('#svg-map');
    const bookInfoDiv = document.querySelector('#book-info');
    const genreSelect = document.querySelector('#genre-select');

    // Fetch the book data from the JSON file
    fetch('https://avauga03.github.io/Universal-Lore-Draft/assets/bookdata.json')
        .then(response => response.json())
        .then(data => {
            // Add event listeners to each country path in the SVG map
            svgMap.querySelectorAll('path').forEach(path => {
                path.addEventListener('mouseenter', () => path.classList.add('hover-effect'));
                path.addEventListener('mouseleave', () => path.classList.remove('hover-effect'));
                path.addEventListener('click', function() {
                    const countryIdentifier = getCountryIdentifier(this);
                    svgMap.querySelectorAll('.selected').forEach(selected => selected.classList.remove('selected'));
                    this.classList.add('selected');
                    displayBooksForCountry(countryIdentifier, data, bookInfoDiv, genreSelect.value);
                });
            });

            // Handle genre selection change
            genreSelect.addEventListener('change', () => {
                highlightCountriesByGenre(genreSelect.value, data, svgMap);
            });

            // Initial highlighting on page load
            highlightCountriesByGenre(genreSelect.value, data, svgMap);
        })
        .catch(error => console.error('Failed to fetch book data:', error));
});

// Function to retrieve the country identifier from an SVG path element
function getCountryIdentifier(element) {
    return element.getAttribute('name') || element.getAttribute('class').split(' ')[0]; // Assuming the first class is the country name if multiple classes exist.
}

// Function to display books for a selected country
function displayBooksForCountry(countryIdentifier, bookData, bookInfoDiv, genre) {
    const continent = findContinentForCountry(countryIdentifier, bookData);
    bookInfoDiv.innerHTML = '';
    if (continent) {
        const books = bookData[continent][genre] || [];
        if (books.length > 0) {
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
            bookInfoDiv.innerHTML = `<p>No books found for genre ${genre} in ${countryIdentifier}.</p>`;
        }
    } else {
        bookInfoDiv.innerHTML = `<p>No continent data available for ${countryIdentifier}.</p>`;
    }
}

// Function to find the continent for a given country identifier
function findContinentForCountry(countryIdentifier, bookData) {
    for (let continent in bookData) {
        if (Object.values(bookData[continent]).flat().some(book => book.country === countryIdentifier)) {
            return continent;
        }
    }
    return null; // Return null if no continent is found
}

// Function to highlight countries based on the selected genre
function highlightCountriesByGenre(genre, bookData, svgMap) {
    svgMap.querySelectorAll('.genre-highlight').forEach(path => path.classList.remove('genre-highlight'));
    Object.keys(bookData).forEach(continent => {
        const genreBooks = bookData[continent][genre];
        if (genreBooks) {
            genreBooks.forEach(book => {
                const countryPath = svgMap.querySelector(`[name="${book.country}"], [class="${book.country}"]`);
                if (countryPath) {
                    countryPath.classList.add('genre-highlight');
                } else {
                    console.log("Missing country for genre highlight:", book.country);
                }
            });
        }
    });
}
