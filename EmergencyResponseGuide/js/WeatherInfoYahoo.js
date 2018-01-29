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
  'dojo/_base/lang',
  'dojo/dom-class',
  'dojo/dom-construct',
  "esri/request"
], function(
  declare,
  lang,
  domClass,
  domConstruct,
  esriRequest
) {

  var weatherInfo = declare('WeatherInfo', null, {

    constructor: function(container, URL, parent) {      
      this.container = container;
      this.parent = parent;      
      this.weatherURL = URL;
    },

    // update for Incident
    updateForIncident: function(incident) {
      this.container.innerHTML = "";
      domClass.add(this.container, "loading");
      var geom = incident;
      var loc = incident;
      if (geom.type !== "point") {
        loc = geom.getExtent().getCenter();
      }
      var coords = loc.y + "," + loc.x;
      var query = 'select wind,item.condition from weather.forecast where woeid in' +
        ' (select woeid from geo.places(1) where text="(' + coords + ')")&format=json';
      var requestURL = this.weatherURL + "&q=" + query;
      var weatherDeferred = esriRequest({
        url: requestURL,
        callbackParamName: "callback"
      }, {
        useProxy: false
      });
      weatherDeferred.then(lang.hitch(this, function(response) {
        var info = this._resultsHandler(response);
        return info;
      }), lang.hitch(this, function() {        
      }));
    },

    // results handler
    _resultsHandler: function(response) {
      var info;
      var tpc, div, div2;
      domClass.remove(this.container, "loading");
      if(response.query.results) {
        var code, temp;
        var condition = response.query.results.channel.item.condition;
        var wind = response.query.results.channel.wind;
          
        this.container.innerHTML = "";
        

        tpc = domConstruct.create("div", {
          id: "tpc",
          style: "width: 100%;"
        }, this.container);
        domClass.add(tpc, "IMT_tabPanelContent");
        
        if (condition) {        
          // time info
          var timeInfo = 1;
          var obs = condition.date.split(" ");
          var ampm = obs[5];
          var hrArray = obs[4].split(":");
          var hr = parseInt(hrArray[0], 10);
          if (ampm === "AM") {
            if ((hr < 6) || (hr === 12)) {
              timeInfo = 2;
            }
          } else {
            if ((hr > 6) && (hr < 12)) {
              timeInfo = 2;
            }
          }
          
          if(timeInfo === 1) {
            this.parent.spillTime.setValue('DY');
          } else {
            this.parent.spillTime.setValue('NTE');
          }

          // current
          temp = condition.temp;         
          code = parseInt(condition.code, 10);          
          info = this.parent.nls.temperature + "<br/><img style='height:45px' src='" +
            this.parent.folderUrl + "images/w/yahoo/" + code + ".png' /><br/>" + temp + "&deg;";
          if (this.parent.config.celsius) {
            info = info + " " + this.parent.nls.c;
          } else {
            info = info + " " + this.parent.nls.f;
          }
          div = domConstruct.create("div", {
            innerHTML: info
          }, tpc);
          domClass.add(div, "ERGcolSmall");

          // wind
          // calculate the wind direction as a compass point
          var val = Math.floor((wind.direction / 22.5) + 0.5);
          var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", 
            "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];    
          var winddir16Point = arr[(val % 16)];
          
          var windSpeedUnits = " MPH";
                    
          info = this.parent.nls.wind + "<br/><span style='font-size: 30px; line-height:47px'>" +
            winddir16Point + "</span><br/>" + wind.speed + windSpeedUnits;
          div2 = domConstruct.create("div", {
            innerHTML: info
          }, tpc);
          domClass.add(div2, "ERGcolSmall");
          
          this.parent.windDirection.setValue(parseFloat(wind.direction));       
          
          if(wind.speed <= 6){          
            this.parent.windSpeed.setValue('LOW');
          } else if (wind.speed > 6 && wind.speed <= 12) {
            this.parent.windSpeed.setValue('MOD');
          } else {
            this.parent.windSpeed.setValue('HI');
          }
        }        
      } else {
        this.container.innerHTML = "";
        tpc = domConstruct.create("div", {
          id: "tpc",
          style: "width: 100%;"
        }, this.container);
        domClass.add(tpc, "IMT_tabPanelContent");
        
        // current        
        info = "<img style='height:76px' src='" + this.parent.folderUrl + "images/w/dunno.png' />";
        div = domConstruct.create("div", {
          innerHTML: info
        }, tpc);
        domClass.add(div, "ERGcolSmallUnknown");

        info = '<span>' + this.parent.nls.weatherErrorMessage + '</span>';
        
        div2 = domConstruct.create("div", {
          innerHTML: info
        }, tpc);
        domClass.add(div2, "ERGcolSmall");
        
      }
      // credits
      var txt = "<a style='color:#6e6e6e;text-decoration:none'" + 
          "href='https://www.yahoo.com/news/weather/' title='Yahoo Weather' target='_blank'>"+
          "<img style='height:36px;margin-top: 10px;' src='" + 
          this.parent.folderUrl + "images/yahoo.png' />" + 
          '<br /><span style="font-size:11px;color:#6e6e6e">Powered by<br/>' + 
          'Yahoo</a></span>';
      var divCredit  = domConstruct.create("div", {
        innerHTML: txt
      }, tpc);
      domClass.add(divCredit, "ERGcolSmall");
      domClass.add(divCredit, "ERGcolLast");
    },    

    // error handler
    _errorHandler: function() {
      domClass.remove(this.container, "loading");
    }
  });

  return weatherInfo;

});
