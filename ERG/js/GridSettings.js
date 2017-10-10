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
  './FontSetting',
  'jimu/BaseWidget',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!../templates/GridSettings.html',
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
    FontSetting,
    BaseWidget,
    _WidgetsInTemplateMixin,
    GridSettingsTemplate,
    lang,
    Evented,
    domClass,
    query,
    dijitRegistry
  ) {
    return declare([BaseWidget, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'jimu-widget-ERG-Settings',
      templateString: GridSettingsTemplate,
      selectedGridSettings: {}, //Holds selected Settings
      
      constructor: function (options) {
        lang.mixin(this, options);
      },

      //Load all the options on startup
      startup: function () {
        
        if(this.config.erg) {          
                  
        }
        
        //send by default updated parameters
        this.onGridsettingsChanged();

          
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
        //handle spill location button clicked
        this.own(on(this.IISettingsButton, "click", lang.hitch(this, function () {
          this._openCloseNodes(this.IISettingsButton,this.IIZoneContainer);
        })));
        //handle spill location button clicked
        this.own(on(this.fireSettingsButton, "click", lang.hitch(this, function () {
          this._openCloseNodes(this.fireSettingsButton,this.fireZoneContainer);
        })));
      },
      
      _openCloseNodes: function (node,container) {
        var containers = [this.spillLocationContainer,this.IIZoneContainer,this.fireZoneContainer];
        var nodes = [this.spillLocationSettingsButton,this.IISettingsButton,this.fireSettingsButton];
        var nodeOpen = false;
        
        if(domClass.contains(node,'ERGLabelSettingsDownButton')) {nodeOpen = true;}
        
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
      * Return's flag based on plan settings are changed or not
      * @memberOf widgets/ERG/Settings
      **/
      _isSettingsChanged: function () {
        var isDataChanged = false;
        /*
        //check if cellShape is changed
        if (this.selectedGridSettings.cellShape !==
          this.cellShape.get('value')) {
          isDataChanged = true;
        } else if (this.selectedGridSettings.labelStartPosition !==
          this.labelStartPosition.get('value')) {
          //check if labelStartPosition is changed
          isDataChanged = true;
        } else if (this.selectedGridSettings.cellUnits !==
          this.cellUnits.get('value')) {
          //check if cellUnits is changed
          isDataChanged = true;
        } else if (this.selectedGridSettings.labelType !==
          this.labelType.get('value')) {
          //check if labelType is changed
          isDataChanged = true;
        } else if (this.selectedGridSettings.labelDirection !==
          this.labelDirection.get('value')) {
          //check if labelDirection is changed
          isDataChanged = true;
        } else if (this.selectedGridSettings.gridOrigin !==
          this.gridOrigin.get('value')) {
          //check if gridOrigin is changed
          isDataChanged = true;
        } else if (this.selectedGridSettings.referenceSystem !==
          this.referenceSystem.get('value')) {
          //check if reference system is changed
          isDataChanged = true;
        } else if (this.selectedGridSettings.gridOutlineColor !==
          this.gridOutlineColorPicker.getValues().color) {
          //check if grid Outline Color is changed
          isDataChanged = true;
        } else if (this.selectedGridSettings.gridOutlineTransparency !==
          this.gridOutlineColorPicker.getValues().transparency) {
          //check if grid Outline transparency is changed
          isDataChanged = true;
        } else if (this.selectedGridSettings.gridFillColor !==
          this.gridFillColorPicker.getValues().color) {
          //check if grid Fill Color is changed
          isDataChanged = true;
        } else if (this.selectedGridSettings.gridFillTransparency !==
          this.gridFillColorPicker.getValues().transparency) {
          //check if grid Fill transparency is changed
          isDataChanged = true;
        } else if (this.selectedGridSettings.fontSettings !==
          this.fontSetting.getConfig()) {
          //check if font settings is changed
          isDataChanged = true;
        }
        */
        return isDataChanged;
      },

      /**
      * Update's Settings on close of the widget
      * @memberOf widgets/ERG/Settings
      **/
      onClose: function () {
        if (this._isSettingsChanged()) {
          this.onGridsettingsChanged();
        }
      },

      /**
      * Set's the selectedGridSettings on any value change
      * @memberOf widgets/ERG/Settings
      **/
      onGridsettingsChanged: function () {
        /*this.selectedGridSettings = {
          "cellShape": this.cellShape.get('value'),
          "labelStartPosition": this.labelStartPosition.get('value'),
          "cellUnits": this.cellUnits.get('value'),
          "labelType": this.labelType.get('value'),
          "labelDirection": this.labelDirection.get('value'),
          "gridOrigin": this.gridOrigin.get('value'),
          "referenceSystem": this.referenceSystem.get('value'),
          "gridOutlineColor": this.gridOutlineColorPicker.getValues().color,
          "gridOutlineTransparency": this.gridOutlineColorPicker.getValues().transparency,
          "gridFillColor": this.gridFillColorPicker.getValues().color,
          "gridFillTransparency": this.gridFillColorPicker.getValues().transparency,
          "fontSettings": lang.clone(this.fontSetting.getConfig()),
        };
        */
        this.emit("gridSettingsChanged", this.selectedGridSettings);
      }
    });
  });