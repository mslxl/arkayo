import TaskRunner from './i'
import * as capture from '../capture'
import * as ocr from '../ocr'
import * as core from '../core'
import * as colorHelper from '../color'

export default class ExitGame extends TaskRunner {
  getName(): string {
    return "Internal[ExitGame]"
  }
  start(): void {
    while(true){
        capture.refresh()
        let text = ocr.wrapResult(ocr.detect(capture.shot())).map(t=>t.t).reduce((pre,acc)=>pre+acc)
        if(text.indexOf('退出')!=-1){

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
            core.wait(5)
            return
        }else{
            back()
            core.wait(2)
        }
    }
    

  }
}