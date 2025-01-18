const { PoiMarker } = BlueMap;

Object.defineProperty(PoiMarker.prototype, "highlight", {
    get: function() {
        this.highlight = true;
        return true;
    },
    set: function() {
        this.element.classList.add("bm-marker-highlight")
    },
});


const originalConstructor = PoiMarker.prototype.constructor;
PoiMarker.prototype.constructor = function(...args) {
  const instance = new originalConstructor(...args);
  instance.highlight = true;
  return instance;
};

bluemap.mapViewer.markers.markerSets.forEach((markerSet) => {
  markerSet.markers.forEach((marker) => {
    marker.highlight = true;
  });
});
