'use strict';
var {speed} = require('./ST.Layer.WMS.Speed.js')
var {congestion} = require('./ST.Layer.Heat.Congestion.js')
var {incident} = require('./ST.Control.Layers.Incident.js')
var {pois} = require('./ST.Control.Layers.Pois.js')

var _Map = L.Map.extend({

    options: {
        apiKey: '',
        colorOn: '#337AB7',
        colorOff: '#5F7C8A',
    },

    initialize: function (div, options) {
        L.setOptions(this, options);
        L.Map.prototype.initialize.call(this, div, options);
    },

    setView: function (center, zoom, options) {
        L.Map.prototype.setView.call(this, center, zoom, options);
        this._congestionLayer = congestion({
            apiKey: this.options.apiKey,
            visible: false,
        });
        this._speedLayer = speed({
            apiKey: this.options.apiKey,
            visible: false,
        });
        this._congestionLayer.addTo(this);
        this._speedLayer.addTo(this);
        this._incidentControl = incident({apiKey: this.options.apiKey}).addTo(this);
        this._poisControl = pois({apiKey: this.options.apiKey}).addTo(this);
        this.on('dragend zoomend', L.bind(this._speedLayer.update, this._speedLayer));
        this.on('dragend zoomend', L.bind(this._poisControl.update, this._poisControl));
        return this;
    }
});  // NOTE: Map() is a JS(?) function

module.exports = {
    Map: _Map,
    map: function (div, options) {
        return new _Map(div, options);
    },
};
