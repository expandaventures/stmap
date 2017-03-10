'use strict';

var layers = L.Control.Layers.extend({

    options: {
        position: 'topright',
        icon: 'podcast',
        color: '#5F7C8A',
    },

    initialize: function (baseLayers, overlays, options) {
        L.Control.Layers.prototype.initialize.call(this, baseLayers, overlays, options);
        L.setOptions(this, options);
        this.visible = false;
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
			if (input.layerId == -1)
			    continue
			layer = this._getLayer(input.layerId).layer;
            this._map.addLayer(layer);
		}
    },

    hideAll: function () {
        var inputs = this._form.getElementsByTagName('input');
        var input, layer;
        for (var i = inputs.length - 1; i >= 0; i--) {
			input = inputs[i];
			if (input.layerId == -1)
			    continue
			layer = this._getLayer(input.layerId).layer;
            this._map.removeLayer(layer);
		}
    },

	_allClick: function (ev) {
	    ev.preventDefault();
	    this.visible = !this.visible;
	    this.allInput.checked = this.visible;
	    console.log(this.allInput.checked);
	    this.visible ? this.showAll() : this.hideAll();
    },

	_update: function () {
        L.Control.Layers.prototype._update.call(this);
        this._addItem({layer: null, name: 'Todos', overlay: true, fake: true});
    },

	_addItem: function (obj) {
	    if (!obj.fake)
            return L.Control.Layers.prototype._addItem.call(this, obj);

        var label = document.createElement('label');
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'leaflet-control-layers-selector';
        input.checked = false;
        input.layerId = -1;

		L.DomEvent.on(input, 'click', this._allClick, this);
		this.allInput = input;

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;

		var holder = document.createElement('div');

		label.appendChild(holder);
		holder.appendChild(input);
		holder.appendChild(name);

		var container = this._overlaysList;
		container.insertBefore(label, container.firstChild);

        return label;
    },

	_getLayer: function (layerId) {
	    if (layerId > -1)
            return L.Control.Layers.prototype._getLayer.call(this, layerId);
        return {layer: {options: {}}};
	},
});

module.exports = {
    Layers: layers,
    layers: function(baseLayers, overlays, options) {
        return new layers(baseLayers, overlays, options);
    },
};