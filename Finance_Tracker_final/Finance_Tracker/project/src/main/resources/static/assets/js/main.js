const API_BASE_URL = "https://finance-tracker-1e3f.onrender.com";


// main.js — handles authentication, UI helpers, and global actions

// ========== Utility Functions ==========
function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-md text-white z-50 ${
        type === "success"
            ? "bg-green-600"
            : type === "error"
                ? "bg-red-600"
                : "bg-gray-700"
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Attractive auth alert modal for login/signup pages
function showAuthAlert(message, options = {}) {
    const { title = "", autoCloseMs = 0 } = options;
    // Inject styles once
    if (!document.getElementById('auth-alert-styles')) {
        const style = document.createElement('style');
        style.id = 'auth-alert-styles';
        style.textContent = `
        .auth-alert-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:1000;opacity:0;transition:opacity .25s ease}
        .auth-alert{width:min(92vw,420px);border-radius:20px;border:1px solid var(--border);background:var(--card-bg);box-shadow:0 24px 60px rgba(0,0,0,.18),0 0 0 4px rgba(0,194,255,.10);padding:1.25rem 1.25rem 1rem;transform:translateY(8px);opacity:0;transition:all .25s ease}
        .darkmode .auth-alert{box-shadow:0 24px 60px rgba(0,0,0,.4),0 0 0 4px rgba(0,194,255,.12)}
        .auth-alert h3{margin:0 0 .25rem;font:600 1.15rem/1.3 "Poppins", Inter, system-ui;color:var(--text)}
        .auth-alert p{margin:0 0 .9rem;color:var(--text);font:600 1.05rem/1.5 Inter, system-ui;letter-spacing:.01em}
        .auth-alert .alert-actions{display:flex;justify-content:flex-end;gap:.5rem}
        .auth-alert .btn-close{display:inline-flex;align-items:center;justify-content:center;padding:.6rem 1rem;border-radius:12px;border:1px solid rgba(148,163,184,.35);background:linear-gradient(135deg,var(--accent-light),var(--accent));color:#fff;font-weight:700;letter-spacing:.02em;cursor:pointer;box-shadow:0 10px 24px rgba(0,194,255,.25);transition:transform .15s ease, box-shadow .2s ease}
        .auth-alert .btn-close:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(0,194,255,.32)}
        .auth-alert .icon{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;margin-bottom:.6rem;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;box-shadow:0 10px 22px rgba(239,68,68,.28)}
        `;
        document.head.appendChild(style);
    }

    const overlay = document.createElement('div');
    overlay.className = 'auth-alert-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const modal = document.createElement('div');
    modal.className = 'auth-alert';

    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.textContent = '✖';

    const h3 = document.createElement('h3');
    h3.textContent = title || 'Authentication Error';

    const p = document.createElement('p');
    p.textContent = message;

    const actions = document.createElement('div');
    actions.className = 'alert-actions';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-close';
    closeBtn.textContent = 'OK';
    closeBtn.addEventListener('click', () => document.body.removeChild(overlay));
    actions.appendChild(closeBtn);

    modal.appendChild(icon);
    modal.appendChild(h3);
    modal.appendChild(p);
    modal.appendChild(actions);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modal.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
    });

    if (autoCloseMs > 0) setTimeout(() => {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
    }, autoCloseMs);
}

function formatNumber(num) {
    if (isNaN(num)) return "₹0";
    return "₹" + num.toLocaleString("en-IN");
}

// ========== Authentication ==========
function isValidEmail(email) {
    // Basic but robust email pattern
    return /^([a-zA-Z0-9_\-.+])+@([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}$/.test(email);
}
async function loginUser(email, password) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            if (res.status === 401) throw new Error("Invalid credentials");
            if (res.status === 404) throw new Error("User not found");
            throw new Error("Login failed");
        }

        const data = await res.json();
        localStorage.setItem("ft_token", data.token);
        showToast("Login successful!", "success");
        setTimeout(() => (window.location.href = "dashboard.html"), 800);
    } catch (err) {
        if (err?.message?.toLowerCase().includes("invalid")) {
            showAuthAlert("Invalid Password", { title: "Login Failed" });
        } else {
            showToast(err.message || "Login failed", "error");
        }
    }
}


async function registerUser(name, email, password) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg || "Registration failed");
        }

        const data = await res.json();
        localStorage.setItem("ft_token", data.token);
        showToast("Registered successfully!", "success");
        setTimeout(() => (window.location.href = "dashboard.html"), 800);
    } catch (err) {
        showToast(err.message, "error");
    }
}


function logoutUser() {
    localStorage.removeItem("ft_token");
    showToast("Logged out successfully", "info");
    setTimeout(() => (window.location.href = "login.html"), 800);
}

function logoutUser() {
    localStorage.removeItem("ft_token");
    showToast("Logged out successfully", "info");
    setTimeout(() => (window.location.href = "login.html"), 800);
}

// ========== Attach Handlers to Pages ==========
document.addEventListener("DOMContentLoaded", () => {
    // Redirect legacy register page to styled auth page
    if (window.location.pathname.endsWith('/register.html')) {
        window.location.replace('login.html?mode=signup');
        return;
    }
    // Apply persisted theme on every page
    const savedThemeGlobal = localStorage.getItem("ft_theme");
    if (savedThemeGlobal === "dark") document.body.classList.add("darkmode");
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const logoutBtn = document.getElementById("logout-btn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            if (!email || !password) return showToast("Fill all fields", "error");
            loginUser(email, password);
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener("click", () => {
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            if (!name || !email || !password)
                return showToast("Fill all fields", "error");
            registerUser(name, email, password);
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logoutUser);
    }

    // ===== Premium Landing Page Interactions =====
    if (document.body.classList.contains("home")) {
        // Theme icon update function
        function updateThemeIcon(isDark) {
            const themeToggle = document.getElementById("theme-toggle");
            if (themeToggle) {
                const icon = themeToggle.querySelector(".theme-icon");
                if (icon) {
                    icon.textContent = isDark ? "☀️" : "🌙";
                }
            }
        }

        // Apply persisted theme
        const savedTheme = localStorage.getItem("ft_theme");
        if (savedTheme === "dark") {
            document.body.classList.add("darkmode");
            updateThemeIcon(true);
        }

        // ===== Scroll Progress Indicator =====
        const scrollProgress = document.getElementById("scroll-progress");
        if (scrollProgress) {
            window.addEventListener("scroll", () => {
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (window.scrollY / windowHeight) * 100;
                scrollProgress.style.width = scrolled + "%";
            });
        }

        // ===== Parallax Header =====
        const header = document.querySelector(".home-header");
        if (header) {
            let lastScroll = 0;
            window.addEventListener("scroll", () => {
                const currentScroll = window.scrollY;
                if (currentScroll > lastScroll && currentScroll > 100) {
                    header.style.transform = "translateY(-100%)";
                } else {
                    header.style.transform = "translateY(0)";
                }
                lastScroll = currentScroll;
            });
        }

        // ===== Count-Up Animation for Stats =====
        function countUp(element, target, duration = 2000) {
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target >= 1000 ? (target / 1000).toFixed(0) + "K" : Math.floor(target);
                    clearInterval(timer);
                } else {
                    const display = target >= 1000 ? (current / 1000).toFixed(0) + "K" : Math.floor(current);
                    element.textContent = display;
                }
            }, 16);
        }

        const statNumbers = document.querySelectorAll(".stat-number");
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.hasAttribute("data-counted")) {
                    const target = parseInt(entry.target.getAttribute("data-target"));
                    countUp(entry.target, target);
                    entry.target.setAttribute("data-counted", "true");
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => statsObserver.observe(stat));

        // ===== Scroll Reveal for Feature Sections =====
        const featureSections = document.querySelectorAll(".feature-section[data-scroll]");
        const featureObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.setAttribute("data-scroll", "revealed");
                    
                    // Animate bars in feature 1
                    if (entry.target.classList.contains("feature-1")) {
                        const bars = entry.target.querySelectorAll(".demo-bar");
                        if (window.anime && bars.length) {
                            anime({
                                targets: bars,
                                height: (el, i) => {
                                    const heights = [65, 85, 45, 90, 70];
                                    return heights[i] + "%";
                                },
                                opacity: [0, 1],
                                delay: anime.stagger(150),
                                duration: 1000,
                                easing: 'easeOutCubic'
                            });
                        }
                    }

                    // Animate icons in feature 2
                    if (entry.target.classList.contains("feature-2")) {
                        const icons = entry.target.querySelectorAll(".icon-card");
                        if (window.anime && icons.length) {
                            anime({
                                targets: icons,
                                translateY: [40, 0],
                                opacity: [0, 1],
                                delay: anime.stagger(120),
                                duration: 800,
                                easing: 'easeOutQuad'
                            });
                        }
                    }

                    // Animate lock in feature 3
                    if (entry.target.classList.contains("feature-3")) {
                        const lock = entry.target.querySelector(".feature-lock");
                        if (window.anime && lock) {
                            anime({
                                targets: lock,
                                scale: [0.5, 1],
                                opacity: [0, 1],
                                rotate: [180, 0],
                                duration: 1000,
                                easing: 'easeOutBack'
                            });
                        }
                    }
                }
            });
        }, { threshold: 0.3 });

        featureSections.forEach(section => featureObserver.observe(section));

        // ===== Wave Animation =====
        const wavePath = document.getElementById("wave-path");
        if (wavePath && window.anime) {
            let offset = 0;
            function animateWave() {
                offset += 0.5;
                const d = `M0,200 Q300,${100 + Math.sin(offset) * 30} 600,${200 + Math.sin(offset * 1.5) * 20} T1200,${200 + Math.sin(offset * 2) * 15} L1200,400 L0,400 Z`;
                wavePath.setAttribute("d", d);
                requestAnimationFrame(animateWave);
            }
            animateWave();
        }

        // ===== Parallax Hero Content =====
        const hero = document.querySelector(".hero");
        if (hero) {
            window.addEventListener("scroll", () => {
                const scrolled = window.scrollY;
                const heroInner = hero.querySelector(".hero-inner");
                if (heroInner) {
                    heroInner.style.transform = `translateY(${scrolled * 0.3}px)`;
                    heroInner.style.opacity = 1 - (scrolled / 600);
                }
            });
        }

        // ===== Theme Toggle with Swipe Gesture =====
        const themeToggle = document.getElementById("theme-toggle");
        let touchStartY = 0;
        let touchEndY = 0;

        function toggleTheme() {
            const isDark = document.body.classList.toggle("darkmode");
            localStorage.setItem("ft_theme", isDark ? "dark" : "light");
            updateThemeIcon(isDark);
            
            if (window.anime) {
                anime({
                    targets: 'body',
                    opacity: [0.95, 1],
                    duration: 500,
                    easing: 'easeOutQuad'
                });
            }
        }

        if (themeToggle) {
            // Click toggle
            themeToggle.addEventListener("click", toggleTheme);

            // Swipe-up gesture
            themeToggle.addEventListener("touchstart", (e) => {
                touchStartY = e.changedTouches[0].screenY;
            });

            themeToggle.addEventListener("touchend", (e) => {
                touchEndY = e.changedTouches[0].screenY;
                const swipeDistance = touchStartY - touchEndY;
                if (swipeDistance > 50) { // Swipe up threshold
                    toggleTheme();
                }
            });

            // Hover effect
            themeToggle.addEventListener("mouseenter", () => {
                if (window.anime) {
                    anime({
                        targets: themeToggle,
                        scale: 1.1,
                        duration: 200,
                        easing: 'easeOutQuad'
                    });
                }
            });

            themeToggle.addEventListener("mouseleave", () => {
                if (window.anime) {
                    anime({
                        targets: themeToggle,
                        scale: 1,
                        duration: 200,
                        easing: 'easeOutQuad'
                    });
                }
            });
        }

        // ===== Hero Entrance Animation =====
        if (window.anime) {
            const heroElements = [
                { selector: '.hero-kicker', delay: 200 },
                { selector: '.hero-title', delay: 400 },
                { selector: '.hero-subtitle', delay: 600 },
                { selector: '.hero-cta', delay: 800 },
                { selector: '.hero-stats', delay: 1000 }
            ];

            heroElements.forEach(({ selector, delay }) => {
                anime({
                    targets: selector,
                    translateY: [30, 0],
                    opacity: [0, 1],
                    duration: 1000,
                    delay: delay,
                    easing: 'easeOutCubic'
                });
            });
        }
    }

    // ===== App (Dashboard) Interactions =====
    if (document.body.classList.contains('app')) {
        function updateThemeIconApp(isDark) {
            const themeToggle = document.getElementById('theme-toggle');
            if (!themeToggle) return;
            const icon = themeToggle.querySelector('.theme-icon');
            if (icon) icon.textContent = isDark ? '☀️' : '🌙';
        }
        // Apply persisted theme icon
        updateThemeIconApp(document.body.classList.contains('darkmode'));
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isDark = document.body.classList.toggle('darkmode');
                localStorage.setItem('ft_theme', isDark ? 'dark' : 'light');
                updateThemeIconApp(isDark);
            });
        }
    }

    // ===== Auth toggle between Login and Signup =====
    if (document.body.classList.contains("auth")) {
        const toggleContainer = document.querySelector('.auth-toggle');
        const toggleButtons = document.querySelectorAll('.auth-toggle .toggle-btn');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        function setMode(mode) {
            if (!toggleContainer) return;
            toggleContainer.setAttribute('data-mode', mode);
            toggleButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-mode') === mode));
            if (mode === 'login') {
                loginForm?.classList.add('active');
                signupForm?.classList.remove('active');
            } else {
                signupForm?.classList.add('active');
                loginForm?.classList.remove('active');
            }
        }
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => setMode(btn.getAttribute('data-mode')));
        });
        // ensure default mode (honor URL ?mode=signup)
        const qsMode = new URLSearchParams(window.location.search).get('mode');
        setMode(qsMode === 'signup' ? 'signup' : (toggleContainer?.getAttribute('data-mode') || 'login'));
    }

    // ===== Login/Auth Page Interactions =====
    if (document.body.classList.contains("auth")) {
        // Theme icon update function for auth pages
        function updateAuthThemeIcon(isDark) {
            const themeToggle = document.getElementById("theme-toggle");
            if (themeToggle) {
                const icon = themeToggle.querySelector(".theme-icon");
                if (icon) {
                    icon.textContent = isDark ? "☀️" : "🌙";
                }
            }
        }

        // Apply persisted theme
        const savedTheme = localStorage.getItem("ft_theme");
        if (savedTheme === "dark") {
            document.body.classList.add("darkmode");
            updateAuthThemeIcon(true);
        }

        // Theme toggle for auth pages
        const authThemeToggle = document.getElementById("theme-toggle");
        if (authThemeToggle) {
            let touchStartY = 0;
            let touchEndY = 0;

            function toggleAuthTheme() {
                const isDark = document.body.classList.toggle("darkmode");
                localStorage.setItem("ft_theme", isDark ? "dark" : "light");
                updateAuthThemeIcon(isDark);
                
                if (window.anime) {
                    anime({
                        targets: '.login-card, .auth-header, body',
                        opacity: [0.95, 1],
                        duration: 600,
                        easing: 'easeOutQuad'
                    });
                }
            }

            authThemeToggle.addEventListener("click", toggleAuthTheme);

            // Swipe-up gesture
            authThemeToggle.addEventListener("touchstart", (e) => {
                touchStartY = e.changedTouches[0].screenY;
            });

            authThemeToggle.addEventListener("touchend", (e) => {
                touchEndY = e.changedTouches[0].screenY;
                const swipeDistance = touchStartY - touchEndY;
                if (swipeDistance > 50) {
                    toggleAuthTheme();
                }
            });
        }

        // Login/Signup Page Entry Animation (Anime.js Timeline)
        const authCard = document.querySelector('.auth-card-wrapper');
        if (window.anime && authCard) {
            const timeline = anime.timeline({ easing: 'easeOutCubic', duration: 800 });

            timeline
                .add({
                    targets: '.auth-card-wrapper',
                    translateY: [40, 0],
                    opacity: [0, 1],
                    duration: 900
                })
                .add({
                    targets: ['.brand-logo', '.padlock-icon'],
                    scale: [0.8, 1],
                    opacity: [0, 1],
                    duration: 600
                }, '-=700')
                .add({
                    targets: '.auth-toggle',
                    translateY: [12, 0],
                    opacity: [0, 1],
                    duration: 500
                }, '-=600')
                .add({
                    targets: '.auth-title',
                    translateY: [20, 0],
                    opacity: [0, 1],
                    duration: 600
                }, '-=400')
                .add({
                    targets: '.auth-subtitle',
                    translateY: [20, 0],
                    opacity: [0, 1],
                    duration: 600
                }, '-=500')
                .add({
                    targets: '.auth-form',
                    opacity: [0, 1],
                    duration: 700
                }, '-=400')
                .add({
                    targets: '.field',
                    translateY: [15, 0],
                    opacity: [0, 1],
                    delay: anime.stagger(80),
                    duration: 500
                }, '-=300');
        } else if (authCard) {
            // Fallback: ensure visible if Anime.js not available
            authCard.style.opacity = '1';
            authCard.style.transform = 'translateY(0)';
            document.querySelectorAll('.auth-toggle, .auth-title, .auth-subtitle, .auth-form, .field')
                .forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
        }

        // Password Toggle
        const togglePass = document.getElementById("toggle-pass");
        const passwordInput = document.getElementById("password");
        
        if (togglePass && passwordInput) {
            togglePass.addEventListener("click", () => {
                const isPassword = passwordInput.type === "password";
                passwordInput.type = isPassword ? "text" : "password";
                togglePass.textContent = isPassword ? "🙈" : "👁️";
                
                if (window.anime) {
                    anime({
                        targets: togglePass,
                        rotate: [0, 360],
                        duration: 400,
                        easing: 'easeOutQuad'
                    });
                }
            });
        }

        // Input Focus Glow Animation
        const inputs = document.querySelectorAll('.field input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                if (window.anime) {
                    anime({
                        targets: this,
                        scale: [1, 1.01],
                        duration: 200,
                        easing: 'easeOutQuad'
                    });
                }
            });

            input.addEventListener('blur', function() {
                if (window.anime) {
                    anime({
                        targets: this,
                        scale: [1.01, 1],
                        duration: 200,
                        easing: 'easeOutQuad'
                    });
                }
            });
        });

        // Parallax Background on Mouse Move
        const authBg = document.querySelector('.auth-bg');
        if (authBg) {
            document.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;
                
                const xPercent = (clientX / innerWidth - 0.5) * 20;
                const yPercent = (clientY / innerHeight - 0.5) * 20;
                
                const rings = document.querySelectorAll('.ring');
                rings.forEach((ring, i) => {
                    const factor = (i + 1) * 0.5;
                    if (window.anime) {
                        anime.set(ring, {
                            translateX: xPercent * factor,
                            translateY: yPercent * factor
                        });
                    } else {
                        ring.style.transform = `translate(${xPercent * factor}px, ${yPercent * factor}px)`;
                    }
                });
            });
        }

        // Login/Signup submit handlers + progress ring
        const loginBtn = document.getElementById("login-btn");
        const signupBtn = document.getElementById("signup-btn");
        const loginFormEl = document.querySelector('#login-form form');
        const signupFormEl = document.querySelector('#signup-form form');

        function handleLoginSubmit(e) {
            e.preventDefault();
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();
            if (!email || !password) {
                showToast("Please fill in all fields", "error");
                if (window.anime) {
                    anime({ targets: ['#login-email', '#login-password'], translateX: [-10,10,-10,10,0], duration: 400, easing: 'easeOutQuad' });
                }
                return;
            }
            if (!isValidEmail(email)) {
                showToast("Please enter a valid email", "error");
                const el = document.getElementById('login-email');
                el?.focus();
                return;
            }
            if (loginBtn) loginBtn.classList.add("loading");
            const ringFg = loginBtn ? loginBtn.querySelector('.ring-fg') : null;
            if (window.anime && ringFg) {
                anime({ targets: ringFg, strokeDashoffset: [100, 0], duration: 1500, easing: 'linear' });
            }
            loginUser(email, password).finally(() => {
                setTimeout(() => {
                    if (loginBtn) loginBtn.classList.remove("loading");
                    if (ringFg && window.anime) anime.set(ringFg, { strokeDashoffset: 100 });
                }, 400);
            });
        }
        if (loginBtn) loginBtn.addEventListener('click', handleLoginSubmit);
        if (loginFormEl) loginFormEl.addEventListener('submit', handleLoginSubmit);

        // Button Hover Glow Effect
        [loginBtn, signupBtn].forEach((btn) => {
            if (btn && window.anime) {
                btn.addEventListener('mouseenter', () => {
                    anime({ targets: btn, scale: [1, 1.02], duration: 300, easing: 'easeOutQuad' });
                });
                btn.addEventListener('mouseleave', () => {
                    anime({ targets: btn, scale: [1.02, 1], duration: 300, easing: 'easeOutQuad' });
                });
            }
        });

        // Signup submit
        function handleSignupSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value.trim();
            const confirm = document.getElementById('signup-confirm').value.trim();
            if (!name || !email || !password || !confirm) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            if (!isValidEmail(email)) { showToast('Please enter a valid email', 'error'); return; }
            if (password !== confirm) {
                showToast('Passwords do not match', 'error');
                const wrapper = document.getElementById('signup-confirm').closest('.password-field') || document.getElementById('signup-confirm');
                if (wrapper) { wrapper.classList.add('shake'); setTimeout(()=>wrapper.classList.remove('shake'), 450); }
                return;
            }
            if (scorePassword(password) < 40) { showToast('Choose a stronger password', 'error'); return; }
            registerUser(name, email, password);
        }
        const signupFormEl2 = document.querySelector('#signup-form form');
        if (signupBtn) signupBtn.addEventListener('click', handleSignupSubmit);
        // Intentionally do NOT submit signup on Enter

        // Social login placeholders
        const googleBtn = document.getElementById('google-auth');
        const facebookBtn = document.getElementById('facebook-auth');
        const appleBtn = document.getElementById('apple-auth');
        [googleBtn, facebookBtn, appleBtn].forEach(btn => {
            if (!btn) return;
            btn.addEventListener('click', () => showToast('Social login is not configured in this demo', 'info'));
        });

        // ===== Animated Password Field: strength, toggle, lock pulse, generator =====
        function scorePassword(pwd) {
            let score = 0;
            if (!pwd) return 0;
            const letters = {};
            for (let i = 0; i < pwd.length; i++) {
                letters[pwd[i]] = (letters[pwd[i]] || 0) + 1;
                score += 5.0 / letters[pwd[i]];
            }
            const variations = {
                digits: /\d/.test(pwd),
                lower: /[a-z]/.test(pwd),
                upper: /[A-Z]/.test(pwd),
                nonWords: /[^\w]/.test(pwd),
                length8: pwd.length >= 8,
                length12: pwd.length >= 12,
            };
            let variationCount = 0;
            Object.keys(variations).forEach((k) => { variationCount += variations[k] ? 1 : 0; });
            score += (variationCount - 1) * 10;
            return Math.min(100, Math.floor(score));
        }

        function setStrengthUI(container, score) {
            const bar = container.querySelector('.bar');
            const label = container.querySelector('.label');
            let scale = score / 100;
            if (bar) {
                bar.style.transform = `scaleX(${scale})`;
                bar.style.filter = `saturate(${0.8 + scale * 0.4})`;
                bar.style.opacity = 0.8 + scale * 0.2;
            }
            if (label) {
                let text = 'Weak';
                let color = '#ef4444';
                if (score >= 70) { text = 'Strong'; color = '#10b981'; }
                else if (score >= 40) { text = 'Medium'; color = '#f59e0b'; }
                label.textContent = text;
                label.style.color = color;
            }
        }

        function bindPasswordField(prefix) {
            const input = document.getElementById(`${prefix}-password`);
            const toggle = document.getElementById(`toggle-pass-${prefix}`);
            const gen = document.getElementById(`gen-pass-${prefix}`);
            const strength = document.getElementById(`strength-${prefix}`);
            if (!input || !toggle || !strength) return;

            const wrapper = input.closest('.password-field');
            const lock = wrapper?.querySelector('.pwd-lock');

            function update() {
                wrapper?.classList.add('typing');
                const score = scorePassword(input.value);
                setStrengthUI(strength, score);
                if (window.anime && lock) {
                    anime({ targets: lock, scale: [1, 1.08, 1], duration: 400, easing: 'easeOutQuad' });
                }
            }
            input.addEventListener('input', update);
            input.addEventListener('focus', () => wrapper?.classList.add('typing'));
            input.addEventListener('blur', () => { if (!input.value) wrapper?.classList.remove('typing'); });

            toggle.addEventListener('click', () => {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                toggle.classList.add('rotating');
                toggle.textContent = isPassword ? '🙉' : '🙈';
                setTimeout(() => toggle.classList.remove('rotating'), 300);
            });

            if (gen) {
                gen.addEventListener('click', () => {
                    const generated = generateStrongPassword();
                    input.value = generated;
                    input.dispatchEvent(new Event('input'));
                });
            }
        }

        function generateStrongPassword() {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXZYabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()_+~';
            const len = 14;
            let pwd = '';
            for (let i = 0; i < len; i++) {
                pwd += chars[Math.floor(Math.random() * chars.length)];
            }
            return pwd;
        }

        bindPasswordField('login');
        bindPasswordField('signup');

        // Real-time confirm password validation
        const signupPassword = document.getElementById('signup-password');
        const signupConfirm = document.getElementById('signup-confirm');
        if (signupPassword && signupConfirm) {
            function checkMatch() {
                const match = signupPassword.value === signupConfirm.value;
                signupConfirm.setCustomValidity(match ? '' : 'Passwords do not match');
            }
            signupPassword.addEventListener('input', checkMatch);
            signupConfirm.addEventListener('input', checkMatch);
        }

        // Shake invalid on weak password when attempting submit
        function shakeIfWeak(inputId, containerClass) {
            const input = document.getElementById(inputId);
            if (!input) return false;
            const score = scorePassword(input.value);
            if (score < 40) {
                const wrapper = input.closest(containerClass);
                if (wrapper) {
                    wrapper.classList.add('shake');
                    setTimeout(() => wrapper.classList.remove('shake'), 450);
                }
                return true;
            }
            return false;
        }

        if (loginBtn) {
            const originalLoginHandler = loginBtn.onclick;
            loginBtn.addEventListener('click', () => {
                const weak = shakeIfWeak('login-password', '.password-field');
                if (weak) showToast('Password too weak', 'error');
            });
        }
        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                const weak = shakeIfWeak('signup-password', '.password-field');
                if (weak) showToast('Choose a stronger password', 'error');
            });
        }
    }
});

// Export helpers globally for other JS files
window.showToast = showToast;
window.formatNumber = formatNumber;
