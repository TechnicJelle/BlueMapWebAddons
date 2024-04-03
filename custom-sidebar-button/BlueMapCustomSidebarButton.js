const buttonTemplate = document.createElement("template");
buttonTemplate.innerHTML = `
<a style="text-decoration: none" href="https://bluemap.bluecolored.de/">
    <div class="simple-button">
        <div class="label">Visit BlueMap Website</div>
    </div>
</a>
`.trim();
const button = buttonTemplate.content.firstChild;

setInterval(() => {
	const buttonList = document.querySelector(".side-menu .content")?.children.item(0);
	if (buttonList && Array.from(buttonList.children).every(el => el.tagName === "HR" || el.className === "simple-button")) {
		buttonList.appendChild(button);
	}
}, 10);
