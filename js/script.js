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
    const deadline = '2022-07-15'

    function getTimeRemaining(endtime) {
        const remainTime = Date.parse(endtime) - Date.parse(new Date()),
              options = {
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              };
        
        return (remainTime > 0) ? new Intl.DateTimeFormat('ru-RU', options).format(new Date(remainTime)) : '00, 00:00:00'
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock,1000)

        updateClock();
              
        function updateClock() {
            const remainTime = getTimeRemaining(endtime);
            days.innerHTML = remainTime.slice(0, 2);
            hours.innerHTML = remainTime.slice(4, 6);
            minutes.innerHTML = remainTime.slice(7, 9);
            seconds.innerHTML = remainTime.slice(10, 12)

            if (remainTime == '00, 00:00:00')
                console.log('stop')
        }
    }
    setClock('.timer', deadline);
    
})