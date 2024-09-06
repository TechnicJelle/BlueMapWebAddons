// Create and add the toggle button for showing/hiding the distance line
const canvas = document.createElement('canvas');
canvas.width = 32; // Width of the canvas
canvas.height = 32; // Height of the canvas
const ctx = canvas.getContext('2d');

// Base64 image data for the button
const imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFlSURBVFhH7dY9roMwEEZRxC4QEqJhAXT8NGyKJlkBW2GTjsbSRH68z3iIx04KilskgDnCjJKiqirzy93A2G5gbNmB4ziapmngMVRW4DRNZts2s++76boOnnMsG5BwBHOTILMA53n+h+NCyORAenJFUdh3j1HrutrvqBAyKZC3lXCEeT4eb2BZljZG+5DJgITigaAIx0+M6vvexp8ptE4S4DAMFuduqyS0ljpwWZY/N+VtDYXWolSBaCAkobU4NaBvIEKhtdxUgIQ7GwhfaK1j0UDGaW6rWxSQt5XT2la3j4Ft26oPBOojYF3X9mbaA4G6DEw5EKhLQMYd371QaC1pYmCOgUCJgPyupR4IVBDITy7HQKBOgbkHAuUF0t/0lL8Q0iDwWwOBgkApyA2to5F3i68g0fVanQ6JBImu0+wUSJ0h0fnaBYEUQqLzUiQCUi4SHU+VGEgREn2fskvAb3QDY/txYGVej/nouKqF4MoAAAAASUVORK5CYII=';

// Create an image object and draw it on the canvas
const img = new Image();
img.onload = function() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};
img.src = 'data:image/png;base64,' + imageBase64;

// Image position
canvas.style.position = 'fixed';
canvas.style.top = '8px'; // Adjust position as needed
canvas.style.left = '120px'; // Adjust position as needed
canvas.style.zIndex = '1000';
canvas.style.cursor = 'pointer';
document.body.appendChild(canvas);

// Variable to track the visibility state
let isDistanceLineVisible = false; // Set to false to hide the line by default

// Create the distance line marker
const distanceLineMarker = new BlueMap.LineMarker("distanceLineMarker");
distanceLineMarker.line.depthTest = false;
distanceLineMarker.line.linewidth = 2;
distanceLineMarker.visible = isDistanceLineVisible; // Set initial visibility
bluemap.popupMarkerSet.add(distanceLineMarker);

// Function to show or hide the distance line
function toggleDistanceLine() {
    isDistanceLineVisible = !isDistanceLineVisible;
    distanceLineMarker.visible = isDistanceLineVisible;
    // Optionally update the canvas opacity to reflect the current state
    canvas.style.opacity = isDistanceLineVisible ? '1' : '0.5'; // Example to change canvas opacity
}

// Add a click event to the canvas for toggling
canvas.addEventListener('click', function() {
    toggleDistanceLine();
});

// Hijack the 'open' method of popupMarker to track positions
hijack(bluemap.popupMarker, 'open', function (original) {
    return function () {
        const pos = bluemap.popupMarker.position;
        positions.push([pos.x, pos.y, pos.z]);

        // Ensure we have two distinct positions before measuring
        if (positions.length === 2) {
            const prevPos = positions[0];
            const newPos = positions[1];

            // Check if positions are identical, and skip if they are
            if (prevPos[0] === newPos[0] && prevPos[1] === newPos[1] && prevPos[2] === newPos[2]) {
                console.log("Positions are the same, skipping distance calculation.");
                positions.shift(); // Remove the duplicate and keep the last position
                return; 
            }

            // Calculate the Euclidean distance between the two points
            const distance = Math.sqrt(Math.pow(prevPos[0] - newPos[0], 2) + Math.pow(prevPos[1] - newPos[1], 2) + Math.pow(prevPos[2] - newPos[2], 2));
            console.log("Distance between " + prevPos + " and " + newPos + " is " + distance);
            distanceLineMarker.data.label = "Distance: " + distance.toFixed(2) + " blocks";

            // Calculate the average position for marker placement
            const avgX = (prevPos[0] + newPos[0]) / 2;
            const avgY = (prevPos[1] + newPos[1]) / 2;
            const avgZ = (prevPos[2] + newPos[2]) / 2;
            distanceLineMarker.position = {x: avgX, y: avgY, z: avgZ};

            // Set the line points relative to the average position
            const points = [
                prevPos[0] - avgX + 0.5, prevPos[1] - avgY + 1, prevPos[2] - avgZ + 0.5,
                newPos[0] - avgX + 0.5, newPos[1] - avgY + 1, newPos[2] - avgZ + 0.5
            ];
            distanceLineMarker.setLine(points);

            // Remove the first position to prepare for the next measurement
            positions.shift();
        }
        original.call(this); // Call the original 'open' function of popupMarker
    };
});

/**
 * Hijack a function with custom behavior
 * @param {object} object - Context object containing the function
 * @param {string} funcName - Name of the function to hijack
 * @param {function} override - Override function that wraps the original
 * @return {function} - The original function for reference
 */
function hijack(object, funcName, override) {
    var original = object[funcName];
    object[funcName] = override(original);
    return original;
}

// Variable to store positions
const positions = [];
