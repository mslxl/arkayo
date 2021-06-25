import TaskRunner from './i'

import StartGame from './start-game'
import CommitMission from './commit-mission'
import HarvestBase from './harvest-base'
import EnterLast from './enter-last-battle'
import CustomBattle from './custom-battle'
import ClueCommunication from './clue-communication'
import { setAutoCapture } from '../capture'

import * as core from '../core'
import * as logger from '../logger'
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
      logger.i(`[All-In-One]: ${index + 1}/${tasks.length} - ${task.getName()}`)
      task.start()
      setAutoCapture(false)
      core.wait(20)
    })
    logger.i('[All-In-One]: All tasks were finished!')
  }

}