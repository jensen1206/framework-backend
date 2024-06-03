import Sortable from 'sortablejs';

export const sortableTable = (callback, optionen) => {
    let elementArray = [];
    new Sortable(optionen.target, {
        animation: 300,
        handle: optionen.handle,
        ghostClass: 'sortable-ghost',
        forceFallback: true,
        scroll: true,
        bubbleScroll: true,
        scrollSensitivity: 150,
        easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
        scrollSpeed: 20,
        emptyInsertThreshold: 5,
        onEnd: function (/**Event*/evt) {
            elementArray = [];
            evt.to.childNodes.forEach(sort => {
                let iSelector = sort.querySelector('i')
                if (iSelector.hasAttribute('data-id')) {
                    let sortData = {
                        'id': iSelector.getAttribute('data-id'),
                        'owner': iSelector.getAttribute('data-owner'),
                    }
                    elementArray.push(sortData);
                }
            })
            callback(elementArray)
        }
    })
}