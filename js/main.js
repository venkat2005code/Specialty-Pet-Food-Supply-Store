/**
 * Global Navigation and Theme Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRTL();
    setActiveNavLink();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Page-specific initializations
    if (document.querySelector('.counter-number')) {
        initCounters();
    }
    if (document.querySelector('.product-card-adv') || document.querySelector('.search-input')) {
        initShop();
    }
    if (document.querySelector('.toggle-option')) {
        initPricing();
    }
    if (document.querySelector('.faq-question')) {
        initAccordion();
    }
    if (document.querySelector('.auth-card')) {
        initAuth();
    }
    if (document.querySelector('#signupForm')) {
        initSignup();
    }
});

/**
 * Theme Toggle Logic
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const htmlElement = document.documentElement;

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
        updateThemeIcons(true);
    } else {
        htmlElement.classList.remove('dark');
        updateThemeIcons(false);
    }
}

function toggleTheme() {
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('dark');
    
    const isDark = htmlElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcons(isDark);
}

function updateThemeIcons(isDark) {
    const themeIcons = document.querySelectorAll('#theme-icon');
    themeIcons.forEach(icon => {
        if (isDark) {
            icon.setAttribute('data-lucide', 'sun');
        } else {
            icon.setAttribute('data-lucide', 'moon');
        }
    });
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * RTL Support Logic
 */
function initRTL() {
    const savedDir = localStorage.getItem('dir') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    updateRTLIcons(savedDir === 'rtl');
}

function toggleRTL() {
    const htmlElement = document.documentElement;
    const currentDir = htmlElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    
    htmlElement.setAttribute('dir', newDir);
    localStorage.setItem('dir', newDir);
    updateRTLIcons(newDir === 'rtl');
}

function updateRTLIcons(isRTL) {
    // Icons are now handled via text or don't need swapping
}

/**
 * Active Nav Link Detection
 */
function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Mobile Menu Logic
 */
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
    
    // Toggle menu icon
    const menuBtnIcon = document.querySelector('.mobile-menu-btn i');
    if (mobileMenu.classList.contains('active')) {
        menuBtnIcon.setAttribute('data-lucide', 'x');
    } else {
        menuBtnIcon.setAttribute('data-lucide', 'menu');
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Expose functions globally
window.toggleTheme = toggleTheme;
window.toggleRTL = toggleRTL;
window.toggleMobileMenu = toggleMobileMenu;

/**
 * Desktop Nav Dropdown — click toggle for touch/tablet
 */
function initNavDropdowns() {
    const dropdownItems = document.querySelectorAll('.nav-item-has-dropdown');

    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');

        link.addEventListener('click', (e) => {
            // Only intercept if the dropdown exists and screen is <= 1280px
            const dropdown = item.querySelector('.nav-dropdown');
            if (!dropdown) return;

            // On wider screens with a real mouse, let hover handle it
            // On touch/narrow: toggle open class
            const isOpen = item.classList.contains('open');

            // Close all other dropdowns
            dropdownItems.forEach(i => i.classList.remove('open'));

            if (!isOpen) {
                e.preventDefault();
                item.classList.add('open');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item-has-dropdown')) {
            dropdownItems.forEach(i => i.classList.remove('open'));
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavDropdowns();
});

/**
 * Counter Animation Logic
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter-number');
    const speed = 200;

    const animate = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = +counter.innerText.replace(/[^0-9.]/g, '');
        const inc = target / speed;

        if (count < target) {
            const nextCount = Math.ceil(count + inc);
            counter.innerText = formatCounter(nextCount, counter.getAttribute('data-target'));
            setTimeout(() => animate(counter), 1);
        } else {
            counter.innerText = counter.getAttribute('data-target');
        }
    };

    const formatCounter = (num, original) => {
        if (original.includes('+')) return num + '+';
        if (original.includes('/')) return '4.9/5'; // Simplified for the rating
        return num;
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Shop Filtering and Interactions
 */
function initShop() {
    const priceSlider = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const products = document.querySelectorAll('.product-card-adv');
    const searchInput = document.querySelector('.search-input');
    const categoryChecks = document.querySelectorAll('.filter-item input');
    const petTypeBtns = document.querySelectorAll('.pill-btn');
    const sortSelect = document.querySelector('.sort-select');
    const productCount = document.getElementById('productCount');
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');

    // Price Slider Update
    if (priceSlider && priceValue) {
        priceSlider.addEventListener('input', (e) => {
            priceValue.textContent = `₹0 — ₹${e.target.value}`;
            filterProducts();
        });
    }

    // Wishlist Toggle
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            if (btn.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'heart');
                icon.style.fill = 'currentColor';
            } else {
                icon.style.fill = 'none';
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    });

    // Pet Type Toggle
    petTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            petTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts();
        });
    });

    // Filter Listeners
    if (searchInput) searchInput.addEventListener('input', filterProducts);
    categoryChecks.forEach(check => check.addEventListener('change', filterProducts));
    if (sortSelect) sortSelect.addEventListener('change', sortProducts);

    function filterProducts() {
        let count = 0;
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const maxPrice = priceSlider ? +priceSlider.value : 5000;
        const activePetType = document.querySelector('.pill-btn.active')?.textContent.trim() || 'All';
        
        const selectedCategories = Array.from(categoryChecks)
            .filter(c => c.checked)
            .map(c => c.parentElement.textContent.trim());

        products.forEach(product => {
            const name = product.querySelector('h3').textContent.toLowerCase();
            const category = product.getAttribute('data-category');
            const price = +product.getAttribute('data-price');
            const petType = product.getAttribute('data-pet');

            const matchesSearch = name.includes(searchTerm);
            const matchesPrice = price <= maxPrice;
            const matchesCategory = selectedCategories.includes('All Products') || 
                                   selectedCategories.length === 0 || 
                                   selectedCategories.includes(category);
            const matchesPet = activePetType === 'All' || petType === activePetType;

            if (matchesSearch && matchesPrice && matchesCategory && matchesPet) {
                product.style.display = 'flex';
                count++;
            } else {
                product.style.display = 'none';
            }
        });

        if (productCount) productCount.textContent = `${count} Products Found`;
    }

    function sortProducts() {
        const criteria = sortSelect.value;
        const grid = document.querySelector('.products-grid');
        const cards = Array.from(products);

        cards.sort((a, b) => {
            if (criteria === 'price-low') return +a.getAttribute('data-price') - +b.getAttribute('data-price');
            if (criteria === 'price-high') return +b.getAttribute('data-price') - +a.getAttribute('data-price');
            if (criteria === 'rating') return +b.getAttribute('data-rating') - +a.getAttribute('data-rating');
            return 0;
        });

        cards.forEach(card => grid.appendChild(card));
    }
}

// Global Clear Filters
function clearAllFilters() {
    const searchInput = document.querySelector('.search-input');
    const priceSlider = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const categoryChecks = document.querySelectorAll('.filter-item input');
    const petTypeBtns = document.querySelectorAll('.pill-btn');
    const products = document.querySelectorAll('.product-card-adv');

    if (searchInput) searchInput.value = '';
    if (priceSlider) {
        priceSlider.value = 5000;
        priceValue.textContent = '₹0 — ₹5,000';
    }
    categoryChecks.forEach(c => c.checked = (c.parentElement.textContent.trim() === 'All Products'));
    petTypeBtns.forEach(b => {
        b.classList.remove('active');
        if (b.textContent.trim() === 'All') b.classList.add('active');
    });

    products.forEach(p => p.style.display = 'flex');
    const productCount = document.getElementById('productCount');
    if (productCount) productCount.textContent = `${products.length} Products Found`;
}

// Mobile Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.filter-sidebar');
    sidebar.classList.toggle('active');
}

window.clearAllFilters = clearAllFilters;
window.toggleSidebar = toggleSidebar;

/**
 * Pricing Billing Toggle
 */
function initPricing() {
    const toggleOptions = document.querySelectorAll('.toggle-option');
    const priceElements = document.querySelectorAll('.pricing-card .price');
    const billingNote = document.getElementById('billingNote');

    const monthlyPrices = [199, 499, 999];
    const yearlyPrices = [1910, 4790, 9590];

    toggleOptions.forEach(option => {
        option.addEventListener('click', () => {
            const cycle = option.getAttribute('data-cycle');
            toggleOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            updatePrices(cycle);
            localStorage.setItem('billingCycle', cycle);
        });
    });

    function updatePrices(cycle) {
        const prices = cycle === 'yearly' ? yearlyPrices : monthlyPrices;
        const suffix = cycle === 'yearly' ? '/yr' : '/mo';
        
        priceElements.forEach((el, index) => {
            el.style.opacity = '0';
            setTimeout(() => {
                el.innerHTML = `₹${prices[index].toLocaleString()}<span>${suffix}</span>`;
                el.style.opacity = '1';
            }, 200);
        });

        if (billingNote) {
            billingNote.textContent = cycle === 'yearly' ? 
                "Billed annually. Save 20% vs monthly." : 
                "Billed monthly. Cancel anytime.";
        }
    }

    // Restore preference
    const savedCycle = localStorage.getItem('billingCycle') || 'monthly';
    const activeOption = document.querySelector(`.toggle-option[data-cycle="${savedCycle}"]`);
    if (activeOption) {
        activeOption.click();
    }
}

/**
 * FAQ Accordion
 */
function initAccordion() {
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all others
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.faq-question').forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
                q.classList.add('active');
            }
        });
    });
}

/**
 * Authentication Logic (Login/Signup)
 */
function initAuth() {
    const authForm = document.getElementById('authForm');
    const togglePass = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    const rememberMe = document.getElementById('rememberMe');
    const emailInput = document.getElementById('email');

    // Restore Remember Me
    if (emailInput && localStorage.getItem('rememberedEmail')) {
        emailInput.value = localStorage.getItem('rememberedEmail');
        if (rememberMe) rememberMe.checked = true;
    }

    // Toggle Password Visibility
    if (togglePass && passwordInput) {
        togglePass.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePass.setAttribute('data-lucide', type === 'password' ? 'eye' : 'eye-off');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }

    // Form Validation
    if (authForm) {
        const inputs = authForm.querySelectorAll('.form-control');

        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                input.classList.remove('error');
                const errorMsg = input.parentElement.querySelector('.error-msg');
                if (errorMsg) errorMsg.remove();
            });
        });

        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) isValid = false;
            });

            if (isValid) {
                // Save Remember Me
                if (rememberMe && rememberMe.checked && emailInput) {
                    localStorage.setItem('rememberedEmail', emailInput.value);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                const submitBtn = authForm.querySelector('button[type="submit"]');
                submitBtn.innerText = "Signing in...";
                submitBtn.disabled = true;

                setTimeout(() => {
                    alert('Login successful! Redirecting to dashboard...');
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        });
    }

    function validateField(input) {
        const value = input.value.trim();
        let error = "";

        if (input.type === 'email') {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) error = "Email is required";
            else if (!re.test(value)) error = "Please enter a valid email";
        } else if (input.type === 'password') {
            if (!value) error = "Password is required";
            else if (value.length < 6) error = "Password must be at least 6 characters";
        } else {
            if (!value) error = "This field is required";
        }

        const existingError = input.parentElement.querySelector('.error-msg');
        if (existingError) existingError.remove();

        if (error) {
            input.classList.add('error');
            const msg = document.createElement('small');
            msg.className = 'error-msg';
            msg.innerText = error;
            input.parentElement.appendChild(msg);
            return false;
        } else {
            input.classList.remove('error');
            return true;
        }
    }
}


/**
 * Registration Logic (Sign Up)
 */
function initSignup() {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const togglePassBtns = document.querySelectorAll('.toggle-password');

    // Password Visibility Toggles
    togglePassBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            btn.setAttribute('data-lucide', type === 'password' ? 'eye' : 'eye-off');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    });

    // Password Strength Meter
    if (passwordInput) {
        passwordInput.addEventListener('keyup', () => {
            const val = passwordInput.value;
            const result = calculateStrength(val);
            updateStrengthUI(result);
        });
    }

    function calculateStrength(password) {
        if (!password) return { width: '0%', color: 'transparent', text: '' };
        
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (password.length < 6) return { width: '33%', color: '#E53935', text: 'Weak' };
        if (score <= 2) return { width: '33%', color: '#E53935', text: 'Weak' };
        if (score <= 4) return { width: '66%', color: '#FF8F00', text: 'Fair' };
        return { width: '100%', color: '#2E7D32', text: 'Strong' };
    }

    function updateStrengthUI(result) {
        if (strengthBar) strengthBar.style.width = result.width;
        if (strengthBar) strengthBar.style.backgroundColor = result.color;
        if (strengthText) strengthText.innerText = result.text;
        if (strengthText) strengthText.style.color = result.color;
    }


    // Form Submission
    if (signupForm) {
        const inputs = signupForm.querySelectorAll('.form-control');
        const termsCheck = document.getElementById('terms');

        inputs.forEach(input => {
            input.addEventListener('blur', () => validateSignupField(input));
            input.addEventListener('input', () => {
                input.classList.remove('error');
                const errorMsg = input.parentElement.querySelector('.error-msg');
                if (errorMsg) errorMsg.remove();
            });
        });

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateSignupField(input)) isValid = false;
            });

            if (termsCheck && !termsCheck.checked) {
                isValid = false;
                alert('Please accept the Terms and Privacy Policy to continue.');
            }

            if (isValid) {
                const submitBtn = signupForm.querySelector('button[type="submit"]');
                const card = document.querySelector('.auth-card');
                
                submitBtn.innerText = "Creating Account...";
                submitBtn.disabled = true;

                setTimeout(() => {
                    card.innerHTML = `
                        <div style="text-align: center; padding: 40px 0;">
                            <div style="font-size: 4rem; margin-bottom: 20px;">🎉</div>
                            <h2 style="margin-bottom: 12px;">Account Created!</h2>
                            <p style="color: var(--text-secondary); margin-bottom: 24px;">Welcome to the PawStore family. Redirecting you to your dashboard...</p>
                        </div>
                    `;
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                }, 1500);
            }
        });
    }

    function validateSignupField(input) {
        const value = input.value.trim();
        let error = "";

        if (input.id === 'fullName') {
            if (!value) error = "Full name is required";
            else if (value.length < 3) error = "Min 3 characters";
        } else if (input.type === 'email') {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) error = "Email is required";
            else if (!re.test(value)) error = "Enter a valid email";
        } else if (input.id === 'password') {
            if (!value) error = "Password is required";
            else if (value.length < 6) error = "Min 6 characters";
        }

        const existingError = input.parentElement.querySelector('.error-msg');
        if (existingError) existingError.remove();

        if (error) {
            input.classList.add('error');
            const msg = document.createElement('small');
            msg.className = 'error-msg';
            msg.innerText = error;
            if (input.classList.contains('form-control')) {
                input.parentElement.appendChild(msg);
            }
            return false;
        } else {
            input.classList.remove('error');
            if (input.id === 'confirmPassword' && value === passwordInput.value && value !== '') {
                const msg = document.createElement('small');
                msg.className = 'error-msg';
                msg.style.color = 'var(--primary)';
                msg.innerText = "Passwords match ✓";
                input.parentElement.appendChild(msg);
            }
            return true;
        }
    }
}

/**
 * Dashboard Panel Switching
 */
function initDashboard() {
    const navLinks = document.querySelectorAll('.dash-nav-link');
    const panels = document.querySelectorAll('.dash-panel');
    const titleH1 = document.querySelector('.dash-header h1');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.dash-sidebar');

    // Sidebar Toggle
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                const panelName = link.innerText.trim();
                
                switchPanel(targetId, panelName, link);
                
                // Close sidebar on mobile after clicking
                if (window.innerWidth < 768 && sidebar) {
                    sidebar.classList.remove('active');
                }
            });
        });

        // Restore last active panel
        const type = document.body.contains(document.querySelector('.admin-sidebar')) ? 'admin' : 'user';
        const savedPanel = localStorage.getItem(type + 'Panel');
        if (savedPanel) {
            const activeLink = document.querySelector(`.dash-nav-link[data-target="${savedPanel}"]`);
            if (activeLink) {
                activeLink.click();
            }
        }
    }

    function switchPanel(targetId, panelName, link) {
        // Hide all panels
        panels.forEach(p => p.classList.remove('active'));
        
        // Show target panel
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');

        // Update nav links
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Update Header H1
        if (titleH1) titleH1.innerText = panelName;

        // Save to localStorage
        const type = document.body.contains(document.querySelector('.admin-sidebar')) ? 'admin' : 'user';
        localStorage.setItem(type + 'Panel', targetId);
    }
}

// Call in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.dash-wrapper')) {
        initDashboard();
    }
});

// Recommended Slider Navigation
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.recommended-grid');
    const prevBtn = document.getElementById('rec-prev');
    const nextBtn = document.getElementById('rec-next');

    if(slider && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -320, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 320, behavior: 'smooth' });
        });
    }
});
