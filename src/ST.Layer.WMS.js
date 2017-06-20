'use strict';
var {legend} = require('./ST.Control.Legend.js')
var {toggleButton} = require('./ST.Control.ToggleButton.js')


L.stWMS = function (options) {
    return new L.STWMS(options);
}


L.STWMS = L.Layer.extend({

    options: {
        // this
        url: null,
        urlZoomedOut: null,
        zoomThreshold: 15,
        apiKey: '',
        visible: true,
        callback: null,
        callbackTarget: null,
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
        this._layer = null;
        this._visible = this.options.visible;
        this._legend = legend({imgSrc: this.options.imgSrc, position: this.options.legendPosition});
        this._button = toggleButton(this._buttonOptions(options));
    },

    onAdd: function (map) {
        // this._map = map;  // done by L.Layer
        if (this._visible)
            this._show(map);
        this._button.addTo(map);
        map.on('dragend zoomend', L.bind(this.update, this));
    },

    onRemove: function (map) {
        this._hide(map);
        map.removeControl(this._button);
        map.off('dragend zoomend', L.bind(this.update, this));
    },

    update: function () {
        this._updateImageLayer(this._map);
    },

    _show: function (map) {
        this._updateImageLayer(map);
        this._legend.addTo(map);
    },

    _hide: function (map) {
        map.removeLayer(this._layer);
        map.removeControl(this._legend);
    },

    _updateImageLayer: function (map) {
        var _callback = this.options.loadingCallback;
        if (_callback && this._visible)
            _callback(true);
        if(this._layer != null && map.hasLayer(this._layer))
            map.removeLayer(this._layer);
        var c = map.getContainer();
        var b = map.getBounds();
        var url = (this.options.urlZoomedOut && this.options.zoomThreshold >= map.getZoom()) ?
                   this.options.urlZoomedOut :
                   this.options.url;
        var imageUrl = url + '?bbox=' + b.toBBoxString() +
                             '&height=' + c.offsetHeight +
                             '&width=' + c.offsetWidth +
                             '&key=' + this.options.apiKey;
        this._layer = L.imageOverlay(imageUrl, map.getBounds());
        this._layer.on('load', function() {
            if (_callback)
                _callback(false);
        });
        if (this._visible)
            this._layer.addTo(map);
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
        // Only pass colors if they exists, otherwise button defaults get replaced by undefined
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
});

module.exports = {
    WMS: L.STWMS,
    wms: L.stWMS,
};