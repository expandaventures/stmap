'use strict';
//require('leaflet');
var {Map, map} = require('./ST.Map.js');
var {WMS, wms} = require('./ST.Layer.WMS.js');
var {Heat, heat} = require('./ST.Layer.Heat.js');
var {Speed, speed} = require('./ST.Layer.WMS.Speed.js');
var {Service, service} = require('./ST.Layer.WMS.Service.js');
var {Municipalities, municipalities} = require('./ST.Layer.Municipalities.js')
var {ExcessYear, excessYear} = require('./ST.Layer.WMS.ExcessYear.js')
var {Legend, legend} = require('./ST.Control.Legend.js');
var {Layers, layers} = require('./ST.Control.Layers.js');
var {Pois, pois} = require('./ST.Control.Layers.Pois.js')
var {Incident, incident} = require('./ST.Control.Layers.Incident.js')
var {Congestion, congestion} = require('./ST.Layer.Heat.Congestion.js');
var {ToggleButton, toggleButton} = require('./ST.Control.ToggleButton.js');

L.ST = {
    map: map,
    Map: Map,
    Control: {
        incident: incident,
        Incident: Incident,
        pois: pois,
        Pois: Pois,
        // General
        Layers: Layers,
        legend: legend,
        Legend: Legend,
        layers: layers,
        toggleButton: toggleButton,
        ToggleButton: ToggleButton,
    },
    Layer: {
        excessYear: excessYear,
        ExcessYear: ExcessYear,
        speed: speed,
        Speed: Speed,
        service: service,
        Service: Service,
        municipalities: municipalities,
        Municipalities: Municipalities,
        congestion: congestion,
        Congestion: Congestion,
        // General
        heat: heat,
        Heat: Heat,
        wms: wms,
        WMS: WMS,
    }
};
