# SinTráfico's layers

Leaflet plugin that adds SinTrafico's layers to your map.
Works with Leaflet version 1.0.0. 

Uses [FontAwesome](http://fontawesome.io/) icons.
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
``` 

## Layers
### L.STHeat | L.stHeat
### L.STWMS | L.stWMS
### L.STMunicipalities | L.stMunicipalities
### L.stLayer
   Function that returns either `L.STWMS` or `L.STHeat` 
   based on the URL provided in options. 

## Controls
### Legend
L.Control.Legend | L.control.legend

Container with an image specified by source.

Options:
* imgSc: the path to the image that will be used
* position: Leaflet position string. Default: `bottomright`
* width: container width. Default: `300px`

### ToggleButton
L.Control.ToggleButton | L.control.toggleButton

Button that changes color when clicked. Saves state to
know if it is on or off and, if provided, calls the
callback every time it is clicked.

Options:
* callback: `function` to call on click
* callbackTarget: will be passed to callback as first
    argument.
* position: Leaflet position string. Default: `topright`
* initialValue: boolean, default: `true`
* icon: string indicating which [FontAwesome](http://fontawesome.io/)
    icon to use. Default: `podcast`
* colorOn: string representing hex color. Default: `#337AB7`
* colorOff: string representing hex color. Default: `#5F7C8A`
* title: string to show on hover. Default: `Toggle Layer`

### Control.Layers.ST
L.Control.Layers.ST | L.control.layers.st

Like L.Control.Layers, but it adds a checkbox at the top
which turns all layers on/off. 

Options:
* position: Leaflet position string. Default: `topright`
* icon: string indicating which [FontAwesome](http://fontawesome.io/)
    icon to use. Default: `podcast`
* color: string representing hex color. Default: `#337AB7`
* allText: string to show on checkbox. 
    Default: `Todos`

Methods:
* `showAll()`: add all layers in the control to map
* `hideAll()`: remove all layers in the control from map

### L.Control.Layers.STIncidents
L.Control.Layers.STIncidents | L.control.layers.stIncidents

Child of [Control.Layers.ST](#control.layers.st). 
Retrieves all active incidents from server and creates
a layer for each category received.

Options:
* apiKey: your key for SinTráfico's API 
* callback: `function(array)` to receive incident objects
* imgPath: path to images. Default 
    `'http://s3.amazonaws.com/sintrafico/images/'`
* initialVisibility: if `true`, layers will be added
    to the map as soon as they are received.
* tableDiv: if provided, a table will be created and
    placed in that div. When a row is clicked, the map
    will be centered to the incident's location
* All [Control.Layers.ST](#control.layers.st) options

### L.Control.Layers.STPois
L.Control.Layers.STPois | L.control.layers.stPois
