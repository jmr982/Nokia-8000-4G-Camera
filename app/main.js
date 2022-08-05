document.addEventListener("keypress", keypressed);

function keypressed(event) {
	const menu = document.getElementById("menu");

	if (event.key == "SoftLeft") { onToggleMenu(menu); }

	if (menu.style.display == "block") { //Scroll menu and set value
		let item = menuItems[localStorage.getItem("menuKey")];
		switch (event.key) {
			case "ArrowRight":
				setLocalStorageValue("menuKey");
				break;
			case "ArrowLeft":
				setLocalStorageValue("menuKey", "subtract");
				break;
			case "ArrowDown":
				setLocalStorageValue(item);
				break;
			case "ArrowUp":
				setLocalStorageValue(item, "subtract");
				break;
		}
		applySetting(item); //Update cameraControl with new setting. applySetting lcated in setup.js
		updateMenu(); //Draw updateted values to screen
	} else {
		switch (event.key) {
			case "Enter": //Take photo
				onTakePhoto();
				break;
			case "Backspace": //Close camera (this might not work?)
				cameraControl.release();
				window.close();
				break;
			case "ArrowRight": //Set exposure +
				cameraControl.exposureCompensation += cameraControl.capabilities.exposureCompensationStep;
				break;
			case "ArrowLeft": //Set exposure -
				cameraControl.exposureCompensation -= cameraControl.capabilities.exposureCompensationStep;
				break;
		}
		document.getElementById("exposure").textContent = cameraControl.exposureCompensation.toFixed(2);
	}
}

function onToggleMenu(menu) {
	if (menu.style.display != "block") {
		menu.style.display = "block"; //Show menu
		document.getElementById("settings").textContent = "Close" //Change button text
	} else if (menu.style.display == "block") {
		menu.style.display = "none"; //Hide menu
		document.getElementById("settings").textContent = "Settings"
	}
}

function setLocalStorageValue(item, direction) {
	let length = item == "menuKey" ? menuItems.length : cameraControl.capabilities[menuItems[localStorage.getItem("menuKey")]].length;
	let index = parseInt(localStorage.getItem(item));
	index = direction == "subtract" ? (index > 0 ? index - 1 : (length - 1)) : (index < (length - 1) ? (index + 1) : 0);
	localStorage.setItem(item, index);
}

function updateMenu() { //Update menu using localStorage and cameraControl values
	let item = menuItems[localStorage.getItem("menuKey")];
	let value = cameraControl.capabilities[item][localStorage.getItem(item)];
	item = item.replace(/Modes|[A-Z]/g, (r) => { return r == "Modes" ? "" : " " + r; }).toUpperCase(); //Format text
	document.getElementById("key").textContent = `${item}`;
	document.getElementById("value").textContent = `${value}`;
}

function onTakePhoto() {
	let photoOptions = {
		pictureSize: cameraControl.capabilities.pictureSizes[0], //For Nokia 8000 sets size to 1200 * 1600
		fileFormat: cameraControl.capabilities.fileFormats[0] //Sets format to jpeg
	}
	cameraControl.takePicture(photoOptions).then(onPhotoTaken, onError); //onError located in setup.js
}

function onPhotoTaken(blob) { //Saves the photo to storage device
	let location = "others";
	let timeStamp = Date.now().toString();
	storage.addNamed(blob, `${location}/${timeStamp}.jpg`);
	cameraControl.resumePreview();
}
