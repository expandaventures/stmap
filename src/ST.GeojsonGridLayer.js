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
            this._geoJSON = L.geoJSON();
            this._active = false;
            this._request = [];
            this._typeSpeed = options.type_speed;
            },
        onAdd: function () {
            this._initContainer();
            this._levels = {};
            this._tiles = {};
            this._resetView();
            this._update();
            this._active = true;
            if(! this._map.hasLayer(this._geoJSON )) this._geoJSON.addTo(this._map)
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
            _this._request.push( {
                request : $.get( L.Util.template(this._url, coords) )
                            .done(function( data ) {
                                data.forEach(function(x){
                                    if(x.coordinates){
                                        _this._geoJSON.addData(x);
                                    }
                                    _this._geoJSON.eachLayer(function(y) { y.setStyle({ color: y.feature.geometry.properties })});
                                })
                        }), 
                zoom : coords.z
            }
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
