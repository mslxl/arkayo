let isPermit = false
let isAutoCapture = false
let img:Image

export function requestPermission() {
  if (!isPermit) {
    if (!requestScreenCapture()) {
      toastLog("Request Screen Capture failed");
    } else {
      isPermit = true
    }
  }
}

export function setAutoCapture(enable:boolean) {
  isAutoCapture = enable
}

export function shot() {
  if (img == null || isAutoCapture) {
    refresh(false)
  }
  return img
}
/**
 * 
 * @param {bool} cvt Convert img into gray
 */
 export function refresh(cvt:boolean) {
  if (img != null) {
    img.recycle()
  }
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
}
