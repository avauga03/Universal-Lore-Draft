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
                    const countryIdentifier = this.getAttribute('name') || this.getAttribute('class');
                    if (countryIdentifier) {
                        const continent = findContinentForCountry(countryIdentifier, data);
                        if (continent) {
                            displayBooksForCountry(countryIdentifier, data[continent], bookInfoDiv, genreSelect.value);
                        } else {
                            bookInfoDiv.innerHTML = `<p>No book information available for ${countryIdentifier}.</p>`;
                        }
                    } else {
                        bookInfoDiv.innerHTML = `<p>Error: Country identifier is missing.</p>`;
                    }
                });
            });

            genreSelect.addEventListener('change', () => {
                const selectedPath = svgMap.querySelector('.selected');
                if (selectedPath) {
                    const countryIdentifier = selectedPath.getAttribute('name') || selectedPath.getAttribute('class');
                    displayBooksForCountry(countryIdentifier, data, bookInfoDiv, genreSelect.value);
                }
            });
        })
        .catch(error => console.error('Failed to fetch book data:', error));
});

function displayBooksForCountry(countryIdentifier, continentData, bookInfoDiv, genre) {
    bookInfoDiv.innerHTML = '';
    const books = continentData[genre] || [];
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
}

function findContinentForCountry(countryIdentifier, bookData) {
    for (let continent in bookData) {
        if (Object.values(bookData[continent]).flat().some(book => book.country === countryIdentifier)) {
            return continent;
        }
    }
    return null; // Return null if no continent is found
}
