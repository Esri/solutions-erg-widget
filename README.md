# emergency-response-guide-webappbuilder-widget

The Emergency Response Guide (ERG) widget allows users to determine potential hazards based on the type of chemical spill and user-selected location on the map.

The ERG widget references the [ERG Guidebook 2016](https://www.phmsa.dot.gov/hazmat/outreach-training/erg). Note: Table 3 of the 2016 Guidebook is not implemented in the current version of the widget.



## Sections

* [Features](#features)
* [Requirements](#requirements)
* [Instructions](#instructions)
* [Resources](#resources)
* [New to Github?](#new-to-github)
* [Issues](#issues)
* [Contributing](#contributing)
* [Licensing](#licensing)

## Features

* Select chemical type
* Select spill size
* Select wind direction and speed
* Select time of day the spill occurred
* Ability to allow user select a location on the map
* Displays affected location, demography and facilities

## Requirements

* Web Appbuilder for ArcGIS Version 2.2+
    * See [ArcGIS Web Appbuilder for ArcGIS](http://developers.arcgis.com/web-appbuilder/)

## Instructions

* Publish the Geoprocessing and Map services from the .sd files
    * The widget relies on Geoprocessing and Map services. The SD files for those services can be found in the EmergencyOperations.zip file in the [services folder](./ERG/services). 
    * Copy and paste the .zip file to a location on your local machine and extract the .sd files. The zip file contains ERG.sd which is the Geoprocessing service along with the EmergencyOperation.sd which is the accompanying map service. 
    * One way to publish these .sd files is by using [ArcGIS Server Manager](http://server.arcgis.com/en/server/latest/publish-services/linux/publishing-a-service-definition-to-the-server-in-manager.htm). You can also [publish the .sd files from ArcMap](http://server.arcgis.com/en/server/latest/publish-services/linux/publishing-a-service-definition-to-the-server-in-arcgis-for-desktop.htm)
    * Once you've successfully created the ERG Geoprocessing Service and EmergencyOperations Map Service from ArcGIS Server Manager, navigate through the ArcGIS REST Services Dictionary (replace `manager` with `rest` in your url). You'll find that the ERG Geoprocessing Service contains 3 Tasks, and the EmergencyOperations Map Service contains 12 layers and 1 table.
    * Open the [config.json](./ERG/config.json) file in a text editor. Copy the urls of the three Tasks in the ERG Geoprocessing service and paste them in their corresponding locations in the config.json file. You will need to replace existing urls. The three Tasks are `FindNearestWeatherStation`, `ERG by Placard`, and `ERG by Chemical`. 
    * In the same config.json file, copy and paste the urls of three of the layers in the EmergencyOperations Map Service. The three layers are `ERG Facilities`, `NOAA METAR Current Wind Speed and Direction`, and `Total Population`. Save and close the config.json file. You are now ready to deploy the widget. Note these sample layers only contain data over Naperville, IL. 
    
* Deploying Widgets
    * To deploy a widget, copy the folder of the desired deployment widget to the stemapp/widgets directory. This is located in %webappbuilder_install%/client directory.
    * For more resources on developing, modifying, and deploying widgets please visit the
[Web AppBuilder for ArcGIS Documentation](https://developers.arcgis.com/web-appbuilder)

## Resources

* Learn more about Esri's Solutions [Focused Maps and Apps for Your Organization](http://solutions.arcgis.com/).
* [Web AppBuilder API](https://developers.arcgis.com/web-appbuilder/api-reference/css-framework.htm)
* [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)

## New to Github

* [New to Github? Get started here.](https://github.com/Esri/esri.github.com/blob/master/help/esri-getting-to-know-github.html)

## Issues

* Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## New to Github

[New to Github? Get started here.](http://htmlpreview.github.com/?https://github.com/Esri/esri.github.com/blob/master/help/esri-getting-to-know-github.html)

## Contributing

Please see our [guidelines for contributing](../../CONTRIBUTING.md).

## Licensing

Copyright 2016-2017 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's
[license.txt](license.txt) file.
