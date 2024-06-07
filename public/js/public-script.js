const publicReady = new Promise(resolve => {
    if (document.readyState === 'complete') {
        resolve('ready');
    } else {
        window.addEventListener('load', resolve);
    }
});

publicReady.then((resolve) => {

})