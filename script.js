/* This is the starting point for creating the code https://codepen.io/pasengop/details/ZEVzvYa */
document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.querySelector('#svg-map');

/* there was an error in the console before, putting if (!svgMap) made sure the ID svg-map was picked up */
    if (!svgMap) {
        console.error('SVG map not found!');
        return;
    }

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

