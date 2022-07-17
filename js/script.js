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
        modal.classList.add('show');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('show');
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

    //Post&GetData
    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    const getData = async (url) => {
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        };

        return await res.json();
    };
    
    //Forms
    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    }

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
            formData.forEach(function(value, key){
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

    //Menu cards
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSection, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSection);
            this.transfer = 3;
            this.changeToGEL();
        }

        changeToGEL() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element)
            } else
                this.classes.forEach(className => element.classList.add(className));
            
            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> лар/день</div>
                    </div>
            `;
            this.parent.append(element);
        }
    };

    getData('http://localhost:3000/menu')
    .then(data => {
        data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        })
    })

    //Slider

    const slider = document.querySelector('.offer__slider'),
          slides = document.querySelectorAll('.offer__slide'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesInner = document.querySelector('.offer__slider-inner'),
          wrapWidth = window.getComputedStyle(slidesWrapper).width,
          prevSlide = document.querySelector('.offer__slider-prev'),
          nextSlide = document.querySelector('.offer__slider-next');
    let slideIndex = 1;
    let slideOffset = 0;

    total.textContent = ('0' + slides.length).slice(-2);
    current.textContent =  ('0' + slideIndex).slice(-2);

    slidesInner.style.width = 100 * slides.length + '%';
    slidesInner.style.display = "flex";

    slidesWrapper.style.overflow = 'hidden';
    slides.forEach(slide => slide.style.width = wrapWidth)

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots = [];

    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if (i == (slideIndex - 1)) dot.style.opacity = 1;
        indicators.append(dot);
        dots.push(dot);
    };
    
    let slideAutoScroll = setInterval(showSlide, 3000);
    
    nextSlide.addEventListener('click', () => {
        slideIndex < +total.textContent ? slideIndex += 1 : slideIndex = 1;
        showSlide(click = true);
    })
    prevSlide.addEventListener('click', () => {
        slideIndex <= 1 ? slideIndex = +total.textContent : slideIndex -= 1;
        showSlide(click = true);
    })
    
    function returnDigits(str) {
        return +str.replace(/[^0-9\.]/g, '')
    }

    function showSlide (click = false) {
        if (click) {
            slidesInner.style.transition = "0.5s all";
            clearInterval(slideAutoScroll);
            slideAutoScroll = setInterval(showSlide, 5000)
        } else {
            slideIndex < +total.textContent ? slideIndex += 1 : slideIndex = 1;
            slidesInner.style.transition = "1.8s all"
        }

        slideOffset = +returnDigits(wrapWidth) * (slideIndex - 1);
        slidesInner.style.transform = `translateX(-${slideOffset}px)`;

        current.textContent =  ('0' + slideIndex).slice(-2);

        dots.forEach(dot => dot.style.opacity = '0.5');
        dots[slideIndex - 1].style.opacity = 1;
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            slideIndex = e.target.getAttribute('data-slide-to');
            showSlide(click = true);
        })
    })

    //Calculator
    const calcResult = document.querySelector('.calculating__result');

    let sex = 'female',
        height, weight, age,
        ratio = 1.375;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex')
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio')
    } else {
        ratio = '1.375';
        localStorage.setItem('ratio', '1.375');
    }
    
    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (sex && height && weight && age && ratio) {
            if (sex === 'female') {
                calcResult.innerHTML = `<span>${Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio)} ккал</span>`;
            } else {
                calcResult.innerHTML = `<span>${Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio)} ккал</span>`;
            }
        } else {
            calcResult.innerHTML = `<span>****</span>`;
            return
        }
    }

    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {              
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio);
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', sex);
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                })
    
                e.target.classList.add(activeClass);
    
                calcTotal();
            })
        });
    };

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');
    
    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);
        
        input.addEventListener('input', () => {
            switch(input.getAttribute('id')) {
                case 'height':
                    if (checkInput(input, 100, 260))
                        height = +input.value
                    break;
                case 'weight':
                    if (checkInput(input, 30, 200))
                        weight = +input.value;
                    break;
                case 'age':
                    if (checkInput(input, 16, 99))
                        age = +input.value;
                    break;
            }
            calcTotal();
        })
    }

    function checkInput (input, min, max) {
        if (!(input.value.match(/[^0-9\.]/g)) && input.value >= min && input.value <= max) {
            alertInput(input, false);
            return true
        } else {
            alertInput(input, true);
            return false
        }
    }

    function alertInput (input, state) {
        state ? input.style.border = '1px solid red' : input.style.border = ''
    };

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');

})