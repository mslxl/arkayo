import TaskRunner from '../i'
import * as capture from '../../capture'
import * as ocr from '../../ocr'
import * as logger from '../../logger'
import * as core from '../../core'

export default class StartGame extends TaskRunner {
  getName(): string {
    return "启动游戏"
  }
  getDesc(): string {
    return [
        "在游戏未启动时运行",
        "该任务仅会使游戏进入主界面，完成登录，签到，关闭公告等动作后任务结束"
    ].reduce((pre: string, acc: string) => `${pre}。\n${acc}`)
}
  start(): void {
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
          if (item.t.indexOf('源石') != -1 || item.t.indexOf('矿石') != -1 || item.t.indexOf('移动城市') != -1 || item.t.indexOf('感染者问题') != -1 || item.t.indexOf('开始唤醒') != -1) {
            logger.v('recognized main UI')
            core.clickXY(item.x, item.y)
            recognized = true
            break
          } else if (item.t.indexOf('活动公告') != -1 || item.t.indexOf('签到') != -1|| item.t.indexOf('一日之计') != -1|| item.t.indexOf('今日配给') != -1) {
            back()
            recognized = true
            break
          } else if (item.t.indexOf('终端') != -1 || item.t.indexOf('采购中心') != -1 || item.t.indexOf('档案') != -1 || item.t.indexOf('好友') != -1 || item.t.indexOf('理智') != -1) {
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