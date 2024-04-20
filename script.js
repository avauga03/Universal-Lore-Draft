/*This makes sure the HTML loads first and selects the elements for the SVG map, book info display area, and genre dropdown */
/* Ref: https://codepen.io/pasengop/pen/ZEVzvYa */
/* Ref: https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event */ 
/* Ref: https://www.javascripttutorial.net/javascript-dom/javascript-queryselector/ */
document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.querySelector('#svg-map');
    const bookInfo = document.querySelector('#book-info');
    const genreSelect = document.querySelector('#genre-select');

/* This Fetch gets the book data from the JSON file saved Github */
/* Ref: https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data */
/* Add an event listener so when the mouse hovers over, clicks, and leaves each path */
/* Ref: https://codepen.io/pasengop/pen/ZEVzvYa  */
/* Ref: https://codepen.io/noirsociety/pen/YzdyoQq */
/* Ref: https://codepen.io/jzpeepz/pen/PoKBWyP */
    fetch('https://avauga03.github.io/Universal-Lore-Draft/assets/bookdata.json')
        .then(response => response.json())
        .then(data => {
            svgMap.querySelectorAll('path').forEach(path => {
                path.addEventListener('mouseenter', () => mouseHighlight(path, true));
                path.addEventListener('mouseleave', () => mouseHighlight(path, false));
                path.addEventListener('click', () => showBooks(path.dataset.country, data, bookInfo, genreSelect.value));
            });
            genreSelect.addEventListener('change', () => countryHighlights(genreSelect.value, data));
            countryHighlights(genreSelect.value, data); // Initial highlight update
        })
        .catch(error => console.error('Error fetching the book data:', error));
});

function mouseHighlight(path, highlight) {
    document.querySelectorAll(`[data-country="${path.dataset.country}"]`).forEach(p => {
        p.classList.toggle('hover-effect', highlight);
    });
}

function showBooks(country, bookData, bookInfo, genre) {
    const continent = findContinent(country, bookData);
    bookInfo.innerHTML = `<h2>Country: ${country}</h2>`;
    if (continent && bookData[continent][genre]) {
        const books = bookData[continent][genre].filter(book => book.country === country);
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book';
            bookElement.innerHTML = `
                <strong>Popularity Rank in Continent:</strong> ${book['Popularity Rank in Continent']}<br>
                <strong>Book Title:</strong> ${book.title}<br>
                <strong>Author:</strong> ${book.author}<br>
                <strong>Global Rating:</strong> ${book.rating} Stars<br>
                <strong>Publication Year:</strong> ${book.year}<br>
                <strong>Customer Reviews:</strong> ${book.reviews}<br>
                <a href="${book.link}" target="_blank">View on Amazon</a>
            `;
            bookInfo.appendChild(bookElement);
        });
    } else {
        bookInfo.innerHTML += `<p>No books found for ${genre} in ${country}.</p>`;
    }
}

function countryHighlights(genre, bookData) {
    document.querySelectorAll('.genre-highlight').forEach(path => path.classList.remove('genre-highlight'));
    Object.values(bookData).forEach(region => {
        (region[genre] || []).forEach(book => {
            document.querySelectorAll(`[data-country="${book.country}"]`).forEach(path => {
                path.classList.add('genre-highlight');
            });
        });
    });
}

function findContinent(country, bookData) {
    return Object.keys(bookData).find(continent => 
        Object.values(bookData[continent]).flat().some(book => book.country === country)
    );
}
