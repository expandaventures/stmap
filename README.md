# SinTráfico's layers

Leaflet plugin that adds SinTrafico's layers to your map.
Works with Leaflet version 1.0.0. 

Uses [FontAwesome](http://fontawesome.io/) icons.
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
``` 

## Layers
### Heat
L.STHeat | L.stHeat

Heat layer

Options:
* **apiKey**: your key for SinTráfico's API 
* **visible**: if `true` layer will be added to map as 
    soon as it is ready
* **callback**: `function(object callbackTarget, bool visible)` to call on button click
* **callbackTarget**: will be passed to callback as first
    argument.
* **url**: where to retrieve data for layer from
* **opacity**: decimal in range [0, 1]
* **imgSrc**: for legend
* **legendPosition**: default `'bottomright'`
* **buttonPosition**: default: `'topright'`
* All [ToggleButton](#togglebutton) options except position

### WMS
L.STWMS | L.stWMS

WMS layer

Options:
* **url**: where to retrieve data for layer from
* **urlZoomedOut**: where to retrieve data for layer from 
    when viewing small zooms
* **zoomThreshold**: for zoom less than or equal, use
    urlZoomedOut instead of url. Default: `15`
* **apiKey**: your key for SinTráfico's API 
* **visible**: if `true` layer will be added to map as 
    soon as it is ready
* **callback**: `function(object callbackTarget, bool visible)` to call on button click
* **callbackTarget**: will be passed to callback as first
    argument.
* **imgSrc**: for legend
* **legendPosition**: default `'bottomright'`
* **buttonPosition**: default: `'topright'`
* All [ToggleButton](#togglebutton) options except position

### STMunicipalities
L.STMunicipalities | L.stMunicipalities

Show polygons of Mexico's municipalities

Options: 
* **visible**: if `true` layer will be added to map as 
    soon as it is ready
* **buttonPosition**: default: `'topright'`
* **icon**: default: `map`
* **title**: default: `'Municipios'`
* All other [ToggleButton](#togglebutton) options

### L.stLayer
   Function that returns either `L.STWMS` or [L.STHeat](#heat) 
   based on the URL provided in options. 

## Controls
### Legend
L.Control.Legend | L.control.legend

Container with an image specified by source.

Options:
* **imgSc**: the path to the image that will be used
* **position**: Leaflet position string. Default: `bottomright`
* **width**: container width. Default: `300px`

### ToggleButton
L.Control.ToggleButton | L.control.toggleButton

Button that changes color when clicked. Saves state to
know if it is on or off and, if provided, calls the
callback every time it is clicked.

Options:
* **callback**: `function(object callbackTarget, bool visible)` to call on click
* **callbackTarget**: will be passed to callback as first
    argument.
* **position**: Leaflet position string. Default: `topright`
* **initialValue**: boolean, default: `true`
* **icon**: string indicating which [FontAwesome](http://fontawesome.io/)
    icon to use. Default: `podcast`
* **colorOn**: string representing hex color. Default: `#337AB7`
* **colorOff**: string representing hex color. Default: `#5F7C8A`
* **title**: string to show on hover. Default: `Toggle Layer`

### Control.Layers.ST
L.Control.Layers.ST | L.control.layers.st

Like L.Control.Layers, but it adds a checkbox at the top
which turns all layers on/off. 

Options:
* **position**: Leaflet position string. Default: `topright`
* **icon**: string indicating which [FontAwesome](http://fontawesome.io/)
    icon to use. Default: `podcast`
* **color**: string representing hex color. Default: `#337AB7`
* **allText**: string to show on checkbox. 
    Default: `Todos`

Methods:
* `showAll()`: add all layers in the control to map
* `hideAll()`: remove all layers in the control from map

### L.Control.Layers.STIncidents
L.Control.Layers.STIncidents | L.control.layers.stIncidents

Child of [Control.Layers.ST](#controllayersst). 
Retrieves all active incidents from server and creates
a layer for each category received.

Options:
* **apiKey**: your key for SinTráfico's API 
* **callback**: `function(array)` to receive incident objects
* **imgPath**: path to images. Default 
    `'http://s3.amazonaws.com/sintrafico/images/'`
* **initialVisibility**: if `true`, layers will be added
    to the map as soon as they are received.
* **tableDiv**: if provided, a table will be created and
    placed in that div. When a row is clicked, the map
    will be centered to the incident's location
* All [Control.Layers.ST](#controllayersst) options

### L.Control.Layers.STPois
L.Control.Layers.STPois | L.control.layers.stPois

Child of [Control.Layers.ST](#controllayersst). 
Retrieves all POIs from server and creates
a layer for each type received.

Options:
* **apiKey**: your key for SinTráfico's API 
* **imgPath**: path to images. Default 
    `'node_modules/stmap/img/icons/'`
* **initialVisibility**: if `true`, layers will be added
    to the map as soon as they are received.
* All [Control.Layers.ST](#controllayersst) options
