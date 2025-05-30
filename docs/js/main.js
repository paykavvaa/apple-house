document.addEventListener('DOMContentLoaded', function() {
    // Удаляю данные из localStorage, связанные с темной темой
    if (localStorage.getItem('theme')) {
        localStorage.removeItem('theme');
    }
    
    // Убеждаемся, что все основные элементы видны
    document.querySelectorAll('.specs-grid, .tech-image').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.display = '';
    });
    
    // Форма обратной связи
    const form = document.querySelector('.contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const messageDisplay = form.querySelector('.form-message');

    // Функция для обработки отправки формы
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const messageDiv = form.querySelector('.form-message');
        
        // Получаем данные формы
        const formData = {
            name: form.name.value.trim(),
            phone: form.phone.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim()
        };

        // Валидация данных
        if (!formData.name || !formData.phone || !formData.email || !formData.message) {
            messageDiv.className = 'form-message error-message';
            messageDiv.textContent = 'Пожалуйста, заполните все поля формы';
            return;
        }

        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            messageDiv.className = 'form-message error-message';
            messageDiv.textContent = 'Пожалуйста, введите корректный email';
            return;
        }

        // Валидация телефона
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(formData.phone)) {
            messageDiv.className = 'form-message error-message';
            messageDiv.textContent = 'Пожалуйста, введите корректный номер телефона';
            return;
        }
        
        try {
            // Блокируем кнопку и показываем загрузку
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            messageDiv.className = 'form-message';
            messageDiv.textContent = '';
            
            // Отправляем данные на сервер
            const response = await fetch('/api/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                // Показываем успешное сообщение
                messageDiv.className = 'form-message success-message';
                messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> Спасибо! Ваша заявка успешно отправлена.';
                form.reset();
            } else {
                throw new Error(result.message || 'Ошибка при отправке заявки');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            // Показываем ошибку
            messageDiv.className = 'form-message error-message';
            messageDiv.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <div>
                    <strong>Ошибка отправки заявки</strong><br>
                    Пожалуйста, попробуйте позже или свяжитесь с нами по телефону:<br>
                    <a href="tel:+79103231054">+7 (910) 323-10-54</a>
                </div>
            `;
        } finally {
            // Разблокируем кнопку
            submitButton.disabled = false;
            submitButton.innerHTML = 'Отправить заявку';
        }
    };

    // Добавляем обработчик события submit для формы
    if (document.getElementById('contactForm')) {
        document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);
    }

    // Добавляем анимацию при фокусе на полях формы
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
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

    // Technology Animation
    function animateTechElements() {
        const techVariants = document.querySelectorAll('.tech-variant');
        
        techVariants.forEach((variant, index) => {
            // Добавляем задержку анимации в зависимости от индекса
            variant.style.animationDelay = `${index * 0.2}s`;
            
            // Анимируем внутренние элементы
            const elements = variant.querySelectorAll('.tech-advantage, .tech-features li, .tech-actions, .tech-image-overlay');
            elements.forEach(el => {
                el.style.opacity = '0';
            });
            
            // Задержка для анимации внутренних элементов
            setTimeout(() => {
                elements.forEach(el => {
                    el.style.opacity = '';
                });
            }, 600 + index * 200);
        });
    }

    // Анимация при прокрутке к секции technology
    const techSection = document.querySelector('.technology');
    if (techSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateTechElements();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(techSection);
    }

    // Добавляем эффекты при наведении для tech-variant
    const techVariants = document.querySelectorAll('.tech-variant');
    techVariants.forEach(variant => {
        variant.addEventListener('mouseenter', () => {
            variant.style.transform = 'translateY(-10px)';
            variant.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
        });
        
        variant.addEventListener('mouseleave', () => {
            variant.style.transform = '';
            variant.style.boxShadow = '';
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
                if (nav.classList.contains('active')) {
                    toggleMenu();
                }
            }
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll Down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll Up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Gallery Modal
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length > 0) {
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
    }

    // Анимация появления элементов при скролле
    const addAnimationClasses = () => {
        document.querySelectorAll('.animate-on-scroll').forEach((item, index) => {
            // Добавляем задержку для последовательного появления элементов в галерее
            if (item.classList.contains('gallery-item')) {
                item.style.transitionDelay = `${index * 0.1}s`;
            }
            
            // Добавляем небольшую задержку для tech-image
            if (item.classList.contains('tech-image')) {
                item.style.transitionDelay = `0.2s`;
            }
            
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(item);
        });
    };

    // 1. Прогресс-бар прокрутки
    const addScrollProgressBar = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            
            const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
            progressBar.style.width = `${scrollPercentage}%`;
        });
    };

    // 2. Кнопка "Вернуться наверх"
    const addBackToTopButton = () => {
        const backToTop = document.createElement('div');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // 3. Боковая точечная навигация для десктопа
    const addQuickNav = () => {
        if (window.innerWidth < 1024) return;

        const sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;
        
        const quickNav = document.createElement('div');
        quickNav.className = 'quick-nav';
        
        sections.forEach((section) => {
            const dot = document.createElement('div');
            dot.className = 'quick-nav-dot';
            dot.setAttribute('data-target', `#${section.id}`);
            
            dot.addEventListener('click', () => {
                document.querySelector(dot.getAttribute('data-target')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
            
            quickNav.appendChild(dot);
        });
        
        document.body.appendChild(quickNav);
        
        // Обновление активной точки при прокрутке
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            sections.forEach((section, index) => {
                if (index < quickNav.children.length) {
                    const dot = quickNav.children[index];
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                }
            });
        });
    };

    // 4. Индикатор прокрутки вниз на главном экране
    const addScrollDownIndicator = () => {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-down-indicator';
        scrollIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
        hero.appendChild(scrollIndicator);
        
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('#about');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        // Скрываем индикатор при прокрутке
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    };

    // 5. Анимированный фон для секций
    const addAnimatedBackground = () => {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section) => {
            if (section.classList.contains('hero')) return; // Пропускаем hero секцию
            
            const animatedBg = document.createElement('div');
            animatedBg.className = 'animated-bg';
            
            const shape1 = document.createElement('div');
            shape1.className = 'animated-bg-shape';
            
            const shape2 = document.createElement('div');
            shape2.className = 'animated-bg-shape';
            
            animatedBg.appendChild(shape1);
            animatedBg.appendChild(shape2);
            
            section.appendChild(animatedBg);
        });
    };

    // 7. Улучшенная анимация для галереи
    const enhanceGalleryAnimation = () => {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            // Добавляем задержку для каждого элемента, чтобы они появлялись последовательно
            item.style.animationDelay = `${index * 0.1}s`;
            
            // Добавляем эффект при наведении
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.03)';
                item.style.zIndex = '5';
                item.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
                item.style.zIndex = '1';
                item.style.boxShadow = 'none';
            });
        });
    };

    // 8. Улучшенные всплывающие подсказки для элементов с преимуществами
    const addTooltips = () => {
        const advantageCards = document.querySelectorAll('.advantage-card');
        
        const tooltips = [
            'Используем только материалы высшего качества от проверенных производителей с гарантией.',
            'Наши специалисты имеют более 10 лет опыта в строительстве модульных конструкций.',
            'Мы всегда выполняем работу в оговоренные сроки без задержек.',
            'Предоставляем гарантию на все работы сроком до 5 лет.',
            'Конкурентоспособные цены при высоком качестве работ.',
            'Индивидуальный подход к каждому клиенту и проекту.'
        ];
        
        advantageCards.forEach((card, index) => {
            if (index < tooltips.length) {
                card.classList.add('tooltip');
                
                const tooltipText = document.createElement('span');
                tooltipText.className = 'tooltip-text';
                tooltipText.textContent = tooltips[index];
                
                card.appendChild(tooltipText);
            }
        });
    };

    // Инициализация всех функций
    const init = () => {
        // Обновляем активный пункт меню при прокрутке
        const updateActiveMenuItem = () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav a');
            
            window.addEventListener('scroll', () => {
                let current = '';
                const scrollPosition = window.scrollY + 100;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        current = `#${section.id}`;
                    }
                });
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === current) {
                        link.classList.add('active');
                    }
                });
            });
        };

        // Принудительно отображаем specs-grid и tech-image
        const ensureVisibility = () => {
            document.querySelectorAll('.specs-grid, .tech-image, .spec-card').forEach(el => {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.display = '';
                
                // Принудительно добавляем класс visible, если элемент уже должен быть видимым
                if (el.classList.contains('animate-on-scroll')) {
                    el.classList.add('visible');
                }
            });
            
            // Для табов технологии убеждаемся, что первая вкладка активна
            const activeTabs = document.querySelectorAll('.tab-content.active');
            if (activeTabs.length > 0) {
                activeTabs.forEach(tab => {
                    const techImages = tab.querySelectorAll('.tech-image');
                    techImages.forEach(img => {
                        img.style.opacity = '1';
                        img.style.visibility = 'visible';
                        img.style.display = '';
                    });
                });
            }
        };

        // Вызываем функции инициализации
        addAnimationClasses();
        updateActiveMenuItem();
        ensureVisibility();
        
        // Запускаем новые улучшения
        addScrollProgressBar();
        addBackToTopButton();
        addQuickNav();
        addScrollDownIndicator();
        addAnimatedBackground();
        enhanceGalleryAnimation();
        addTooltips();
    };

    // Запускаем все функции
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

document.addEventListener('DOMContentLoaded', function() {
    const certificateBanner = document.querySelector('.certificate-banner');
    if (certificateBanner) {
        // Добавляем анимацию при появлении баннера
        certificateBanner.style.opacity = '0';
        certificateBanner.style.transform = 'translateY(20px)';
        certificateBanner.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            certificateBanner.style.opacity = '1';
            certificateBanner.style.transform = 'translateY(0)';
        }, 500);
    }
}); 

// Дополнительная проверка видимости элементов после полной загрузки страницы
window.onload = function() {
    // Проверяем specs-grid элементы
    document.querySelectorAll('.specs-grid').forEach(grid => {
        grid.style.display = 'grid';
        grid.style.opacity = '1';
        
        // Проверяем дочерние элементы spec-card
        const specCards = grid.querySelectorAll('.spec-card');
        specCards.forEach(card => {
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.display = '';
        });
    });
    
    // Проверяем технологические изображения
    document.querySelectorAll('.tech-image').forEach(image => {
        image.style.opacity = '1';
        image.style.visibility = 'visible';
        image.style.display = 'block';
        
        // Убеждаемся, что изображения внутри видны
        const img = image.querySelector('img');
        if (img) {
            img.style.opacity = '1';
            img.style.visibility = 'visible';
            img.style.display = 'block';
        }
    });
    
    // Запускаем обработку вкладок для технологии
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        // Активируем первую вкладку
        const firstTab = tabBtns[0];
        const tabId = firstTab.getAttribute('data-tab');
        const tabContent = document.getElementById(tabId);
        
        if (tabContent) {
            tabContent.classList.add('active');
            firstTab.classList.add('active');
        }
    }
}; 
