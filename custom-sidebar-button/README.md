[←Back](..)

# Custom Sidebar Button
Thanks to community member [@Chicken](https://github.com/Chicken/)
for being the first to devise a workaround for BlueMap's immutable UI!

![a screenshot of the custom button in the sidebar](https://github.com/TechnicJelle/BlueMapWebScripts/assets/22576047/52011787-83e6-4514-9a85-70ca6180dee9)

## Setup Instructions
To get started, you should create a `.js` file in your webroot (usually `/bluemap/web/`).  
Then you need to register that script with BlueMap, so it'll actually load it.  
You do this in `webapp.conf`, by putting the file name in the `scripts: [ ]` list.  
After adding it to the list, you need to reload BlueMap, so BlueMap applies the changes you've made to the configs.
You can do so with the `/bluemap reload light` command.

The following code block is the content of the script file. You can customise the text of the button by changing what's
inside the label div,
and you can change what it links to by replacing the link in the `<a>`'s `href` attribute.

`/bluemap/web/my-custom-button.js`:
```js
const buttonTemplate = document.createElement("template");
buttonTemplate.innerHTML = `
<a style="text-decoration: none" href="https://bluemap.bluecolored.de/">
    <div class="simple-button">
        <div class="label">Visit BlueMap Website</div>
    </div>
</a>
`.trim();
const button = buttonTemplate.content.firstChild;

setInterval(() => {
    const buttonList = document.querySelector(".side-menu .content")?.children.item(0);
    if (buttonList && Array.from(buttonList.children).every(el => el.tagName === "HR" || el.className === "simple-button")) {
        buttonList.appendChild(button);
    }
}, 10);
```

`plugins/BlueMap/webapp.conf`:
```hocon
scripts: [
    "my-custom-button.js"
]
```

The example above will open your new button within the same window.  
To force it to open within a new/separate tab within your browser, immediately
after `href="https://bluemap.bluecolored.de/"`, include the following: `target="_blank"`.

Example:

```js
buttonTemplate.innerHTML = `
<a style="text-decoration: none" href="https://bluemap.bluecolored.de/" target="_blank">
    <div class="simple-button">
        <div class="label">Visit BlueMap Website</div>
    </div>
</a>
`.trim();
```
