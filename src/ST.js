'use strict';
require('leaflet');
var {Map, map} = require('./ST.Map.js');
var {WMS, wms} = require('./ST.Layer.WMS.js');
var {Heat, heat} = require('./ST.Layer.Heat.js');
var {Speed, speed} = require('./ST.Layer.WMS.Speed.js');
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
        heat: heat,
        Heat: Heat,
        speed: speed,
        Speed: Speed,
        // General
        congestion: congestion,
        Congestion: Congestion,
        wms: wms,
        WMS: WMS,
    }
};
