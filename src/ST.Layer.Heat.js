'use strict';
require('./lib/leaflet-heat.js')
var {legend} = require('./ST.Control.Legend.js')
var {toggleButton} = require('./ST.Control.ToggleButton.js')


L.stHeat = function (options) {
    return new L.STHeat(options);
}


L.STHeat = L.Layer.extend({

    options: {
        // this
        apiKey: '',
        visible: true,
        callback: null,
        callbackTarget: null,
        // layer
        url: null,
        opacity: 0.6,
        radius_func: this._radius,
        loadingCallback: null, // function(loading), loading is true when starting, false when finished
        // ST.Control.Legend
        //     imgSrc: null,
        legendPosition: 'bottomright',
        //     width: '300px',
        // ST.Control.ToggleButton
        buttonPosition: 'topright',
        //     initialValue: true,
        //     icon: 'podcast',
        //     colorOn: '#337AB7',
        //     colorOff: '#5F7C8A',
        //     title: 'Toggle Layer',
    },

    initialize: function (options) {
        L.setOptions(this, options);
        var keyParam = options.url.includes('?') ? '&apiKey=' + options.apiKey :'?apiKey=' + options.apiKey;
        this._visible = this.options.visible;
        this._layer = L.heatLayer({
            url: this.options.url + keyParam,
            opacity: this.options.opacity,
            parseResponse: this._parseResponse,
            radius_func: this.options.radius_func,
            loadingCallback: this.options.loadingCallback,
        });
        this._legend = legend({imgSrc: this.options.imgSrc, position: this.options.legendPosition});
        this._button = toggleButton(this._buttonOptions(options));
    },

    onAdd: function (map) {
        // this._map = map;  // done by L.Layer
        if (this._visible)
            this._show(map);
        this._button.addTo(map);
    },

    onRemove: function (map) {
        this._hide(map);
        map.removeControl(this._button);
    },

    _show: function (map) {
        this._layer.addTo(map);
        this._legend.addTo(map);
    },

    _hide: function (map) {
        map.removeLayer(this._layer);
        map.removeControl(this._legend);
    },

    // Button methods
    _buttonClicked: function (me, visible) {
        me._visible = !me._visible;
        if (visible)
            me._show(me._map);
        else
            me._hide(me._map);
        if (me.callback)
            me.callback(me.callbackTarget, visible);
    },

    _buttonOptions: function (options) {
        // Only pass colors if they exist, otherwise button defaults get replaced by undefined
        var newOptions = {
            callback: this._buttonClicked,
            callbackTarget: this,
            initialValue: this.options.visible,
        };
        if ('buttonPosition' in options)
            newOptions.position = options.buttonPosition;
        if (options.icon)
            newOptions.icon = options.icon;
        if ('colorOn' in options)
            newOptions.colorOn = options.colorOn;
        if ('colorOff' in options)
            newOptions.colorOff = options.colorOff;
        if ('title' in options)
            newOptions.title = options.title;
        return newOptions;
    },

    // Layer methods
    _parseResponse: function (data) {
        var points = [];
        for (var i=0;i<data.points.length;i++){
            points.push([data.points[i].lat, data.points[i].lon, data.points[i].c*1.8]);
        }
        return points;
    },

    _radius: function (zoom) {
        if (zoom >= 11)
            return 5.8333 * zoom - 64.167;
        return 1
    },
});

module.exports = {
    Heat: L.STHeat,
    heat: L.stHeat,
};
