import * as logger from './logger'
import * as debug from 'debug-flow'


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
  logger.v('Detect text by hraps ocr...')
  let bitmap = (img as any).getBitmap()
  let res: OcrResult[] = ocr.detect(bitmap, mul)
  let v = JSON.stringify(res)
  debug.debugBlock(() => {
    logger.trace(v)
  })

  return JSON.parse(v)
}

export function wrapResult(res: OcrResult[]): WrapResult[] {
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

export function detectAndWrap(img:Image,mul:number=1):WrapResult[] {
  return wrapResult(detect(img,mul))
}

export function findAnyText(text: string[], metaData: WrapResult[]): WrapResult | null {
  let lines = metaData 
  for (const item of lines) {
    for (const t of text) {
      if (item.t.indexOf(t) != -1) {
        logger.v(`Recoginzed ${JSON.stringify(item)}`)
        return item
      }
    }
  }
  return null
}

export function findText(text: string, metaData: WrapResult[]): WrapResult | null {
  return findAnyText([text], metaData)
}

interface OcrResult {
  text: string
  frame: number[]
  angleType: number
  dbnetScore: number
  angleScore: number
  crnnScore: number[]
}

export interface WrapResult {
  t: string
  x: number
  y: number
  w: number
  h: number
}