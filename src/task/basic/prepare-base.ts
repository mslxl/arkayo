import TaskRunner from '../i'
import * as capture from '../../capture'
import * as ocr from '../../ocr'
import * as logger from '../../logger'
import * as core from '../../core'
import * as colorHelper from '../../color'
import BackToMain from '../internal/back-to-main'
import HarvestBase from './harvest-base'
export default class PrepareBase extends TaskRunner {
    getName(): string {
        return "补充基建制造站的源石碎片"//"Prepare Base"
    }
    start(): void {
        capture.refresh()
        let meta = ocr.detectAndWrap(capture.shot())
        let t = ocr.findText('基建', meta)!!
        core.clickRect(t)
        core.wait(10)

        if (new HarvestBase().harvest()) {
            // 真有收货
            capture.refresh()
            let meta = ocr.detectAndWrap(capture.shot())
            let t = ocr.findText('待办事项', meta) // 通过点击标签返回上一极
            if (t) {
                core.clickRect(t)
                core.wait(5)
            }
        }

        this.clearDomo()
        core.wait(5)
        capture.setAutoCapture(true)
        this.checkMal()
        core.wait(5)
        this.checkDock()
        new BackToMain().start()

    }

    checkMal() {

        let height = Math.min(device.width, device.height)
        let width = Math.max(device.width, device.height)
        // 先随便进个制造站
        let t = ocr.findText('制造站', ocr.detectAndWrap(capture.shot()))!!
        core.clickRect(t)
        core.wait(5)
        core.clickRect(ocr.findAnyText(['制造中', '空闲中', '已停'], ocr.detectAndWrap(capture.shot()))!!)
        core.wait(10)


        function prepare():boolean {
            let meta = ocr.detectAndWrap(capture.shot())
            let t = ocr.findAnyText(['石碎片','固源岩'], meta)
            if (t) {
                core.clickRect(ocr.findText('最多', ocr.detectAndWrap(capture.shot()))!!)
                core.wait(2)

                let pos = ocr.findText('执行更改', ocr.detectAndWrap(capture.shot()))!!
                if (pos) {
                    core.clickXY(pos.x + pos.w + 5, pos.y + 2 * pos.h)
                    core.wait(10)
                }
                return true
            }
            core.wait(10)
            return false
        }

        let meta = ocr.detectAndWrap(capture.shot())
        t = ocr.findText('设施列表', meta)!!
        let currentRoom = ocr.findText('制造站', meta)!!.t
        if(prepare()){
            return
        }
        for (let index = t.h + t.y; index < height; index += 30) {
            core.clickXY(t.x + random(0, t.w), index)
            meta = ocr.detectAndWrap(capture.shot())
            let room = ocr.findText('设施列表', meta)!!.t
            if (room != currentRoom) {
                if(prepare()){
                    return
                }
                currentRoom = room
            }
        }
    }
    checkDock() {

    }

    clearDomo() {


    }

}