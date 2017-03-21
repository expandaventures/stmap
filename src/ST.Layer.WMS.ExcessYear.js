'use strict';
var {WMS} = require('./ST.Layer.WMS.js')

var excess = WMS.extend({

    options: {
        // ST.Layer.WMS
        visible: true,
        //     callback: null,
        //     callbackTarget: null,
        //     url: [set on initialize because it uses apiKey],
        // ST.Control.Legend
        //     imgSrc: null,
        //     legendPosition: 'bottomright',
        //     width: '300px',
        // ST.Control.ToggleButton
        icon: 'bolt',
        title: 'Excesos/Año',
        //     buttonPosition: 'topright',
        //     colorOn: '#337AB7',
        //     colorOff: '#5F7C8A',
    },

    initialize: function (options) {
        options.url = 'http://tile.sintrafico.com/wms/speeding_year.png';
        if (options.icon == undefined)
            options.icon = 'bolt';
        if (options.title == undefined)
            options.title = 'Excesos/Año';
        L.setOptions(this, options);
        WMS.prototype.initialize.call(this, options);
    },
});

module.exports = {
    ExcessYear: excess,
    excessYear: function(options) {
        return new excess(options);
    },
};