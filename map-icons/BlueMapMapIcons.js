// Trigger an update to map icons
document.body.addEventListener("click", function () {
	setTimeout(updateMapButtons, 50);  // Needs slight delay to work properly
});

// Updating the map buttons
function updateMapButtons() {
	// Find map-buttons (if available)
	const mapButtons = document.querySelectorAll(".map-button");
	mapButtons?.forEach(button => {
		// Grab the "title" for the button
		let buttonTitle = button.getAttribute("title");

		// Grab the "display-name" to update the image alt-text
		let buttonName = button.querySelector("span.name").innerText;

		// Replace sky "•" with block image
		let buttonSkySpan = button.querySelector("span.sky");
		let buttonImg = `assets/${buttonTitle}.png`; // ← Change this to the path and filetype of your image
		let newImg = new Image();
		newImg.src = buttonImg;
		newImg.alt = buttonName;
		buttonSkySpan.innerText = "";  // Removes the "•"
		buttonSkySpan.appendChild(newImg);
	});
}
