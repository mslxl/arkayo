import TaskRunner from './i'
import * as capture from '../capture'
import * as ocr from '../ocr'
import * as core from '../core'
import * as logger from '../logger'

function clickT(t: { x: number, y: number, w: number, h: number }) {
  core.clickXY(t.x + random(0, t.w), t.y + random(0, t.h))
}

export default class CustomBattle extends TaskRunner {
  start(): void {
    let unrecognizedTimes = 0
    while (true) {
      let recognized = false
      capture.refresh()
      let texts = ocr.wrapResult(ocr.detect(capture.shot()))
      for (const t of texts) {
        if (t.t.indexOf('开始行动') != -1 || t.t.indexOf('开始') != -1 || t.t.indexOf('行动') != -1) {
          logger.v('[CustomBattle] Start Battle!')
          clickT(t)
          recognized = true
        } else if (t.t.indexOf('正在提交') != -1 || t.t.indexOf('反馈神经') != -1 || t.t.indexOf('Loading') != -1) {
          logger.v('[CustomBattle] Wait...')
          core.wait(5)
          recognized = true
        } else if (t.t.indexOf('接管作战') != -1 || t.t.indexOf('代理指挥作战正常') != -1) {
          logger.v('[CustomBattle] War, war, never change')
          core.wait(20)
          recognized = true
        } else if (t.t.indexOf('使用至纯源石恢复') != -1 || t.t.indexOf('使用药剂恢复') != -1 || t.t.indexOf('是否花费以上') != -1) {
          back()
          logger.v('[CustomBattle] Task fin')
          return
        } else if (t.t.indexOf('行动结束') != -1 || t.t.indexOf('全员信赖') != -1
          || t.t.indexOf('常规掉落') != -1) {
          logger.v('[CustomBattle] The battlefield is a place of tragedy. I hope they come to understand this one day.')
          core.clickXY(random(1, device.height), random(1, device.width))
          recognized = true
        }
        if (recognized) {
          logger.v(`[CustomBattle] Recognized content:${JSON.stringify(t)}`)
          core.wait(5)
          break
        }
      }
      if (!recognized) {
        unrecognizedTimes++
        toastLog(`Unrecognized scene: ${unrecognizedTimes}/20, wait 20s`)
        if (unrecognizedTimes > 20) {
          throw new Error('Unrecognized scene')
        }
        core.wait(20)
      } else {
        unrecognizedTimes = 0
      }
    }
  }

}