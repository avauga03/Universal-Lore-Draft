document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.querySelector('#svg-map');
    const bookInfoDiv = document.querySelector('#book-info');
    const genreSelect = document.querySelector('#genre-select');

    fetch('https://avauga03.github.io/Universal-Lore-Draft/assets/bookdata.json')
        .then(response => response.json())
        .then(data => {
            svgMap.querySelectorAll('path').forEach(path => {
                path.addEventListener('mouseenter', () => path.classList.add('hover-effect'));
                path.addEventListener('mouseleave', () => path.classList.remove('hover-effect'));
                path.addEventListener('click', function() {
                    const countryIdentifier = getCountryIdentifier(this);
                    this.classList.add('selected');
                    displayBooksForCountry(countryIdentifier, data, bookInfoDiv, genreSelect.value);
                });
            });

            genreSelect.addEventListener('change', () => {
                highlightCountriesByGenre(genreSelect.value, data, svgMap);
            });

            // Initial highlighting on page load
            highlightCountriesByGenre(genreSelect.value, data, svgMap);
        })
        .catch(error => console.error('Failed to fetch book data:', error));
});

function getCountryIdentifier(pathElement) {
    return pathElement.getAttribute('name') || pathElement.getAttribute('class').split(' ')[0]; // Assuming class could have multiple classes and the country is the first one.
}

function displayBooksForCountry(countryIdentifier, bookData, bookInfoDiv, genre) {
    const continent = findContinentForCountry(countryIdentifier, bookData);
    bookInfoDiv.innerHTML = '';
    if (continent) {
        const books = bookData[continent][genre] || [];
        books.forEach(book => {
            if (book.country === countryIdentifier) {
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
            }
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
    svgMap.querySelectorAll('.genre-highlight').forEach(path => path.classList.remove('genre-highlight'));
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
