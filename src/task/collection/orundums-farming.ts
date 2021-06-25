import TaskRunner from '../i'

import StartGame from '../basic/start-game'
import CommitMission from '../basic/commit-mission'
import HarvestBase from '../basic/harvest-base'
import EnterLongmen from '../internal/enter-longmen'
import CustomBattle from '../basic/custom-battle'
import AutoRecruit from '../basic/recruit'
import Enter1T7 from '../internal/enter1-7'
import PrepareBase from '../basic/prepare-base'
import { refresh, setAutoCapture, shot } from '../../capture'

import * as core from '../../core'
import * as logger from '../../logger'
import { detect, findAnyText, wrapResult } from '../../ocr'
import BackToMain from '../internal/back-to-main'
export default class OrundumsFarming extends TaskRunner {
  getName(): string {
    return "搓玉"
  }
  start(): void {
    let tasks: TaskRunner[] = [
      new StartGame(),
      new HarvestBase(),
      new EnterBattle(),
      new CustomBattle(),
      new PrepareBase(),
      // TODO new AutoRecruit(),
      new CommitMission(),
    ]
    tasks.forEach((task, index) => {
      logger.i(`进度 ${index + 1}/${tasks.length}`)
      task.start()
      setAutoCapture(false)
      core.wait(20)
    })
  }
}

class EnterBattle extends TaskRunner{
  start(): void {
    refresh()
    let t = findAnyText(['终端','理智'],wrapResult(detect(shot())))
    if(t){
      core.clickRect(t)
    }
    core.wait(5)
    refresh()
    t = findAnyText(['每周报酬','理智'],wrapResult(detect(shot())))
    new BackToMain().start()
    if(t){
      logger.i('Enter longmen...')
      new EnterLongmen().start()
    }else{
      logger.i('Enter 1-7')
      new Enter1T7().start()
    }
  }
  getName(): string {
    return "Internal[Enter Battle]"
  }
}