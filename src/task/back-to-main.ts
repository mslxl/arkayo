import TaskRunner from './i'


import * as capture from '../capture'
import * as ocr from '../ocr'
import * as core from '../core'
import * as logger from '../logger'
import * as colorHelper from '../color'
export default class BackToMain extends TaskRunner {
    getName(): string {
        return "Internal[BackToMain]"
    }
    start(): void {
        logger.i('Back to main page')
        while (true) {
            capture.refresh()
            let text = ocr.wrapResult(ocr.detect(capture.shot())).map(v => v.t).reduce((pre, acc) => pre + acc)
            if (text.indexOf('采购中心') != -1 || text.indexOf('档案') != -1 || text.indexOf('公开招募') != -1|| text.indexOf('理智') != -1) {
                return
            } else if (text.indexOf('是否') != -1) {
                if (text.indexOf('退出游戏') != -1) {
                    back()
                    return
                }
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
            back()
            $debug.gc()
            core.wait(5)
        }
    }

}