function calc() {
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
            switch (input.getAttribute('id')) {
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

    function checkInput(input, min, max) {
        if (!(input.value.match(/[^0-9\.]/g)) && input.value >= min && input.value <= max) {
            alertInput(input, false);
            return true
        } else {
            alertInput(input, true);
            return false
        }
    }

    function alertInput(input, state) {
        state ? input.style.border = '1px solid red' : input.style.border = ''
    };

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
}

export default calc;