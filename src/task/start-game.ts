import TaskRunner from './i'
import * as capture from '../capture'
import * as ocr from '../ocr'
import * as logger from '../logger'
import * as conf from '../config'
import * as core from '../core'
import * as colorHelper from '../color'
import JSON_GAME from '../game.json'
export default class StartGame extends TaskRunner {
  start(): void {
    let game = JSON_GAME[conf.get('game')]
    toastLog(`Launch ${game.name}`)
    launch(game.pkg)
    core.wait(5)
    while (true) {
      try {
        capture.refresh(false)
        let result = ocr.detect(capture.shot(), 1.5).map(v => {
          return {
            t: v.text,
            x: v.frame[0],
            y: v.frame[1],
            w: v.frame[2] - v.frame[0],
            h: v.frame[7] - v.frame[1]
          }
        })
        let recognized = false
        for (const item of result) {
          if (item.t.indexOf('源石') != -1 || item.t.indexOf('矿石') != -1 || item.t.indexOf('移动城市') != -1 || item.t.indexOf('感染者问题') != -1) {
            logger.v('recognized main UI')
            core.clickXY(item.x, item.y)
            recognized = true
            break
          } else if (item.t.indexOf('活动公告') != -1) {
            // X 按钮
            logger.v('recognized Notification')
            let pos = colorHelper.findMultiColorsWithCache('XButtonInNotice',capture.shot(), "#b8b6b8", [[29, 29, "#c6c3c6"], [0, 29, "#c6c7c6"], [29, 2, "#c6c3c6"], [15, -4, "#5a595a"], [16, 29, "#5e5e5e"]])!!
            logger.i(`X Button: ${JSON.stringify(pos)}`)
            core.clickXY(pos.x, pos.y)
            recognized = true
            break
          } else if (item.t.indexOf('终端') != -1 || item.t.indexOf('采购中心') != -1 || item.t.indexOf('档案') != -1 || item.t.indexOf('好友') != -1 || item.t.indexOf('理智') != -1) {
            logger.i('recognized Terminal, Task fin.')
            recognized = true
            return
          }
        }
        if (!recognized) {
          logger.v('Unrecognized scene')
          core.wait(20)
        } else {
          core.wait(5)
        }
      } catch (e) {
        logger.e(e)
      }
    }

  }

}