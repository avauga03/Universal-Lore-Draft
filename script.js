/* This is the starting point for creating the code https://codepen.io/pasengop/details/ZEVzvYa */
document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.querySelector('#svg-map');

/* there was an error in the console before, putting if (!svgMap) made sure the ID svg-map was picked up */
/* I think there was a timing issue, the document.querySelector('#svg-map') is trying to find the svg-map ID in HTML, before the SVG is placed in the DOM 
/* so I used truthy or falsy, the ! means if svgMap is not true (hence the error)
/* in case of svgmap is missing missed, i used a retun, going by the error meesage https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return */
/* the return; statement exits the function, preventing any further code that depends on svgMap if false */



/*  querySelectorAll() method is a JavaScript method from the DOM API that allows you to retrieve all elements that match the query parameter passed to the method. */
/* https://sebhastian.com/javascript-queryselectorall/ */
/* the mouseenter and mouseleave are event Listeners, these add a remove the path for hover effects, the class list does this based on the users mouse movements */
/* When you move the mouse into the path area, the fill color of the path changes to what's in the CSS file */
/*The addEventListener() method of the EventTarget interface sets up a function that will be called whenever the specified event is delivered to the target*/
/* https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener */

document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.querySelector('#svg-map');
    const bookInfoDiv = document.querySelector('#book-info');
    const genreSelect = document.querySelector('#genre-select');  // Select the genre dropdown

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
                    path.addEventListener('mouseenter', highlightCountry);
                    path.addEventListener('mouseleave', removeHighlight);
                    path.addEventListener('click', () => {
                        const continent = findContinentForCountry(path.id, data);
                        if (continent) {
                            displayBooksForCountry(path.id, data[continent], bookInfoDiv, genreSelect.value);
                        } else {
                            bookInfoDiv.innerHTML = `<p>No book information available for ${path.id}</p>`;
                        }
                    });
                });

                // Handle genre selection changes
                genreSelect.addEventListener('change', () => {
                    const selectedPath = svgMap.querySelector('.selected'); // Assume a class to mark selected country
                    if (selectedPath) {
                        const continent = findContinentForCountry(selectedPath.id, data);
                        if (continent) {
                            displayBooksForCountry(selectedPath.id, data[continent], bookInfoDiv, genreSelect.value);
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching the book data:', error);
            });
    }
});

function highlightCountry() {
    this.classList.add('hover-effect');
}

function removeHighlight() {
    this.classList.remove('hover-effect');
}

function displayBooksForCountry(countryId, continentData, bookInfoDiv, genre) {
    console.log("Displaying books for:", countryId, "in genre:", genre);
    const books = continentData[genre] || [];
    bookInfoDiv.innerHTML = '';

    if (books.length > 0) {
        books.sort((a, b) => a.rank - b.rank).forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book';
            bookElement.textContent = `${book.rank}. ${book.title} by ${book.author} (${book.year})`;
            bookInfoDiv.appendChild(bookElement);
        });
    } else {
        bookInfoDiv.innerHTML = `<p>No books available for ${genre} in ${countryId}</p>`;
    }
}

function findContinentForCountry(countryId, bookData) {
    // This function determines the continent for the given country
    for (let continent in bookData) {
        if (Object.values(bookData[continent]).flat().some(book => book.country === countryId)) {
            return continent;
        }
    }
    return null; // Return null if no continent is found (handle this case in your UI)
}
