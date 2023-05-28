$(function() {
    // on document ready

    fetch('projects.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const container = document.getElementById('projects');
        container.innerHTML = "";
        data.forEach(projectData => {
            // Project card initialization
            const project = createAndAppendElement(container, 'div', "project col-6 mb-4");
//            var height = Math.random()*400;
//            console.log(height)
//            project.style = "background-color: blue; height: "+height+"px";
//            project.innerText = "ok"
            const card = createAndAppendElement(project, 'div', "card border-primary");
            // Header
            const header = createAndAppendElement(card, 'div', "card-header");
            const title = createAndAppendElement(header, 'h3', "");
            title.innerText = projectData.title;
            const duration = createAndAppendElement(header, 'p', "");
            duration.innerText = projectData.start + " - " + projectData.end;
            // Body
            const body = createAndAppendElement(card, 'div', "card-body container-fluid");
            const row = createAndAppendElement(body, 'div', "row");
            if (projectData.media) {
                var listContainer = createAndAppendElement(row, 'div', "col-xl-8");
                const imgContainer1 = createAndAppendElement(row, 'div', "col-xl-4 d-flex mt-3");
                if (projectData.link) {
                    // Link
                    const link = createAndAppendElement(imgContainer1, 'a', "");
                    link.href = projectData.link;
                    link.target = "_blank";
                    // Image
                    const imgContainer2 = createAndAppendElement(link, 'div', "photo-box justify-content-center");
                    imgContainer2.style = "position: relative; text-align: center;";
                    const img = createAndAppendElement(imgContainer2, 'img', "img-fluid");
                    img.src = projectData.media;
                    img.style = "filter: blur(1px); -webkit-filter: blur(1px);";
                    // Link button
                    const button = createAndAppendElement(imgContainer2, "span", "badge rounded-pill bg-info me-1");
                    button.innerText = "Show Project"
                    button.style = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
                } else {
                    // Image
                    const imgContainer2 = createAndAppendElement(imgContainer1, 'div', "photo-box justify-content-center");
                    const img = createAndAppendElement(imgContainer2, 'img', "img-fluid");
                    img.src = projectData.media;
                }
            } else {
                var listContainer = createAndAppendElement(row, 'div', "col-xl-12");
            }
            const list = createAndAppendElement(listContainer, 'ul', "mb-0");
            projectData.description.forEach(desc => {
                const description = createAndAppendElement(listContainer, "li", "");
                description.innerText = desc;
            });
            // Footer
            const footer = createAndAppendElement(card, 'div', "card-footer");
            projectData.tags.forEach(tag => {
                const tagElement = createAndAppendElement(footer, "span", "badge rounded-pill bg-primary me-1");
                tagElement.innerText = tag;
            });
        });
    })
    .then(() => {
        Promise.all(
            // Wait for all images to load
            Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
                img.onload = img.onerror = resolve;
            }))
        )
        .then( () => {
            // Run isotope once all images are loaded
            $('#projects').isotope({
                itemSelector: '.project',
                masonry: {}
            });
        });
    });
});

function createAndAppendElement(parent, tagName, classes) {
    const newElement = document.createElement(tagName);
    newElement.className = classes;
    parent.appendChild(newElement);
    return newElement
}

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