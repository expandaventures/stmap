'use strict';
require('./lib/topojson.js')
    
var counter = 0;
(function () {
    var console = window.console || {
        error: function () {},
        warn: function () {}
    };
    function defineLeafletGeoJSONGridLayer(L) {
        L.GeoJSONGridLayer = L.GridLayer.extend({
        initialize: function (url, options) {
            L.GridLayer.prototype.initialize.call(this);
            this._url = url;
            this._geoJsonLayers = [];
            this._request = [];
            this._typeSpeed = options.type_speed;
            },

        createTile: function(coords){
            var _this = this;
            // create a <canvas> element for drawing
            var tile = L.DomUtil.create('canvas', 'leaflet-tile');
            // setup tile width and height according to the options
            var size = this.getTileSize();
            tile.width = size.x;
            tile.height = size.y;
            // get a canvas context and draw something on it using coords.x, coords.y and coords.z
            var ctx = tile.getContext('2d');
            // return the tile so it can be rendered on screen
            var counter = 0;
            var this_ = this;
            // do all the request and push them into a stack, in order to track them 
            this._request.push(
                $.get( L.Util.template(this._url, coords) )
                    .done(function( data ) {
                        var geojson = L.topojson.feature(data, data.objects.name);
                        var layer = L.geoJSON(geojson);
                        // keep the reference of each layer 
                        this_._geoJsonLayers.push(layer);
                        // color each segment 
                        layer.addTo(_this._map).eachLayer(function (layer) {
                            road_colors(layer); });
                    })
                );
            return tile;
        }
    });

    L.geoJsonGridLayer = function(url, options) {
        return new L.GeoJSONGridLayer(url, options);
        };
    }

    if (typeof define === 'function' && define.amd) {
        // Try to add leaflet.loading to Leaflet using AMD
        define(['leaflet'], function (L) {
            defineLeafletGeoJSONGridLayer(L);
        });
    }
    else {
        // Else use the global L
        defineLeafletGeoJSONGridLayer(L);
    }

})();

function road_colors(layer){
    var speedColors = ["green", "yellow", "red", "brown", "black"]
    layer.setStyle( { color: speedColors[Math.floor(Math.random() * speedColors.length)]} )
    // if (layer.feature.properties.speed < 30){
    //     layer.setStyle( { color: "red"} ) 
    // }else{
    //      
    // }

}