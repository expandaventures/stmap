'use strict';
require('leaflet.markercluster');
var {Layers} = require('./ST.Control.Layers.js');

var pois = Layers.extend({

    options: {
        apiKey: '',
        imgPath: 'node_modules/stmap/img/icons/',
        // ST.Control.Layers defaults:
        //     position: 'topright',
        //     icon: 'podcast',
        //     color: '#5F7C8A',
    },

    initialize: function (options) {
        if (options.icon == undefined)
            options.icon = 'map-marker';
        if (options.imgPath == undefined)
            options.imgPath = 'node_modules/stmap/img/icons/';
        L.setOptions(this, options);
        Layers.prototype.initialize.call(this, null, null, options);
    },

    onAdd: function (map) {
        var container = Layers.prototype.onAdd.call(this, map);
        this._clusters = {};
        this._getPois(map);  // call after this._map has been set
        return container;
    },

    update: function () {
        this._getPois(this._map);
    },

    _getPois: function (map) {
        var bounds = map.getBounds();
        var SW = bounds.getSouthWest();
        var NE = bounds.getNorthEast();
        var boundsParam = SW.lat + ',' + SW.lng + ',' + NE.lat + ',' + NE.lng;
        var url = 'http://api.sintrafico.com/st/pois';
        var params = {"apiKey": this.options.apiKey, "ps[]": [0, 1, 2], bounds: boundsParam};
        $.getJSON(url, params)
            .done(L.bind(this._receivePois, this))
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.status);
                console.log(errorThrown);
            });
    },

    _receivePois: function (data) {
        for (var _poiType in data) {
            var poiType = this._layerName(_poiType);
            var cluster = L.markerClusterGroup({
                iconCreateFunction: function(cluster) {
                    return L.divIcon({
                        className: 'st-poi-cluster',
                        iconSize: L.point(50, 70),
                        html: cluster.getChildCount() + this.imgSrc
                    });
                },
                imgSrc: '<img src=' + this._iconPath(poiType) +' />'
            });
            var markers = data[_poiType].map((poi, index) => {
                var icon = L.icon({iconUrl: this._iconPath(_poiType, poi)});
                var marker = L.marker(L.latLng(poi.location[1], poi.location[0]), {icon: icon});
                cluster.addLayer(marker);
            });
            var visible = poiType in this._clusters && this._map.hasLayer(this._clusters[poiType]);
            if (poiType in this._clusters) {
                // Exists, must replace
                if (this._map.hasLayer(this._clusters[poiType])) {
                    this._map.removeLayer(this._clusters[poiType]);
                    cluster.addTo(this._map);
                }
                this.removeLayer(this._clusters[poiType]);
                this.addOverlay(cluster, poiType);
            }
            else {
                // First time adding
                cluster.addTo(this._map);
                this.addOverlay(cluster, poiType);
            }
            this._clusters[poiType] = cluster;
        }
    },

    _iconPath: function (poiType, poi) {
        var base = this.options.imgPath;
        switch(poiType) {
            case 'estacionamientos':
            case 'Estacionamientos': return base + 'Estacionamiento.png';
            case 'tolls':
            case 'Casetas': return base + 'Peaje.png';
        }
        base += 'Gas';
        if (poi == null)
            return base + '.png';
        if(poi.status == 'No verificada')
            return base + 'Ama.png';
        if(poi.status == 'Con anomalías')
            return base + 'Rojo.png';
        if(poi.status == 'Sin anomalías')
            return base + 'Verde.png';
        if(poi.status == 'Se negó a verificación')
            return base + 'Nara.png';
    },

    _layerName: function (poiType) {
        switch(poiType) {
            case 'gasolineras': return 'Gasolineras';
            case 'estacionamientos': return 'Estacionamientos';
            case 'tolls': return 'Casetas';
            default: return 'Desconocidos';  // shouln't happen
        }
    },
});

module.exports = {
    Pois: pois,
    pois: function(options) {
        return new pois(options);
    },
};