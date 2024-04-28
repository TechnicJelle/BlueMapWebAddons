// This will be the label id name for the bluemap marker data
let poiLabel = "examplelabel";

// An increasing counter number that will be added to the poiLabel id name each time the copy button is used
let poiCounter = 0;

// The text on the button on the map
let buttonText = "Copy location";

// 1 = copy only coordinates (x y z)
// 2 = copy teleportation command (/teleport x y z)
// 3 = copy complete marker data to create a bluemap marker (see https://bluemap.bluecolored.de/wiki/customization/Markers.html#poi-markers for format)
let copyMode = 3;




// You can add additional copy modes here if you like. Besides that, there is no need to change anything.
window.copyText = function (data) {
  let textToCopy;
  switch (copyMode) {
    case 1:
      textToCopy = `${data.position.x} ${data.position.y} ${data.position.z}`;
      break;
    case 2:
      textToCopy = `/teleport ${data.position.x} ${data.position.y} ${data.position.z}`;
      break;
    case 3:
      // Output as shown, without the outermost {}
      textToCopy = `"${data.key}": ` + JSON.stringify(data.value, null, 4);
      break;
  }
  const temp = document.createElement("textarea");
  temp.value = textToCopy;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
};

const original = window.bluemap.popupMarker.onMapInteraction;
window.bluemap.events.removeEventListener("bluemapMapInteraction", original);

window.bluemap.popupMarker.onMapInteraction = function(evt) {
  original.call(this, evt);
  poiCounter++;
  const key = `${poiLabel}-${poiCounter}`;
  const data = {
    type: "poi",
    position: { x: this.position.x, y: this.position.y, z: this.position.z },
    label: "change-me-to-something-cool",
    icon: "assets/poi.svg",
    anchor: { x: 25, y: 45 },
    sorting: 0,
    listed: true,
    'min-distance': 10,
    'max-distance': 10000000
  };

  const button = document.createElement("button");
  button.textContent = buttonText;
  button.style.pointerEvents = "auto";
  button.addEventListener("click", () => copyText(copyMode === 3 ? {key, value: data} : data));

  const copyButtonDiv = document.createElement("div");
  copyButtonDiv.id = "copy-button";
  copyButtonDiv.appendChild(button);

  this.element.appendChild(copyButtonDiv);
}.bind(window.bluemap.popupMarker);

window.bluemap.events.addEventListener("bluemapMapInteraction", window.bluemap.popupMarker.onMapInteraction);