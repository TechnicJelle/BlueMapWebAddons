// Disable the Click-To-Go-To-Player feature
document.body.addEventListener("click", function () {
	setTimeout(disableClicking, 50); // Needs slight delay to work properly
});

function disableClicking() {
	const playerButtons = document.querySelectorAll(".marker-item:has(> .follow-player-button) .marker-button");
	if (!playerButtons) return;

	for (let playerButton of playerButtons) {
		//Apparently this is how you remove all event listeners from an element???
		playerButton.replaceWith(playerButton.cloneNode(true));
	}
}
