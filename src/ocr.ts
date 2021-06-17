import * as logger from './logger'
function installPlugin() {
  app.openUrl('https://wws.lanzoux.com/iduulmofune')
  do {
    toastLog('Please install hraps OCR first! (Password: habv)')
    sleep(1500)
  } while (app.getAppName('com.hraps.ocr') == null)
}
let ocr: any = null
function initOCR() {
  if (ocr == null) {
    logger.i('Init ocr')
    if (app.getAppName('com.hraps.ocr') == null) {
      threads.start(() => {
        installPlugin()
      })
      throw new Error("Did not install com.hraps.ocr");
    }
    logger.i('Load com.hraps.ocr')
    ocr = $plugins.load("com.hraps.ocr")
    $debug.gc()
  }
}

export function detect(img: Image, mul: number = 1): OcrResult[] {
  initOCR()
  logger.i('Detect text by hraps ocr...')
  let bitmap = (img as any).getBitmap()
  let res: OcrResult[] = ocr.detect(bitmap, mul)
  let v = JSON.stringify(res)
  logger.v(v)
  bitmap.recycle()
  return JSON.parse(v)
}

export function wrapResult(res: OcrResult[]): { t: string, x: number, y: number, w: number, h: number }[] {
  return res.map(v => {
    return {
      t: v.text,
      x: v.frame[0],
      y: v.frame[1],
      w: v.frame[2] - v.frame[0],
      h: v.frame[7] - v.frame[1]
    }
  })
}

interface OcrResult {
  text: string
  frame: number[]
  angleType: number
  dbnetScore: number
  angleScore: number
  crnnScore: number[]
}