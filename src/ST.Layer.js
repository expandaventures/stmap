'use strict';

var stLayer = L.Layer.extend({

    options: {
        // ST.Layer.WMS
        //     urlZoomedOut: null,
        //     zoomThreshold: 15,
        // ST.Layer.Heat && ST.Layer.WMS
        //     url: null,
        //     visible: true,
        //     callback: null,
        //     callbackTarget: null,
        // layer
        //     opacity: 0.6,
        // ST.Control.Legend
        //     imgSrc: null,
        //     legendPosition: 'bottomright',
        //     width: '300px',
        // ST.Control.ToggleButton
        //     buttonPosition: 'topright',
        //     initialValue: true,
        //     icon: 'podcast',
        //     colorOn: '#337AB7',
        //     colorOff: '#5F7C8A',
        //     title: 'Toggle Layer',
    },

    initialize: function (options) {
        L.setOptions(this, options);
    },

    onAdd: function (map) {
    },

    onRemove: function (map) {
    },
});

module.exports = {
    Layer: ST.Layer,
    layer: function(options) {
        return new stLayer(options);
    },
};