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
  'jimu/BaseWidget',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./symbologySettings.html',
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
      
      constructor: function (options) {
        lang.mixin(this, options);
      },

      //Load all the options on startup
      startup: function () {        
        if(this.config.erg) {          
                  
        }
        
        //send by default updated parameters
        this.updateSettings();
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
      * Return's flag based on settings are changed or not
      * @memberOf widgets/ERG/Settings
      **/
      _isSettingsChanged: function () {
        var isDataChanged = false;        
        //check if spill Location Symbol Chooser has changed
        if (this.selectedSettings.spillLocation !==
          this.spillLocationSymChooser.getValidSymbol()) {
          isDataChanged = true;
        } else if (this.selectedSettings.IIZone !==
          this.IIZoneSymChooser.getValidSymbol()) {
          //check if II Zone Symbol Chooser has changed
          isDataChanged = true;
        } else if (this.selectedSettings.PAZone !==
          this.PAZoneSymChooser.getValidSymbol()) {
          //check if PA Zone Symbol Chooser has changed
          isDataChanged = true;
        } else if (this.selectedSettings.downwindZone !==
          this.downwindZoneSymChooser.getValidSymbol()) {
          //check if Down Wind Zone Symbol Chooser has changed
          isDataChanged = true;
        } else if (this.selectedSettings.fireZone !==
          this.fireZoneSymChooser.getValidSymbol()) {
          //check if FIRE Zone Symbol Chooser has changed
          isDataChanged = true;
        } else if (this.selectedSettings.bleveZone !==
          this.bleveZoneSymChooser.getValidSymbol()) {
          //check if BLEVE Zone Symbol Chooser has changed
          isDataChanged = true;
        }
        return isDataChanged;
      },

      /**
      * Set's the selected Settings on any value change
      * @memberOf widgets/ERG/Settings
      **/
      updateSettings: function () {
        this.selectedSettings = {
          "spillLocation": this.spillLocationSymChooser.getValidSymbol(),
          "IIZone": this.IIZoneSymChooser.getValidSymbol(),
          "PAZone": this.PAZoneSymChooser.getValidSymbol(),
          "downwindZone": this.downwindZoneSymChooser.getValidSymbol(),
          "fireZone": this.fireZoneSymChooser.getValidSymbol(),
          "bleveZone": this.bleveZoneSymChooser.getValidSymbol()          
        };        
        this.emit("settingsChanged", this.selectedSettings);
      }
    });
  });