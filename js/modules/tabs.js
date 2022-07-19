function tabs({tabsSelector, tabsContentSelector, tabsParentSelector, activeClass, startTab, interval}) {
    const tabs = document.querySelectorAll(tabsSelector),
          tabContents = document.querySelectorAll(tabsContentSelector),
          tabsParent = document.querySelector(tabsParentSelector);
    let index = startTab;

    function hideTabContent() {
        tabContents.forEach(tabContent => {
            tabContent.classList.add('hide');
            tabContent.classList.remove('show', 'fade')
        });

        tabs.forEach(tab => {
            tab.classList.remove(activeClass)
        })
    }

    function showTabContent(i = 0) {
        tabContents[i].classList.add('show', 'fade');
        tabContents[i].classList.remove('hide');
        tabs[i].classList.add(activeClass)
    }

    function nextTab() {
        index < tabContents.length - 1  ? index ++ : index = 0;
          hideTabContent(index);
          showTabContent(index);
      }
      
    let timerId = setInterval(nextTab, interval)

    hideTabContent();
    showTabContent(index);

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        clearInterval(timerId);
        
        if (target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    })
}

export default tabs;