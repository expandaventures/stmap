'use strict';


L.control.legend = function (options) {
    return new L.Control.Legend(options);
}


L.Control.Legend = L.Control.extend({

    options: {
        imgSrc: null,
        position: 'bottomright',
        width: '300px',
    },

    initialize: function (options) {
        L.setOptions(this, options);
    },

    onAdd: function (map) {
        if (this.options.imgSrc) {
            var container = L.DomUtil.create('div', 'logo-container');
            container.style.width = this.options.width;
            container.innerHTML = '<div class="row">'
                                +     '<div class="col-md-12">'
                                +         '<img class="logo" src="' + this.options.imgSrc + '">'
                                +     '</div>'
                                + '</div>';
            return container;
        }
        return L.DomUtil.create('div', 'logo-container');
    },
});

module.exports = {
    Legend: L.Control.Legend,
    legend: L.control.legend,
};