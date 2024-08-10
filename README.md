# BlueMap Web Addons

BlueMap has a feature that allows us to inject any custom JavaScript and CSS snippets that we want into the web app.  
This allows us to add custom functionality to the web app, such as extra buttons, a ruler, and more.  
This repository contains a collection of some such scripts and styles ("addons") for the BlueMap Web App.

Notice: The BlueMap UI is currently not programmed to handle being modified other than CSS styling.  
However, there are some workarounds to customise the UI anyway, which you can find in the scripts below.

The proper way to customise the BlueMap UI would be to clone the BlueMap webapp source code, modify that, and recompile it.  
That is very complicated, though, and also a lot of effort.  
You can find a guide on how to do this [here](https://bluemap.bluecolored.de/community/Customisation.html#advanced-webapp-customisation),
but please note that it is written for people who are already familiar with web development.

## Scripts
- [Custom Sidebar Button](custom-sidebar-button)
- [Distance Measurer / Ruler](distance-measurer)
- [Map Icons](map-icons)
- [Watermark](watermark)
- [Copy Coordinates](copy-coordinates)

## Styles
- [Block Click Popup Select](block-click-popup-select)
- [Hidden Position](hidden-position)
- [Marker Label Full Width](marker-label-full-width)
- [Marker Label Select](marker-label-select)
- [Far Player Names](far-player-names)

## Installation Instructions
You can find the most up-to-date installation instructions for WebApp Scripts and Styles on the
[BlueMap Wiki](https://bluemap.bluecolored.de/community/Customisation.html).

Some addons may support or require being edited by you, however.\
If that is the case, the README of that script will explain the extra steps.

These web addons are not limited to any specific platform; they work on all platforms that BlueMap supports.  
Also note that they do *not* go into the `BlueMap/addons` directory!
That one is for BlueMap Native Addons, which is something else from BlueMap Web Addons.

## Support
To get support with any of these addons, scripts, or styles, please join the [BlueMap Discord server](https://bluecolo.red/map-discord)
and ask your questions in [#3rd-party-support](https://discord.com/channels/665868367416131594/863844716047106068).
You're welcome to ping me, @TechnicJelle.

## Contributing
If you have a script or style that you think would be useful to others, or have a useful modification to an existing one, 
please feel free to create a pull request!

Make sure that each addon has its own folder, with a README.md file that explains
what it does, how to install it, and how to use it.  
Please make sure that the readme is understandable standalone.  
It should also contain a demonstration video or screenshot, and a link to the original author.

And don't forget to add your script or style to the correct list above!
