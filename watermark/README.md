[←Back](../README.md)

# Watermark

To add a "watermark" overlay image to your map, we'll need to write a little bit of JavaScript and CSS.

To get started, you should create two files: `watermark.js` and `watermark.css` in your webroot (
usually `/bluemap/web/`).  
Copy this into both of those files:

`/bluemap/web/watermark.js`:
```js
// JavaScript function to show the watermark
function showWatermark() {
    const anchor = document.createElement("a"); //create HTML <a>
    document.body.appendChild(anchor); //place it on the page
    anchor.href = "https://bluemap.bluecolored.de/"; //set the link

    const watermarkImage = document.createElement("img"); //create HTML <img>
    anchor.appendChild(watermarkImage); //place it inside the just created <a>
    watermarkImage.src = "https://avatars.githubusercontent.com/u/42522657"; //set the image URL
    watermarkImage.id = 'watermarkImage'; //set the tag's ID, so the CSS style will apply to it
}

// Call the function to show the watermark
showWatermark();
```

> Feel free to change the `anchor.href` link and the `watermarkImage.src` link.
{: .info }

`/bluemap/web/watermark.css`:
```css
/* Apply to the HTML tag with the ID 'watermarkImage' */
#watermarkImage {
    /* Place the image in the bottom left, 20 pixels from each side. */
    bottom: 20px;
    left: 20px;

    /* Adjust this size as needed */
    max-width: 150px;
    max-height: 150px;

    display: block;
    position: fixed;
    z-index: 9999;
}
```

> Feel free to change the placement and the size of the watermark.
{: .info }

Now you need to register these files with BlueMap, so it'll actually load them.  
You do this in `webapp.conf`, by putting the file name of the script in the `scripts: [ ]` list,
and the file name of the style in the `styles: [ ]` list, like this:

```hocon
scripts: [
    "watermark.js"
]

styles: [
    "watermark.css"
]
```

After adding these to the lists, you need to reload BlueMap, so BlueMap applies the changes you've made to the configs.
You can do so with the `/bluemap reload light` command.
