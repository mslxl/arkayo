import TaskRunner from './i'
import * as capture from '../capture'
import * as ocr from '../ocr'
import * as core from '../core'
export default class CustomBattle extends TaskRunner {
  start(): void {
    while (this.enterBattle()) {

    }
  }
  enterBattle(): boolean {
    let fin = false
    capture.refresh()
    let texts = ocr.wrapResult(ocr.detect(capture.shot()))
    for (const t of texts) {
      if (t.t == '开始行动') {
        core.clickPos(t)
        break
      }
    }
    return fin
  }

}