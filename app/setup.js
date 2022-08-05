let cameraPreviewStream = document.getElementById("camera-preview-stream");
let camera = navigator.mozCameras.getListOfCameras()[0]; //Selects backcamera for Nokia 8000
let storage = navigator.getDeviceStorage("sdcard"); //Sets storage to default storage device
let cameraControl = null;

const menuItems = ["effects", "flashModes", "isoModes", "meteringModes", "sceneModes", "whiteBalanceModes"];

navigator.mozCameras.getCamera(camera).then(onSuccess, onError); //Initialize the camera and preview stream. 

function onSuccess(cameraObj) {
	cameraControl = cameraObj.camera;
	cameraPreviewStream.srcObject = cameraControl; //Set camera view
	cameraControl.pictureQuality = 1; //Set quality to max
	cameraControl.setMeteringAreas([null]);
	initializeCameraSettings();
}

function initializeCameraSettings() {
	if(!localStorage.getItem("menuKey")) { localStorage.setItem("menuKey", 0); }
	for (let item of menuItems) {
		if(!localStorage.getItem(item)) { localStorage.setItem(item, 0); }
		applySetting(item);
	}	
}

function applySetting(item) {
	let setting = item.slice(0, item.length - 1);
	cameraControl[setting] = cameraControl.capabilities[item][localStorage.getItem(item)]
}

function onError(error) { //Used as default error function
	console.warn(error);
}
