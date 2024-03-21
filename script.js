document.addEventListener('DOMContentLoaded', function() {
    const svgMap = document.querySelector('#svg-map');

    if (!svgMap) {
        console.error('SVG map not found!');
        return;
    }

    svgMap.querySelectorAll('path').forEach(function(path) {
        path.addEventListener('mouseenter', function() {
            this.classList.add('hover-effect');
        });

        path.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
    });
});
