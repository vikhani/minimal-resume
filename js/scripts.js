document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const languageToggle = document.getElementById('languageToggle');
    const pdfDownload = document.getElementById('pdfDownload');
    const elements = document.querySelectorAll('[data-key]');
    const copyButtons = document.querySelectorAll('.copy-button');
    const toTopButton = document.querySelector('.to-top-button');

    // Function to apply the saved theme
    function applySavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            themeToggle.checked = true;
        } else if (savedTheme === null) {
            detectSystemTheme();
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            themeToggle.checked = false;
        }
    }

    // Function to apply the saved language
    function applySavedLanguage() {
        const savedLanguage = localStorage.getItem('language') || 'ru';
        languageToggle.checked = savedLanguage === 'en';
        loadContent(savedLanguage);
    }

    // Function to detect the user's system theme preference and set the initial theme
    function detectSystemTheme() {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (darkModeMediaQuery.matches && !localStorage.getItem('theme')) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            themeToggle.checked = true;
        }
    }

    // Initialize with saved theme and language
    applySavedTheme();
    applySavedLanguage();

    // Theme toggle
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // Language toggle
    languageToggle.addEventListener('change', () => {
        const selectedLanguage = languageToggle.checked ? 'en' : 'ru';
        loadContent(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
    });

    // PDF download
    pdfDownload.addEventListener('click', () => {
        window.location.href = 'files/resume.pdf'; // Ensure resume.pdf exists
    });

    // Function to load content from JSON files and apply it to the HTML
    function loadContent(language) {
        fetch(`json/${language}.json`)
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
                            <div class="experience-item">
                                <h4 class="experience-title">${item.role} • ${item.company} • ${item.dates}</h4>
                                <h3 class="experience-stack">${item.stack}</h3>
                                <p>${item.description}</p>
                            </div>
                        `).join('');
                    } else if (key === "contacts.content") {
                        el.innerHTML = value.map(contact => {
                            const [type, detail] = Object.entries(contact)[0];
                            return `<div class="contact-item"><strong>${type}:</strong> ${detail}</div>`;
                        }).join('');
                    } else {
                        el.textContent = value;
                    }
                });
                applyContactsColumnLayout();
            })
            .catch(error => {
                console.error('Error loading content:', error);
                alert('Failed to load content. Please check the console for more details.');
            });
    }

    function getValueFromJSON(key, data) {
        const keys = key.split('.');
        let value = data;
        keys.forEach(k => {
            value = value[k];
        });
        return value;
    }

    function applyContactsColumnLayout() {
        const contactsContent = document.querySelector('.contacts-content');
        const contactItems = contactsContent.querySelectorAll('.contact-item');
        if (contactItems.length > 4) {
            contactsContent.classList.add('multi-column');
        } else {
            contactsContent.classList.remove('multi-column');
        }
    }

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) { // Show button if scrolled more than 100px
            toTopButton.classList.add('show');
        } else {
            toTopButton.classList.remove('show');
        }
    });

    // Copy to clipboard functionality
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            const message = this.nextElementSibling;

            navigator.clipboard.writeText(textToCopy).then(() => {
                message.style.opacity = '1';
                setTimeout(() => {
                    message.style.opacity = '0';
                }, 1500);
            }).catch(err => {
                console.error('Error copying text: ', err);
            });
        });
    });
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}