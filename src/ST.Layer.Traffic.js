'use strict';
require('./ST.GeojsonGridLayer.js')
var {legend} = require('./ST.Control.Legend.js')
var {toggleButton} = require('./ST.Control.ToggleButton.js')

L.stTraffic = function (options) {
    return new L.STTraffic(options);
}


L.STTraffic = L.Layer.extend({

    options: {
        apiKey: '',
        visible: true,
        callback: null,
        callbackTarget: null,
        url: null, 
        opacity: 0.6,
        radius_func: this._radius,
        loadingCallback: null, // function(loading), loading is true when starting, false when finished
        legendPosition: 'bottomright',
        buttonPosition: 'topright',
    },

    initialize: function (options) {
        L.setOptions(this, options);
        var keyParam = options.url.includes('?') ? '&apiKey=' + options.apiKey :'?apiKey=' + options.apiKey;
        this._visible = this.options.visible;
        this._typeSpeed = options.type_speed;
        this._layer = L.geoJsonGridLayer( this.options.url + options.apiKey, { layers: { }, type_speed: this.options.type_speed });
        this._legend = legend({imgSrc: this.options.imgSrc, position: this.options.legendPosition});
        this._button = toggleButton(this._buttonOptions(options));
    },

    onAdd: function (map) {
        // this._map = map;  // done by L.Layer
        if (this._visible)
            this._show(map);
        this._button.addTo(map);
    },

    // onRemove: function (map) {
    //     this._hide(map);
    //     map.removeControl(this._button);
    // },

    _show: function (map) {
        this._layer.addTo(map);
        this._legend.addTo(map);
    },

    _hide: function (me) {
        me._map.eachLayer(function(layer){ 
            if(layer._typeSpeed === me._typeSpeed && layer._active ) {
                typeof layer._geoJSON != "undefined" && layer._geoJSON.eachLayer(function(segment){ me._map.removeLayer(segment); });
                me._map.removeLayer(layer);     
            }
            if(layer._request){
                layer._request.forEach( function(x){x.request.abort()})
            }
        });
        me._map.removeControl(this._legend);
    },

    // Button methods
    _buttonClicked: function (me, visible) {
        me._visible = !me._visible;
        if (visible)
            me._show(me._map);
        else
            me._hide(me);
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
    Traffic: L.STTraffic,
    traffic: L.stTraffic,
};
