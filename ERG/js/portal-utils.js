///////////////////////////////////////////////////////////////////////////
// Copyright © 2017 Esri. All Rights Reserved.
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
  'esri/geometry/Point',
  'esri/geometry/Polygon',  
  'esri/geometry/geometryEngine',
  'esri/graphic',
  'esri/geometry/webMercatorUtils',
  'esri/SpatialReference',
  'esri/geometry/Circle',
  'esri/request',
  'jimu/dijit/Message',  
  'dojo/json',
  './geometryUtils'
], function(
  Point,
  Polygon,
  geometryEngine,
  Graphic,
  webMercatorUtils,
  SpatialReference,
  EsriCircle,
  esriRequest,
  Message,  
  JSON,
  geometryUtils
) {
  
  var grg = {};
  
  grg.getFeatureServiceParams = function (featureServiceName, map) {
    return {
     "name" : featureServiceName,
     "serviceDescription" : "",
     "hasStaticData" : false,
     "maxRecordCount" : 1000,
     "supportedQueryFormats" : "JSON",
     "capabilities" : "Create,Delete,Query,Update,Editing",
     "tags" : "GRG",
     "description" : "",
     "copyrightText" : "",
     "spatialReference" : {
        "wkid" : 102100
        },
     "initialExtent" : {
        "xmin": map.extent.xmin,
        "ymin": map.extent.ymin,
        "xmax": map.extent.xmax,
        "ymax": map.extent.ymax,
        "spatialReference":{
          "wkid":102100
        }
      },
     "allowGeometryUpdates" : true,
     "units" : "esriMeters",
     "xssPreventionInfo" : {
        "xssPreventionEnabled" : true,
        "xssPreventionRule" : "InputOnly",
        "xssInputRule" : "rejectInvalid"
      }
    }
  },

  grg.getLayerParams = function (layerName, map, textSymbol, gridSymbol) {          
    return {
      "layers": [
        {
          "adminLayerInfo": {
            "geometryField": {
              "name": "Shape"
            },
            "xssTrustedFields": ""
          },
          "id": 0,
          "name": layerName,
          "type": "Feature Layer",
          "displayField": "",
          "description": "A GRG (Gridded Reference Graphic) is a grid overlay used for a common reference point in many situations - from cordon and search operations to security for presidential inaugurations.",
          "tags" : "GRG",
          "copyrightText": "",
          "defaultVisibility": true,
          "ownershipBasedAccessControlForFeatures" : {
            "allowOthersToQuery" : false, 
            "allowOthersToDelete" : false, 
            "allowOthersToUpdate" : false
          },              
          "relationships": [],
          "isDataVersioned" : false, 
          "supportsCalculate" : true, 
          "supportsAttachmentsByUploadId" : true, 
          "supportsRollbackOnFailureParameter" : true, 
          "supportsStatistics" : true, 
          "supportsAdvancedQueries" : true, 
          "supportsValidateSql" : true, 
          "supportsCoordinatesQuantization" : true, 
          "supportsApplyEditsWithGlobalIds" : true,
          "advancedQueryCapabilities" : {
            "supportsPagination" : true, 
            "supportsQueryWithDistance" : true, 
            "supportsReturningQueryExtent" : true, 
            "supportsStatistics" : true, 
            "supportsOrderBy" : true, 
            "supportsDistinct" : true, 
            "supportsQueryWithResultType" : true, 
            "supportsSqlExpression" : true, 
            "supportsReturningGeometryCentroid" : true
          },          
          "useStandardizedQueries" : false,      
          "geometryType": "esriGeometryPolygon",
          "minScale" : 0, 
          "maxScale" : 0,
          "extent": {
            "xmin": map.extent.xmin,
            "ymin": map.extent.ymin,
            "xmax": map.extent.xmax,
            "ymax": map.extent.ymax,
            "spatialReference":{
              "wkid":102100
            }
          },
          "drawingInfo": {
            "renderer": {
             "type": "simple",
             "symbol": gridSymbol
            },
            "transparency": 0,
            "labelingInfo": [
               {
                "labelExpression": "[grid]",
                "labelExpressionInfo": {"value": "{grid}"},
                "format": null,
                "fieldInfos": null,
                "useCodedValues": false,
                "maxScale": 0,
                "minScale": 0,
                "where": null,
                "sizeInfo": null,
                "labelPlacement": "esriServerPolygonPlacementAlwaysHorizontal",
                "symbol": textSymbol
              }
            ]
          },
          "allowGeometryUpdates": true,
          "hasAttachments": false,
          "htmlPopupType": "esriServerHTMLPopupTypeNone",
          "hasM": false,
          "hasZ": false,
          "objectIdField": "OBJECTID",
          "globalIdField": "",
          "typeIdField": "",
          "fields": [
            {
              "name": "OBJECTID",
              "type": "esriFieldTypeOID",
              "actualType": "int",
              "alias": "OBJECTID",
              "sqlType": "sqlTypeOther",
              "nullable": false,
              "editable": false,
              "domain": null,
              "defaultValue": null
            },
            {
              "name": "grid",
              "type": "esriFieldTypeString",
              "alias": "grid",
              "actualType": "nvarchar",
              "nullable": true,
              "editable": true,
              "domain": null,
              "defaultValue": null,
              "sqlType": "sqlTypeNVarchar",
              "length": 256
            }
          ],
          "indexes": [],
          "types": [],
          "templates": [
            {
              "name": "New Feature",
              "description": "",
              "drawingTool": "esriFeatureEditToolPolygon",
              "prototype": {
                "attributes": {
                  "grid": ""
                }
              }
            }
          ],
          "supportedQueryFormats": "JSON",
          "hasStaticData": false,
          "maxRecordCount": 10000,
          "standardMaxRecordCount" : 4000,               
          "tileMaxRecordCount" : 4000, 
          "maxRecordCountFactor" : 1,   
          "exceedsLimitFactor" : 1,           
          "capabilities": "Query,Editing,Create,Update,Delete"
        }
      ]
    }        
  },
  
  grg.isNameAvailable = function (serviceName, token, featureServiceName) {
    //Check for the layer name
    var def = esriRequest({
      url: serviceName,
      content: {
        name: featureServiceName,
        type: "Feature Service",
        token: token,
        f: "json"
      },
      handleAs: "json",
      callbackParamName: "callback"
    },{usePost: true});
    return def;
  },

  grg.createFeatureService = function (serviceUrl, token, createParams) {
    //create the service
    var def = esriRequest({
      url: serviceUrl,
      content: {
        f: "json",
        token: token,
        typeKeywords: "ArcGIS Server,Data,Feature Access,Feature Service,Service,Hosted Service",
        createParameters: JSON.stringify(createParams),
        outputType: "featureService"
      },
      handleAs: "json",
      callbackParamName: "callback"
    },{usePost: true});
    return def;
  },

  grg.addDefinitionToService = function (serviceUrl, token, defParams) {
    var def = esriRequest({
      url: serviceUrl,
      content: {
        token: token,
        addToDefinition: JSON.stringify(defParams),
        f: "json"                            
      },
      handleAs: "json",
      callbackParamName: "callback"                          
    },{usePost: true});
    return def;
  }
  
  return grg;
});

