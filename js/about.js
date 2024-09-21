if (document.location.pathname.endsWith("about.html")) {
    const aboutContainer = document.getElementById("about-content");
    
    // Function to render the markdown content of the About page
    function renderAbout() {
        fetch("posts/about.md")
            .then((response) => response.text())
            .then((mdContent) => {
                const converter = new showdown.Converter();
                const htmlContent = converter.makeHtml(mdContent);
                aboutContainer.innerHTML = htmlContent;
                aboutContainer.style.padding = "20px"; // Optional styling
            })
            .catch((err) => {
                aboutContainer.innerHTML = `<p>Error loading About page...</p>`;
                console.error("Error loading about.md:", err);
            });
    }

    renderAbout();
}
