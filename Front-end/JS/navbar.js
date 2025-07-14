
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.navbarContainer')) return;
    // your navbar code

    // ────────────────────────────
    // 📦 Utility Functions
    // ────────────────────────────
    function getCurrentLang() {
        const path = window.location.pathname;
        const langMatch = path.match(/\/(EN|ES|DE)/);
        return langMatch ? langMatch[1] : 'EN';
    }
    const langNames = {
        EN: 'English',
        ES: 'Español',
        DE: 'Deutsch'
    };

    function updateCurrentLangDisplay() {
        const lang = getCurrentLang();
        const label = langNames[lang] || 'Language';
        const langDisplay = document.getElementById('currentLangName');
        if (langDisplay) langDisplay.textContent = label;
    }


    function goToPage(id) {
        document.querySelectorAll('.menu-page').forEach(p => p.classList.remove('active'));
        document.getElementById(id)?.classList.add('active');
    }

    function openNav() {
        document.getElementById("mobileNavbar").style.display = "block";
    }

    function closeNav() {
        document.getElementById("mobileNavbar").style.display = "none";
        document.querySelectorAll(".menu-page").forEach(page => page.classList.remove("active"));
        document.getElementById("mainMenu")?.classList.add("active");
    }

    function changeLanguage(lang) {
        const currentPath = window.location.pathname;
        const updatedPath = currentPath.replace(/\/(EN|ES|DE)/, '/' + lang);
          updateCurrentLangDisplay(); // optional since page reloads
        window.location.href = updatedPath === currentPath ? `/${lang}` : updatedPath;
    }

    function goToProduct(productSlug) {
        const lang = getCurrentLang();
        window.location.href = `/${lang}/products/${productSlug}`;
    }

    function goToModel(productSlug, modelSlug) {
        const lang = getCurrentLang();
        setTimeout(() => {
            window.location.href = `/${lang}/products/${productSlug}/${modelSlug}`;
        }, 100);
    }

    function updateModels(productId) {
        const productEl = document.querySelector(`.productContainer[data-id="${productId}"]`);
        if (!productEl) return;

        const container = productEl.closest('.ProductsDivContainer');
        const modelsContainer = container?.querySelector(".modelsContainer ul");
        const imageContainer = container?.querySelector(".productImgContainer img");

        if (modelsContainer && imageContainer) {
            imageContainer.src = productEl.getAttribute('data-sketch');
            const models = JSON.parse(productEl.getAttribute('data-models'));
            modelsContainer.innerHTML = models.length
                ? models.map(m => `<li style="cursor:pointer">${m.name}</li>`).join('')
                : "<li>No models available</li>";

            modelsContainer.querySelectorAll("li").forEach((li, i) => {
                li.addEventListener("click", (e) => {
                    e.stopPropagation();
                    goToModel(productId, models[i].id);
                });
            });
        }
    }

    function updateAllLinksForLang() {
        const lang = getCurrentLang();
        const langLinks = {
            '/support': `/${lang}/support`,
            '/technical-service': `/${lang}/technical-service`,
            '/WarrantyRegistration': `/${lang}/WarrantyRegistration`,
            '/TermCondition': `/${lang}/TermCondition`,
            '/PrivacyPolicy': `/${lang}/PrivacyPolicy`,
            '/Downloads': `/${lang}/Downloads`,
            '/aboutus': `/${lang}/aboutus`,
            '/Articles': `/${lang}/Articles`,
            '/Contactus': `/${lang}/Contactus`,
            '/': `/${lang}`
        };

        // ✅ Only links inside the navbar
        document.querySelectorAll('.navbarContainer a').forEach(link => {
            const href = link.getAttribute('href');
            if (langLinks[href]) {
                link.setAttribute('href', langLinks[href]);
            }
        });
    }

    // ────────────────────────────
    // 📌 Main Event Bindings
    // ────────────────────────────
    // Product Clicks
    document.querySelectorAll('[data-goto-product]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // prevent it from affecting form clicks
            goToProduct(el.getAttribute('data-goto-product'));
        });
    });


    document.querySelectorAll('[data-show-models]').forEach(item => {
        item.addEventListener('click', () => goToPage(`modelMenu_${item.getAttribute('data-show-models')}`));
    });

    document.querySelectorAll('[data-goto-model-product]').forEach(el => {
        el.addEventListener('click', () => {
            goToModel(
                el.getAttribute('data-goto-model-product'),
                el.getAttribute('data-goto-model-model')
            );
        });
    });

    // Page Navigation (mobile)
    document.querySelectorAll('[data-goto-page]').forEach(el => {
        el.addEventListener('click', () => goToPage(el.getAttribute('data-goto-page')));
    });

    document.querySelectorAll('[data-go-back-parent]').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.menu-page')?.classList.remove('active');
            document.getElementById('mainMenu')?.classList.add('active');
        });
    });
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.addEventListener('click', (e) => {
            // Prevent triggering when clicking inside children of data-lang elements
            if (e.currentTarget !== e.target) return;

            changeLanguage(el.getAttribute('data-lang'));
        });
    });

    // // Language switcher
    // document.querySelectorAll('[data-lang]').forEach(el => {
    //     el.addEventListener('click', () => changeLanguage(el.getAttribute('data-lang')));
    // });

    // const langSelect = document.getElementById('languageSwitcher');
    // if (langSelect) {
    //     langSelect.value = getCurrentLang();
    //     langSelect.addEventListener('change', () => changeLanguage(langSelect.value));
    // }

    // Hamburger open
    const openNavBtn = document.getElementById('hamburgerBtn') || document.querySelector('.open-nav');
    if (openNavBtn) openNavBtn.addEventListener('click', openNav);

    // Close mobile nav
    document.querySelectorAll(".close-menu").forEach(btn => {
        btn.addEventListener("click", closeNav);
    });

    // Product hover update (desktop)
    document.querySelectorAll('[data-update-models]').forEach(el => {
        el.addEventListener('mouseenter', () => updateModels(el.getAttribute('data-update-models')));
    });

    // Preload first product models
    const firstProduct = document.querySelector(".productContainer");
    if (firstProduct) updateModels(firstProduct.getAttribute("data-id"));

    // Update all internal links based on language
    updateAllLinksForLang();

    // Search Desktop
    const searchInput = document.getElementById('search');
    const resultsContainer = document.getElementById('searchResults');
    if (searchInput && resultsContainer) {
        setupSearch(searchInput, resultsContainer);
    }

    // Search Mobile
    const mobileSearchInput = document.getElementById('mobileSearch');
    if (mobileSearchInput) {
        const mobileResults = mobileSearchInput.nextElementSibling;
        setupSearch(mobileSearchInput, mobileResults);
    }
    document.querySelectorAll('[data-go-back]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-go-back');
            document.getElementById(targetId)?.classList.remove('active');
            document.getElementById('productPage')?.classList.add('active');
        });
    });


    // ────────────────────────────
    // 🔎 Search Setup (Reusable)
    // ────────────────────────────
    function setupSearch(inputEl, resultBox) {
        let timeout;

        inputEl.addEventListener('input', () => {
            const query = inputEl.value.trim();
            clearTimeout(timeout);

            if (query.length < 3) {
                resultBox.innerHTML = '';
                resultBox.style.display = 'none';
                return;
            }

            timeout = setTimeout(() => {
                fetch(`/search?q=${encodeURIComponent(query)}&lang=${getCurrentLang()}`)
                    .then(res => res.json())
                    .then(data => {
                        resultBox.innerHTML = '';
                        if (data.length === 0) {
                            resultBox.innerHTML = '<div class="no-results">No matches found.</div>';
                            resultBox.style.display = 'block';
                            return;
                        }

                        data.forEach(item => {
                            const div = document.createElement('div');
                            div.classList.add('search-item');
                            div.textContent = `${item.name} (${item.type})`;
                            div.addEventListener('click', () => window.location.href = item.url);
                            resultBox.appendChild(div);
                        });

                        resultBox.style.display = 'block';
                    })
                    .catch(err => console.error('Search error:', err));
            }, 300);
        });

        // Hide on outside click
        document.addEventListener('click', e => {
            if (!resultBox.contains(e.target) && e.target !== inputEl) {
                resultBox.style.display = 'none';
            }
        });
    }
    // Language dropdown toggle
    const langSwitcher = document.getElementById('languageSwitcher');
    const toggleBtn = langSwitcher?.querySelector('.lang-toggle');
    const langButtons = langSwitcher?.querySelectorAll('[data-lang]');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent page click from immediately closing
            langSwitcher.classList.toggle('active');
        });
    }

    if (langButtons) {
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // also prevent close when clicking inside
                const lang = btn.getAttribute('data-lang');
                if (lang) changeLanguage(lang);
            });
        });
    }

    // Close dropdown if clicking outside
    document.addEventListener('click', (e) => {
        if (!langSwitcher.contains(e.target)) {
            langSwitcher.classList.remove('active');
        }
    });

updateCurrentLangDisplay();

});



