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

    svgMap.querySelectorAll('path').forEach(function(path) {
        path.addEventListener('mouseenter', function() {
            this.classList.add('hover-effect');
        });

        path.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
    });
});

/