document.getElementById('svg-map').addEventListener('load', function() {
    const iframeDocument = this.contentDocument || this.contentWindow.document;
    
    if (iframeDocument) {
        console.log('Accessing contentDocument');
        const paths = iframeDocument.querySelectorAll('path');
        console.log(paths);

        paths.forEach(path => {
            path.addEventListener('mouseenter', () => {
                path.style.fill = '#cccccc';
            });
            path.addEventListener('mouseleave', () => {
                path.style.fill = '';
            });
        });
    } else {
        console.log('contentDocument is still null.');
    }
});
