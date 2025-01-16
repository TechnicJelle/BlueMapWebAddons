/************
 *  Hijick the property "highlight" of PoiMarker
 */
const originalDescriptor = Object.getOwnPropertyDescriptor(window.BlueMap.PoiMarker.prototype, 'highlight');
const originalHighlightGetter = originalDescriptor.get;
const originalHighlightSetter = originalDescriptor.set;

Object.defineProperty(window.BlueMap.PoiMarker.prototype, 'highlight', {
    get: function() {
        if (!this.element.classList.contains("bm-marker-highlight"))
            this.element.classList.add("bm-marker-highlight");
        return true;
    },
    set: function(highlight) {
        originalHighlightSetter.call(this, true);
    },
    enumerable: true,
    configurable: true
});


/***********
 *  Hijick the constructor of PoiMarker
 */
const originalConstructor = window.BlueMap.PoiMarker.prototype.constructor;
window.BlueMap.PoiMarker.prototype.constructor = function(...args) {
  const instance = new originalConstructor(...args);
  instance.highlight = true;
  return instance;
};


/************
 *  Highlight all PoiMarkers when the map is loaded
 */
_HighlightAllPoiMarkers();


/************
 *  Highlight all PoiMarkers after the map switched
 */
const originalSwitchMap = window.BlueMap.BlueMapApp.prototype.switchMap;
window.BlueMap.BlueMapApp.prototype.switchMap = async function(...args) {
  const result = await originalSwitchMap.apply(this, args);
  _HighlightAllPoiMarkers();
  return result;
};


function _HighlightAllPoiMarkers() {
	bluemap.mapViewer.markers.markerSets.forEach((markerSet, _) => {
    markerSet.markers.forEach((marker, _) => {
      marker.highlight = true;
    });
  });
}