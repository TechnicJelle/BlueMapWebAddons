[←Back](..)

# Custom Sidebar Button
Thanks to community member [@Chicken](https://github.com/Chicken/)
for being the first to devise a workaround for BlueMap's immutable UI!

![a screenshot of the custom button in the sidebar](https://github.com/TechnicJelle/BlueMapWebScripts/assets/22576047/52011787-83e6-4514-9a85-70ca6180dee9)

## Installation Instructions
Download or copy the [BlueMapCustomSidebarButton.js](BlueMapCustomSidebarButton.js) file to your webapp, and register it.
([guide](https://bluemap.bluecolored.de/community/Customisation.html#webapp-script-addons))

### Options
You can customise the text of the button by changing what's inside the label div:
```html
<div class="label">Visit BlueMap Website</div>
```

And you can change what it links to, by replacing the link in the anchor tag's `href` attribute:
```html
<a style="text-decoration: none" href="https://bluemap.bluecolored.de/">
```

To open the link in a new tab, instead of in the same tab, add `target="_blank"` to the anchor tag:
```html
<a style="text-decoration: none" href="https://bluemap.bluecolored.de/" target="_blank">
```
