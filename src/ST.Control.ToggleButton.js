'use strict';


L.control.toggleButton = function (options) {
    return new L.Control.ToggleButton(options);
}


L.Control.ToggleButton = L.Control.extend({

    // callback keeps this object's 'this' scope.
    // Therefore we must receive an object with the desired scope: 'callbackTarget'
    options: {
        callback: null,
        callbackTarget: null,
        position: 'topright',
        initialValue: true,
        icon: 'podcast',
        colorOn: '#337AB7',
        colorOff: '#5F7C8A',
        title: 'Toggle Layer',
    },

    initialize: function (options) {
        L.setOptions(this, options);
    },

    onAdd: function (map) {
        var containerClass = 'leaflet-bar leaflet-control';
        if (this.options.initialValue)
            containerClass += ' active';
        var container = L.DomUtil.create('div', containerClass);

        container.style.backgroundColor = 'white';
        container.style.backgroundSize = "35px 35px";
        container.style.width = '35px';
        container.style.height = '35px';
        container.style.color = this.options.initialValue ? this.options.colorOn : this.options.colorOff;
        container.innerHTML = '<center title="' + this.options.title + '">' +
                              '<span style="margin-top:4px;" class="fa fa-2x fa-' +
                              this.options.icon + '"></span></center>';
        container.onclick = this._clicked;
        // Properties
        container._switch = this.options.initialValue;
        container.callback = this.options.callback;
        container.callbackTarget = this.options.callbackTarget;
        container.colorOn = this.options.colorOn;
        container.colorOff = this.options.colorOff;

        return container;
    },

    _clicked: function () {  // 'this' refers to button (container)
        this._switch = !this._switch;
        if (this._switch)
            this.style.color = this.colorOn;
        else
            this.style.color = this.colorOff;
        if (this.callback)
            this.callback(this.callbackTarget, this._switch);
    }
});

module.exports = {
    ToggleButton: L.Control.ToggleButton,
    toggleButton: L.control.toggleButton,
};