import TaskRunner from './i'
import * as capture from '../capture'
import * as ocr from '../ocr'
import * as logger from '../logger'
import * as core from '../core'
import * as colorHelper from '../color'
export default class HarvestBase extends TaskRunner {
  start(): void {
    if (!this.enterBase()) {
      return
    }
    this.harvest()
    this.back()
  }
  harvest(): boolean {
    capture.refresh()
    let pos = colorHelper.opencvDetectColorLocation(capture.shot(), [215.0, 160.0, 40.0], [222.0, 170.0, 47.0])
    if (pos.length < 1) {
      return false
    }

    let p = pos[0]
    core.clickRect(p)
    core.wait(2)

    outter:
    while (true) {
      capture.refresh()
      let texts = ocr.wrapResult(ocr.detect(capture.shot()))

      for (const t of texts) {
        if (t.t.indexOf('交付') != -1 || t.t.indexOf('订单') != -1 || t.t.indexOf('收获') != -1 || t.t.indexOf('信赖') != -1 || t.t.indexOf('收取') != -1) {
          core.clickRect(t)
          core.wait(10)
          continue outter
        }
      }

      break
    }
    return true
  }

  enterBase(): boolean {
    capture.refresh()
    let cp = capture.shot()
    let pos = colorHelper.opencvDetectColorLocation(cp, [180.0, 130.0, 5.0], [190.0, 135.0, 15.0])
    cp.recycle()
    if (pos.length < 1) {
      return false
    }

    let p = pos[0]
    core.clickRect({
      x: p.x - 50,
      y: p.y + 50,
      w: p.w,
      h: p.w
    })
    core.wait(20)
    return true
  }

  back() {
    back()
    core.wait(2)
    capture.refresh()
    let text = ocr.wrapResult(ocr.detect(capture.shot())).map(t => t.t).reduce((pre, acc) => pre + acc)
    if (text.indexOf('是否确认') != -1) {
      capture.refresh()
      let cap = capture.shot()
      let maxX = Number.MIN_VALUE, minX = Number.MAX_VALUE, maxY = Number.MIN_VALUE, minY = Number.MAX_VALUE
      colorHelper.opencvDetectColorLocation(cap, [20.0, 20.0, 100.0], [50.0, 50.0, 130.0]).forEach((elem) => {
        if (elem.centreX < minX) {
          minX = elem.centreX
        } else if (elem.centreX > maxX) {
          maxX = elem.centreX
        }
        if (elem.centreY < minY) {
          minY = elem.centreY
        } else if (elem.centreY > maxY) {
          maxY = elem.centreY
        }
      })
      core.clickXY(random(minX + 10, maxX - 10), random(minY + 10, maxY - 10))
      cap.recycle()
      core.wait(10)
    }
  }
}