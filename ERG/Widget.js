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
  'dojo/dom',
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/dom-class',
  'dojo/dom-attr',
  'dojo/dom-construct',
  'dojo/dom-style',
  'dojo/json',
  'dojo/on',
  'dojo/keys',
  'dojo/query',  
  'dojo/string',
  'dojo/store/Memory',
  'dojo/topic',
  'dojo/_base/html',
  'dojo/text!./materials.json',
  
  'dijit/form/FilteringSelect',
  'dijit/_WidgetBase',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/registry',
  'dijit/TooltipDialog',
  'dijit/popup',
  'dijit/Menu',
  'dijit/MenuItem',
  'dijit/MenuSeparator',
  
  'jimu/dijit/Message',
  'jimu/dijit/LoadingIndicator',
  'jimu/LayerInfos/LayerInfos',
  'jimu/utils',
  
  'esri/IdentityManager',
  'esri/arcgis/OAuthInfo',
  'esri/arcgis/Portal',
  'esri/config',
  'esri/Color',
  'esri/dijit/util/busyIndicator',
  'esri/graphic',
  'esri/geometry/geometryEngine',
  'esri/geometry/Extent',
  'esri/geometry/Point',  
  'esri/geometry/Polygon',
  'esri/geometry/Circle',
  'esri/geometry/webMercatorUtils',
  'esri/graphicsUtils',
  'esri/layers/FeatureLayer',
  'esri/layers/GraphicsLayer',
  'esri/layers/LabelClass',
  'esri/SpatialReference',
  'esri/symbols/Font',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/TextSymbol',
  'esri/toolbars/draw',
  'esri/renderers/UniqueValueRenderer',
  'esri/tasks/query',
  'esri/request',
  
  './js/GridSettings',
  './js/CoordinateInput',
  './js/DrawFeedBack',
  './js/EditOutputCoordinate',
  './js/jquery.easy-autocomplete',
  './js/WeatherInfo',
  
  'dijit/form/NumberTextBox',
  'dijit/form/RadioButton',
  'dijit/form/NumberSpinner',
],
  function (
    dojoDom,
    declare,
    BaseWidget,
    array,
    lang,
    domClass,
    domAttr,
    domConstruct,
    domStyle,
    JSON,
    on,
    keys,
    query,
    dojoString,
    Memory,
    topic,
    html,
    materials,
    FilteringSelect,
    dijitWidgetBase,    
    dijitWidgetsInTemplate,
    dijitRegistry,
    dijitTooltipDialog,
    dijitPopup,
    Menu, 
    MenuItem, 
    MenuSeparator,      
    Message,
    LoadingIndicator,
    jimuLayerInfos,
    utils,
    esriId,
    esriOAuthInfo,
    esriPortal,
    esriConfig,
    Color,
    busyIndicator,
    Graphic,
    GeometryEngine,
    Extent,
    Point,
    Polygon,
    Circle,
    WebMercatorUtils,
    graphicsUtils,
    FeatureLayer,
    GraphicsLayer,
    LabelClass,
    SpatialReference,
    Font,
    SimpleMarkerSymbol,
    SimpleFillSymbol,
    TextSymbol,
    Draw,
    UniqueValueRenderer,
    Query,
    esriRequest,
    GridSettings,
    coordInput,
    drawFeedBackPoint,
    editOutputCoordinate,
    autoComplete,    
    WeatherInfo
  ) {
    return declare([BaseWidget, dijitWidgetBase, dijitWidgetsInTemplate], {
      baseClass: 'jimu-widget-ERG',
      
      _selectedMaterial: null, //holds the current value of the selected material
      _materialsData: null, //a JSON object holding all the information about materials
      _weatherInfo: null,
      _windSpeed: 0, //
      _lastOpenPanel: "ergMainPage", //Flag to hold last open panel, default will be main page
      _currentOpenPanel: "ergMainPage", //Flag to hold last open panel, default will be main page
      
      
      _gridSettingsInstance: null, //Object to hold Grid Settings instance
      _cellShape: "default", //Current selected grid cell shape
      _labelStartPosition: "lowerLeft", //Current selected label start position
      _cellUnits: "meters", //Current selected cell units
      _labelType: "alphaNumeric", //Current selected label type
      _labelDirection: "horizontal", //Current selected label direction
      _gridOrigin: "center", //Current selected grid origin
      _referenceSystem: 'MGRS', //Current selected reference system
      _showLabels: true, //flag to hold whether labels should be shown 
      _ERGAreaFillSymbol: null, //Fill symbol used for ERG cells
      _cellTextSymbol: null, //Text symbol used for ERG labeling
      
      featureLayerInfo: null,
      
      postMixInProperties: function () {
        //mixin default nls with widget nls
        this.nls.common = {};
        lang.mixin(this.nls.common, window.jimuNls.common);
      },
      
      constructor: function (args) {
        declare.safeMixin(this, args);
      },

      postCreate: function () {
        this.inherited(arguments);
        
        //set up blank weather info        
        this._resetWeatherInfo();        
        
        //set up the symbology used for the interactive polygon draw tools
        this.extentAreaFillSymbol = {
          type: 'esriSFS',
          style: 'esriSFSSolid',
          color: [155,155,155,0],
          outline: {
            color: [0, 0, 255, 255],
            width: 1.25,
            type: 'esriSLS',
            style: 'esriSLSSolid'
          }
        };
        
        //set up the symbology used for the interactive point draw tools        
        this.pointSymbol = {
          'color': [255, 0, 0, 255],
          'size': 8,
          'type': 'esriSMS',
          'style': 'esriSMSCircle',
          'outline': {
            'color': [255, 0, 0, 255],
            'width': 1,
            'type': 'esriSLS',
            'style': 'esriSLSSolid'
          }
        };        
        
        //create graphics layer for grid extent and add to map
        this._graphicsLayerERGExtent = new GraphicsLayer({id: "graphicsLayerERGExtent"});
        
        //set up symbology for polygon input
        this._extentSym = new SimpleFillSymbol(this.extentAreaFillSymbol);        
        
        //set up symbology for point input
        this._ptSym = new SimpleMarkerSymbol(this.pointSymbol);
        
        //create a feature collection for the drawn ERG to populate 
        var featureCollection = {
          "layerDefinition": {
            "geometryType": "esriGeometryPolygon",
            "objectIdField": "ObjectID",
            "fields": [{
              "name": "ObjectID",
              "alias": "ObjectID",
              "type": "esriFieldTypeOID"
              }, {
              "name": "type",
              "alias": "type",
              "type": "esriFieldTypeString"
            }],            
            "extent": {
              "xmin":-18746028.312877923,
              "ymin":-6027547.894280539,
              "xmax":18824299.82984192,
              "ymax":12561937.384669386,
              "spatialReference":{
                "wkid":102100
              }
            },
          }
        };
        
        //create a the ERG feature layer
        this.ERGArea = new FeatureLayer(featureCollection,{
          id: "Gridded-Reference-Graphic",
          outFields: ["*"],
          showLabels: true
        });   
        
        //add the ERG feature layer and the ERG extent graphics layer to the map 
        this.map.addLayers([this.ERGArea,this._graphicsLayerERGExtent]);
        
        //set up coordinate input dijit for ERG Point by Size
        this.ERGCoordTool = new coordInput({nls: this.nls, appConfig: this.appConfig}, this.newERGPointOriginCoords);      
        this.ERGCoordTool.inputCoordinate.formatType = 'DD';
        this.ERGCoordinateFormat = new dijitTooltipDialog({
          content: new editOutputCoordinate({nls: this.nls}),
          style: 'width: 400px'
        });
        
        //we need an extra class added the the coordinate format node for the Dart theme 
        if(this.appConfig.theme.name === 'DartTheme')
        {
          domClass.add(this.ERGCoordinateFormat.domNode, 'dartThemeClaroDijitTooltipContainerOverride');
        }
        
        // add extended toolbar for drawing ERG Spill Location
        this.dt = new drawFeedBackPoint(this.map,this.ERGCoordTool.inputCoordinate.util);
                                     
        this._initLoading();
        
        //set up all the handlers for the different click events
        this._handleClickEvents();
        
        this._createGridSettings();
      },

      startup: function () {
        this.inherited(arguments);
        this.busyIndicator = busyIndicator.create({target: this.domNode.parentNode.parentNode.parentNode, backgroundOpacity: 0});
        this._setTheme(); 
        
        //load in the materials json file
        this._materialsData = JSON.parse(materials);
        
        var options = {
          data: this._materialsData,
          placeholder: this.nls.materialPlaceholder,
          getValue: function(element) {
            return element.IDNum === 0?element.Material: element.IDNum + " | " + element.Material;
          },
          template: {
            type: "custom",
            method: lang.hitch(this, function(value, item) {
              return "<a href='" + this.folderUrl + "guide/" + item.GuideNum + ".pdf' target='_blank'><img height='18px' src='" + this.folderUrl + "images/pdf.png' /></a>  " + value;
            })
          },
          list: {
            match: {
              enabled: true
            },
            onChooseEvent: lang.hitch(this, function() {
              var index = $(this.materialType).getSelectedItemIndex();
              this._selectedMaterial = $(this.materialType).getSelectedItemData(index);
              
              if (this._selectedMaterial.TABLE3 && this.spillSize.getValue() === 'LG'){
                var alertMessage = new Message({
                  message: this.nls.table3Message
                })
                this.windSpeed.set('disabled', false);
                this.transportContainer.set('disabled', false);
              } else {
                this.windSpeed.set('disabled', true);
                this.transportContainer.set('disabled', true);
              }
              
              if (this._selectedMaterial.BLEVE){
                var alertMessage = new Message({
                  message: this.nls.bleveMessage
                })
                this.useBleve.set('disabled', false);
                this.tankCapacity.set('disabled', false);
              } else {
                this.useBleve.set('disabled', true);
                this.tankCapacity.set('disabled', true);
              }
              
              if(this._selectedMaterial.Material.includes('Substances')) {
                this.spillSize.setValue('SM');
                this.spillSize.set('disabled', true);
              }
              
              if(this.ERGCoordTool.inputCoordinate.coordinateEsriGeometry) {
                dojo.removeClass(this.CreateERGButton, 'jimu-state-disabled');
              }
            }),            
            onShowListEvent: lang.hitch(this, function() {
              this._selectedMaterial = null;
              this.spillSize.set('disabled', false);
              dojo.addClass(this.CreateERGButton, 'jimu-state-disabled');
            })            
          }          
        };
        
        $(this.materialType).easyAutocomplete(options);
        this._weatherInfo = new WeatherInfo(this.weather, this);
      },

      /**
      * Performs activities like resizing widget components, connect map click etc on widget open
      */
      onOpen: function () {
        console.log('widget opened');
      },

      /**
      * Performs activities like disconnect map handlers, close popup etc on widget close
      */
      onClose: function () {
        console.log('widget closed');
      },        

      /**
      * This function used for loading indicator
      */
      _initLoading: function () {
        this.loading = new LoadingIndicator({hidden: true});
        this.loading.placeAt(this.domNode);
        this.loading.startup();
      },

      /**
      * Handle click events for different controls
      **/
      _handleClickEvents: function () {
        /**
        * ERG panel
        **/        
            //handle Settings button
            if(!this.config.erg.lockSettings) {
              //handle Settings button
              this.own(on(this.ERGSettingsButton, "click", lang.hitch(this, function () {
                this._showPanel("settingsPage");
              })));
            } else {
              this.ERGSettingsButton.title = this.nls.lockSettings;
              //html.addClass(this.ERGSettingsButton, 'controlGroupHidden');
            }
            
            //Handle click event of create ERG button        
            this.own(on(this.CreateERGButton, 'click', lang.hitch(this, 
              this._CreateERGButtonClicked)));
              
            //Handle click event of clear ERG button        
            this.own(on(this.ClearERGButton, 'click', lang.hitch(this, function () {
              this.materialType.value = '';
              this.windSpeed.set('disabled', true);
              this.transportContainer.set('disabled', true);
              this.useBleve.set('disabled', true);
              this.tankCapacity.set('disabled', true);
              this._selectedMaterial = null;
              this._clearLayers(true);
            })));
            
            //Handle click event of Add ERG draw button
            this.own(on(this.ERGAddPointBtn, 'click', lang.hitch(this, 
              this._ERGDrawButtonClicked)));
              
            //Handle completion of ERG drawing
            this.own(on(this.dt, 'draw-complete', lang.hitch(this,
              this._dt_Complete)));
              
            //Handle change in coord input      
            this.own(this.ERGCoordTool.inputCoordinate.watch('outputString', lang.hitch(this,
              function (r, ov, nv) {
                if(!this.ERGCoordTool.manualInput){
                  this.ERGCoordTool.set('value', nv);
                }
              }
            )));

            //Handle change in start point and update coord input
            this.own(this.dt.watch('startPoint', lang.hitch(this, 
              function (r, ov, nv) {
                this.ERGCoordTool.inputCoordinate.set('coordinateEsriGeometry', nv);
                this.dt.addStartGraphic(nv, this._ptSym, this._graphicsLayerERGExtent);
                this._weatherInfo.updateForIncident(nv);                
              }
            )));
            
            //Handle key up events in coord input
            this.own(on(this.ERGCoordTool, 'keyup', lang.hitch(this, 
              this._ERGCoordToolKeyWasPressed)));
            
            //Handle click event on coord format button
            this.own(on(this.ERGFormatButton, 'click', lang.hitch(this, 
              this._ERGFormatButtonClicked)));
            
            //Handle click event on apply button of the coord format popup        
            this.own(on(this.ERGCoordinateFormat.content.applyButton, 'click', lang.hitch(this,
              this._ERGFormatPopupApplyButtonClicked)));
            
            //Handle click event on cancel button of the coord format popup         
            this.own(on(this.ERGCoordinateFormat.content.cancelButton, 'click', lang.hitch(this, 
              function () {
                dijitPopup.close(this.ERGCoordinateFormat);
              }
            )));
            
            //Handle spill size dropdown change
            this.own(on(this.spillSize, 'change', lang.hitch(this, function () { 
              if(this._selectedMaterial) {
                if (this._selectedMaterial.TABLE3 && this.spillSize.getValue() === 'LG'){
                  var alertMessage = new Message({
                    message: this.nls.table3Message
                  })
                  this.windSpeed.set('disabled', false);
                  this.transportContainer.set('disabled', false);
                } else {
                  this.windSpeed.set('disabled', true);
                  this.transportContainer.set('disabled', true);
                }
              }
            })));
            
        /**
        * Settings panel
        **/        
            //Handle click event of settings back button
            this.own(on(this.gridSettingsPanelBackButton, "click", lang.hitch(this, function () {
              this._gridSettingsInstance.onClose();          
              this._showPanel(this._lastOpenPanel);
            })));        
        
        /**
        * Publish panel
        **/
            //Handle click event back button
            this.own(on(this.publishPanelBackButton, "click", lang.hitch(this, function () {
              //remove any messages
              this.publishMessage.innerHTML = '';
              //clear layer name
              this.addERGNameArea.setValue('');
              this._graphicsLayerERGExtent.show();
              this._showPanel(this._lastOpenPanel);              
            })));
            
            //Handle click event of publish ERG to portal button
            this.own(on(this.ERGAreaBySizePublishERGButton, 'click', lang.hitch(this, function () {
              if(this.addERGNameArea.isValid()) {
                this.publishMessage.innerHTML = '';
                this._initSaveToPortal(this.addERGNameArea.value)
              } else {
                // Invalid entry
                this.publishMessage.innerHTML = this.nls.missingLayerNameMessage;
              }
            })));
            
      },
      
      /**
      * Get panel node from panel name
      **/
      _getNodeByName: function (panelName) {
        var node;
        switch (panelName) {
          case "ergMainPage":
            node = this.ergMainPageNode;
            break;          
          case "settingsPage":
            node = this.settingsPageNode;
            break;
          case "publishPage":
            node = this.publishPageNode;
            break;
        }
        return node;
      },

      /**
      * This function resets everything on navigating back to main page
      */
      _resetOnBackToMainPage: function () {
        //reset the tools
        this._showPanel("mainPage");
        this._reset();
      },

      _reset: function () {
        this._clearLayers(true);
        
        //ensure all toolbars are deactivated
        this.dt.deactivate();
        
        //enable map navigation if disabled due to a tool being in use
        this.map.enableMapNavigation();
        
        //remove any active classes from the tool icons
        dojo.removeClass(this.ERGAddPointBtn, 'jimu-edit-active');
      },

      _clearLayers: function (includeExtentLayer) {
        this.ERGArea.clear();
        //refresh ERG layer to make sure any labels are removed
        this.ERGArea.refresh();
        
        //sometimes we only want to clear the ERG overlay and not the spill location 
        if(includeExtentLayer) {
          this.dt.removeStartGraphic(this._graphicsLayerERGExtent);                    
          dojo.addClass(this.CreateERGButton, 'jimu-state-disabled');
          this.ERGCoordTool.clear();
          this._resetWeatherInfo();          
        }
      },

      /**
      * Creates grid settings
      **/
      _createGridSettings: function () {
        //Create GridSettings Instance
        this._gridSettingsInstance = new GridSettings({
          nls: this.nls,
          config: this.config,
          appConfig: this.appConfig
        }, domConstruct.create("div", {}, this.gridSettingsNode));        
        
        //add a listener for a change in settings
        this.own(this._gridSettingsInstance.on("gridSettingsChanged",
          lang.hitch(this, function (updatedSettings) {
            this._cellShape = updatedSettings.cellShape;
            this._labelStartPosition = updatedSettings.labelStartPosition;
            this._cellUnits = updatedSettings.cellUnits;
            this._labelType = updatedSettings.labelType;
            this._labelDirection = updatedSettings.labelDirection;
            this._gridOrigin = updatedSettings.gridOrigin;
            this._referenceSystem = updatedSettings.referenceSystem;
            
            //set grid colours
            var fillColor = new Color(updatedSettings.gridFillColor);
            fillColor.a = 1 - updatedSettings.gridFillTransparency;
            
            var outlineColor = new Color(updatedSettings.gridOutlineColor);
            outlineColor.a = 1 - updatedSettings.gridOutlineTransparency;
                        
            this._ERGAreaFillSymbol = {
              type: 'esriSFS',
              style: 'esriSFSSolid',
              color: fillColor,
              outline: {
                color: outlineColor,
                width: 2,
                type: 'esriSLS',
                style: 'esriSLSSolid'
              }
            };
            
            var uvrJson = {"type": "uniqueValue",
              "field1": "Type",
              "defaultSymbol": {
                "color": [255, 153, 0, 128],
                "outline": {
                  "color": [255, 153, 0, 255],
                  "width": 1,
                  "type": "esriSLS",
                  "style": "esriSLSSolid"
                },
                "type": "esriSFS",
                "style": "esriSFSSolid"
              },
              "uniqueValueInfos": [{
                "value": "Spill Location",
                "symbol": {
                  "color": [0, 0, 0, 255],
                  "outline": {
                    "color": [0, 0, 0, 255],
                    "width": 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  },
                  "type": "esriSFS",
                  "style": "esriSFSSolid"
                }
              }, {
                "value": "II Zone",
                "symbol": {
                  "color": [255, 153, 0, 128],
                  "outline": {
                    "color": [255, 153, 0, 255],
                    "width": 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  },
                  "type": "esriSFS",
                  "style": "esriSFSSolid"
                }
              }, {
                "value": "Bleve",
                "symbol": {
                  "color": [255, 153, 0, 128],
                  "outline": {
                    "color": [255, 153, 0, 255],
                    "width": 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  },
                  "type": "esriSFS",
                  "style": "esriSFSSolid"
                }
              }, {
                "value": "Fire",
                "symbol": {
                  "color": [255, 153, 0, 128],
                  "outline": {
                    "color": [255, 153, 0, 255],
                    "width": 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  },
                  "type": "esriSFS",
                  "style": "esriSFSSolid"
                }
              }, {
                "value": "Down Wind",
                "symbol": {
                  "color": [255, 153, 0, 128],
                  "outline": {
                    "color": [255, 153, 0, 255],
                    "width": 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  },
                  "type": "esriSFS",
                  "style": "esriSFSSolid"
                }
              }, {
                "value": "Protective Action Area",
                "symbol": {
                  "color": [255, 153, 0, 128],
                  "outline": {
                    "color": [255, 153, 0, 255],
                    "width": 1,
                    "type": "esriSLS",
                    "style": "esriSLSSolid"
                  },
                  "type": "esriSFS",
                  "style": "esriSFSSolid"
                }
              }]
            }
            
            // create a renderer for the ERG layer to override default symbology
            var renderer = new UniqueValueRenderer(uvrJson);
            this.ERGArea.setRenderer(renderer);
           
            //refresh the layer to apply the settings
            this.ERGArea.refresh();              
          })));
        this._gridSettingsInstance.startup();
      },

      /**
      * Displays selected panel
      **/
      _showPanel: function (currentPanel) {
        var prevNode, currentNode;
        //check if previous panel exist and hide it
        if (this._currentOpenPanel) {
          prevNode = this._getNodeByName(this._currentOpenPanel);
          domClass.add(prevNode, "ERGHidden");
        }
        //get current panel to be displayed and show it
        currentNode = this._getNodeByName(currentPanel);
        domClass.remove(currentNode, "ERGHidden");
        //set the current panel and previous panel
        this._lastOpenPanel = this._currentOpenPanel;
        this._currentOpenPanel = currentPanel;
      },
      
      /**
      * Handle the draw point icon being clicked on the ERG Panel
      **/
      _ERGDrawButtonClicked: function () {
        if(domClass.contains(this.ERGAddPointBtn,'jimu-edit-active')) {
          //already selected so deactivate draw tool
          this.dt.deactivate();
          this.map.enableMapNavigation();
        } else {
          this.dt.removeStartGraphic(this._graphicsLayerERGExtent);
          this._clearLayers(true); 
          this.ERGCoordTool.manualInput = false;        
          this.dt._setTooltipMessage(0);        
          this.map.disableMapNavigation();          
          this.dt.activate('point');
          var tooltip = this.dt._tooltip;
          if (tooltip) {
            tooltip.innerHTML = this.nls.drawPointToolTip;
          }          
        }
        domClass.toggle(this.ERGAddPointBtn, 'jimu-edit-active');
      },
      
      /**
      * Handle the completion of the draw spill location
      **/      
      _dt_Complete: function () {          
        domClass.remove(this.ERGAddPointBtn, 'jimu-edit-active');
        this.dt.deactivate();
        this.map.enableMapNavigation();
        if(this._selectedMaterial) {
          dojo.removeClass(this.CreateERGButton, 'jimu-state-disabled');
        }
      },
      
      /**
      * catch key press in spill location input
      **/
      _ERGCoordToolKeyWasPressed: function (evt) {
        this.ERGCoordTool.manualInput = true;
        if (evt.keyCode === keys.ENTER) {
          this.ERGCoordTool.inputCoordinate.getInputType().then(lang.hitch(this, 
            function (r) {
              if(r.inputType === "UNKNOWN"){
                var alertMessage = new Message({
                  message: this.nls.parseCoordinatesError
                });
              } else {
                this._reset();
                topic.publish(
                  'ERG-center-point-input',
                  this.ERGCoordTool.inputCoordinate.coordinateEsriGeometry
                );
                this._ERGSetCoordLabel(r.inputType);
                var fs = this.ERGCoordinateFormat.content.formats[r.inputType];
                this.ERGCoordTool.inputCoordinate.set('formatString', fs.defaultFormat);
                this.ERGCoordTool.inputCoordinate.set('formatType', r.inputType);
                this.dt.addStartGraphic(r.coordinateEsriGeometry, this._ptSym, this._graphicsLayerERGExtent);
              }
            }
          ));
        }
      },
      
      /**
      * Reformat coordinate label depend on what reference system is chosen
      **/
      _ERGSetCoordLabel: function (toType) {
        this.ERGCoordInputLabel.innerHTML = dojoString.substitute(
          this.nls.coordInputLabel + ' (${crdType})', {
              crdType: toType
          });
      },
      
      /**
      * Handle the format coordinate input popup opening
      * Point by Size Panel
      **/
      _ERGFormatButtonClicked: function () {
        this.ERGCoordinateFormat.content.set('ct', this.ERGCoordTool.inputCoordinate.formatType);
        dijitPopup.open({
            popup: this.ERGCoordinateFormat,
            around: this.ERGFormatButton
        });
      },
      
      /**
      * Handle the format coordinate input being applied
      **/
      _ERGFormatPopupApplyButtonClicked: function () {
        var fs = this.ERGCoordinateFormat.content.formats[this.ERGCoordinateFormat.content.ct];
        var cfs = fs.defaultFormat;
        var fv = this.ERGCoordinateFormat.content.frmtSelect.get('value');
        if (fs.useCustom) {
            cfs = fs.customFormat;
        }
        this.ERGCoordTool.inputCoordinate.set(
          'formatPrefix',
          this.ERGCoordinateFormat.content.addSignChkBox.checked
        );
        this.ERGCoordTool.inputCoordinate.set('formatString', cfs);
        this.ERGCoordTool.inputCoordinate.set('formatType', fv);
        this._ERGSetCoordLabel(fv);
        dijitPopup.close(this.ERGCoordinateFormat);        
      },
      
      /**
      * Handle the create ERG button being clicked
      **/
      _CreateERGButtonClicked: function () {
        if(this._selectedMaterial && this.ERGCoordTool.inputCoordinate.coordinateEsriGeometry) {
          var IIAttributeValue, PAAttributeValue, bleveAttributeValue, IIDistance, PADistance;
          var features = [];
          
          var spatialReference = new SpatialReference({wkid:102100});
          
          //get the spill location
          var spillLocation = WebMercatorUtils.geographicToWebMercator(this.ERGCoordTool.inputCoordinate.coordinateEsriGeometry);
          
          // clear any existing ERG overlays
          this._clearLayers(true);
          
          //check if you need to refer to table 3
          if(!this._selectedMaterial.TABLE3) {
            IIAttributeValue = this.spillSize.getValue() + "_ISO";
            PAAttributeValue = this.spillSize.getValue() + "_" + this.spillTime.getValue();
          } else {
            IIAttributeValue = this.transportContainer.getValue() + "_ISO";
            PAAttributeValue = this.transportContainer.getValue() + this.spillTime.getValue() + this.windSpeed.getValue();
          }
          
          IIDistance = this._selectedMaterial[IIAttributeValue];
          PADistance = this._selectedMaterial[PAAttributeValue];
          
          // determine the initial isolation zone
          var IIZone = new Circle({
            center: spillLocation,
            radius: IIDistance,
            geodesic: true,
            numberOfPoints: 360
          });        
          var IIGraphic = new Graphic(IIZone);
          IIGraphic.setAttributes({"type": "II Zone"});
          features.push(IIGraphic);
          
          // show BLEVE zone
          if(this.useBleve.getValue() === 'yes' && this._selectedMaterial.BLEVE){            
            bleveAttributeValue = this.tankCapacity.getValue();
            var bleveZone = GeometryEngine.geodesicBuffer(spillLocation,this._selectedMaterial[bleveAttributeValue],'meters');
            var bleveZoneGraphic = new Graphic(bleveZone);
            bleveZoneGraphic.setAttributes({"type": "Bleve"});
            features.push(bleveZoneGraphic);
          }
          
          // show fire evaction zone
          if(this.fire.getValue() === 'yes'){
            var fireZone = GeometryEngine.geodesicBuffer(spillLocation,this._selectedMaterial['FIRE_ISO'],'meters');
            var fireZoneGraphic = new Graphic(fireZone);
            fireZoneGraphic.setAttributes({"type": "Fire"});
            features.push(fireZoneGraphic);
          }
          
          if(this._selectedMaterial.Material.includes('Substances') || this._selectedMaterial.BLEVE) {
            // Materials with the word Substances in their title or BLEVE values do not have any PA distances
            // warn the user to this then zoom to the II Zone
            var alertMessage = new Message({
              message: this.nls.noPAZoneMessage
            }); 
          } else {          
            // create a circle from the spill location that we can use to calculate
            // the center point that will be used for the Protective Action (PA) Zone
            var PACircle = new Circle({
                center: spillLocation,
                radius: PADistance/2,
                geodesic: true,
                numberOfPoints: 360
            });
            
            // Get the center point for the PA Zone (first point of the circle due north)
            var PACenter = PACircle.getPoint(0,0);
            
            // Create another circle from this center point, the extent of which will be the PA Zone
            var PAZone = new Circle({
                center: PACenter,
                radius: PADistance/2,
                geodesic: true,
            });
            
            // get the two bottom corners of the PA Zone - these will be swapped out below
            var PAZoneExtent = PAZone.getExtent();
            var PAPoint1 = new Point(PAZoneExtent.xmin,PAZoneExtent.ymin,spatialReference);
            var PAPoint2 = new Point(PAZoneExtent.xmax,PAZoneExtent.ymin,spatialReference);
            
            // Compute the "protective action arc" - the arc at the limit of the protective action zone
            var paBuffer = GeometryEngine.geodesicBuffer(spillLocation,PADistance,'meters');
            var protectiveActionArc = GeometryEngine.intersect(paBuffer,Polygon.fromExtent(PAZoneExtent));
                      
            // get the 2 coordinates where the initial isolation zone intersects with the protective action distance
            var iiPoint1 = IIZone.getPoint(0,270);
            var iiPoint2 = IIZone.getPoint(0,90);
            
            // Swap out the two bottom corners to create the fan
            array.forEach(protectiveActionArc.rings[0],lang.hitch(this, function(point, i){
              if(point[0] === PAPoint1.x && point[1] === PAPoint1.y) {
                protectiveActionArc.setPoint(0, i, iiPoint1);
              } else if(point[0] === PAPoint2.x && point[1] === PAPoint2.y) {
                protectiveActionArc.setPoint(0, i, iiPoint2);
              }
            }));
            
            var protectiveActionArea = GeometryEngine.difference(protectiveActionArc,IIZone);
            
            // all geometry so far is orientated north so rotate what we need to the wind direction
            protectiveActionArea = GeometryEngine.rotate(protectiveActionArea,this.windDirection.getValue() * -1,spillLocation);         
            PAZoneArea = GeometryEngine.rotate(Polygon.fromExtent(PAZoneExtent),this.windDirection.getValue() * -1,spillLocation);
                      
            var PAAGraphic = new Graphic(protectiveActionArea);
            PAAGraphic.setAttributes({"type": "Down Wind"});
            var PAZoneGraphic = new Graphic(PAZoneArea);
            PAZoneGraphic.setAttributes({"type": "Protective Action Area"});
            
            features.push(PAAGraphic,PAZoneGraphic);
            } 

          // draw a small polygon to show spill location
          var spillLocationPoly = GeometryEngine.geodesicBuffer(spillLocation,2.5,'meters');
          var spillLocationGraphic = new Graphic(spillLocationPoly);
          spillLocationGraphic.setAttributes({"type": "Spill Location"}); 
          features.push(spillLocationGraphic);
          
          this.ERGArea.applyEdits(features, null, null);
          this.map.setExtent(graphicsUtils.graphicsExtent(this.ERGArea.graphics).expand(2),false);
        }
      },
                  
      /**
      * reset the weather info
      **/
      _resetWeatherInfo: function () {
        this.weather.innerHTML = "";
        var tpc = domConstruct.create("div", {
          id: "tpc",
          style: "width: 100%;"
        }, this.weather);
        domClass.add(tpc, "IMT_tabPanelContent");
        
        // current        
        info = "<img style='height:76px' src='" + this.folderUrl + "images/w/dunno.png' />";
        var div = domConstruct.create("div", {
          innerHTML: info
        }, tpc);
        domClass.add(div, "IMTcolSmallUnknown");

        info = '<br/><span>' + this.nls.weatherIntialText + '</span>';
        
        var div2 = domConstruct.create("div", {
          innerHTML: info
        }, tpc);
        domClass.add(div2, "IMTcolSmall");
        
        // credits
        var txt = "<a style='color:#6e6e6e;text-decoration:none' href='https://darksky.net/poweredby/' title='Dark Sky' target='_blank'><img style='height:36px;margin-top: 10px;' src='" 
          + this.folderUrl + "images/darksky.png' />" + '<br /><span style="font-size:11px;color:#6e6e6e">Powered by<br/>' + 'Dark Sky</a></span>';
        var divCredit  = domConstruct.create("div", {
          innerHTML: txt
        }, tpc);
        domClass.add(divCredit, "IMTcolSmall");
        domClass.add(divCredit, "IMTcolLast");
      },
      
      /**
      * Handle different theme styles
      **/
      //source:
      //https://stackoverflow.com/questions/9979415/dynamically-load-and-unload-stylesheets
      _removeStyleFile: function (filename, filetype) {
        //determine element type to create nodelist from
        var targetelement = null;
        if (filetype === "js") {
          targetelement = "script";
        } else if (filetype === "css") {
          targetelement = "link";
        } else {
          targetelement = "none";
        }
        //determine corresponding attribute to test for
        var targetattr = null;
        if (filetype === "js") {
          targetattr = "src";
        } else if (filetype === "css") {
          targetattr = "href";
        } else {
          targetattr = "none";
        }
        var allsuspects = document.getElementsByTagName(targetelement);
        //search backwards within nodelist for matching elements to remove
        for (var i = allsuspects.length; i >= 0; i--) {
          if (allsuspects[i] &&
            allsuspects[i].getAttribute(targetattr) !== null &&
            allsuspects[i].getAttribute(targetattr).indexOf(filename) !== -1) {
            //remove element by calling parentNode.removeChild()
            allsuspects[i].parentNode.removeChild(allsuspects[i]);
          }
        }
      },

      _setTheme: function () {
        //Check if DartTheme
        if (this.appConfig.theme.name === "DartTheme") {
          //Load appropriate CSS for dart theme
          utils.loadStyleLink('darkOverrideCSS', this.folderUrl + "css/dartTheme.css", null);
        } else {
          this._removeStyleFile(this.folderUrl + "css/dartTheme.css", 'css');
        }
        //Check if DashBoardTheme
        if (this.appConfig.theme.name === "DashboardTheme" && this.appConfig.theme.styles[0] === "default"){
          //Load appropriate CSS for dashboard theme
          utils.loadStyleLink('darkDashboardOverrideCSS', this.folderUrl + "css/dashboardTheme.css", null);
        } else {
          this._removeStyleFile(this.folderUrl + "css/dashboardTheme.css", 'css');
        }
      },
      
      /**
      * Handle widget being destroyed
      * Primarly needed when in WAB configuration mode
      **/
      destroy: function() {        
        this.inherited(arguments);        
        this.map.removeLayer(this._graphicsLayerERGExtent);
        this.map.removeLayer(this.ERGArea);
        console.log('ERG widget distroyed')
      },
      
      /**
      * Handle publish ERG to portal
      **/
      _initSaveToPortal: function(layerName) {        
        esriId.registerOAuthInfos();        
        var featureServiceName = layerName;
        esriId.getCredential(this.appConfig.portalUrl + "/sharing", { oAuthPopupConfirmation: false }).then(lang.hitch(this, function() {
          //sign in
          new esriPortal.Portal(this.appConfig.portalUrl).signIn().then(lang.hitch(this, function(portalUser) {
           //Get the token
            var token = portalUser.credential.token;
            var orgId = portalUser.orgId;
            var userName = portalUser.username;
            
            var checkServiceNameUrl = this.appConfig.portalUrl + "sharing/rest/portals/" + orgId + "/isServiceNameAvailable";
            var createServiceUrl = this.appConfig.portalUrl + "sharing/content/users/" + userName + "/createService"; 

            drawERG.isNameAvailable(checkServiceNameUrl, token, featureServiceName).then(lang.hitch(this, function(response0) {
              if (response0.available) {
                //set the widget to busy
                this.busyIndicator.show();
                //create the service
                drawERG.createFeatureService(createServiceUrl, token, drawERG.getFeatureServiceParams(featureServiceName, this.map)).then(lang.hitch(this, function(response1) {
                  if (response1.success) {
                    var addToDefinitionUrl = response1.serviceurl.replace(new RegExp('rest', 'g'), "rest/admin") + "/addToDefinition";
                    drawERG.addDefinitionToService(addToDefinitionUrl, token, drawERG.getLayerParams(featureServiceName, this.map, this._cellTextSymbol, this._ERGAreaFillSymbol)).then(lang.hitch(this, function(response2) {
                      if (response2.success) {
                        //Push features to new layer
                        var newFeatureLayer = new FeatureLayer(response1.serviceurl + "/0?token=" + token, {
                          id: featureServiceName,
                          outFields: ["*"],
                              
                         });                        
                        this.map.addLayers([newFeatureLayer]);
                        
                        var newGraphics = [];
                        array.forEach(this.ERGArea.graphics, function (g) {
                          newGraphics.push(new Graphic(g.geometry, null, {grid: g.attributes["grid"]}));
                        }, this);
                        newFeatureLayer.applyEdits(newGraphics, null, null).then(lang.hitch(this, function(){
                          this._reset();                                
                        })).otherwise(lang.hitch(this,function(){
                          this._reset();
                        })); 
                        this.busyIndicator.hide();
                        var newURL = '<br /><a href="' +this.appConfig.portalUrl + "home/item.html?id=" + response1.itemId + '" target="_blank">';
                        this.publishMessage.innerHTML = this.nls.successfullyPublished.format(newURL) + '</a>';
                        
                      }                      
                    }), function(err2) {
                      this.busyIndicator.hide();
                      this.publishMessage.innerHTML = this.nls.addToDefinition.format(err2.message);                                                    
                    });                    
                  } else {
                    this.busyIndicator.hide();
                    this.publishMessage.innerHTML = this.nls.unableToCreate.format(featureServiceName);                    
                  }
                }), function(err1) {
                  this.busyIndicator.hide();
                  this.publishMessage.innerHTML = this.nls.createService.format(err1.message);                  
                });
              } else {
                  this.busyIndicator.hide();
                  this.publishMessage.innerHTML = this.nls.publishingFailedLayerExists.format(featureServiceName); 
                  
              }
            }), function(err0) {
              this.busyIndicator.hide();
              this.publishMessage.innerHTML = this.nls.checkService.format(err0.message);
            });
          }))
        }));        
      }     
    });
  });