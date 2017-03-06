'use strict';
var {Heat} = require('./ST.Layer.Heat.js')

var congestion = Heat.extend({

    options: {
        apiKey: '',
        // ST.Layer.Heat
        visible: true,
        //     callback: null,
        //     callbackTarget: null,
        // heat layer
        //     url: [set on initialize because it uses apiKey],
        //     opacity: 0.6,
        // ST.Control.Legend
        imgSrc: 'LeyendaCongestion.png',
        //     legendPosition: 'bottomright',
        //     width: '300px',
        // ST.Control.ToggleButton
        icon: 'thermometer-empty',
        //     buttonPosition: 'topright',
        //     colorOn: '#337AB7',
        //     colorOff: '#5F7C8A',
    },

    initialize: function (options) {
        if (options == undefined)
            options = {};
        options.url = 'http://tile.sintrafico.com/rawlayers/heatmap.json?' +
                           'bbox={minX},{minY},{maxX},{maxY}&apiKey=' + options.apiKey;
        if (options.icon == undefined)
            options.icon = 'thermometer-empty';
        L.setOptions(this, options);
        L.ST.Layer.Heat.prototype.initialize.call(this, options);
    },
});

module.exports = {
    Congestion: congestion,
    congestion: function(options) {
        return new congestion(options);
    },
};