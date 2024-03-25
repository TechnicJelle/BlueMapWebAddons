const positions = [];
const distanceLineMarker = new BlueMap.LineMarker("distanceLineMarker");
distanceLineMarker.line.depthTest = false;
distanceLineMarker.line.linewidth = 2;
bluemap.popupMarkerSet.add(distanceLineMarker);

hijack(bluemap.popupMarker, 'open', function (original) {
	return function () {
		const pos = bluemap.popupMarker.position;
		positions.push([pos.x, pos.y, pos.z]);

		if (positions.length === 2) {
			const prevPos = positions[0];
			const newPos = positions[1];
			const distance = Math.sqrt(Math.pow(prevPos[0] - newPos[0], 2) + Math.pow(prevPos[1] - newPos[1], 2) + Math.pow(prevPos[2] - newPos[2], 2));
			console.log("Distance between " + prevPos + " and " + newPos + " is " + distance);
			distanceLineMarker.data.label = "Distance: " + distance.toFixed(2) + " blocks";

			const avgX = (prevPos[0] + newPos[0]) / 2;
			const avgY = (prevPos[1] + newPos[1]) / 2;
			const avgZ = (prevPos[2] + newPos[2]) / 2;
			distanceLineMarker.position = {x: avgX, y: avgY, z: avgZ};

			const points = [
				prevPos[0] - avgX + 0.5, prevPos[1] - avgY + 1, prevPos[2] - avgZ + 0.5,
				newPos[0] - avgX + 0.5, newPos[1] - avgY + 1, newPos[2] - avgZ + 0.5
			];
			distanceLineMarker.setLine(points);

			//remove the first element
			positions.shift();
		}
		original.call(this);
	};
});

/**
 * Hijack a function with custom behaviour
 * from https://gist.github.com/joshwnj/625349/
 * @param {object} Context object
 * @param {string} Name of the context object's function
 * @param {function} Override function
 * @return {function} Original function
 */
function hijack(object, funcName, override) {
	var original = object[funcName];
	object[funcName] = override(original);
	return original;
}
