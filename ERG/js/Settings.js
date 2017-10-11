///////////////////////////////////////////////////////////////////////////
// Copyright © 2017 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/on',
  './ColorPickerEditor',
  'jimu/BaseWidget',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!../templates/Settings.html',
  'dojo/_base/lang',
  'dojo/Evented',
  'dojo/dom-class',
  'dojo/query',
  'dijit/registry',
  'dijit/form/Select',
  'jimu/dijit/SymbolChooser',  
],
  function (
    declare,
    array,
    html,
    on,
    ColorPickerEditor,
    BaseWidget,
    _WidgetsInTemplateMixin,
    SettingsTemplate,
    lang,
    Evented,
    domClass,
    query,
    dijitRegistry
  ) {
    return declare([BaseWidget, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'jimu-widget-ERG-Settings',
      templateString: SettingsTemplate,
      selectedSettings: {}, //Holds selected Settings      
      colorPickerNodes: [], //Holds an array of color pickers populated at start up
      
      constructor: function (options) {
        lang.mixin(this, options);
      },

      //Load all the options on startup
      startup: function () {     
        
        this.colorPickerNodes = [
          [this.spillLocationOutlineColorPicker,'spillLocationOutlineColor', this.spillLocationOutlineType],
          [this.IIZoneOutlineColorPicker, 'IIZoneOutlineColor', this.IIZoneOutlineType],
          [this.PAZoneOutlineColorPicker, 'PAZoneOutlineColor', this.PAZoneOutlineType],
          [this.downwindZoneOutlineColorPicker, 'downwindZoneOutlineColor', this.downwindZoneOutlineType],
          [this.fireZoneOutlineColorPicker, 'fireZoneOutlineColor', this.fireZoneOutlineType],
          [this.bleveZoneOutlineColorPicker, 'bleveZoneOutlineColor', this.bleveZoneOutlineType],
          [this.spillLocationFillColorPicker, 'spillLocationFillColor', this.spillLocationFillType],
          [this.IIZoneFillColorPicker, 'IIZoneFillColor', this.IIZoneFillType],
          [this.PAZoneFillColorPicker, 'PAZoneFillColor', this.PAZoneFillType],
          [this.downwindZoneFillColorPicker, 'downwindZoneFillColor', this.downwindZoneFillType],
          [this.fireZoneFillColorPicker, 'fireZoneFillColor', this.fireZoneFillType],
          [this.bleveZoneFillColorPicker, 'bleveZoneFillColor', this.bleveZoneFillType]          
        ];
       
       array.forEach(this.colorPickerNodes,lang.hitch(this, function(node){
          node[0] = new ColorPickerEditor({nls: this.nls}, node[0]);
          node[0].setValues({
              "color": this.config.erg.symbology[node[1]].color,
              "transparency": this.config.erg.symbology[node[1]].transparency
            });
          node[0].startup();
          node[2].setValue(this.config.erg.symbology[node[1]].type);
        }));
        
        //send by default updated parameters
        this.onSettingsChanged();
      },

      postCreate: function () {
        this.inherited(arguments);
        //set class to main container
        domClass.add(this.domNode, "ERGSettingsContainer ERGFullWidth");
        this._handleClickEvents();
      },
      
      /**
      * Handle click events for different controls
      * @memberOf widgets/ERG/Widget
      **/
      _handleClickEvents: function () {
        //handle spill location button clicked
        this.own(on(this.spillLocationSettingsButton, "click", lang.hitch(this, function () {
          this._openCloseNodes(this.spillLocationSettingsButton,this.spillLocationContainer);
        })));
        //handle Initial Isolation Zone button clicked
        this.own(on(this.IISettingsButton, "click", lang.hitch(this, function () {
          this._openCloseNodes(this.IISettingsButton,this.IIZoneContainer);
        })));
        //handle Protective Action Zone button clicked
        this.own(on(this.PASettingsButton, "click", lang.hitch(this, function () {
          this._openCloseNodes(this.PASettingsButton,this.PAZoneContainer);
        })));
        //handle down wind button clicked
        this.own(on(this.downwindSettingsButton, "click", lang.hitch(this, function () {
          this._openCloseNodes(this.downwindSettingsButton,this.downwindZoneContainer);
        })));
        //handle Fire Isolation Zone button clicked
        this.own(on(this.fireSettingsButton, "click", lang.hitch(this, function () {
          this._openCloseNodes(this.fireSettingsButton,this.fireZoneContainer);
        })));
        //handle BLEVE Zone button clicked
        this.own(on(this.bleveSettingsButton, "click", lang.hitch(this, function () {
          this._openCloseNodes(this.bleveSettingsButton,this.bleveZoneContainer);
        })));
      },
      
      _openCloseNodes: function (node,container) {
        var containers = [
          this.spillLocationContainer,
          this.IIZoneContainer,
          this.PAZoneContainer,
          this.downwindZoneContainer,
          this.fireZoneContainer,
          this.bleveZoneContainer
        ];
        var nodes = [
          this.spillLocationSettingsButton,
          this.IISettingsButton,
          this.PASettingsButton,
          this.downwindSettingsButton,
          this.fireSettingsButton,
          this.bleveSettingsButton
        ];
        var nodeOpen = false;
        
        if(node){
          if(domClass.contains(node,'ERGLabelSettingsDownButton')) {nodeOpen = true;}
        }
        //close all dropdowns
        array.forEach(containers,lang.hitch(this, function(otherContainer){
          html.addClass(otherContainer, 'controlGroupHidden');          
        }));
        array.forEach(nodes,lang.hitch(this, function(otherNode){
          html.removeClass(otherNode, 'ERGLabelSettingsUpButton');
          html.addClass(otherNode, 'ERGLabelSettingsDownButton');          
        }));
        
        if(nodeOpen) {
          //in closed state - so open and change arrow to up
          html.removeClass(container, 'controlGroupHidden');
          html.removeClass(node, 'ERGLabelSettingsDownButton');
          html.addClass(node, 'ERGLabelSettingsUpButton');
        }       
      },
            
      /**
      * Update's Settings on close of the widget
      * @memberOf widgets/ERG/Settings
      **/
      onClose: function () {
        this.onSettingsChanged();        
      },

      /**
      * Set's the selected Settings on any value change
      * @memberOf widgets/ERG/Settings
      **/
      onSettingsChanged: function () {
        array.forEach(this.colorPickerNodes,lang.hitch(this, function(node){
          var json = {'color': node[0].getValues().color,
                      'transparency': node[0].getValues().transparency,
                      'type': node[2].getValue()};
          this.selectedSettings[node[1]] = json;
        }));        
        this.emit("settingsChanged", this.selectedSettings);
      }
    });
  });