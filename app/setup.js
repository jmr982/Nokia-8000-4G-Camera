// Assign video preview.
const cameraPreviewStream = document.getElementById('camera-preview-stream');

// Assign settings and exposure elements.
const settings = document.getElementById('settings');
const exposure = document.getElementById('exposure');

// Assign menu elements. 
const menu = document.getElementById('menu');
const menuKey = document.getElementById('key');
const menuValue = document.getElementById('value');

const menuItems = [
  'effects', 
  'flashModes', 
  'isoModes', 
  'meteringModes', 
  'sceneModes', 
  'whiteBalanceModes'
];

// Variable used to navigate the settings menu and select items from menuItems. 
let menuIndex = 0;

// Set the storage device to default storage and directory to others.
const storage = navigator.getDeviceStorage('sdcard'); 
const storageDir = 'others';

let cameraControl = null;

// Set the backcamera as the camera (Nokia 8000).
const camera = navigator.mozCameras.getListOfCameras()[0];

/* 
  Initialize the camera and perform setup. Accepts as function arguments setup 
  and error.
*/
navigator.mozCameras.getCamera(camera).then(setup, error);

/*
  This function initializes the camera and performs setup. Accepts as an 
  argument the camera object. Reads stored settings from localStorage and 
  applies them. If no settings are available (first launch), sets (setItem) 
  the values to 0. 
*/
function setup(cameraObj) {
  cameraControl = cameraObj.camera; 
  cameraPreviewStream.srcObject = cameraControl;
  // Set picture quality to best quality.
  cameraControl.pictureQuality = 1;
  cameraControl.setMeteringAreas([null]);

  for (let item of menuItems) {
    if (!localStorage.getItem(item)) { localStorage.setItem(item, 0); }
    applySetting(item);
  }	
  
  setCameraPreviewRotation();
}
