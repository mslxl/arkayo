import TaskRunner from '../i'
import * as capture from '../../capture'
import * as ocr from '../../ocr'
import * as core from '../../core'
import * as logger from '../../logger'
import * as colorHelper from '../../color'
import * as flow from 'debug-flow'

import BackToMain from '../internal/back-to-main'

export default class CustomBattle extends TaskRunner {
  getName(): string {
    return "自定义作战"
  }
  start(): void {

    core.wait(5)
    let unrecognizedTimes = 0
    outter:
    while (true) {
      core.wait(10)
      capture.refresh()
      let texts = ocr.wrapResult(ocr.detect(capture.shot()))

      let t = ocr.findText('开始行动', texts)
      if (t) {
        logger.v('Prepare battle!')
        core.clickRect(t)
        continue
      }

      t = ocr.findAnyText(['开始', '行动'], texts)
      if (t) {
        if (!this.checkAutoDeploy()) {
          continue outter
        }
        logger.v('Battle start!')
        core.clickRect(t)
        continue
      }

      t = ocr.findAnyText(['正在提交', '反馈神经', 'Loading'], texts)
      if (t) {
        logger.v('Wait...')
        core.wait(5)
        continue
      }

      t = ocr.findAnyText(['接管作战', '代理指挥作战正常'], texts)
      if (t) {
        logger.i('War, war, never change')
        core.wait(20)
        continue
      }

      t = ocr.findAnyText(['使用至纯源石恢复', '使用药剂恢复', '是否花费以上'], texts)
      if (t) {
        back()
        this.back()
        return
      }


      t = ocr.findAnyText(['行动结束', '全员信赖', '常规掉落', '剩余防御点', '作战简报', '速度耗时', '龙门币奖励'], texts)
      if (t) {
        logger.i('The battlefield is a place of tragedy. I hope they come to understand this one day.')
        core.clickXY(random(1, device.height), random(1, device.width))
        continue
      }



      unrecognizedTimes++
      toastLog(`Unrecognized scene: ${unrecognizedTimes}/20, wait 20s`)
      if (unrecognizedTimes > 20) {
        this.back()
        return
      }
      core.wait(20)

    }


  }
  checkAutoDeploy(): boolean {

    function goAndEnable() {
      back()
      capture.refresh()
      let ts = ocr.wrapResult(ocr.detect(capture.shot()))
      for (const t of ts) {
        if (t.t.indexOf('代理指挥') != -1) {
          core.clickRect(t)
          break
        }
      }
      core.wait(5)
    }


    logger.i('Dectet whether auto deploy was enabled...')

    capture.refresh()
    let ts = ocr.wrapResult(ocr.detect(capture.shot()))
    for (const t of ts) {
      if (t.t.indexOf('本次行动配置') != -1 || t.t.indexOf('不可更改') != -1) {
        return true
      }
    }
    goAndEnable()
    return false
  }


  back() {
    new BackToMain().start()
  }
}