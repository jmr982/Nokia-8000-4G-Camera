// Default error function. console.warn used for development.
function error(error) {
  console.warn(error);
}

/*
  Helper function used with setup and main. Accepts as an input the name of 
  the item whose value is applied to the camera. Reads the value from 
  localStorage. 
*/
function applySetting(item) {
	let setting = item.slice(0, item.length - 1);
	cameraControl[setting] = 
    cameraControl.capabilities[item][localStorage.getItem(item)];
}

/*
  This function was added as a fix for the 'flipped screen' issue. The 
  function overrides the value set for the video element transform in 
  style.css. 
*/
function setCameraPreviewRotation() {
  let angle = cameraControl.sensorAngle + 'deg'; 
  cameraPreviewStream.style.transform = `rotate(${angle})`;
}

/*
  This function toggles the menu on or off. Changes the text displayed for the 
  'SoftLeft' button. Retruns true if the settings menu is visible after toggle 
  and false if it is hidden.
*/
function toggleMenu() {
  if (menu.style.display != 'block') {
    menu.style.display = 'block'; 
    settings.textContent = 'Close';
  } else if (menu.style.display == 'block') {
    menu.style.display = 'none'; 
    settings.textContent = 'Settings';
  }
  return menu.style.display == 'block';
}

/*
  This function takes the photo. Sets the image size to 1200px * 1600px and 
  format to jpeg. Pauses the preview on execution. 
*/
function takePhoto() {
  let photoOptions = {
    pictureSize: cameraControl.capabilities.pictureSizes[0], 
    fileFormat: cameraControl.capabilities.fileFormats[0] 
  }
  cameraControl.takePicture(photoOptions).then(savePhoto, error);
}

/*
  Callback function used with takePhoto. Accepts as an argument the image 
  blob. Saves the file to storage with a default name (current timestamp) and 
  then resumes camera preview. 
*/
function savePhoto(blob) { 
  let timeStamp = Date.now().toString();
  storage.addNamed(blob, `${storageDir}/${timeStamp}.jpg`);
  cameraControl.resumePreview();
}

function incrementIndex(index, length) {
  index = parseInt(index);
  length = parseInt(length);
  return index < length - 1 ? index + 1 : 0;
}

function decrementIndex(index, length) {
  index = parseInt(index);
  length = parseInt(length);
  return index > 0 ? index - 1 : length - 1;
}

/*
  This function updates the settings menu with values from menuItems and 
  cameraControl. Removes (replaces) 'Modes' from the menu item text and 
  converts it to upper case.  
*/
function updateMenu() {
  let item = menuItems[menuIndex];
  let value = cameraControl.capabilities[item][localStorage.getItem(item)];
  item = item.replace(
		/Modes|[A-Z]/g, 
		(r) => { return r == 'Modes' ? '' : ' ' + r; }
		).toUpperCase();
  menuKey.textContent = `${item}`;
  menuValue.textContent = `${value}`;
}