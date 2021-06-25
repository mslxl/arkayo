import TaskRunner from './i'
import * as capture from '../capture'
import * as ocr from '../ocr'
import * as core from '../core'
import Back from './back-to-main'
import * as colorHelper from '../color'

export default class Enter1T7 extends TaskRunner {
    getName(): string {
        return "Internal[Enter 1-7]"
    }
    start(): void {

        capture.setAutoCapture(true)

        let t = ocr.findAnyText(['终端'], ocr.wrapResult(ocr.detect(capture.shot())))
        if (!t) {
            new Back().start()
            return
        }
        core.clickRect(t)
        core.wait(10)


        let relElem = ocr.findText('终端', ocr.wrapResult(ocr.detect(capture.shot())))
        let Y = 0
        if (relElem) {
            Y = relElem.y + random(0, relElem.h)
        }

        let width = Math.max(device.width, device.height)
        let height = Math.max(device.width, device.height)
        let i = 0
        let step = width / 10
        while (!ocr.findText('主题曲', ocr.wrapResult(ocr.detect(capture.shot())))) {

            core.clickXY(i * step, Y)
            i++
            core.wait(2)
            if (i > 10) {
                new Back().start()
                return
            }
        }



        t = ocr.findAnyText(['觉醒', 'AWAKENING'], ocr.wrapResult(ocr.detect(capture.shot())))
        if (!t) {
            new Back().start()
            return
        }
        core.clickRect(t)
        core.wait(10)


        let maxX = Number.MIN_VALUE
        Y = 0
        let found = false
        while (!found) {
            let texts = ocr.wrapResult(ocr.detect(capture.shot()))


            for (const tt of texts) {
                if (tt.t.indexOf('黑暗时代') != -1) {
                    if (tt.x > maxX) {
                        maxX = tt.x
                        Y = tt.y
                    }
                    found = true
                }
            }
            swipe(width / 4 * 3, height / 2 + random(-20, 20), width - 20, height / 2 + random(-20, 20), 400)
            core.wait(2)
        }
        core.clickXY(maxX, Y)

        found = false
        while (!found) {
            let texts = ocr.wrapResult(ocr.detect(capture.shot()))
            let maxX = Number.MIN_VALUE
            let Y = 0
            for (const tt of texts) {
                if (tt.t.indexOf('1-7') != -1) {
                    core.clickRect(tt)
                    return
                }
            }
            swipe(width / 4 * 3, height / 2 + random(-20, 20), width - 20, height / 2 + random(-20, 20), 400)
            core.wait(2)
        }



    }
}