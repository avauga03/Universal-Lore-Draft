document.addEventListener('DOMContentLoaded', function() {
    const objectElement = document.getElementById('svg-map');

    objectElement.addEventListener('load', function() {
        const svgDoc = objectElement.contentDocument;
        if (svgDoc) {
            const paths = svgDoc.querySelectorAll('path');
            paths.forEach(path => {
                path.addEventListener('mouseenter', () => {
                    path.style.fill = '#cccccc'; // Change color on mouse enter
                });
                path.addEventListener('mouseleave', () => {
                    path.style.fill = ''; // Reset color on mouse leave
                });
            });
        } else {
            console.error('Unable to access SVG document');
        }
    });
}); 