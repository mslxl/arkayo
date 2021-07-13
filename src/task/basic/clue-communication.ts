import TaskRunner from '../i'
import * as capture from '../../capture'
import * as ocr from '../../ocr'
import * as logger from '../../logger'
import * as core from '../../core'
import * as colorHelper from '../../color'
import BackToMain from '../internal/back-to-main'

function clickText(text: string[]): boolean {
    capture.refresh()
    let rect = null
    let time = 0
    do {
        time++
        if (time > 10) {
            return false
        }
        rect = ocr.findAnyText(text, ocr.wrapResult(ocr.detect(capture.shot())))
        core.wait(5)
    } while (!rect)
    core.clickRect(rect)
    return true
}

export default class ClueCommunication extends TaskRunner {
    getName(): string {
        return "线索交流"
    }
    getDesc(): string {
        return [
            "在主界面运行此任务",
            "该任务仅会拜访所有启动了线索交流的好友基建，任务结束后返回主界面"
        ].reduce((pre: string, acc: string) => `${pre}。\n${acc}`)
    }
    start(): void {
        if (!clickText(['好友', '好反', '好仗', '合库', '合雕'])) {
            return
        }
        core.wait(10)
        if (!clickText(['列表'])) {
            return
        }
        core.wait(20)

        capture.refresh()
        let rect = ocr.findText('访问', ocr.wrapResult(ocr.detect(capture.shot())))
        if (!rect) {
            return
        }
        core.clickPos(rect)

        core.wait(10)

        while (this.checkHasNext()) {
            clickText(['访问下位'])
            core.wait(10)
        }

        this.back()
    }

    checkHasNext(): boolean {
        capture.refresh()
        let screenHeight = Math.min(device.height, device.width)
        let pos = colorHelper.opencvDetectColorLocation(capture.shot(), [7.0, 88.0, 205.0], [17.0, 95.0, 215.0]).filter(e => e.y > screenHeight / 2)
        return pos.length > 0
    }

    back() {
        new BackToMain().start()
    }
}