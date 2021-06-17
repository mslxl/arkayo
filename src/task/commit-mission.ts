import TaskRunner from './i'
import * as capture from '../capture'
import * as ocr from '../ocr'
import * as logger from '../logger'
import * as core from '../core'
import * as colorHelper from '../color'
export default class CommitMission extends TaskRunner {
  start(): void {
    capture.refresh()
    // Detect mission clue
    let pos = colorHelper.findColorsWithCache('BlueBlockWhichIsTheSymbolOfMissionWereComplete',capture.shot(), "#ea4b06", [[45, 2, "#e76129"], [77, -13, "#e76129"], [108, 7, "#e76129"], [109, 42, "#e76129"], [76, 56, "#e76129"], [43, 37, "#e7622b"], [75, 50, "#dad9d9"], [77, 45, "#e76129"], [77, 2, "#e76129"]])

    if (pos) {
      core.clickXY(pos.x, pos.y + 20)
      core.wait(10)
      this.commit()
    }
    $debug.gc()
  }
  commit(): void {
    let retryTimes = 0
    while (true) {
      capture.refresh()
      let pos = colorHelper.findMultiColors(capture.shot(), "#ffffff", [[37, 6, "#ff6801"], [44, 1, "#ff6801"], [42, 13, "#ff6801"], [47, 6, "#ff6801"]])
      if (pos) {
        core.clickXY(pos.x, pos.y + 30)
        retryTimes = 0
      } else {
        retryTimes++
        logger.v('Did not find any new completed mission, retry...')
        if (retryTimes > 10) {
          logger.v('It seems like all missions are completed.')
          this.back()
          return
        }
        continue
      }
      capture.refresh()
      let text = ocr.wrapResult(ocr.detect(capture.shot()))
      for (const elem of text) {
        if (elem.t == "点击领取") {
          core.clickXY(elem.x, elem.y)
          break
        }
      }
      core.wait(5)
      this.checkObtain()
    }
  }
  back():void{
    capture.refresh()
    let pos = colorHelper.findMultiColorsWithCache('BackButtonInToolbar',capture.shot(),"#ffffff",[[-20,22,"#fbfbfb"],[0,45,"#f6f5f6"],[4,18,"#313031"]])
    if(pos){
      core.clickPos(pos)
    }
  }
  checkObtain(): void {
    capture.refresh()
    logger.v('Check resource obtaining...')
    let img = capture.shot()
    let text = ocr.wrapResult(ocr.detect(img))
    for (const elem of text) {
      if (elem.t == "获得物资") {
        let pos = colorHelper.findMultiColorsWithCache('YesButtonToAcquireRes',img,"#2b2929",[[-17,7,"#838270"],[0,22,"#a6a496"],[23,-5,"#8b8877"]])
        if(pos){
          core.clickPos(pos)
        }else{
          core.clickXY(elem.x, elem.y)
        }
        core.wait(5)
        break
      }
    }
  }

}