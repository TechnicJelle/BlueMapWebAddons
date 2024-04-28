[←Back](..)

# Copy coordinates

If you want to copy the coordinates of a block you selected on the map, you can use this. It will add a customizable button to the coordinates popup that will allow you to copy the selected coordinates to your clipboard. My initial need was to quickly add markers. Since the web interface (as of April 2024) does not allow to add markers directly, this script makes the process much faster as you can just copy-paste coordinates into your world configuration.

![image](https://github.com/TechnicJelle/BlueMapWebScripts/assets/11146296/9a46b861-4ec2-4fc4-b3c1-1f995bce225c)

:heart: Thanks to Antti over on the Bluemap Discord for the initial idea and code.


## Installation Instructions
To make this script work, you only need copy-coordinates.js. The CSS file only centers the button as shown in the image. Without it, it will be aligned to the left. I recommend uploading both though, as this allows you to change the button further (colors, font, etc.)

Download or copy both the [copy-coordinates.js](copy-coordinates.js) script file
and the [copy-coordinates.css](copy-coordinates.css) style file to your webapp, and register them.

Here is a [guide for the registering js file](https://bluemap.bluecolored.de/community/Customisation.html#webapp-script-addons)
and a [guide for the registering css file](https://bluemap.bluecolored.de/community/Customisation.html#theme-and-look).


If you want to change the options, you can do so in the copy-coordinates.js. By default, it will copy the selected location in the Bluemap Marker format (called copy mode 3):

```json
"exmaplelabel-1": {
    "type": "poi",
    "position": {
        "x": 17,
        "y": 93,
        "z": 301
    },
    "label": "change-me-to-something-cool",
    "icon": "assets/poi.svg",
    "anchor": {
        "x": 25,
        "y": 45
    },
    "sorting": 0,
    "listed": true,
    "min-distance": 10,
    "max-distance": 10000000
}
```

## Configuration
`let poiLabel = "examplelabel";`

Change this to what the marker id name should be called. **Only relevant for copymode=3**

`let poiCounter = 0;`

Set the starting number for the marker id name. It will be incremented by 1 each time you click the copy button. Reloading the page will reset it to 0. It will output the names as examplelabel-1, examplelabel-2, examplelabel-3 and so forth. **Only relevant for copymode=3**

`let buttonText = "Copy location";`

You can change the text of the button to anything you like. 

`let copyMode = 3;`

The last and most interesting one. Currently, there are 3 copy modes:

### copymode = 1
Will copy only the "raw" coordinates (x y z):

```17 93 301```

### copymode = 2
Copies a teleportation command (/teleport x y z) that you can paste into minecraft.

```/teleport 17 93 301```

### copymode = 3
Copies the complete marker data to create a bluemap marker.
```json
"exmaplelabel-1": {
    "type": "poi",
    "position": {
        "x": 17,
        "y": 93,
        "z": 301
    },
    "label": "change-me-to-something-cool",
    "icon": "assets/poi.svg",
    "anchor": {
        "x": 25,
        "y": 45
    },
    "sorting": 0,
    "listed": true,
    "min-distance": 10,
    "max-distance": 10000000
}
```