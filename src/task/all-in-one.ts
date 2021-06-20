import TaskRunner from './i'

import StartGame from './start-game'
import CommitMission from './commit-mission'

import * as core from '../core'
import * as logger from '../logger'
export default class AllInOne extends TaskRunner {
  start(): void {
    let tasks: TaskRunner[] = [
      new StartGame(),
      new CommitMission()
    ]
    tasks.forEach((task, index) => {
      logger.i(`[All-In-One]: ${index + 1}/${tasks.length} - ${task.constructor.name}`)
      task.start()
      core.wait(20)
    })
    logger.i('[All-In-One]: All tasks were finished!')
  }

}