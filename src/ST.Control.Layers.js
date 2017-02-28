'use strict';

var layers = L.Control.Layers.extend({

    options: {
        position: 'topright',
        icon: 'podcast',
        color: '#5F7C8A',
    },

    initialize: function (baseLayers, overlays, options) {
        L.setOptions(this, options);
        L.Control.Layers.prototype.initialize.call(this, baseLayers, overlays, options);
    },

    onAdd: function (map) {
        var container = L.Control.Layers.prototype.onAdd.call(this, map);
        container.classList.add('st-control-layers');
        container.childNodes[0].style.color = this.options.color;
        container.childNodes[0].innerHTML = '<center>' +
                                            '<span style="margin-top:4px;" class="fa fa-2x fa-' +
                                            this.options.icon + '"></span>' +
                                            '<span class="fa fa-caret-down"></span>';
                                            '</center>';
        return container;
    },
});

module.exports = {
    Layers: layers,
    layers: function(baseLayers, overlays, options) {
        return new layers(baseLayers, overlays, options);
    },
};