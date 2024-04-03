[←Back](..)

# Map icons

Similar to [adding a custom button to the sidebar](../custom-sidebar-button), it's possible to include your own custom world icons.
This would replace the existing tiny `"•"` to the left of the world name, represented by the sky colors.

| Original | Custom |
| -------- | ------ |
| ![image](https://github.com/TechnicJelle/BlueMapWebScripts/assets/22576047/6dc42857-f7b2-4064-8e79-6958b8f6470e) | ![image](https://github.com/TechnicJelle/BlueMapWebScripts/assets/22576047/fcbf6d4c-482d-44b1-b29e-2d4538026fea) |

Thanks to community member [@TravelTimN](https://github.com/TravelTimN) for providing this cool feature!


## Installation Instructions
This script requires two files: a JavaScript file and a CSS file.

Download or copy both the [BlueMapMapIcons.js](BlueMapMapIcons.js) script file
and the [BlueMapMapIcons.css](BlueMapMapIcons.css) style file to your webapp, and register them.

Here is a [guide for the registering js file](https://bluemap.bluecolored.de/community/Customisation.html#webapp-script-addons)
and a [guide for the registering css file](https://bluemap.bluecolored.de/community/Customisation.html#theme-and-look).

Now, you need to upload the world icon images that you'd like to use, into your assets webroot (usually `/bluemap/web/assets/`).  
Ideally, have the images be no larger than 32x32 pixels.  
They should be named to match the `.conf` file names found within your BlueMap maps configs (in `BlueMap/maps/`).  
The file type for every image should be the same. In this example, `.png` is used.

Examples:

- `/bluemap/web/assets/world.png`
- `/bluemap/web/assets/world_nether.png`
- `/bluemap/web/assets/world_the_end.png`

If you're using another image type that isn't `.png`, make sure to update this line of code to the appropriate file type
(and location) you're using:

```js
let buttonImg = `assets/${buttonTitle}.png`;
```
