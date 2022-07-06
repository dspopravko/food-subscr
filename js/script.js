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
              time = {
                day: '',
                hour: '',
                minute: '',
                second: ''
              }
        if (remainTime > 0) {
            for (key in time) {
                let options = {};
                options[key] = '2-digit';
                time[key] = +new Intl.DateTimeFormat('ru-RU', options).format(new Date(remainTime));
                console.log(options)
            }
        }
        time.total = remainTime;

        return time
    }

    function addZero(num) {
        if (num >= 0 && num < 10)
            return `0${num}`
        else return num
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

            days.innerHTML = addZero(remainTime.day);
            hours.innerHTML = addZero(remainTime.hour);
            minutes.innerHTML = addZero(remainTime.minute);
            seconds.innerHTML = addZero(remainTime.second)

            if (remainTime.total <= 0) {
                clearInterval(timeInterval)
            }
        }
    }
    setClock('.timer', deadline);
    
})