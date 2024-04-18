document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.querySelector('#svg-map');
    const bookInfoDiv = document.querySelector('#book-info');
    const genreSelect = document.querySelector('#genre-select');

    fetch('https://avauga03.github.io/Universal-Lore-Draft/assets/bookdata.json')
        .then(response => response.json())
        .then(data => setupMapInteractions(svgMap, data, bookInfoDiv, genreSelect))
        .catch(error => console.error('Error fetching the book data:', error));
});

function setupMapInteractions(svgMap, data, bookInfoDiv, genreSelect) {
    svgMap.querySelectorAll('path').forEach(path => {
        path.addEventListener('mouseenter', () => toggleHighlight(path, true));
        path.addEventListener('mouseleave', () => toggleHighlight(path, false));
        path.addEventListener('click', () => displayBooksForCountry(path.dataset.country, data, bookInfoDiv, genreSelect.value));
    });

    genreSelect.addEventListener('change', () => highlightCountriesByGenre(genreSelect.value, data, svgMap));
    highlightCountriesByGenre(genreSelect.value, data, svgMap);
}

function toggleHighlight(path, add) {
    svgMap.querySelectorAll(`[data-country="${path.dataset.country}"]`).forEach(p => p.classList.toggle('hover-effect', add));
}

function displayBooksForCountry(country, data, bookInfoDiv, genre) {
    const continent = findContinentForCountry(country, data);
    bookInfoDiv.innerHTML = `<h2>Country: ${country}</h2>`;
    const books = continent ? data[continent][genre].filter(book => book.country === country) : [];
    bookInfoDiv.innerHTML += books.length ? books.map(book => bookHTML(book)).join('') : `<p>No books found for ${genre} in ${country}.</p>`;
}

function bookHTML(book) {
    return `
        <div class="book">
            <strong>Popularity Rank in Continent:</strong> ${book['Popularity Rank in Continent']}<br>
            <strong>Title:</strong> ${book.title}<br>
            <strong>Author:</strong> ${book.author}<br>
            <strong>Rating:</strong> ${book.rating} Stars<br>
            <strong>Year:</strong> ${book.year}<br>
            <strong>Reviews:</strong> ${book.reviews}<br>
            <a href="${book.link}" target="_blank">View on Amazon</a>
        </div>`;
}

function findContinentForCountry(country, data) {
    return Object.keys(data).find(continent => data[continent].Autobiography.some(book => book.country === country));
}

function highlightCountriesByGenre(genre, data, svgMap) {
    svgMap.querySelectorAll('.genre-highlight').forEach(path => path.classList.remove('genre-highlight'));
    Object.keys(data).forEach(continent => {
        data[continent][genre]?.forEach(book => {
            svgMap.querySelectorAll(`[data-country="${book.country}"]`).forEach(path => path.classList.add('genre-highlight'));
        });
    });
}
