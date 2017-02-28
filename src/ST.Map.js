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
        var congestionOptions = this._baseOptions(options);
        congestionOptions.visible = options.congestionVisible;
        if ('congestionIcon' in options)
            congestionOptions.icon = options.congestionIcon;
        this._congestionLayer = congestion(congestionOptions).addTo(this);
    },

    _speed: function (options) {
        if (!options.speedEnabled)
            return;
        var speedOptions = this._baseOptions(options);
        speedOptions.visible = options.speedVisible;
        if ('speedIcon' in options)
            speedOptions.icon = options.speedIcon;
        this._speedLayer = speed(speedOptions).addTo(this);
        this.on('dragend zoomend', L.bind(this._speedLayer.update, this._speedLayer));
    },

    _incidents: function (options) {
        if (!options.incidentsEnabled)
            return;
        var incidentsOptions = this._baseOptions(options);
        incidentsOptions.initialVisibility = options.incidentsVisible;
        if ('colorOff' in options)
            incidentsOptions.color = options.colorOff;
        if ('incidentsIcon' in options)
            incidentsOptions.icon = options.incidentsIcon;
        this._incidentsLayer = incident(incidentsOptions).addTo(this);
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
