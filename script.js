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
                showMessage(reviewFormMessage, `Произошла ошибка при отправке отзыва: ${error}`, 'error');
            });
        });
    }
    
    // --- ЛОГИКА ЗАГРУЗКИ ОПУБЛИКОВАННЫХ ОТЗЫВОВ ---
    // (Пока не реализована, чтобы не усложнять. Сейчас отзывы нужно добавлять вручную в HTML)
    const reviewsList = document.getElementById('reviews-list');
    if (reviewsList) {
        const reviewsLoader = document.getElementById('reviews-loader');
        // Проверяем, есть ли уже в верстке карточки отзывов
        const existingReviews = reviewsList.querySelectorAll('.review-card');
        if (existingReviews.length > 0) {
            reviewsLoader.style.display = 'none'; // Если есть, прячем загрузчик
        } else {
            reviewsLoader.textContent = 'Отзывов пока нет. Станьте первым!'; // Если нет, меняем текст
        }
    }

    // --- ОБЩИЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    function showMessage(element, message, type) {
        if (!element) return;
        element.textContent = message;
        element.className = 'form-message';
        element.classList.add(type);
    }
    
    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, match => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[match]));
    }

    // --- АНИМАЦИЯ ПРИ ПРОКРУТКЕ ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const elementInView = (el) => el.getBoundingClientRect().top <= window.innerHeight;
    const displayScrollElement = (el) => el.classList.add('is-visible');
    const handleScrollAnimation = () => scrollElements.forEach(el => { if (elementInView(el)) displayScrollElement(el); });
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation();
});

1.  **Откройте ваш репозиторий на GitHub.**
2.  Найдите файл **`index.html`**, нажмите "Edit", сотрите старый код и вставьте новый из **пункта 1**. Сохраните.
3.  Найдите файл **`script.js`**, нажмите "Edit", сотрите старый код и вставьте новый из **пункта 2**. Сохраните.
4.  **Готово!** Netlify автоматически начнет пересборку вашего сайта. Через 1-2 минуты все изменения будут онлайн, и все функции (включая отправку заявки) будут работать корректно.
