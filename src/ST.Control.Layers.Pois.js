'use strict';
require('leaflet.markercluster');
var {Layers} = require('./ST.Control.Layers.js');


L.control.layers.stPois = function(options) {
    return new L.Control.Layers.STPois(options);
}


L.Control.Layers.STPois = Layers.extend({

    options: {
        apiKey: '',
        imgPath: 'node_modules/stmap/img/icons/',
        initialVisibility: true,
        // ST.Control.Layers defaults:
        //     position: 'topright',
        //     icon: 'podcast',
        //     color: '#5F7C8A',
        //     allText: 'Todos',
        view_type: 'bounds', //options 'bounds' || 'radius'
        cluster: true,
        callback: false,
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
        this._clusters = {};
        this._getPois(this._map);  // call after this._map has been set
        var container = Layers.prototype.onAdd.call(this, map);
        if(this.options.view_type == 'bounds') {
          map.on('dragend zoomend', L.bind(this.update, this));
        }
        return container;
    },

    onRemove: function (map) {
      if(this.options.view_type == 'bounds') {
        map.off('dragend zoomend', L.bind(this.update, this));
      }
    },

    update: function () {
        this._getPois(this._map);
    },

    _getPois: function (map) {
        let _this = this;
        let url = 'https://api.sintrafico.com/st/pois?',
        // let url = 'http://localhost:5000/st/pois?',
            params = {"apiKey": this.options.apiKey, "ps[]":[0, 1, 2]};
        if(this.options.view_type == 'radius') {
            params.location = `${this.options.latitude},${this.options.longitude}`;
            params.radius = this.options.radius;
        } else {
            let bounds = map.getBounds(),
                SW = bounds.getSouthWest(),
                NE = bounds.getNorthEast();
            params.bounds = `${SW.lat},${SW.lng},${NE.lat},${NE.lng}`;
        }
        let urlParams = this._buildParams(params),
            rq = `${url}${urlParams}`;
        fetch(rq)
          .then(response => {
            if (_this.options.callback) {
              (_this.options.callback)(response.json());
            }
            this._receivePois(response.json());
          })
          .catch(err  => {console.log(err)})
    },

    _buildParams: function(params) {
      let params_string = '';
      Object.keys(params).map(key => {
        if (params[key] && typeof params[key] == 'object') {
          params[key].map(value => {params_string += `${key}=${value}&`})
        } else {
          params_string += `${key}=${params[key]}&`;
        }
      })
      return params_string;
    },

    _receivePois: function (data) {
        let cluster = this.options.cluster;
        for(let type in data) {
          let poiType = this._layerName(type),
              markers = !cluster?L.layerGroup():L.markerClusterGroup({
              iconCreateFunction: (cluster) => {
                  return L.divIcon({
                      className: 'st-poi-cluster',
                      iconSize: L.point(50, 70),
                      html: cluster.getChildCount() + this.imgSrc
                  });
              },
              imgSrc: `<img src='${this._iconPath(poiType)}'/>`
          });
          data[type].map((poi, index) => {
            let icon = L.icon({iconUrl: this._iconPath(type, poi)}),
                ll = L.latLng(poi.location[1], poi.location[0]),
                marker = L.marker(ll, {icon: icon});
            markers.addLayer(marker);
          });
          let initialVisible = this.options.initialVisibility,
              exists = this._map.hasLayer(markers);
          if (exists) {
            this._map.removeLayer(markers);
            markers.addTo(this._map);
          } else if(initialVisible) {
            markers.addTo(this._map);
          }
        }

        // let noCluster = L.layerGroup(); //Made for radius option (when not shown as cluster)
        // for (var _poiType in data) {
        //     var poiType = this._layerName(_poiType);
        //     var cluster = L.markerClusterGroup({
        //         iconCreateFunction: function(cluster) {
        //             return L.divIcon({
        //                 className: 'st-poi-cluster',
        //                 iconSize: L.point(50, 70),
        //                 html: cluster.getChildCount() + this.imgSrc
        //             });
        //         },
        //         imgSrc: '<img src=' + this._iconPath(poiType) +' />'
        //     });
        //     var markers = data[_poiType].map((poi, index) => {
        //         var icon = L.icon({iconUrl: this._iconPath(_poiType, poi)});
        //         var marker = L.marker(L.latLng(poi.location[1], poi.location[0]), {icon: icon});
        //         if(this.options.view_type == 'radius'){
        //             noCluster.addLayer(marker);
        //         }else{
        //             cluster.addLayer(marker);
        //         }
        //     });
        //     var visible = poiType in this._clusters && this._map.hasLayer(this._clusters[poiType]);
        //     if (poiType in this._clusters) {
        //         // Exists, must replace
        //         if (this._map.hasLayer(this._clusters[poiType])) {
        //             this._map.removeLayer(this._clusters[poiType]);
        //             cluster.addTo(this._map);
        //         }
        //         this.removeLayer(this._clusters[poiType]);
        //         if (this.options.control) {
        //             this.addOverlay(cluster, poiType);
        //         }
        //     } else {
        //         // First time adding
        //         if (this.options.initialVisibility)
        //             cluster.addTo(this._map);  // This turns all layers on by default
        //         if (this.options.control) {
        //             this.addOverlay(cluster, poiType);
        //         }
        //     }
        //     this._clusters[poiType] = cluster;
        // }
        // if(this.options.view_type == 'radius'){
        //     noCluster.addTo(this._map);
        // }
    },

    _receivePlaces: function(data) {
      console.log(data);
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
