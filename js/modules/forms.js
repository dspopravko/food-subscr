import {closeModal, openModal} from './modal';
import {postData} from '../services/services'

function forms(formSelector, modalTimerId) {
    const forms = document.querySelectorAll(formSelector);
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(form => {
        bindPostData(form);
    });

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form)

            const object = {};
            formData.forEach(function (value, key) {
                object[key] = value
            });

            postData('http://localhost:3000/requests', JSON.stringify(Object.fromEntries(formData.entries())))
                .then(data => {
                    console.log(data);
                    showAlertModal(message.success);
                    form.reset();
                    statusMessage.remove();
                }).catch(() => {
                    showAlertModal(message.failure);
                }).finally(() => {
                    form.reset();
                })
        });
    };

    function showAlertModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal('.modal', modalTimerId);

        const alertModal = document.createElement('div');
        alertModal.classList.add('modal__dialog');
        alertModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(alertModal);
        setTimeout(() => {
            alertModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal('.modal');
        }, 4000);
    }
}

export default forms;