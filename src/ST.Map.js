'use strict';
var {speed} = require('./ST.Layer.WMS.Speed.js')
var {congestion} = require('./ST.Layer.Heat.Congestion.js')
var {incident} = require('./ST.Control.Layers.Incident.js')
var {pois} = require('./ST.Control.Layers.Pois.js')

var _Map = L.Map.extend({

    options: {
        apiKey: '',
        // General
        //     buttonPosition: 'topright'
             legendWidth: '600px',
        // Layers
        congestionEnabled: true,
        congestionVisible: false,
        //     congestionIcon: 'thermometer-empty',
        speedEnabled: true,
        speedVisible: false,
        //     speedIcon: 'dashboard',
        incidentEnabled: true,
        incidentVisible: false,
        //     incidentIcon: 'exclamation-triangle',
        colorOn: '#337AB7',
        colorOff: '#5F7C8A',
    },

    initialize: function (div, options) {
        L.setOptions(this, options);
        L.Map.prototype.initialize.call(this, div, options);
    },

    setView: function (center, zoom, options) {
        console.log(this.options);
        L.Map.prototype.setView.call(this, center, zoom, options);
        this._congestion(this.options);
        this._speed(this.options);
        this._incidents(this.options);
        this._poisControl = pois({apiKey: this.options.apiKey}).addTo(this);
        this.on('dragend zoomend', L.bind(this._poisControl.update, this._poisControl));
        return this;
    },

    _congestion: function (options) {
        if (!options.congestionEnabled)
            return;
        var congestionOptions = {
            apiKey: options.apiKey,
            visible: options.congestionVisible,
        };
        if ('colorOn' in options)
            congestionOptions.colorOn = options.colorOn;
        if ('colorOff' in options)
            congestionOptions.colorOff = options.colorOff;
        if ('congestionIcon' in options)
            congestionOptions.icon = options.congestionIcon;
        if ('buttonPosition' in options)
            congestionOptions.position = options.buttonPosition;
        if ('legendWidth' in options)
            congestionOptions.width = options.legendWidth;
        this._congestionLayer = congestion(congestionOptions).addTo(this);
    },

    _speed: function (options) {
        if (!options.speedEnabled)
            return;
        var speedOptions = {
            apiKey: options.apiKey,
            visible: options.speedVisible,
        };
        if ('colorOn' in options)
            speedOptions.colorOn = options.colorOn;
        if ('colorOff' in options)
            speedOptions.colorOff = options.colorOff;
        if ('speedIcon' in options)
            speedOptions.icon = options.speedIcon;
        if ('buttonPosition' in options)
            speedOptions.position = options.buttonPosition;
        if ('legendWidth' in options)
            speedOptions.width = options.legendWidth;
        this._speedLayer = speed(speedOptions).addTo(this);
        this.on('dragend zoomend', L.bind(this._speedLayer.update, this._speedLayer));
    },

    _incidents: function (options) {
        if (!options.incidentsEnabled)
            return;
        var incidentsOptions = {
            apiKey: options.apiKey,
            initialVisibility: options.incidentsVisible,
        };
        if ('colorOff' in options)
            incidentsOptions.color = options.colorOff;
        if ('incidentsIcon' in options)
            incidentsOptions.icon = options.incidentsIcon;
        if ('buttonPosition' in options)
            incidentsOptions.position = options.buttonPosition;
        this._incidentsLayer = incident(incidentsOptions).addTo(this);
    },
});  // NOTE: Map() is a JS(?) function

module.exports = {
    Map: _Map,
    map: function (div, options) {
        return new _Map(div, options);
    },
};
