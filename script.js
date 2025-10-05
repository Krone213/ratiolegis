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
