import Sortable from 'sortablejs';

export const sortableNested = (callback, optionen) => {
    let elementArray = [];
    new Sortable(optionen.target, {
        animation: 300,
        handle: optionen.handle,
        ghostClass: 'sortable-ghost',
        group: 'shared',
        forceFallback: true,
        scroll: true,
        fallbackOnBody : true,
        bubbleScroll: true,
        scrollSensitivity: 150,
        easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
        scrollSpeed: 20,
        swapThreshold : 0.65,
        emptyInsertThreshold: 5,
        onEnd: function (/**Event*/evt) {
            elementArray = [];
            evt.to.childNodes.forEach(sort => {
                if (sort.hasAttribute('data-id')) {
                    let parent = 0;
                    if(sort.parentElement.hasAttribute('data-parent')) {
                        parent = parseInt(sort.parentElement.getAttribute('data-parent'))
                    }

                    if(parent !== 0 && sort.getAttribute('data-parent')){
                      parent = parseInt(sort.getAttribute('data-parent'));
                    }

                    let sortData = {
                        'id': sort.getAttribute('data-id'),
                        'parent': parent,
                    }

                    elementArray.push(sortData);
                }
            })
            callback(elementArray)
        }
    })
}