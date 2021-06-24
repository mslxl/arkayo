import TaskRunner from './i'
import * as capture from '../capture'
import * as ocr from '../ocr'
import * as core from '../core'
import Back from './back-to-main'
import * as colorHelper from '../color'

export default class EnterLongmen extends TaskRunner {
    getName(): string {
        return "Internal[EnterLast]"
    }
    start(): void {

        capture.setAutoCapture(true)

        let t = ocr.findAnyText(['终端', '理智'], ocr.wrapResult(ocr.detect(capture.shot())))
        if (!t) {
            new Back().start()
            return
        }
        core.clickRect(t)
        core.wait(10)

        t = ocr.findAnyText(['每周报酬'], ocr.wrapResult(ocr.detect(capture.shot())))
        if (!t) {
            new Back().start()
            return
        }
        core.clickRect(t)
        core.wait(10)

        back()
        core.wait(2)
        t = ocr.findAnyText(['切换', 'LOCAT','切牧'], ocr.wrapResult(ocr.detect(capture.shot())))
        if (!t) {
            let width = Math.max(device.width, device.height)
            let height = Math.min(device.width, device.height)
            core.clickRect({
                x: width - 20,
                y: height - 20,
                w: 15,
                h: 15
            })
        } else {
            core.clickRect(t)
        }
        core.wait(10)

        t = ocr.findAnyText(['龙门外环'], ocr.wrapResult(ocr.detect(capture.shot())))
        if (!t) {
            new Back().start()
            return
        }
        core.clickRect(t)
        
    }
}