function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
    const slider = document.querySelector(container),
          slides = document.querySelectorAll(slide),
          total = document.querySelector(totalCounter),
          current = document.querySelector(currentCounter),
          slidesWrapper = document.querySelector(wrapper),
          inner = document.querySelector(field),
          width = window.getComputedStyle(slidesWrapper).width,
          prev = document.querySelector(prevArrow),
          next = document.querySelector(nextArrow);
    let slideIndex = 1;
    let offset = 0;

    total.textContent = ('0' + slides.length).slice(-2);
    current.textContent = ('0' + slideIndex).slice(-2);

    inner.style.width = 100 * slides.length + '%';
    inner.style.display = "flex";

    slidesWrapper.style.overflow = 'hidden';
    slides.forEach(slide => slide.style.width = width)

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

    next.addEventListener('click', () => {
        slideIndex < +total.textContent ? slideIndex += 1 : slideIndex = 1;
        showSlide(true);
    })
    prev.addEventListener('click', () => {
        slideIndex <= 1 ? slideIndex = +total.textContent : slideIndex -= 1;
        showSlide(true);
    })

    function returnDigits(str) {
        return +str.replace(/[^0-9\.]/g, '')
    }

    function showSlide(click = false) {
        if (click) {
            inner.style.transition = "0.5s all";
            clearInterval(slideAutoScroll);
            slideAutoScroll = setInterval(showSlide, 5000)
        } else {
            slideIndex < +total.textContent ? slideIndex += 1 : slideIndex = 1;
            inner.style.transition = "1.8s all"
        }

        offset = +returnDigits(width) * (slideIndex - 1);
        inner.style.transform = `translateX(-${offset}px)`;

        current.textContent = ('0' + slideIndex).slice(-2);

        dots.forEach(dot => dot.style.opacity = '0.5');
        dots[slideIndex - 1].style.opacity = 1;
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            slideIndex = e.target.getAttribute('data-slide-to');
            showSlide(true);
        })
    })
}

export default slider;