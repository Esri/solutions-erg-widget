///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2017 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/on',
    'dojo/query',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/string',
    'dijit/form/Select',
    'dijit/form/ValidationTextBox',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/focus',    
    'jimu/utils',
    'jimu/BaseWidgetSetting',
    "jimu/dijit/CheckBox",
    'jimu/dijit/TabContainer',
    'jimu/dijit/Message',
    'jimu/dijit/Popup',
    'jimu/LayerInfos/LayerInfos',
    './QuerySourceSetting',
    './FieldPicker',
    './symbologySettings',    
    'jimu/dijit/SimpleTable'
  ],
  function(
    declare, array, lang, html, domClass, domStyle, on, query, domConstruct, domAttr, string,
    Select, ValidationTextBox, _WidgetsInTemplateMixin, focusUtil, utils, BaseWidgetSetting, 
    CheckBox, TabContainer, Message, Popup, LayerInfos, QuerySourceSetting, FieldPicker, symbologySettings) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-ERG-setting',
      _SettingsInstance: null, //Object to hold Settings instance
      _currentSettings: null, //Object to hold the current settings
      _demographicLayer: null,
      
      postMixInProperties: function() {
        this.nls = lang.mixin(this.nls, window.jimuNls.common);
      },
      postCreate: function() {        
        this.tab = new TabContainer({
          tabs: [{
            title: this.nls.layersTabLabel,
            content: this.layersTab
          }, {
            title: this.nls.symbolologyTabLabel,
            content: this.symbologyTab
          }],
          selected: this.nls.gridTabLabel
        });
        this.tab.placeAt(this.tabsContainer);
        this.tab.startup();
        this.inherited(arguments);

        this._getAllLayers();
        this.own(on(this.btnAddTab, 'click', lang.hitch(this, this._addTabRow)));
        this.own(on(this.tabTable, 'actions-edit', lang.hitch(this, function(tr) {
          this._onEditLayerClicked(tr);
        })));
        this.own(on(this.tabTable, 'row-delete', lang.hitch(this, this._rowDeleted)));
      },
      
      _getAllLayers: function() {
        if (this.map.itemId) {
          LayerInfos.getInstance(this.map, this.map.itemInfo)
            .then(lang.hitch(this, function(operLayerInfos) {
              this.opLayers = operLayerInfos;
              this._setLayers();
              this.setConfig(this.config);
            }));
        }
      },
      
      startup: function() {
        this.inherited(arguments);
        if (!this.config.erg) {
          this.config.erg = {};
        }        
        this._createSettings();
      },

      setConfig: function(config) {
        this.config = config;        
        for (var i = 0; i < this.config.facilityLayers.length; i++) {
          var aTab = this.config.facilityLayers[i];          
          this._populateTabTableRow(aTab);
        }
        if(this.config.demographicLayer) {
          this._demographicLayer = [this.config.demographicLayer];
          this.demographicLayer.setValue(this.config.demographicLayer);
        }
      },      

      getConfig: function() {
        var tabs = [];
        var aTab = {};
        var trs = this.tabTable.getRows();
        array.forEach(trs, lang.hitch(this, function(tr) {
          var selectLayers = tr.selectLayers;
          var selectTypes = tr.selectTypes;
          var labelText = tr.labelText;
          aTab = {};
          aTab.label = labelText.value;
          aTab.layers = selectLayers.value;
          //new prop for title/id switch
          aTab.layerTitle = selectLayers._getSelectedOptionsAttr().label;
          if(tr.tabInfo && tr.tabInfo.fields) {
            aTab.fields = tr.tabInfo.fields;
          } else {
            //set default
            if (tr.validFields) {
              var fp = new FieldPicker({
                test: true,
                nls: this.nls
              });
              aTab.fields = fp.getDefaultFields(tr.validFields.popUpFields,
                tr.validFields.validSummaryFields, selectTypes.value);
            }
          }
          tabs.push(aTab);
        }));

        this.config.facilityLayers = tabs;
        this.config.demographicLayer = this._demographicLayer;
        this._SettingsInstance.onSettingsChanged();
        for (var key in this._currentSettings) {
            this.config.erg.symbology[key] = this._currentSettings[key];
        }        
        return this.config;
      },
      
      destroy: function(){
        this.inherited(arguments);
      },
      
      _getAllLayers: function() {
        if (this.map.itemId) {
          LayerInfos.getInstance(this.map, this.map.itemInfo)
            .then(lang.hitch(this, function(operLayerInfos) {
              this.opLayers = operLayerInfos;
              this._setLayers();
              this.setConfig(this.config);
            }));
        }
      },

      _setLayers: function () {
        var options = [];        
        this.skipLayers = [];
        array.forEach(this.opLayers._layerInfos, lang.hitch(this, function (OpLyr) {
          if (OpLyr.newSubLayers.length > 0) {
            this._recurseOpLayers(OpLyr.newSubLayers, options);
          } else {
            var skipLayer = this._checkSkipLayer(OpLyr);
            if (!skipLayer) {
              options.push({
                label: OpLyr.title,
                value: OpLyr.id
              });
            }
          }
        }));

        if (this.skipLayers.length > 0) {
          var msg = "";
          array.forEach(this.skipLayers, function (l) {
            //TODO update nls for 5.4
            var _type = l.type === 'collection' ? 'Feature Collection' : l.type;
            msg += "Layer Name: " + l.name + "\r\nLayer Type: " + _type + "\r\n\r\n";
          });

          new Message({
            titleLabel: this.nls.layer_type_not_supported,
            message: "<div style='max-height: 500px; overflow: auto;'>" + msg + "</div>",
            maxWidth: 450
          });
        }

        if (options.length === 0) {
          domStyle.set(this.btnAddTab, "display", "none");
          domStyle.set(this.layersTab, "margin-top", "10px");
          html.removeClass(this.noLayersMessage, 'controlGroupHidden');
          this.noValidLayers = true;
          return;
        }

        this.layer_options = lang.clone(options);
        this.checkFields();        
      },

      checkFields: function () {
        this.validFields = [];
        var fp;
        for (var i = 0; i < this.layer_options.length; i++) {
          var l = this.layer_options[i];
          fp = new FieldPicker({
            nls: this.nls,
            callerLayer: l.value,
            callerOpLayers: this.opLayers._layerInfos,
            map: this.map,
            test: true,
            callerTab: {
              type: 'closest'
            }
          });
          fp._validatePopupFields().then(lang.hitch(this, function (validFields) {
            this.validFields.push(validFields);
          }));
        }
      },

      _recurseOpLayers: function (opLyrs, options) {
        array.forEach(opLyrs, lang.hitch(this, function (opLyr) {
          if (opLyr.newSubLayers.length > 0) {
            this._recurseOpLayers(opLyr.newSubLayers, options);
          } else {
            var skipLayer = this._checkSkipLayer(opLyr);
            if (!skipLayer) {
              options.push({
                label: opLyr.title,
                value: opLyr.id
              });              
            }
          }
        }));
      },

      _checkSkipLayer: function (opLyr) {
        var supportedLayerTypes = ["ArcGISFeatureLayer", "ArcGISMapServiceLayer", "Feature Layer"];
        var skipLayer = false;

        if (opLyr.layerObject) {
          if (opLyr.layerObject.hasOwnProperty('tileInfo')) {
            skipLayer = true;
          }
          if (opLyr.layerObject.url && (opLyr.layerObject.url.indexOf('ImageServer') > -1 ||
            opLyr.layerObject.url.indexOf('.csv') > -1)) {
            skipLayer = true;
          }
          if (opLyr.layerObject.type && supportedLayerTypes.indexOf(opLyr.layerObject.type) === -1) {
            skipLayer = true;
          }
          if (!opLyr.layerObject.url) {
            skipLayer = true;
          }
        }
        if (skipLayer) {
          this.skipLayers.push({
            name: opLyr.title,
            type: (opLyr.originOperLayer && opLyr.originOperLayer.selfType) ?
              opLyr.originOperLayer.selfType : (opLyr.originOperLayer && opLyr.originOperLayer.type) ?
                opLyr.originOperLayer.type : opLyr.layerObject.type
          });
        }
        return skipLayer;
      },
      
      _populateTabTableRow: function(tabInfo) {
        var result = this.tabTable.addRow({});
        if (result.success && result.tr) {
          var tr = result.tr;
          tr.tabInfo = tabInfo;
          this._addTabLayers(tr);
          this._addTabLabel(tr);
          //for BC after the title/id switch
          //layerTitle is only set for configs after this change...old configs will not have it
          var id = typeof (tabInfo.layerTitle) !== 'undefined' ? tabInfo.layers : this.getLayerID(tabInfo.layers);
          if (!this.layerExists(tr.selectLayers.options, tabInfo)) {
            tr.selectLayers.addOption({
              label: typeof (tabInfo.layerTitle) !== 'undefined' ? tabInfo.layerTitle : tabInfo.layers,
              value: tabInfo.layers,
              disabled: 'disabled'
            });
            tr.selectLayers.invalidValues.push(tabInfo.layers);
          }
          console.log(id);
          tr.selectLayers.set("value", id);
          tr.type = tabInfo.type;
          tr.labelText.set("value", tabInfo.label);
        }
      },

      getLayerID: function(title){
        for (var i = 0; i < this.layer_options.length; i++) {
          var lo = this.layer_options[i];
          if (title === lo.label || title === lo.value) {
            return lo.value;
          }
        }
      },

      _rowDeleted: function () {
        var trs = this.tabTable.getRows();
        var allValid = true;
        for (var i = 0; i < trs.length; i++) {
          if (!trs[i].isValid) {
            allValid = false;
            break;
          }
        }
        var s = query(".button-container")[0];
        domStyle.set(s.children[2], "display", allValid ? "inline-block" : "none");
        domStyle.set(s.children[3], "display", allValid ? "none" : "inline-block");
      },

      _addTabRow: function() {
        var result = this.tabTable.addRow({});
        if (result.success && result.tr) {
          var tr = result.tr;
          this._addTabLayers(tr);
          this._addTabLabel(tr);
        }
      },

      _addTabLayers: function(tr) {
        var lyrOptions = lang.clone(this.layer_options);
        var td = query('.simple-table-cell', tr)[0];
        if (td) {
          var tabLayers = new Select({
            style: {
              width: "100%",
              height: "26px"
            },
            "class": "medSelect",
            options: lyrOptions,
            isValid: this.validateLayer,
            required: true,
            invalidValues: [],
            row: tr
          });
          tabLayers.placeAt(td);
          tabLayers.startup();
          tr.selectLayers = tabLayers;
          tabLayers._missingMsg = this.nls.layer_error;
          tabLayers.on("change", function () {
            var p = this.domNode.parentNode;
            //validate layers
            p.parentNode.selectLayers.validate();
            focusUtil.focus(p.parentNode.selectLayers.domNode);
            p.parentNode.selectLayers.domNode.blur();            
            //focus on table node
            var table = query(".jimu-simple-table")[0];
            focusUtil.focus(table);
            focusUtil.focus(this.domNode);
          });
          focusUtil.focus(tabLayers.domNode);
          tabLayers.domNode.blur();
          var table = query(".jimu-simple-table")[0];
          focusUtil.focus(table);
        }
      },

      layerExists: function (options, layerOption) {
        //test if layer is no longer found in webmap
        var v = layerOption.layers;
        var isValid = false;
        array.forEach(options, function (opt) {
          if (!isValid) {
            isValid = opt.value === v;
          }
        });
        return isValid;
      },

      validateLayer: function () {
        var isValid = this.invalidValues.indexOf(this.value) === -1;
        var editIcon = this.row.querySelectorAll('.jimu-icon-edit')[0];
        if (!isValid) {
          domClass.add(editIcon, 'jimu-state-disabled');
        } else {
          if (domClass.contains(editIcon, 'jimu-state-disabled')) {
            domClass.remove(editIcon, 'jimu-state-disabled');
          }
        }
        return isValid;
      },

      validateType: function () {
        var row = this.row;
        var isValid = true;
        var isEditable = true;
        var tabInfo = row.tabInfo;
        var hasStats = true;
        var stats;
        if (tabInfo && row && row.type && tabInfo.type !== row.type && tabInfo.type !== 'groupedSummary') {
          tabInfo = undefined;
        }
        if (tabInfo && tabInfo.fields && tabInfo.fields.stats) {
          //user defined values
          stats = tabInfo.fields.stats;
        } else {
          hasStats = false;
        }
        for (var i = 0; i < this.validFields.length; i++) {
          var vf = this.validFields[i];
          if (vf.layer === row.selectLayers.value) {
            row.validFields = vf;
            break;
          }
        }
        row.isValid = isValid;
        row.isEditable = isEditable;

        var editIcon = row.querySelectorAll('.jimu-icon-edit')[0];
        if (!isEditable) {
          domClass.add(editIcon, 'jimu-state-disabled');
        } else {
          if (domClass.contains(editIcon, 'jimu-state-disabled')) {
            domClass.remove(editIcon, 'jimu-state-disabled');
          }
        }

        //check all rows
        var rows = this.parentTable.getRows();
        var allValid = true;
        for (var ii = 0; ii < rows.length; ii++) {
          if (!rows[ii].isValid) {
            allValid = false;
            break;
          }
        }
        var p = this.parent;
        var s = query(".button-container")[0];
        domStyle.set(s.children[2], "display", allValid && p.saveValid && p.textValid ? "inline-block" : "none");
        domStyle.set(s.children[3], "display", allValid && p.saveValid && p.textValid ? "none" : "inline-block");

        return isValid;
      },
      
      _addTabLabel: function(tr) {
        var td = query('.simple-table-cell', tr)[1];
        var labelTextBox = new ValidationTextBox({
          style: {
            width: "100%",
            height: "26px"
          }
        });
        labelTextBox.placeAt(td);
        labelTextBox.startup();
        tr.labelText = labelTextBox;
      },

      _onEditLayerClicked: function(tr) {
        this.curRow = tr;
        
        var aTab = tr.tabInfo;
        if (!aTab) {
          aTab = {};
          aTab.label = tr.labelText.value;
          aTab.layers = tr.selectLayers.value;
          aTab.fields = {};
          tr.tabInfo = aTab;
        }
        var id = typeof (aTab.layerTitle) !== 'undefined' ? aTab.layers : this.getLayerID(aTab.layers);
        if (id !== tr.selectLayers.value) {
          aTab.layers = tr.selectLayers.value;
          aTab.fields = {};
        }

        var args = {
          nls: this.nls,
          callerLayer: tr.selectLayers.value,
          callerTab: aTab,
          callerOpLayers: this.opLayers._layerInfos,
          map: this.map
        };

        var sourceDijit = new FieldPicker(args);

        var popup = new Popup({
          width: 830,
          height: 560,
          content: sourceDijit,
          titleLabel: this.nls.selectFields + ": " + tr.selectLayers._getSelectedOptionsAttr().label
        });

        this.own(on(sourceDijit, 'ok', lang.hitch(this, function (items) {
          this.curRow.tabInfo.fields = items;          
          this.curRow = null;          
          sourceDijit.destroy();
          sourceDijit = null;
          popup.close();
        })));

        this.own(on(sourceDijit, 'cancel', lang.hitch(this, function () {
          this.curRow = null;
          sourceDijit.destroy();
          sourceDijit = null;
          popup.close();
        })));
        
      },
      
      /**
      * Creates settings
      **/
      _createSettings: function () {
        //Create Settings Instance
        this._SettingsInstance = new symbologySettings({
          nls: this.nls,
          config: this.config,
          appConfig: this.appConfig
        }, domConstruct.create("div", {}, this.SettingsNode));        
        
        //add a listener for a change in settings
        this.own(this._SettingsInstance.on("settingsChanged",
          lang.hitch(this, function (updatedSettings) {
            this._currentSettings = updatedSettings;
          })
        ));
        this._SettingsInstance.startup();
      },

      _addNewQuerySource: function() {
        this._createNewQuerySourceSettingFromMenuItem({}, {});
      },
      
      _createNewQuerySourceSettingFromMenuItem: function(setting, definition) {
        var querySetting = new QuerySourceSetting({
          nls: this.nls,
          map: this.map,
          appConfig: this.appConfig
        });
        querySetting.setDefinition(definition);
        querySetting.setConfig({
          url: setting.url,
          name: setting.name || "",
          layerId: setting.layerId,
          placeholder: setting.placeholder || "",
          searchFields: setting.searchFields || [],
          displayField: setting.displayField || definition.displayField || "",
          exactMatch: !!setting.exactMatch,
          zoomScale: setting.zoomScale || 50000,
          maxSuggestions: setting.maxSuggestions || 6,
          maxResults: setting.maxResults || 6,
          searchInCurrentMapExtent: !!setting.searchInCurrentMapExtent,
          type: "query"
        });
        querySetting._openQuerySourceChooser();

        querySetting.own(
          on(querySetting, 'select-query-source-ok', lang.hitch(this, function(item) {
            this.demographicLayer.setValue(item.url);
            this._demographicLayer = item.url;            
          }))
        );        
        querySetting.own(
          on(querySetting, 'select-query-source-cancel', lang.hitch(this, function() {
            //do nothing
          }))
        );
      },      
    });
  });