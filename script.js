document.addEventListener('DOMContentLoaded', function() {

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
     // --- АВТОМАТИЧЕСКАЯ ЗАГРУЗКА ОТЗЫВОВ ---
    const reviewsList = document.getElementById('reviews-list');
    if (reviewsList) {
        // Эти переменные будут заменены Netlify во время сборки
        const FORM_ID = '{{ env.NETLIFY_FORM_ID }}';
        const ACCESS_TOKEN = '{{ env.NETLIFY_ACCESS_TOKEN }}';
        
        async function fetchAndDisplayReviews() {
            const reviewsLoader = document.getElementById('reviews-loader');
            // Проверяем, что ключи были успешно внедрены
            if (!FORM_ID.includes("env.") && !ACCESS_TOKEN.includes("env.")) {
                try {
                    const response = await fetch(`https://api.netlify.com/api/v1/forms/${FORM_ID}/submissions`, {
                        headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
                    });
                    if (!response.ok) throw new Error('Failed to fetch reviews');
                    const submissions = await response.json();
                    reviewsList.innerHTML = ''; // Очищаем
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
                    reviewsLoader.textContent = "Не удалось загрузить отзывы.";
                }
            } else {
                reviewsLoader.textContent = "Настройка автоматической загрузки отзывов не завершена. Добавьте переменные окружения.";
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


