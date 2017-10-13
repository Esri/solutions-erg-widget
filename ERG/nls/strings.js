define({
  root: ({
    _widgetLabel: "ERG", // Label of widget
    
    //ERG Main Page Panel    
    "ergMainPageTitle": "Based on the Emergency Response Guidebook 2016", // Shown as title for new ERG from point panel
    "coordInputLabelStart": 'Spill Location (DD)', // Shown as label for coordinate input box (DD) denotes that decimal degrees is set as the default
    "coordInputLabel": 'Spill Location', // Shown as label for coordinate input box
    "addPointToolTip": 'Add Spill Location', // Show as tooltip help on the draw point icon    
    "drawPointToolTip": 'Click to add spill location', // Shown as tooltip help on the cursor when using the draw point tool
    
    "material": "Material", // Shown as title for material input 
    "materialPlaceholder": "Start typing to search for a material", // Shown as prompt text in material input field
    "table3Message": "The material you have selected requires additional information if you are dealing with a large spill.\n\nPlease ensure you have the correct values selected for wind speed and transport container.", // Shown as message box it material is table 3
    
    "spillSize": "Spill Size", // Shown as title for spill size dropdown
    "small": "Small", // Shown as label for small in spill size dropdown
    "large": "Large", // Shown as label for large in spill size dropdown
    
    "fireLabel": "Show Fire Isolation Zone", // Shown as label for fire toggle
    
    "weatherLabel": "Current Weather at Spill Location", // Shown as title for weather container
    "weatherIntialText": "Updated once a spill location has been idenitified", // Shown in the weather panel before location has been set
    "temperature": "Temperature", // Shown in the temperature label in weather panel
    "wind": "Wind", // Shown in the wind label in weather panel
    "c": "C", // Shown in the celsius (centigrade) label in weather panel
    "f": "F", // Shown in the fahrenheit label in weather panel
    "weatherErrorMessage": "Current Weather information could not be obtained. Manually update the Wind Speed and Time of Spill values",
        
    "windDirection": "Wind Direction (blowing to)", // Shown as label for wind direction
    
    "timeOfSpill": "Time of Spill", // Shown as label for time of spill dropdown
    "day": "Day", // Shown as label for day in time of spill dropdown
    "night": "Night", // Shown as label for night in time of spill dropdown
    
    "windSpeed": "Wind Speed", // Shown as label for wind speed
    "low": "Low", // Shown as label for low in wind speed dropdown
    "moderate": "Moderate", // Shown as label for moderate in wind speed dropdown
    "high": "High", // Shown as label for high in wind speed dropdown
    
    "transportContainer": "Transport Container", // Shown as label for transport container dropdown
    "rail": "Rail tank car",
    "semi": "Highway tank truck or trailer",
    "mton": "Multiple ton cylinders",
    "ston": "Multiple small cylinders or single ton cylinder",
    "ag": "Agricultural nurse tank",
    "msm": "Multiple small cylinders",
    
    "bleveLabel": "Show BLEVE Isolation Zone", // Shown as label for BLEVE toggle
    
    "capacity": "Container Capacity (litres)", // Shown as label for Container Capacity dropdown
    
    "bleveMessage": "For the material you have selected an additional evacuation distance can be shown for BLEVE.\n\nTo enable this, set the Show BLEVE Isolation Zone toggle to on and select the appropiate container capacity.",
    "noPAZoneMessage": "There are no Protective Action distances for this material. Only the Initial Isolation and evacuation zones has been calculated",
    
    //Settings Panel
    "settingsTitle": "Settings", // Shown as Title for Grid Settings page and label on settings buttons
    
    "spillLocationLabel": 'Spill Location', // Shown as Title for Spill Location Settings dropdown
    "spillLocationButtonLabel": 'Configure Spill Location Settings', // Shown as tooltip for Spill Location Settings dropdown
    
    "IISettingsLabel": 'Initial Isolation Zone', // Shown as Title for Initial Isolation Zone Settings dropdown
    "IIButtonLabel": 'Configure Initial Isolation Settings', // Shown as tooltip for Initial Isolation Zone Settings dropdown
    
    "PASettingsLabel": 'Protective Action Zone', // Shown as Title for Protective Action Zone Settings dropdown
    "PAButtonLabel": 'Configure Protective Action Settings', // Shown as tooltip for Protective Action Zone Settings dropdown
    
    "downwindSettingsLabel": 'Down Wind Zone', // Shown as Title for Down Wind Zone Settings dropdown
    "downwindButtonLabel": 'Configure Down Wind Settings', // Shown as tooltip for Down Wind Zone Settings dropdown
        
    "fireSettingsLabel": 'Fire Isolation Zone', // Shown as Title for Fire Isolation Zone Settings dropdown
    "fireButtonLabel": 'Configure Fire Isolation Settings', // Shown as tooltip for Fire Isolation Zone Settings dropdown
    
    "bleveSettingsLabel": 'BLEVE Isolation Zone', // Shown as Title for BLEVE Isolation Zone Settings dropdown
    "bleveButtonLabel": 'Configure BLEVE Settings', // Shown as tooltip for BLEVE Isolation Zone Settings dropdown
    
    "outlineStyle": 'Outline Style', // Shown as Title for Fill Style dropdown
    
    "dash": 'Dash',
    "dashdot": 'Dash Dot',
    "dashdotdot": 'Dash Dot Dot',
    "dot": 'Dot',
    "longdash": 'Long Dash',
    "longdashdot": 'Long Dash Dot',
    "null": 'Null',
    "shortdash": 'Short Dash',
    "shortdashdot": 'Short Dash Dot',
    "shortdashdotdot": 'Short Dash Dot Dot',
    "shortdot": 'Short Dot',
    "solid": 'Solid',
    
    "fillStyle": 'Fill Style', // Shown as Title for Fill Style dropdown
    
    "backward": 'Backward',
    "cross": 'Cross',
    "diagonal": 'Diagonal',
    "forward": 'Forward',
    "horizontal": 'Horizontal',
    "null": 'Null',
    "solid": 'Solid',
    "vertical": 'Vertical',
    
    
    //results Panel
    "resultsTitle": "Results", // Shown as Title for Grid Settings page and label on settings buttons
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
    "transparency": 'Transparency', // Shown as label on transparency sliders
    "outline": 'Outline', // Shown as label for outline color picker
    "fill": 'Fill (Color only applies when style set to solid)', // Shown as label for outline color picker
    "createERGBtn": 'Create Zones', // Shown as label on create button
    "clearERGBtn": 'Clear', // Shown as label on clear button
    "labelFormat": 'Label Format', // Shown as label above label format input box
    "helpIconTooltip": 'Z: Grid Zone Designator (GZD)\nS: 100,000-meter Grid Square Identification (GSID)\nX: Easting (X Coordinate)\nY: Northing (Y Coordinate)\n\nExamples:\nZSXY is 15SWC8081751205\nZS X,Y is 15SWC 80817,51205', // Shown as label above label format input box
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
    "missingLayerNameMessage": 'You must enter a valid layer name before you can publish', //shown as error message for invalid layer name     
    "parseCoordinatesError": 'Unable to parse coordinates. Please check your input.' //Shown as error message for unknown coordinates
    
  })
});
