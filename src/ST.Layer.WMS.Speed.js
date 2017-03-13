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
        options.url = 'http://tile.sintrafico.com/wms/segment_speed_hr_avg.png';
        if (options.icon == undefined)
            options.icon = 'dashboard';
        if (options.title == undefined)
            options.title = 'Velocidad promedio';
        L.setOptions(this, options);
        WMS.prototype.initialize.call(this, options);
    },
});

module.exports = {
    Speed: speed,
    speed: function(options) {
        return new speed(options);
    },
};