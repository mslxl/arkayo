import TaskRunner from './i'
import * as capture from '../capture'
import * as ocr from '../ocr'
import * as core from '../core'
import * as colorHelper from '../color'

export default class EnterLast extends TaskRunner {
    start(): void {
        while (true) {
            capture.refresh()
            let ts = ocr.wrapResult(ocr.detect(capture.shot()))
            for (const t of ts) {
                if (t.t.indexOf('终端') != -1 || t.t.indexOf('当前') != -1 || t.t.indexOf('前往上一次') != -1 || t.t.indexOf('上一次作战') != -1) {
                    core.clickRect(t)
                    break
                } else if (t.t.indexOf('开始行动') != -1 || t.t.indexOf('开始') != -1 || t.t.indexOf('行动') != -1) {
                    return
                }
            }
            core.wait(10)
        }
    }
}