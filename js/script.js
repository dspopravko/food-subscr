window.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabContents = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabContents.forEach(tabContent => {
            tabContent.classList.add('hide');
            tabContent.classList.remove('show', 'fade')
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active')
        })
            
    }

    function showTabContent(i = 0) {
        tabContents[i].classList.add('show', 'fade');
        tabContents[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active')
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    })
    
    //Timer
    const deadline = '2022-08-07'

    function getTimeRemaining(endtime) {
        let remainTime = Date.parse(endtime) - Date.parse(new Date());
        if (remainTime < 0) {remainTime = 0};
        const days = Math.floor(remainTime/(1000*60*60*24));
              hours = Math.floor(remainTime/(1000*60*60)%24);
              minutes = Math.floor((remainTime/1000/60)%60);
              seconds = Math.floor((remainTime/1000)%60)

        return {
            'total': remainTime,
            days,
            hours,
            minutes,
            seconds
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds');
              
              updateClock();

        function updateClock() {
            const remainTime = getTimeRemaining(endtime);
            
            days.innerHTML = ('0' + remainTime.days).slice(-2);
            hours.innerHTML = ('0' + remainTime.hours).slice(-2);
            minutes.innerHTML = ('0' + remainTime.minutes).slice(-2);
            seconds.innerHTML = ('0' + remainTime.seconds).slice(-2);
            
            const timeInterval = setInterval(updateClock, 1000);

            if (remainTime.total <= 0) {
                clearInterval(timeInterval)
            }
        }
    }

    setClock('.timer', deadline);
    
    //Modal
    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    modalTrigger.forEach(button => {
        button.addEventListener('click', openModal);
    });

    function openModal() {
        modal.classList.toggle('show');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.classList.toggle('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    })

    const modalTimerId = setTimeout(openModal, 30000);

    function showModalByScroll() {
        if (Math.ceil(window.pageYOffset + document.documentElement.clientHeight) >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
    
    //Forms
    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    }

    forms.forEach(form => {
        postData(form);
    });

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');

            request.setRequestHeader('Content-type', 'application/json');
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key){
                object[key] = value
            });

            const json = JSON.stringify(object);

            request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    showAlertModal(message.success);
                    form.reset();
                    statusMessage.remove();
                } else {
                    showAlertModal(message.failure);
                }
            });
        });
    };

    function showAlertModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

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
            closeModal();
        }, 4000);
    }
})