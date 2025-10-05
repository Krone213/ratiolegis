document.addEventListener('DOMContentLoaded', function() {
   // --- НОВАЯ ЛОГИКА ДЛЯ БУРГЕР-МЕНЮ ---
    const burgerIcon = document.getElementById('burger-icon');
    const mobileMenu = document.getElementById('mobile-menu');

    if (burgerIcon && mobileMenu) {
        burgerIcon.addEventListener('click', function() {
            burgerIcon.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });
    }
    // --- ЛОГИКА ДЛЯ ФОРМЫ ЗАЯВКИ (Отправка в Telegram через Netlify Functions) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formMessage = document.getElementById('form-message');
        const submitBtn = document.getElementById('submit-btn');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            const formData = {
                case_number: document.getElementById('case_number').value,
                contact_info: document.getElementById('contact_info').value,
                message: document.getElementById('message').value
            };
            fetch('/.netlify/functions/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => { if (!response.ok) { throw new Error('Server response was not ok.'); } return response.json(); })
            .then(() => {
                showMessage(formMessage, 'Спасибо! Ваша заявка успешно отправлена.', 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Ошибка отправки:', error);
                showMessage(formMessage, 'Произошла ошибка. Пожалуйста, попробуйте еще раз.', 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Отправить заявку';
            });
        });
    }

    // --- ЛОГИКА ДЛЯ ФОРМЫ ОТЗЫВОВ (Отправка в Netlify Forms) ---
    const reviewForm = document.querySelector('form[name="reviews"]');
    if (reviewForm) {
        const reviewFormMessage = document.getElementById('review-form-message');
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = reviewForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';

            const formData = new FormData(reviewForm);
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                reviewForm.reset();
                showMessage(reviewFormMessage, 'Спасибо! Ваш отзыв отправлен на модерацию.', 'success');
            })
            .catch(error => {
                showMessage(reviewFormMessage, `Ошибка: ${error}`, 'error');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Оставить отзыв';
            });
        });
    }
   // --- ИСПРАВЛЕННАЯ АВТОМАТИЧЕСКАЯ ЗАГРУЗКА ОТЗЫВОВ ---
    const reviewsList = document.getElementById('reviews-list');
    if (reviewsList) {
        async function fetchAndDisplayReviews() {
            const reviewsLoader = document.getElementById('reviews-loader');
            try {
                // Делаем запрос к нашей безопасной функции-посреднику
                const response = await fetch('/.netlify/functions/get-reviews');
                if (!response.ok) throw new Error(`Ошибка сервера: ${response.statusText}`);
                const submissions = await response.json();
                if (submissions.error) throw new Error(submissions.error);

                reviewsList.innerHTML = ''; // Очищаем "Загрузка..."
                if (submissions.length === 0) {
                    reviewsList.innerHTML = '<p>Отзывов пока нет. Станьте первым!</p>';
                } else {
                    submissions.forEach(submission => {
                        const review = submission.data;
                        const reviewElement = document.createElement('div');
                        reviewElement.className = 'review-card';
                        reviewElement.innerHTML = `<blockquote>«${escapeHTML(review.text)}»</blockquote><cite>${escapeHTML(review.author)}</cite>`;
                        reviewsList.appendChild(reviewElement);
                    });
                }
            } catch (error) {
                console.error("Ошибка загрузки отзывов:", error);
                if(reviewsLoader) {
                    reviewsLoader.textContent = "Не удалось загрузить отзывы.";
                }
            }
        }
        fetchAndDisplayReviews();
    }
    // --- ОБЩИЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    function showMessage(element, message, type) {
        if (!element) return;
        element.textContent = message;
        element.className = 'form-message';
        element.classList.add(type);
    }
    
    // --- ИСПРАВЛЕННАЯ ЛОГИКА АНИМАЦИИ ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
    };
    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };
    window.addEventListener('scroll', handleScrollAnimation);
    // Вызываем функцию один раз при загрузке для элементов, которые уже видны
    handleScrollAnimation();
});






