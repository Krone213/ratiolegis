document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
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
        .then(data => { showMessage('Спасибо! Ваша заявка успешно отправлена.', 'success'); contactForm.reset(); })
        .catch(error => { console.error('Ошибка отправки:', error); showMessage('Произошла ошибка. Пожалуйста, попробуйте еще раз.', 'error'); })
        .finally(() => { submitBtn.disabled = false; submitBtn.textContent = 'Отправить заявку'; });
    });

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message';
        formMessage.classList.add(type);
    }

    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const elementInView = (el) => el.getBoundingClientRect().top <= window.innerHeight;
    const displayScrollElement = (el) => el.classList.add('is-visible');
    const handleScrollAnimation = () => scrollElements.forEach(el => { if (elementInView(el)) displayScrollElement(el); });
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation();
});