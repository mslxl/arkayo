import TaskRunner from '../i'

import StartGame from '../basic/start-game'
import CommitMission from '../basic/commit-mission'
import HarvestBase from '../basic/harvest-base'
import EnterLast from '../internal/enter-last-battle'
import CustomBattle from '../basic/custom-battle'
import ClueCommunication from '../basic/clue-communication'
import { setAutoCapture } from '../../capture'

import * as core from '../../core'
import * as logger from '../../logger'
export default class AllInOne extends TaskRunner {
  getName(): string {
    return "多合一日常"
  }
  start(): void {
    let tasks: TaskRunner[] = [
      new StartGame(),
      new HarvestBase(),
      new EnterLast(),
      new CustomBattle(),
      new ClueCommunication(),
      new HarvestBase(),
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