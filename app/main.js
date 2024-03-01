// The camera 'main' loop.
document.addEventListener('keypress', main);

/*
  This function performs an action based on the key pressed. Accepts as an 
  argument the keypress event. It applies changes to the camera settings, 
  updates the view, takes the photo, and exits the program. The 'SoftLeft' 
  button opens and closes the menu. 'Enter' takes the photo. The 'Arrow' keys 
  are used for setting the exposure, navigating the menu, and changing camera 
  settings. Functionality depends on whether the menu is visible or not. 
*/
function main (event) {
  let menuOpen = menu.style.display == 'block';
  let menuItem = menuItems[menuIndex];
	
  switch (event.key) {
    case 'SoftLeft':
      menuOpen = toggleMenu();
      break;
    case 'Enter': 
      takePhoto();
      break;
    case 'Backspace': 
      cameraControl.release();
      window.close();
      break;
    case 'ArrowRight': 
			menuOpen ? 
      menuIndex = incrementIndex(menuIndex, menuItems.length) : 
      cameraControl.exposureCompensation += 
      cameraControl.capabilities.exposureCompensationStep;
      break;
    case 'ArrowLeft':  
      menuOpen ?
      menuIndex = decrementIndex(menuIndex, menuItems.length) :
      cameraControl.exposureCompensation -= 
      cameraControl.capabilities.exposureCompensationStep;
      break;
    case 'ArrowDown':
      if (menuOpen) { 
        let index = incrementIndex(
          localStorage.getItem(menuItem), 
          cameraControl.capabilities[menuItem].length
        );
        localStorage.setItem(menuItem, index);
      }
      break;
		case 'ArrowUp':
      if (menuOpen) { 
        let index = decrementIndex(
          localStorage.getItem(menuItem), 
          cameraControl.capabilities[menuItem].length
        );
        localStorage.setItem(menuItem, index);
      }
      break;
		}
	
  if (menuOpen) {
    applySetting(menuItem);
    updateMenu();
  } else {
    exposure.textContent = cameraControl.exposureCompensation.toFixed(2);
  }
}