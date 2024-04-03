[←Back](..)

# Map icons

Similar to [adding a custom button to the sidebar](../custom-sidebar-button), it's possible to include your own custom world icons.
This would replace the existing tiny `"•"` to the left of the world name, represented by the sky colors.

| Original | Custom |
| -------- | ------ |
| ![image](https://github.com/TechnicJelle/BlueMapWebScripts/assets/22576047/6dc42857-f7b2-4064-8e79-6958b8f6470e) | ![image](https://github.com/TechnicJelle/BlueMapWebScripts/assets/22576047/fcbf6d4c-482d-44b1-b29e-2d4538026fea) |

Thanks to community member [@TravelTimN](https://github.com/TravelTimN) for providing this cool feature!


## Setup Instructions

To get started, you need to upload the world icon images that you'd like to use into your assets webroot (usually `/bluemap/web/assets/`).  
Ideally, have the images be no larger than 32x32 pixels.  
They should be named to match the `.conf` file names found within your BlueMap maps configs (in `BlueMap/maps/`).  
The file type for every image should be the same. In this example, `.png` is used.

Examples:

- `/bluemap/web/assets/world.png`
- `/bluemap/web/assets/world_nether.png`
- `/bluemap/web/assets/world_the_end.png`

Create and register a new script ([guide](https://bluemap.bluecolored.de/community/Customisation.html#webapp-script-addons))
with the following content:

```js
// trigger an update to map icons
document.body.addEventListener("click", function() {
  setTimeout(updateMapBtns, 50);  // needs slight delay to work properly
});

// updating the map buttons
function updateMapBtns() {
  // find map-buttons (if available)
  const mapBtns = document.querySelectorAll(".map-button");
  mapBtns?.forEach(btn => {
    // grab the "title" for the btn
    let btnTitle = btn.getAttribute("title");

    // grab the "display-name" to update the image alt-text
    let btnName = btn.querySelector("span.name").innerText;

    // replace sky "•" with block image
    let btnSkySpan = btn.querySelector("span.sky");
    let btnImg = `assets/${btnTitle}.png`;
    let newImg = new Image();
    newImg.src = btnImg;
    newImg.alt = btnName;
    btnSkySpan.innerText = "";  // remove the "•"
    btnSkySpan.appendChild(newImg);
  });
}
```

If you're using another image type that isn't `.png`, make sure to update this line to the appropriate file type (and
location) you're using:

```js
let btnImg = `assets/${btnTitle}.png`;
```

Finally, you'll want to consider adding some custom CSS to have the images fit within the menu appropriately.  
Repeat the process for creating a custom JavaScript file above, but for CSS.

Create a `.css` file in your webroot where the `.js` file is stored.  
Then you need to register the styles.  
In `webapp.conf`, put the CSS file name in the `styles: [ ]` list.  
After adding it to the list, you'll probably want to reload BlueMap, so BlueMap applies the changes you've made to the
configs.
You can do so with the `/bluemap reload light` command.

`/bluemap/web/map-icons.css`:
```css
/* map [world] icons */
.side-menu .map-button {
    overflow: hidden;
}

.side-menu .map-button .sky {
    font-size: 2em;
    margin: 0 1em 0 0.5em;
}

.side-menu .map-button .sky img {
    max-width: 32px;
    max-height: 32px;
}
```
