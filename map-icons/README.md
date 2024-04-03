[←Back](..)

# Map icons

Similar to [adding a custom button to the sidebar](../custom-sidebar-button), it's possible to include your own custom world icons.
This would replace the existing tiny `"•"` to the left of the world name, represented by the sky colors.

//TODO: Add a table with two screenshots (original, custom) to show the difference.

Thanks to community member [@TravelTimN](https://github.com/TravelTimN) for providing this cool feature!


## Setup Instructions

To get started, you need to upload the world icon images that you'd like to use, into your assets webroot (
usually `/bluemap/web/assets/`). Ideally, have the images be no larger than 32x32 pixels, and to use the code below, you
should rename them to match the respective `.conf` file name found within `/BlueMap/maps/`, and the file type used in
this example is a `.png`.

Examples:

- `/bluemap/web/assets/world.png`
- `/bluemap/web/assets/world_nether.png`
- `/bluemap/web/assets/world_the_end.png`

Next, you should create a `.js` file in your webroot (usually `/bluemap/web/`).  
Then you need to register that script with BlueMap, so it'll actually load it.  
You do this in `webapp.conf`, by putting the file name in the `scripts: [ ]` list.  
After adding it to the list, you'll probably want to reload BlueMap, so BlueMap applies the changes you've made to the
configs.
You can do so with the `/bluemap reload light` command.

`/bluemap/web/map-icons.js`:
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
