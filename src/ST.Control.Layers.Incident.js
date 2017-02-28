'use strict';
var {Layers} = require('./ST.Control.Layers.js')

var incident = Layers.extend({

    options: {
        apiKey: '',
        tableDiv: null,
        callback: null,
        imgPath: 'node_modules/stmap/img/icons/',
        // ST.Control.Layers defaults:
        //     position: 'topright',
        //     icon: 'podcast',
        //     color: '#5F7C8A',
    },

    initialize: function (options) {
        if (options.icon == undefined)
            options.icon = 'exclamation-triangle';
        if (options.imgPath == undefined)
            options.imgPath = 'node_modules/stmap/img/icons/';
        L.setOptions(this, options);
        Layers.prototype.initialize.call(this, null, null, options);
    },

    onAdd: function (map) {
        var container = Layers.prototype.onAdd.call(this, map);
        this._getIncidents();  // call after this._map has been set
        return container;
    },

    city: function (lat, lon) {
        var limits = {
            "cdmx": {"lat": {"min": 19.08, "max": 19.84},
                     "lon": {"min": -99.342323, "max": -98.913169}},
            "gdl": {"lat": {"min": 20.567992, "max": 20.743075},
                    "lon": {"min": -103.490510, "max": -103.233361}},
            "mty": {"lat": {"min": 25.505656, "max": 25.847875},
                    "lon": {"min": -100.452793, "max": -100.175388}},
            "pch": {"lat": {"min": 20.023174, "max": 20.142480},
                    "lon": {"min": -98.823555, "max": -98.688286}},
            "pue": {"lat": {"min": 18.942342, "max": 19.139337},
                    "lon": {"min": -98.284291, "max": -98.103360}},
            "zpt": {"lat": {"min": 19.602467, "max": 19.794143},
                    "lon": {"min": -103.611209, "max": -103.415515}},
            "grc": {"lat": {"min": 25.770808, "max": 25.827784},
                    "lon": {"min": -100.641005, "max": -100.550670}}};
        for (var i in limits) {
            if ((lat >= limits[i].lat.min && lat <= limits[i].lat.max &&
                        lon >= limits[i].lon.min && lon <= limits[i].lon.max)) {
                return i;
            };
        };
        return 'unk';
    },

    _getIncidents: function () {
        var url = 'http://text.sintrafico.com/reports/active';
        var params = {'apiKey': this.options.apiKey};
        $.getJSON(url, params)
            .done(L.bind(this._receiveIncidents, this))
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.status);
                console.log(errorThrown);
            });
    },

    _receiveIncidents: function (data) {
        var markers = {};
        // Process and organize data
        var tbody = document.createElement('tbody');
        data.items.map((report, index) => {
            var icon = L.icon({iconUrl: this._iconPath(report.category)});
            var marker = L.marker(L.latLng(report.lat, report.lng), {icon: icon});
            marker.bindPopup(report.text);
            var category = report.category == 'Incidentes' ? 'Misceláneos' : report.category;
            if (category in markers)
                markers[category].push(marker);
            else
                markers[category] = [marker];
            // Only create table if div was received
            if (this.options.tableDiv) {
                var cell = document.createElement('td');
                cell.innerHTML = report.text;
                var row = document.createElement('tr');
                row.classList.add(this.city(report.lat, report.lng));
                row.onclick = function() {
                    this._map.setView(new L.latLng(report.lat, report.lng));
                    marker.openPopup();
                };
                row.appendChild(cell);
                tbody.appendChild(row);
            }
        })
        // Add to map
        for (var category in markers) {
            var newOverlay = L.layerGroup(markers[category]);
            newOverlay.addTo(this._map);  // This turns all layers on by default
            this.addOverlay(newOverlay, category);
        }
        // Insert table
        if (this.options.tableDiv) {
            var table = document.createElement('table');
            table.classList.add('table');
            table.appendChild(tbody);
            var reportDiv = document.getElementById('reports');
            reportDiv.innerHTML = '';  // remove loader
            reportDiv.appendChild(table);
        }
        if (this.callback)
            this.callback(data.items);
    },

    _iconPath: function (category) {
        var base = this.options.imgPath;
        switch(category) {
            case 'Accidente':
            case 'Accidente Grave': return base + 'Choque.png';
            case 'Obra': return base + 'Obra.png';
            case 'Inundación': return base + 'Inundacion5.png';
            case 'Manifestación':
            case 'Huelga/Plantón': return base + 'Manifestacion.png';
            case 'Evento': return base + 'Evento.png';
            case 'Incidentes': return base + 'Reporte.png';
            case 'Peregrinación': return base + 'Peregrinacion.png';
            case 'Vehículo Descompuesto': return base + 'VehiculoDescompuesto.png';
            case 'Mercado': return base + 'Mercado.png';
            case 'Cortes Intermitentes': return base + 'Reporte.png';
            case 'Contraflujo': return base + 'Contraflujo.png';
            case 'Abierto': return base + 'Abierto.png';
            case 'Alerta': return base + 'Alerta.png';
            case 'Movilización': return base + 'Movilizacion.png';
            default: return base + 'Reporte.png';  // missing public transport
        }
    },
});

module.exports = {
    Incident: incident,
    incident: function(options) {
        return new incident(options);
    },
};