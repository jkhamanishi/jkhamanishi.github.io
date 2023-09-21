$( document ).ready( function() {
    // On document load
    // Load projects
    loadProjects();
    // Add event listener on filter selectors
    $('#filter-radio input').on('click', function() {
        $('#projects').isotope({filter: this.value});
        $('#filter-dropdown').val(this.value);
    });
    $('#filter-dropdown').on('change', function() {
      $('#projects').isotope({filter: this.value});
      $('#filter-radio input[value="' + this.value + '"]').prop('checked', true);
    });
});


function loadProjects() {
    fetch('projects.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('projects');
        container.innerHTML = "";  // clear container
        for (projectData of data) {
            // Project card initialization
            const project = createAndAppendElement(container, 'div', "project col-md-6 mb-4");
            projectData.tags.forEach(tag => {project.classList.add(tag.replace(/ /g,"-").toLowerCase());});
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
                var listContainer = createAndAppendElement(row, 'div', "col-lg-8");
                const imgContainer1 = createAndAppendElement(row, 'div', "col-lg-4 photo-box");
                if (projectData.link || projectData.modalMedia) {
                    // Link
                    const link = createAndAppendElement(imgContainer1, 'a', "");
                    link.style.cursor = "pointer";
                    if (projectData.link) {
                        link.href = projectData.link;
                        link.target = "_blank";
                    } else if (projectData.modalMedia) {
                        const modal = createModal(body, projectData.title, projectData.modalMedia);
                        link.addEventListener("click", function(){ $(modal).modal('show') });
                    }
                    // Image
                    const imgContainer2 = createAndAppendElement(link, 'div', "photo-box justify-content-center");
                    imgContainer2.style = "position: relative; text-align: center;";
                    const img = createAndAppendElement(imgContainer2, 'img', "img-fluid");
                    img.src = projectData.media;
                    img.style = "filter: blur(1px); -webkit-filter: blur(1px);";
                    // Link button
                    const button = createAndAppendElement(imgContainer2, "span", "badge bg-secondary");
                    button.innerText = "View Project"
                    button.style = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
                } else {
                    const imgContainer2 = createAndAppendElement(imgContainer1, 'div', "photo-box");
                    // Image
                    const img = createAndAppendElement(imgContainer2, 'img', "img-fluid");
                    // Tooltip
                    img.src = projectData.media;
                    img.setAttribute("data-bs-toggle", "tooltip");
                    img.setAttribute("data-bs-placement", "bottom");
                    img.setAttribute("data-bs-original-title", "Click to enlarge");
                    // Enlarged Image Modal
                    const modal = createModal(body, projectData.title, projectData.media);
                    imgContainer2.style.cursor = "pointer";
                    imgContainer2.addEventListener("click", function(){ $(modal).modal('show') });
                }
            } else {
                var listContainer = createAndAppendElement(row, 'div', "col-12");
            }
            // Description
            const list = createAndAppendElement(listContainer, 'ul', "mb-3");
            projectData.description.forEach(desc => {
                const description = createAndAppendElement(list, "li", "");
                description.innerText = desc;
            });
            // Footer
            const footer = createAndAppendElement(card, 'div', "card-footer");
            projectData.tags.forEach(tag => {
                const tagElement = createAndAppendElement(footer, "span", "badge rounded-pill bg-primary me-1");
                tagElement.innerText = tag;
            });
        };
        // Enable tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });
        // Run isotope
        $('#projects').isotope({
            itemSelector: '.project',
            masonry: {}
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
};

function createAndAppendElement(parent, tagName, classes) {
    const newElement = document.createElement(tagName);
    newElement.className = classes;
    parent.appendChild(newElement);
    return newElement
}

function createModal(parent, projectTitle, media){
    const modal = createAndAppendElement(parent, "div", "modal");
    const dialog = createAndAppendElement(modal, "div", "modal-dialog modal-xl");
    dialog.role = "document";
    const container = createAndAppendElement(dialog, "div", "modal-content");
    // Header
    const header = createAndAppendElement(container, "div", "modal-header");
    const title = createAndAppendElement(header, "h5", "modal-title");
    title.innerText = projectTitle + " (media)";
    // Close button
    const close = createAndAppendElement(header, "button", "btn-close");
    close.setAttribute("data-bs-dismiss", "modal");
    // Body
    const body = createAndAppendElement(container, "div", "modal-body photo-box text-center");
    heightStyle = "min-height: 300px; max-height: calc(100vh - 150px);";
    if (media.endsWith('.mp4')) {
        // Video player
        const vid = createAndAppendElement(body, 'video', "img-fluid");
        vid.innerText = "Your browser does not support the video tag.";
        vid.style = heightStyle;
        vid.controls = true;
        source = createAndAppendElement(vid, 'source', "");
        source.src = media;
        source.setAttribute("type", "video/mp4");
        $(modal).on('hide.bs.modal', function(e){ vid.pause() });
        $(modal).on('shown.bs.modal', function(e){ vid.play() });
    } else {
        // Image display
        const img = createAndAppendElement(body, 'img', "img-fluid");
        img.src = media;
        img.style = heightStyle;
    }
    return modal
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
        zIndex: 2000
    });
    document.getElementById('confetti-counter').innerText = +document.getElementById('confetti-counter').innerText + 1;
};
