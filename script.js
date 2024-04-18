document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.querySelector('#svg-map');
    const bookInfoDiv = document.querySelector('#book-info');
    const genreSelect = document.querySelector('#genre-select');

    fetch('https://avauga03.github.io/Universal-Lore-Draft/assets/bookdata.json')
        .then(response => response.json()) // Assumes response is always OK for simplicity
        .then(data => {
            svgMap.querySelectorAll('path').forEach(path => {
                path.addEventListener('mouseenter', () => path.classList.add('hover-effect'));
                path.addEventListener('mouseleave', () => path.classList.remove('hover-effect'));
                path.addEventListener('click', function() {
                    this.classList.add('selected'); // Add 'selected' class for visual feedback
                    displayBooksForCountry(this.id, data, bookInfoDiv, genreSelect.value);
                });
            });

            genreSelect.addEventListener('change', () => {
                const selectedPath = svgMap.querySelector('.selected');
                if (selectedPath) {
                    displayBooksForCountry(selectedPath.id, data, bookInfoDiv, genreSelect.value);
                }
            });
        })
        .catch(error => console.error('Failed to fetch book data:', error));
});

function displayBooksForCountry(countryId, bookData, bookInfoDiv, genre) {
    const continent = findContinentForCountry(countryId, bookData);
    if (!continent) {
        bookInfoDiv.innerHTML = `<p>No book information available for ${countryId}.</p>`;
        return;
    }

    const books = bookData[continent][genre];
    bookInfoDiv.innerHTML = '';
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
}

function findContinentForCountry(countryId, bookData) {
    for (let continent in bookData) {
        if (Object.values(bookData[continent]).flat().some(book => book.country === countryId)) {
            return continent;
        }
    }
    return null; // Return null if no continent is found (should handle this case in your UI)
}
