import TaskRunner from './i'

import StartGame from './start-game'
import CommitMission from './commit-mission'
import HarvestBase from './harvest-base'
import EnterLongmen from './enter-longmen'
import CustomBattle from './custom-battle'
import AutoRecruit from './recruit'
import Enter1T7 from './enter1-7'
import { refresh, setAutoCapture, shot } from '../capture'

import * as core from '../core'
import * as logger from '../logger'
import { detect, findAnyText, wrapResult } from '../ocr'
import BackToMain from './back-to-main'
export default class OrundumsFarming extends TaskRunner {
  getName(): string {
    return "Orundums Farming"
  }
  start(): void {
    let tasks: TaskRunner[] = [
      new StartGame(),
      new HarvestBase(),
      new EnterBattle(),
      new CustomBattle(),
      new HarvestBase(),
      // TODO new AutoRecruit(),
      new CommitMission(),
    ]
    tasks.forEach((task, index) => {
      logger.i(`[Orundums Farming]: ${index + 1}/${tasks.length} - ${task.getName()}`)
      task.start()
      setAutoCapture(false)
      core.wait(20)
    })
    logger.i('[Orundums Farming]: All tasks were finished!')
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
    if(false){
      new EnterLongmen().start()
    }else{
      new Enter1T7().start()
    }
  }
  getName(): string {
    return "Internal[Enter Battle]"
  }
}