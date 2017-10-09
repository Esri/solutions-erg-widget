define({
  root: ({
    _widgetLabel: "ERG", // Label of widget
    
    //ERG Main Page Panel    
    "ergMainPageTitle": "Based on the Emergency Response Guidebook 2016", // Shown as title for new ERG from point panel
    "coordInputLabelStart": 'Spill Location (DD)', // Shown as label for coordinate input box (DD) denotes that decimal degrees is set as the default
    "coordInputLabel": 'Spill Location', // Shown as label for coordinate input box
    
    "material": "Material", // Shown as title for material input 
    "materialPlaceholder": "Start typing to search for a material", // Shown as prompt text in material input field
    "table3Message": "The material you have selected requires addition information if you are dealing with a large spill.\n\nPlease ensure you have the correct values selected for wind speed and transport container.", // Shown as message box it material is table 3
    "spillSize": "Spill Size", // Shown as title for spill size dropdown
    "small": "Small", // Shown as label for small in spill size dropdown
    "large": "Large", // Shown as label for large in spill size dropdown
    "weatherLabel": "Current Weather at Spill Location", // Shown as title for weather container
    "weatherIntialText": "Updated once a spill location has been idenitified", // Shown in the weather panel before location has been set
    "temperature": "Temperature", // Shown in the temperature label in weather panel
    "wind": "Wind", // Shown in the wind label in weather panel
    "c": "C", // Shown in the celsius (centigrade) label in weather panel
    "f": "F", // Shown in the fahrenheit label in weather panel
    "weatherErrorMessage": "Current Weather information could not be obtained. Manually update the Wind Speed and Time of Spill values",
    
    
    "windDirection": "Wind Direction (blowing to)", // Shown as label for wind direction
    "timeOfSpill": "Time Of Spill", // Shown as label for time of spill dropdown
    "day": "Day", // Shown as label for day in time of spill dropdown
    "night": "Night", // Shown as label for night in time of spill dropdown
    "windSpeed": "Wind Speed", // Shown as label for wind speed
    "transportContainer": "Transport Container", // Shown as label for transport container dropdown
    
    "low": "Low",
    "moderate": "Moderate",
    "high": "High",
    
    "rail": "Rail tank car",
    "semi": "Highway tank truck or trailer",
    "mton": "Multiple ton cylinders",
    "ston": "Multiple small cylinders or single ton cylinder",
    "ag": "Agricultural nurse tank",
    "msm": "Multiple small cylinders",
    
    
    
    
    
    //Point ERG By Reference System Panel    
    "newERGPointByRefSystemTitle": "ERG from Point by Reference System", // Shown as title for new ERG from reference system panel

    //Settings Panel
    "settingsTitle": "Settings", // Shown as Title for Grid Settings page and label on settings buttons
    "labelSettingsLabel": 'Label Settings', // Shown as Title for Label Settings dropdown
    "labelSettingsButtonLabel": 'Configure Label Settings', // Shown as tooltip for Label Settings dropdown
    "gridSettingsLabel": 'Grid Settings', // Shown as Title for Label Settings dropdown
    "gridSettingsButtonLabel": 'Configure Grid Settings', // Shown as tooltip for Label Settings dropdown
    "transparency": 'Transparency', // Shown as label on transparency sliders
    "labelStyle": 'Label Style', // Shown as label on label settings
    "font": 'Font', // Shown as label for font type
    "textSize": 'Text Size', // Shown as label for font size
    "textColor": 'Text Color', // Shown as label for font colour
    "halo": 'Halo', // Shown as label for halo settings    
    "show": 'Show', // Shown as label for halo settings
    "lockSettings": 'Settings have been locked by the application owner', // Shown as tooltip on settings button if locked
    
    "gridSettings": {
      "cellShape": "Cell Shape", // Shown as label to set Cell Shape Type
      "cellUnits": "Cell Units", // Shown as label to set Cell Units      
      "cellOutline": 'Cell Outline Settings', // Shown as label to set cell Outline Settings
      "cellFill": 'Cell Fill Settings', // Shown as label to set cell fill Settings
      "gridReferenceSystem": 'Reference System', // Shown as label to set Reference System
      "gridDatum": 'Datum: WGS84', // Shown as label for datum
      "labelStartPosition": "Label Origin",  // Shown as label to set label start position      
      "labelType": "Label Type", // Shown as label to set label type
      "labelDirection": "Label Direction", // Shown as label to set label direction
      "gridOrigin": "Grid Origin", // Shown as label to set grid origin
      
      "default": "Rectangle", // Shown as label for default in cell shape dropdown
      "hexagon": "Hexagon", // Shown as label for hexagon in cell shape  dropdown      
      
      "miles": 'Miles', // Shown as label for miles in cell units dropdown
      "kilometers": 'Kilometers', // Shown as label for kilometers in cell units dropdown
      "feet": 'Feet', // Shown as label for feet in cell units dropdown
      "meters": 'Meters', // Shown as label for meters in cell units dropdown
      "yards": 'Yards', // Shown as label for yards in cell units dropdown
      "nautical-miles": 'Nautical Miles', // Shown as label for nauticalMiles in cell units dropdown
      
      "lowerLeft": 'Lower-Left', // Shown as label for lower left in label start position and grid origin dropdowns
      "lowerRight": 'Lower-Right', // Shown as label for lower right in label start position and grid origin dropdowns
      "upperLeft": 'Upper-Left', // Shown as label for upper left in label start position and grid origin dropdowns
      "upperRight": 'Upper-Right', // Shown as label for upper right in label start position and grid origin dropdowns
      "center": 'Center', // Shown as label for center in grid origin dropdown
      
      "alphaNumeric": 'Alpha-Numeric', // Shown as label for Alpha-Numeric in label type dropdown
      "alphaAlpha": 'Alpha-Alpha', // Shown as label for Alpha-Alpha in label type dropdown
      "numeric": 'Numeric', // Shown as label for Numeric in label type dropdown
      
      "horizontal": 'Horizontal', // Shown as label for Horizontal in label direction dropdown
      "vertical": 'Vertical', // Shown as label for Vertical in label direction dropdown
      
      "MGRS": 'MGRS', // Shown as label for MGRS in reference system dropdown
      "USNG": 'USNG', // Shown as label for USNG in reference system dropdown
      
      "showLabels": 'Show Labels', // Shown as label for show labels toggle switch    
    },
    
    //Publish Panel
    "publishTitle": "Publish ERG to Portal", // Shown as Title for Grid Settings page and label on settings buttons
    "publishERGBtn": 'Publish', // Shown as label on publish ERG button   
    "ERGLayerName": 'Published ERG Layer Name', // Shown as label for layer name box
    "invalidERGLayerName": 'Layer name must only contain alpha-numeric characters and underscores', //Shown as validation error on published layer name
    "missingERGLayerName": 'You must enter a name for the ERG', //Shown as validation error on empty published layer name
    
    //publishing error messages
    "publishingFailedLayerExists": 'Publishing Failed: You already have a feature service named {0}. Please choose another name.', //Shown as error for layer name already used when publishing {0} will be replaced with the layer name in the code so do not remove
    "checkService": 'Check Service: {0}', //{0} will be replaced in the code so do not remove
    "createService": 'Create Service: {0}', //{0} will be replaced in the code so do not remove
    "unableToCreate": 'Unable to create: {0}', //{0} will be replaced in the code so do not remove
    "addToDefinition": 'Add to definition: {0}', //{0} will be replaced in the code so do not remove
    "successfullyPublished": 'Successfully published web layer{0}Manage the web layer', //{0} will be replaced in the code so do not remove
    
    //common
    "createERGBtn": 'Create II and PA Distances', // Shown as label on create button
    "clearERGBtn": 'Clear', // Shown as label on clear button
    "labelFormat": 'Label Format', // Shown as label above label format input box
    "helpIconTooltip": 'Z: Grid Zone Designator (GZD)\nS: 100,000-meter Grid Square Identification (GSID)\nX: Easting (X Coordinate)\nY: Northing (Y Coordinate)\n\nExamples:\nZSXY is 15SWC8081751205\nZS X,Y is 15SWC 80817,51205', // Shown as label above label format input box
    "addPointToolTip": 'Add ERG Origin', // Show as tooltip help on the draw point icon    
    "cellWidth": 'Cell Width (x)', // Shown as label above cell width input
    "cellHeight": 'Cell Height (y)', // Shown as label above cell height input
    "invalidNumberMessage": 'The value entered is not valid', //Shown as validation error on invalid entries
    "invalidRangeMessage": 'Value must be greater than 0', //Shown as validation error on invalid entries
    "gridAngleInvalidRangeMessage": 'Value must be between -89.9 and 89.9', //Shown as validation error for the angle input     
    "formatIconTooltip": 'Format Input', // Shown as tooltip on the format input coordinate button
    
    "setCoordFormat": 'Set Coordinate Format String', // Shown as label for set format string
    "prefixNumbers": 'Add "+/-" prefix to positive and negative numbers', // Shown as text next to the add prefix check box
    "cancelBtn": 'Cancel', // Shown as label on cancel button
    "applyBtn": 'Apply', // Shown as label on apply button
    "comfirmInputNotation": 'Confirm Input Notation',  //Shown as panel title when more than one notation match
    "notationsMatch": 'notations match your input please confirm which you would like to use:', // Shown as message when more than one notation match
    "numberOfCellsHorizontal": '# Horizontal Cells', // Shown as label for number of Horizontal cells
    "numberOfCellsVertical": '# Vertical Cells', // Shown as label for number of Vertical cells
    "gridAngle": 'Grid Rotation', // Shown as label for grid angle
    "missingParametersMessage": '<p>The ERG creation form has missing or invalid parameters, Please ensure:</p><ul><li>A ERG area has been drawn.</li><li>The cell width and height contain valid values.</li></ul>',
    "drawPointToolTip": 'Click to add ERG origin point', // Shown as tooltip help on the cursor when using the draw point tool
    "missingLayerNameMessage": 'You must enter a valid layer name before you can publish', //shown as error message for invalid layer name     
    "parseCoordinatesError": 'Unable to parse coordinates. Please check your input.' //Shown as error message for unknown coordinates
    
  })
});
