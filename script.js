document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.querySelector('#svg-map');
    const bookInfoDiv = document.querySelector('#book-info');
    const genreSelect = document.querySelector('#genre-select');

    if (svgMap && bookInfoDiv && genreSelect) {
        fetch('https://avauga03.github.io/Universal-Lore-Draft/assets/bookdata.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                svgMap.querySelectorAll('path').forEach(path => {
                    path.addEventListener('mouseenter', function() {
                        this.classList.add('hover-effect');
                    });
                    path.addEventListener('mouseleave', function() {
                        this.classList.remove('hover-effect');
                    });
                    path.addEventListener('click', function() {
                        svgMap.querySelectorAll('path').forEach(p => p.classList.remove('selected'));
                        this.classList.add('selected'); // Add 'selected' class for visual feedback

                        const continent = findContinentForCountry(this.id, data);
                        if (continent) {
                            displayBooksForCountry(this.id, data[continent], bookInfoDiv, genreSelect.value);
                        } else {
                            bookInfoDiv.innerHTML = `<p>No book information available for ${this.id}</p>`;
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching the book data:', error);
            });
    }
});