import { hideConsole, showConsole } from './logger'
let isPermit = false
let isAutoCapture = false
let img: any

export function requestPermission() {
  if (!isPermit) {
    if (!requestScreenCapture(true)) {
      toastLog("Request Screen Capture failed");
    } else {
      isPermit = true
    }
  }
}

export function setAutoCapture(enable: boolean) {
  isAutoCapture = enable
}

export function shot():Image {
  if (img === null || isAutoCapture || img.isRecycled()) {
    refresh(false)
  }
  return img
}
/**
 * 
 * @param {bool} cvt Convert img into gray
 */
export function refresh(cvt: boolean = false) {
  // If screen not changed, the same img will be returned.
  // So do not recycle it.
  // if (img != null) {
  //   try {
  //     img.recycle()
  //   } catch (e) {

  //   }
  // }
  hideConsole(true)
  if (cvt) {
    let screenShot = captureScreen()
    let gray = images.grayscale(screenShot)
    let argb = images.cvtColor(gray, "GRAY2BGRA")
    screenShot.recycle()
    gray.recycle()
    img = argb
  } else {
    img = captureScreen()
  }
  showConsole()
}
