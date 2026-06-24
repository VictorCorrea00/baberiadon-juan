document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opcional: dejar de observar si solo queremos que se anime una vez
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3b. Slide-In Animations (Gallery images from sides)
    const slideElements = document.querySelectorAll('.slide-in');

    const slideCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Delay escalonado para que entren una por una
                const delay = Array.from(slideElements).indexOf(entry.target) * 200;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    };

    const slideOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -30px 0px"
    };

    const slideObserver = new IntersectionObserver(slideCallback, slideOptions);

    slideElements.forEach(el => {
        slideObserver.observe(el);
    });

    // 4. Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    let counted = false;

    const countUp = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                
                // Dividimos el objetivo para que sume gradualmente
                const inc = target / 50; 

                if (count < target) {
                    // Si es decimal (como 4.8), redondeamos a 1 decimal
                    if(target % 1 !== 0) {
                        counter.innerText = (count + inc).toFixed(1);
                    } else {
                        counter.innerText = Math.ceil(count + inc);
                    }
                    setTimeout(updateCount, 40);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Observar la sección de contadores para iniciar la animación
    const statsSection = document.querySelector('.stats');
    if(statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting && !counted) {
                countUp();
                counted = true;
            }
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // 5. Lightbox Logic
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if(lightbox && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if(e.target !== lightboxImg) {
                lightbox.classList.remove('active');
            }
        });
    }

    // 6. Testimonials Auto-Slider
    const track = document.getElementById('testimonialsTrack');
    if(track) {
        let cards = document.querySelectorAll('.testimonial-card');
        if(cards.length > 0) {
            let currentIndex = 0;
            
            setInterval(() => {
                // Obtenemos el ancho actual en caso de resize (ancho tarjeta + gap 30px)
                const currentWidth = cards[0].offsetWidth + 30;
                currentIndex++;
                
                // Calculamos cuántos elementos caben en pantalla
                let visibleCards = 1;
                if(window.innerWidth > 992) visibleCards = 3;
                else if (window.innerWidth > 768) visibleCards = 2;

                // Si la tarjeta actual más las visibles exceden el total, volvemos a cero
                if (currentIndex > cards.length - visibleCards) {
                    currentIndex = 0;
                }
                
                track.style.transform = `translateX(-${currentIndex * currentWidth}px)`;
            }, 3000); // Rotar cada 3 segundos
        }
    }

    // 8. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Cerrar todos
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Si no estaba activo, abrirlo
            if(!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 9. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        if(progressBar) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrolled + '%';
        }
    });

    // 10. Light/Dark Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    
    // Check local storage for theme
    if(localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        if(themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            if(document.body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        });
    }
});

// 7. Preloader Logic (Espera a que TODO descargue, incluyendo imágenes)
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if(preloader) {
        // Un pequeño timeout extra para que se luzca la animación del logo de carga
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600); // Esperar que termine la animación css fade-out
        }, 800);
    }
});
