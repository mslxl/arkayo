import TaskRunner from './i'
import * as capture from '../capture'
import * as ocr from '../ocr'
import * as logger from '../logger'
import * as core from '../core'
import * as colorHelper from '../color'
import BackToMain from './back-to-main'
export default class HarvestBase extends TaskRunner {
  getName(): string {
    return "Harvest Base"
  }
  start(): void {
    if (!this.enterBase()) {
      return
    }
    this.harvest()
    this.back()
  }
  harvest(): boolean {
    capture.refresh()

    // 点右边的通知按钮
    let pos = colorHelper.opencvDetectColorLocation(capture.shot(), [215.0, 160.0, 40.0], [222.0, 170.0, 47.0])
    if (pos.length < 1) {
      return false
    }

    let p = pos[0]
    let width = Math.max(device.width,device.height)
    for (const item of pos) { // 保证找到的蓝色在屏幕右边
      if(item.x > width/2){
        p = item
        break
      }
    }
    core.clickRect(p)
    core.wait(5)


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
      w: p.w - 20,
      h: p.w - 20
    })
    core.wait(20)
    return true
  }

  back() {
    new BackToMain().start()
  }
}