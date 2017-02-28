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
        incidentsEnabled: true,
        incidentsVisible: false,
        //     incidentsIcon: 'exclamation-triangle',
        poisEnabled: true,
        poisVisible: false,
        //     poisIcon: 'map-marker',
        colorOn: '#337AB7',
        colorOff: '#5F7C8A',
    },

    initialize: function (div, options) {
        L.setOptions(this, options);
        L.Map.prototype.initialize.call(this, div, options);
    },

    setView: function (center, zoom, options) {
        L.Map.prototype.setView.call(this, center, zoom, options);
        this._initCongestion(this.options);
        this._initSpeed(this.options);
        this._initIncidents(this.options);
        this._initPois(this.options);
        return this;
    },

    _initCongestion: function (options) {
        if (!options.congestionEnabled)
            return;
        var congestionOptions = this._baseOptions(options);
        congestionOptions.visible = options.congestionVisible;
        if ('congestionIcon' in options)
            congestionOptions.icon = options.congestionIcon;
        this._congestion = congestion(congestionOptions).addTo(this);
    },

    _initSpeed: function (options) {
        if (!options.speedEnabled)
            return;
        var speedOptions = this._baseOptions(options);
        speedOptions.visible = options.speedVisible;
        if ('speedIcon' in options)
            speedOptions.icon = options.speedIcon;
        this._speed = speed(speedOptions).addTo(this);
        this.on('dragend zoomend', L.bind(this._speed.update, this._speed));
    },

    _initIncidents: function (options) {
        if (!options.incidentsEnabled)
            return;
        var incidentsOptions = this._baseOptions(options);
        incidentsOptions.initialVisibility = options.incidentsVisible;
        if ('colorOff' in options)
            incidentsOptions.color = options.colorOff;
        if ('incidentsIcon' in options)
            incidentsOptions.icon = options.incidentsIcon;
        this._incidents = incident(incidentsOptions).addTo(this);
    },

    _initPois: function (options) {
        if (!options.poisEnabled)
            return;
        var poisOptions = this._baseOptions(options);
        poisOptions.initialVisibility = options.poisVisible;
        if ('colorOff' in options)
            poisOptions.color = options.colorOff;
        if ('poisIcon' in options)
            poisOptions.icon = options.poisIcon;
        this._pois = pois(poisOptions).addTo(this);
        this.on('dragend zoomend', L.bind(this._pois.update, this._pois));
    },

    _baseOptions: function (options) {
        var base = {
            apiKey: options.apiKey,
        };
        if ('colorOn' in options)
            base.colorOn = options.colorOn;
        if ('colorOff' in options)
            base.colorOff = options.colorOff;
        if ('buttonPosition' in options)
            base.position = options.buttonPosition;
        if ('legendWidth' in options)
            base.width = options.legendWidth;
        return base;
    },
});  // NOTE: Map() is a JS(?) function

module.exports = {
    Map: _Map,
    map: function (div, options) {
        return new _Map(div, options);
    },
};
