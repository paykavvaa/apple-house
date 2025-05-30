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
        
        console.log('Форма отправлена, начинаем обработку...');
        
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

        console.log('Данные формы:', formData);

        // Валидация данных
        if (!formData.name || !formData.phone || !formData.email || !formData.message) {
            console.log('Ошибка валидации: пустые поля');
            messageDiv.className = 'form-message error-message';
            messageDiv.textContent = 'Пожалуйста, заполните все поля формы';
            return;
        }

        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            console.log('Ошибка валидации: неверный email');
            messageDiv.className = 'form-message error-message';
            messageDiv.textContent = 'Пожалуйста, введите корректный email';
            return;
        }

        // Валидация телефона - используем более простой и надежный регекс
        // Проверяем наличие минимум 10 цифр в номере телефона
        const cleanPhone = formData.phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            console.log('Ошибка валидации: неверный телефон - недостаточно цифр');
            messageDiv.className = 'form-message error-message';
            messageDiv.textContent = 'Пожалуйста, введите корректный номер телефона (минимум 10 цифр)';
            return;
        }
        
        try {
            // Блокируем кнопку и показываем загрузку
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            messageDiv.className = 'form-message';
            messageDiv.textContent = '';
            
            console.log('Начинаем отправку данных на сервер...');
            
            // Отправляем данные на сервер
            const response = await fetch('/api/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            console.log('Ответ от сервера получен:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Данные ответа:', result);
            
            if (result.success) {
                // Показываем успешное сообщение
                messageDiv.className = 'form-message success-message';
                messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> Спасибо! Ваша заявка успешно отправлена.';
                form.reset();
            } else {
                throw new Error(result.message || 'Ошибка при отправке заявки');
            }
        } catch (error) {
            console.error('Ошибка при отправке:', error);
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
        console.log('Форма найдена, добавляем обработчик события submit');
        document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);
    } else {
        console.log('Форма не найдена!');
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

    // Галерея
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.querySelector('.gallery-modal');
    const modalImg = modal.querySelector('.modal-content img');
    const modalCaption = modal.querySelector('.modal-caption');
    const modalClose = modal.querySelector('.modal-close');
    const modalPrev = modal.querySelector('.modal-prev');
    const modalNext = modal.querySelector('.modal-next');
    
    let currentIndex = 0;
    
    // Функция для открытия модального окна
    function openModal(index) {
        const item = galleryItems[index];
        const img = item.querySelector('img');
        
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalCaption.innerHTML = ''; // Убираем вывод заголовка и описания
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
        currentIndex = index;
    }
    
    // Функция для закрытия модального окна
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
    
    // Функция для перехода к предыдущему изображению
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        openModal(currentIndex);
    }
    
    // Функция для перехода к следующему изображению
    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        openModal(currentIndex);
    }
    
    // Обработчики событий для галереи
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });
    
    modalClose.addEventListener('click', closeModal);
    modalPrev.addEventListener('click', showPrevImage);
    modalNext.addEventListener('click', showNextImage);
    
    // Закрытие по клику вне изображения
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Обработка клавиш клавиатуры
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
    
    // Анимация появления элементов при прокрутке
    const animateGalleryItems = () => {
        galleryItems.forEach((item, index) => {
            const itemTop = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (itemTop < windowHeight - 100) {
                item.classList.add('visible');
                // Добавляем задержку для эффекта каскада
                item.style.animationDelay = `${index * 0.1}s`;
            }
        });
    };
    
    // Вызываем функцию при загрузке и при прокрутке
    animateGalleryItems();
    window.addEventListener('scroll', animateGalleryItems);

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
        // Удаляем существующую кнопку, если она есть
        const existingButton = document.querySelector('.back-to-top');
        if (existingButton) {
            existingButton.remove();
        }
        
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
        
        // Принудительно проверяем позицию прокрутки после создания кнопки
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        }
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

        // Определяем функцию addAnimationClasses, которая не была определена ранее
        const addAnimationClasses = () => {
            // Добавляем классы для анимации при прокрутке
            document.querySelectorAll('.animate-on-scroll').forEach(element => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(element);
            });
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
    
    // Убедимся, что кнопка возврата наверх создана
    if (!document.querySelector('.back-to-top')) {
        addBackToTopButton();
    }
}; 
