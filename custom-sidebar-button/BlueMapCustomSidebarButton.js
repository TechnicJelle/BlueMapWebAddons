const buttons = [];
// <-- Do not edit before here ---


createButton("https://bluemap.bluecolored.de/", "Visit BlueMap Website");
createButton("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "Mischievous Button", true);


// --- Do not edit from here on -->

function createButton(link, text, newTab = false) {
	const buttonTemplate = document.createElement("template");
	buttonTemplate.innerHTML = `
	<a style="text-decoration: none" href="${link}" ${newTab ? 'target="_blank"' : ""}>
		<div class="simple-button">
			<div class="label">${text}</div>
		</div>
	</a>
	`.trim();
	const button = buttonTemplate.content.firstChild;
	buttons.push(button);
}

// Periodically check if the sidebar is open
setInterval(() => {
	const buttonList = document.querySelector(".side-menu .content")?.children.item(0);
	if (!buttonList) return; // Sidebar is not open

	// Check if the buttons are already in the sidebar
	if (Array.from(buttonList.children).every(el => el.tagName === "HR" || el.className === "simple-button")) {
		buttonList.append(...buttons);
	}
}, 10);
