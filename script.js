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
/* Using an Immediately-Invoked Function Expression, the countries highlight immediately as soon as you choose the genre */
/* Ref: https://developer.mozilla.org/en-US/docs/Glossary/IIFE */
/* Promise.prototype.catch() for catching errors */
/* Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch */
    fetch('https://avauga03.github.io/Universal-Lore-Draft/assets/bookdata.json')
        .then(response => response.json())
        .then(data => {
            svgMap.querySelectorAll('path').forEach(path => {
                path.addEventListener('mouseenter', () => mouseHighlight(path, true));
                path.addEventListener('mouseleave', () => mouseHighlight(path, false));
                path.addEventListener('click', () => showBooks(path.dataset.country, data, bookInfo, genreSelect.value));
            });
            genreSelect.addEventListener('change', () => countryHighlights(genreSelect.value, data));
            countryHighlights(genreSelect.value, data); 
        })
        .catch(error => console.error('There is an error when trying to fetch the book data:', error));
});

/* This Toggles the 'hover-effect' class based on when the mouse enters the path or leaves it */ 
/* Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals */
/* Ref: https://www.javascripttutorial.net/javascript-dom/javascript-classlist/ */
function mouseHighlight(path, highlight) {
    document.querySelectorAll(`[data-country="${path.dataset.country}"]`).forEach(svgPath => {
        svgPath.classList.toggle('hover-effect', highlight);
    });
}

/* The function chooses the continent for the country and then retrieves the book data */
/* Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals */
/* Ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML */
/* Find the books chosen on the data structure and filter on the books that equal the condition set*/
/* Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality */
/* Then show the book information on the webpage using append */
/* Ref: https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild */
/* If the condition is false, a message is provided saying there are no books */
/* Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling */
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
        bookInfo.innerHTML += `<p>There are no books found for ${genre} in ${country}.</p>`;
    }
}

/* This function */
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
