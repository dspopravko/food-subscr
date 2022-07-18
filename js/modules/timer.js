function timer(id, deadline) {
    function getTimeRemaining(endtime) {
        let remainTime = Date.parse(endtime) - Date.parse(new Date());
        if (remainTime < 0) { remainTime = 0 };
        const days = Math.floor(remainTime / (1000 * 60 * 60 * 24)),
        hours = Math.floor(remainTime / (1000 * 60 * 60) % 24),
        minutes = Math.floor((remainTime / 1000 / 60) % 60),
        seconds = Math.floor((remainTime / 1000) % 60)

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

    setClock(id, deadline);
}

export default timer;