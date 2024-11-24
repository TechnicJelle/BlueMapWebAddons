// Toggle button
const rulerSvg = `<svg viewBox="0 0 24 24"><path d="M2 15.6157C2 16.463 2.68179 17.1448 4.04537 18.5083L5.49167 19.9546C6.85525 21.3182 7.53704 22 8.38426 22C9.23148 22 9.91327 21.3182 11.2769 19.9546L19.9546 11.2769C21.3182 9.91327 22 9.23148 22 8.38426C22 7.53704 21.3182 6.85525 19.9546 5.49167L18.5083 4.04537C17.1448 2.68179 16.463 2 15.6157 2C14.8623 2 14.2396 2.53926 13.1519 3.61778C13.1817 3.63981 13.2103 3.66433 13.2373 3.69135L14.6515 5.10556C14.9444 5.39846 14.9444 5.87333 14.6515 6.16622C14.3586 6.45912 13.8837 6.45912 13.5908 6.16622L12.1766 4.75201C12.1494 4.7248 12.1247 4.69601 12.1026 4.66595L11.0299 5.73861C11.06 5.76077 11.0888 5.78545 11.116 5.81267L13.2373 7.93399C13.5302 8.22688 13.5302 8.70176 13.2373 8.99465C12.9444 9.28754 12.4695 9.28754 12.1766 8.99465L10.0553 6.87333C10.0281 6.84612 10.0034 6.81733 9.98125 6.78726L8.90859 7.85993C8.93865 7.88209 8.96744 7.90678 8.99465 7.93399L10.4089 9.3482C10.7018 9.6411 10.7018 10.116 10.4089 10.4089C10.116 10.7018 9.6411 10.7018 9.3482 10.4089L7.93399 8.99465C7.90678 8.96744 7.88209 8.93865 7.85993 8.90859L6.78727 9.98125C6.81733 10.0034 6.84612 10.0281 6.87333 10.0553L8.99465 12.1766C9.28754 12.4695 9.28754 12.9444 8.99465 13.2373C8.70176 13.5302 8.22688 13.5302 7.93399 13.2373L5.81267 11.116C5.78545 11.0888 5.76077 11.06 5.73861 11.0299L4.66595 12.1026C4.69601 12.1247 4.7248 12.1494 4.75201 12.1766L6.16622 13.5908C6.45912 13.8837 6.45912 14.3586 6.16622 14.6515C5.87333 14.9444 5.39846 14.9444 5.10556 14.6515L3.69135 13.2373C3.66433 13.2103 3.63981 13.1817 3.61778 13.1519C2.53926 14.2396 2 14.8623 2 15.6157Z"/></svg>`;
const toggleBtnControl = document.createElement("div");
toggleBtnControl.className = "svg-button distance-toggle";
toggleBtnControl.innerHTML = rulerSvg;
const toggleBtnZoom = toggleBtnControl.cloneNode(true);
const spacer = document.createElement("div");
spacer.className = "space thin-hide";
const cb = document.querySelector(".control-bar");
const cbReference = [...cb.children].find((el) => el.className === "space thin-hide greedy");
cbReference.parentNode.insertBefore(spacer, cbReference);
cbReference.parentNode.insertBefore(toggleBtnControl, cbReference);
const zb = document.querySelector("#zoom-buttons");
zb.insertBefore(toggleBtnZoom, zb.children[0]);
const styles = document.createElement("style");
styles.innerHTML = /* css */ `
	#zoom-buttons > .distance-toggle {
		display: none;
		margin-bottom: 0.5em;
	}
	.control-bar > .distance-toggle {
		display: block;
	}
	@media (max-width: 575.98px) {
		#zoom-buttons > .distance-toggle {
			display: block;
		}
		.control-bar > .distance-toggle {
			display: none;
		}
	}
`;
document.body.appendChild(styles);

// State
let isDistanceLineVisible = false;
const positions = [];

// Distance line marker
const distanceLineMarker = new BlueMap.LineMarker("distanceLineMarker");
distanceLineMarker.line.depthTest = false;
distanceLineMarker.line.linewidth = 2;
distanceLineMarker.data.listed = false;
distanceLineMarker.visible = isDistanceLineVisible;
bluemap.popupMarkerSet.add(distanceLineMarker);

// Toggle
function toggleDistanceLine() {
	isDistanceLineVisible = !isDistanceLineVisible;
	distanceLineMarker.visible = isDistanceLineVisible;
	if (isDistanceLineVisible) {
		toggleBtnControl.classList.add("active");
		toggleBtnZoom.classList.add("active");
	} else {
		toggleBtnControl.classList.remove("active");
		toggleBtnZoom.classList.remove("active");
	}
}
toggleBtnControl.addEventListener("click", toggleDistanceLine);
toggleBtnZoom.addEventListener("click", toggleDistanceLine);

// Hijack the 'open' method of popupMarker to track positions
hijack(bluemap.popupMarker, "open", (original) => function () {
	const pos = bluemap.popupMarker.position;
	positions.push([pos.x, pos.y, pos.z]);

	// Ensure we have two distinct positions before measuring
	if (positions.length === 2) {
		const prevPos = positions[0];
		const newPos = positions[1];

		// Calculate the Euclidean distance between the two points
		const distance = Math.sqrt(
			Math.pow(prevPos[0] - newPos[0], 2) +
				Math.pow(prevPos[1] - newPos[1], 2) +
				Math.pow(prevPos[2] - newPos[2], 2)
		);
		console.log("Distance between " + prevPos + " and " + newPos + " is " + distance);
		distanceLineMarker.data.label = "Distance: " + distance.toFixed(2) + " blocks";

		// Calculate the average position for marker placement
		const avgX = (prevPos[0] + newPos[0]) / 2;
		const avgY = (prevPos[1] + newPos[1]) / 2;
		const avgZ = (prevPos[2] + newPos[2]) / 2;
		distanceLineMarker.position = { x: avgX, y: avgY, z: avgZ };

		// Set the line points relative to the average position
		const points = [
			prevPos[0] - avgX + 0.5,
			prevPos[1] - avgY + 1,
			prevPos[2] - avgZ + 0.5,
			newPos[0] - avgX + 0.5,
			newPos[1] - avgY + 1,
			newPos[2] - avgZ + 0.5,
		];
		distanceLineMarker.setLine(points);

		// Remove the first position to prepare for the next measurement
		positions.shift();
	}

	original.call(this); // Call the original 'open' function of popupMarker
});

/**
 * Hijack a function with custom behavior
 * @param {object} object Context object containing the function
 * @param {string} funcName Name of the function to hijack
 * @param {(original: function) => function} override Override function that wraps the original
 */
function hijack(object, funcName, override) {
	object[funcName] = override(object[funcName]);
}
