'use strict';
var {WMS} = require('./ST.Layer.WMS.js')

var speed = WMS.extend({

    options: {
        // ST.Layer.WMS
        visible: true,
        //     callback: null,
        //     callbackTarget: null,
        //     url: [set on initialize because it uses apiKey],
        // ST.Control.Legend
        imgSrc: 'LeyendaVelocidad.png',
        //     legendPosition: 'bottomright',
        //     width: '300px',
        // ST.Control.ToggleButton
        icon: 'dashboard',
        title: 'Velocidad promedio',
        //     buttonPosition: 'topright',
        //     colorOn: '#337AB7',
        //     colorOff: '#5F7C8A',
    },

    initialize: function (options) {
        options.url = 'http://tile.sintrafico.com/wms/speed_live.png';
        if (options.icon == undefined)
            options.icon = 'dashboard';
        if (options.title == undefined)
            options.title = 'Velocidad en vivo';
        L.setOptions(this, options);
        WMS.prototype.initialize.call(this, options);
    },
});

module.exports = {
    SpeedLive: speed,
    speedLive: function(options) {
        return new speed(options);
    },
};