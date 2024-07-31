document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const languageToggle = document.getElementById('languageToggle');
    const pdfDownload = document.getElementById('pdfDownload');
    const elements = document.querySelectorAll('[data-key]');
    const copyButtons = document.querySelectorAll('.copy-button');

    // Initialize with default theme
    document.body.classList.add('light-theme');

    // Theme toggle
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.replace('light-theme', 'dark-theme');
        } else {
            document.body.classList.replace('dark-theme', 'light-theme');
        }
    });

    // Language toggle
    languageToggle.addEventListener('change', () => {
        if (languageToggle.checked) {
            loadContent('en');
        } else {
            loadContent('ru');
        }
    });

    // PDF download
    pdfDownload.addEventListener('click', () => {
        window.location.href = 'resume.pdf'; // Ensure resume.pdf exists
    });

    // Function to load content from JSON files and apply it to the HTML
    function loadContent(language) {
        fetch(`${language}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                elements.forEach(el => {
                    const key = el.getAttribute('data-key');
                    const value = getValueFromJSON(key, data);
                    if (key === "experience.items") {
                        el.innerHTML = value.map(item => `
                            <div>
                                <h4>${item.role} • ${item.company} • ${item.dates}</h4>
                                <p>${item.description}</p>
                            </div>
                        `).join('');
                    } else {
                        el.textContent = value;
                    }
                });
            })
            .catch(error => {
                console.error('Error loading content:', error);
                alert('Failed to load content. Please check the console for more details.');
            });
    }

    // Helper function to get value from JSON object using dot notation
    function getValueFromJSON(key, json) {
        return key.split('.').reduce((acc, part) => acc && acc[part], json);
    }

    // Load default language (Russian)
    loadContent('ru');

    // Copy to clipboard functionality
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            const message = this.nextElementSibling;

            navigator.clipboard.writeText(textToCopy).then(() => {
                message.style.opacity = '1';
                setTimeout(() => {
                    message.style.opacity = '0';
                }, 2000); // Message disappears after 2 seconds
            }).catch(err => {
                console.error('Error copying text: ', err);
            });
        });
    });
});