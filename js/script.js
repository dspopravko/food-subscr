window.addEventListener('DOMContentLoaded', () => {

    //Tabs
    const tabs = document.querySelectorAll('.tabheader__item'), // каждый пункт меню
          tabsContent = document.querySelectorAll('.tabcontent'), //каждый отдельный продукт
          tabsParent = document.querySelector('.tabheader__items'); // меню
    
    //убираем превью и выключаем меню
    function hideTabContent() {
        tabsContent.forEach(item => {
                item.style.display = 'none';
        });
        
        tabs.forEach(item => {
                item.classList.remove('tabheader__item_active');
        });

    }

    //показываем превью
    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
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
    const deadline = '2022-06-01';
    
    function getTimeRemaining(endtime) {
        const total = Date.parse(endtime) - Date.parse(new Date());
              days = Math.floor(total/(1000*60*60*24));
              hours = Math.floor(total/(1000*60*60) % 24);
              minutes = Math.floor((total/1000/60)%60);
              seconds = Math.floor((total/1000)%60);
        
        return {
            total,
            days,
            hours,
            minutes,
            seconds
        };
    }

    function getZero(num) {
        if (num>=0 && num < 10)
            return `0${num}`
        else return num
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock,1000);

        updateClock();
              
        function updateClock() {
            const total = getTimeRemaining(endtime);

            days.innerHTML = getZero(total.days);
            hours.innerHTML = getZero(total.hours);
            minutes.innerHTML = getZero(total.minutes);
            seconds.innerHTML = getZero(total.seconds);

            if (total.total <= 0) {
                clearInterval(timeInterval);
            }

        }

    }

    setClock('.timer', deadline);

    //modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          modalCloseBtn = document.querySelector('[data-close]');

    modalTrigger.forEach(item => {
        item.addEventListener('click', openModal);
    });
    
    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 3000);

    function showModalByScroll() {
        if (Math.ceil(window.pageYOffset + document.documentElement.clientHeight) >= document.documentElement.scrollHeight) {
            console.log('smth');
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

})