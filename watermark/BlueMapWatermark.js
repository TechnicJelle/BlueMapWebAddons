// JavaScript function to show the watermark
function showWatermark() {
	const anchor = document.createElement("a"); //create HTML <a>
	document.body.appendChild(anchor); //place it on the page
	anchor.href = "https://bluemap.bluecolored.de/"; //set the link

	const watermarkImage = document.createElement("img"); //create HTML <img>
	anchor.appendChild(watermarkImage); //place it inside the just created <a>
	watermarkImage.src = "assets/logo.png"; //set the image URL
	watermarkImage.id = 'watermarkImage'; //set the tag's ID, so the CSS style will apply to it
}

// Call the function to show the watermark
showWatermark();
