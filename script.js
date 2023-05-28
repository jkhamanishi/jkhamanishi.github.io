
//(function(){
//    var grid;
//    function init() {
//        grid = new Minigrid({
//            container: '#projects',
//            item: '.project',
//            gutter: 6
//        });
//    grid.mount();
//    }
//
//    // mount
//    function update() {
//        grid.mount();
//    }
//
//    document.addEventListener('DOMContentLoaded', init);
//    window.addEventListener('resize', update);
//})();
$(function() {
    $('.projects').isotope({
        itemSelector: '.project',
        masonry: {}
    });
    console.log('here');
});


function customConfetti() {
    // Canvas Confetti
    // https://www.npmjs.com/package/canvas-confetti
    confetti({
        particleCount: 150,
        origin: { x: 0.5, y: 1},
        spread: 60,
        startVelocity: 75,
        gravity: 3,
        scalar: 1,
        zIndex: 2000,
        disableForReducedMotion: true
    });
};