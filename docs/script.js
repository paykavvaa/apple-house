document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const messageDisplay = document.querySelector('.form-message');
    const progressBar = document.querySelector('.header-progress');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Функция для отображения сообщений
    function showMessage(message, isError = false) {
        messageDisplay.textContent = message;
        messageDisplay.className = 'form-message ' + (isError ? 'error' : 'success');
        messageDisplay.style.display = 'block';
        
        // Скрываем сообщение через 5 секунд
        setTimeout(() => {
            messageDisplay.style.display = 'none';
        }, 5000);
    }

    // Функция для валидации телефона
    function validatePhone(phone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone);
    }

    // Функция для валидации email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Обновление прогресса прокрутки
    function updateScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = Math.min(Math.round((scrolled / documentHeight) * 100), 100);
        progressBar.style.width = progress + '%';
    }

    // Обновление активного пункта меню
    function updateActiveMenuItem() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Добавляем обработчики событий для прокрутки
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        updateActiveMenuItem();
    });

    // Инициализация прогресса прокрутки
    updateScrollProgress();

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Получаем значения полей
        const name = form.querySelector('input[name="name"]').value.trim();
        const phone = form.querySelector('input[name="phone"]').value.trim();
        const email = form.querySelector('input[name="email"]').value.trim();
        const message = form.querySelector('textarea[name="message"]').value.trim();

        // Валидация полей
        if (!name || !phone || !email || !message) {
            showMessage('Пожалуйста, заполните все поля', true);
            return;
        }

        if (!validatePhone(phone)) {
            showMessage('Пожалуйста, введите корректный номер телефона', true);
            return;
        }

        if (!validateEmail(email)) {
            showMessage('Пожалуйста, введите корректный email адрес', true);
            return;
        }

        // Отключаем кнопку отправки
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        try {
            // Создаем объект с данными формы
            const formData = {
                name: name,
                phone: phone,
                email: email,
                message: message
            };

            // Отправляем данные на сервер
            const response = await fetch('/api/send-telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showMessage(result.message || 'Спасибо! Ваше сообщение успешно отправлено.');
                form.reset();
            } else {
                showMessage(result.error || 'Произошла ошибка при отправке сообщения', true);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showMessage('Ошибка соединения с сервером', true);
        } finally {
            // Включаем кнопку отправки обратно
            submitButton.disabled = false;
            submitButton.textContent = 'Отправить заявку';
        }
    });

    // Добавляем анимацию при фокусе на полях формы
    const formInputs = form.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const body = document.body;

    // Создаем оверлей для меню
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);

    // Функция для открытия/закрытия меню
    function toggleMenu() {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        body.classList.toggle('no-scroll');
    }

    // Обработчик клика по кнопке меню
    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Закрытие меню при клике на оверлей
    menuOverlay.addEventListener('click', toggleMenu);

    // Закрытие меню при клике на ссылку
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1080 && nav.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Technology Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    });

    // Header Scroll Effect - упрощенная версия без скрытия шапки
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Добавляем класс scrolled при скролле вниз
        if (currentScroll > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Gallery Modal
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <img src="" alt="">
        </div>
    `;
    document.body.appendChild(modal);

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const modalImg = modal.querySelector('img');
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Закрытие модального окна по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Анимация появления элементов при скролле
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        const windowHeight = window.innerHeight;
        const triggerBottom = windowHeight * 0.8;

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    };

    // Добавляем классы для анимации
    const addAnimationClasses = () => {
        const sections = document.querySelectorAll('section');
        const cards = document.querySelectorAll('.advantage-card, .gallery-item, .spec-card');
        const images = document.querySelectorAll('.about-image, .tech-image');
        const texts = document.querySelectorAll('.about-text, .tech-text');
        
        sections.forEach(section => section.classList.add('animate-on-scroll'));
        cards.forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            card.style.animationDelay = `${index * 0.1}s`;
        });
        images.forEach(image => image.classList.add('animate-on-scroll'));
        texts.forEach(text => text.classList.add('animate-on-scroll'));
    };

    // Плавный скролл к секциям
    const smoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Закрываем мобильное меню при клике
                    if (nav.classList.contains('active')) {
                        toggleMenu();
                    }
                }
            });
        });
    };

    // Анимация счетчиков
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter');
        const speed = 200;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const updateCount = () => {
                const increment = target / speed;
                if (count < target) {
                    count += increment;
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Анимация при наведении на карточки
    const cardHoverEffect = () => {
        const cards = document.querySelectorAll('.spec-card, .advantage-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
            });
        });
    };

    // Валидация формы с анимацией
    const formValidation = () => {
        const form = document.querySelector('.contact-form');
        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            input.addEventListener('input', () => {
                if (input.value) {
                    input.classList.add('valid');
                } else {
                    input.classList.remove('valid');
                }
            });
        });
    };

    // Анимация логотипа
    const logoAnimation = () => {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('mouseenter', () => {
                logo.style.transform = 'scale(1.05)';
                logo.style.textShadow = '0 0 10px rgba(212, 175, 55, 0.3)';
            });
            logo.addEventListener('mouseleave', () => {
                logo.style.transform = 'scale(1)';
                logo.style.textShadow = 'none';
            });
        }
    };

    // Анимация кнопок
    const buttonAnimation = () => {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px)';
                button.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
            });
        });
    };

    // Инициализация всех функций
    const init = () => {
        addAnimationClasses();
        smoothScroll();
        animateCounters();
        cardHoverEffect();
        formValidation();
        logoAnimation();
        buttonAnimation();

        // Добавляем обработчик скролла
        window.addEventListener('scroll', () => {
            animateOnScroll();
            // Обновляем активный пункт меню
            updateActiveMenuItem();
        });

        // Запускаем анимацию при загрузке
        animateOnScroll();
    };

    // Запускаем инициализацию
    init();
});

// Анимация для кнопок
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mouseover', () => {
        button.style.transform = 'translateY(-3px)';
    });
    
    button.addEventListener('mouseout', () => {
        button.style.transform = 'translateY(0)';
    });
});

// Обработка клика по логотипу
document.querySelectorAll('.logo').forEach(logo => {
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}); 
