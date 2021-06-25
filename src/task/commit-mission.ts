import TaskRunner from './i'
import * as capture from '../capture'
import * as ocr from '../ocr'
import * as logger from '../logger'
import * as core from '../core'
import * as colorHelper from '../color'
export default class CommitMission extends TaskRunner {
  getName(): string {
    return "提交任务"
  }
  start(): void {
    capture.refresh()
    // Detect mission clue
    // 利用 opencv 二值化后匹配 6 边形
    let inranged = colorHelper.opencvInRange(capture.shot(), [35.0, 90.0, 220.0], [45.0, 100.0, 240.0])
    let pos = colorHelper.opencvDetectPolyLocation(inranged, 6, 0)
    inranged.recycle()

    if (pos.length == 1) {
      core.clickXY(pos[0].x, pos[0].y + 20)
      core.wait(10)
      this.commit()
    }
    $debug.gc()
  }

  commit(): void {
    let retryTimes = 0
    outter:
    while (true) {

      capture.refresh()
      let elem = ocr.findText("点击领取", ocr.wrapResult(ocr.detect(capture.shot())))

      if (elem) {
        core.clickXY(elem.x, elem.y)
        continue outter
      }


      if (this.checkObtain()) {
        continue outter
      }


      capture.refresh()
      // 利用 opencv 二值化后匹配 4 边形 mode= Imgproc.RETR_LIST = 1
      let inranged = colorHelper.opencvInRange(capture.shot(), [0.0, 100.0, 210.0], [20.0, 105.0, 255.0])
      let pos = colorHelper.opencvDetectPolyLocation(inranged, 4, 1)
      inranged.recycle()

      if (pos.length > 0) {
        core.clickXY(pos[0].x - random(0, 30), pos[0].y + random(20, 30))
        retryTimes = 0
      } else {
        retryTimes++
        logger.v(`Did not find any new completed mission, retry... ${retryTimes}/5`)
        if (retryTimes > 5) {
          logger.v('It seems like all missions are completed.')
          back()
          return
        }
        continue outter
      }



    }
  }

  checkObtain(): boolean {
    capture.refresh()
    logger.v('Check resource obtaining...')
    let img = capture.shot()
    let text = ocr.wrapResult(ocr.detect(img))
    for (const elem of text) {
      if (elem.t == "获得物资") {
        let pos = images.findMultiColors(img, "#2b2929", [[-17, 7, "#838270"], [0, 22, "#a6a496"], [23, -5, "#8b8877"]])
        if (pos) {
          core.clickPos(pos)
        } else {
          core.clickXY(elem.x, elem.y)
        }
        core.wait(5)
        return true
      }
    }
    return false
  }

}