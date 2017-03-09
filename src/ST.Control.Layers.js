'use strict';

var layers = L.Control.Layers.extend({

    options: {
        position: 'topright',
        icon: 'podcast',
        color: '#5F7C8A',
    },

    initialize: function (baseLayers, overlays, options) {
        L.setOptions(this, options);
        L.Control.Layers.prototype.initialize.call(this, baseLayers, overlays, options);
    },

    onAdd: function (map) {
        var container = L.Control.Layers.prototype.onAdd.call(this, map);
        container.classList.add('st-control-layers');
        container.childNodes[0].style.color = this.options.color;
        container.childNodes[0].innerHTML = '<center>' +
                                            '<span style="margin-top:4px;" class="fa fa-2x fa-' +
                                            this.options.icon + '"></span>' +
                                            '<span class="fa fa-caret-down"></span>';
                                            '</center>';
        return container;
    },

    showAll: function () {
        var inputs = this._form.getElementsByTagName('input');
        var input, layer;
        for (var i = inputs.length - 1; i >= 0; i--) {
			input = inputs[i];
			layer = this._getLayer(input.layerId).layer;
            this._map.addLayer(layer);
		}
    },

    hideAll: function () {
        var inputs = this._form.getElementsByTagName('input');
        var input, layer;
        for (var i = inputs.length - 1; i >= 0; i--) {
			input = inputs[i];
			layer = this._getLayer(input.layerId).layer;
            this._map.removeLayer(layer);
		}
    },

	_update: function () {
        L.Control.Layers.prototype._update.call(this);
        this._addItem({layer: L.layerGroup(), name: 'Todos', overlay: true, default: false});
    },

	_addItem: function (obj) {
	    if (obj.default)
            return L.Control.Layers.prototype._addItem.call(this, obj);

        var label = document.createElement('label');
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'leaflet-control-layers-selector';
        input.checked = false;
        input.layerId = L.Util.stamp(obj.layer);

//		DomEvent.on(input, 'click', this._onInputClick, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;

		var holder = document.createElement('div');

		label.appendChild(holder);
		holder.appendChild(input);
		holder.appendChild(name);

		var container = this._overlaysList;
		container.insertBefore(label, container.firstChild);
	    console.log(obj);
		console.log(container.children.length);
        return label;
	},
});

module.exports = {
    Layers: layers,
    layers: function(baseLayers, overlays, options) {
        return new layers(baseLayers, overlays, options);
    },
};