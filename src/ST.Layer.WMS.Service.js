'use strict';
var {WMS} = require('./ST.Layer.WMS.js')

var service = WMS.extend({

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
        icon: 'bar-chart',
        title: 'Nivel de servicio',
        //     buttonPosition: 'topright',
        //     colorOn: '#337AB7',
        //     colorOff: '#5F7C8A',
    },

    initialize: function (options) {
        options.url = 'http://tile.sintrafico.com/wms/service.png';
        if (options.icon == undefined)
            options.icon = 'bar-chart';
        if (options.title == undefined)
            options.title = 'Nivel de servicio';
        L.setOptions(this, options);
        WMS.prototype.initialize.call(this, options);
    },
});

module.exports = {
    Service: service,
    service: function(options) {
        return new service(options);
    },
};