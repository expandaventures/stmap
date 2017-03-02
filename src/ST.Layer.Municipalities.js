'use strict';
var {toggleButton} = require('./ST.Control.toggleButton.js')
var test = require('./geo_mx_mun.json')

var municipalities = L.Layer.extend({

    options: {
        // this
        visible: true,
        // ST.Control.ToggleButton
        buttonPosition: 'topright',
        icon: 'map',
        //     initialValue: true,
        //     colorOn: '#337AB7',
        //     colorOff: '#5F7C8A',
    },

    initialize: function (options) {
        L.setOptions(this, options);
        if (options.icon == undefined)
            options.icon = 'map';
        this._visible = this.options.visible;
        var that = this;
        this._layer = L.geoJSON(test, {
            style: this._style,
            onEachFeature: function (feature, layer) {
                layer.on({
                    mouseover: that._inFeature,
                    mouseout: function (e) {that._layer.resetStyle(e.target);},
                });
            }
        });
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
    },

    _hide: function (map) {
        map.removeLayer(this._layer);
    },

    _style: function (feature) {
        return {
            fillColor: '#000000',
            weight: 2,
            opacity: 1,
            color: '#5F7C8A',
            fillOpacity: 0.0
        };
    },

    _inFeature: function (e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#337AB7',
            fillOpacity: 0.0
        });
        layer.bindPopup(e.target.feature.properties.mun_name).openPopup();

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
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
        if ('colorOn' in options)
            newOptions.colorOn = options.colorOn;
        if ('colorOff' in options)
            newOptions.colorOff = options.colorOff;
        if ('icon' in options)
            newOptions.icon = options.icon;
        if ('buttonPosition' in options)
            newOptions.position = options.buttonPosition;
        return newOptions;
    },
});

module.exports = {
    Municipalities: municipalities,
    municipalities: function(options) {
        return new municipalities(options);
    },
};