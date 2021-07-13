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
  tasks: TaskRunner[]
  constructor() {
    super()
    this.tasks = [
      new StartGame(),
      new HarvestBase(),
      new EnterLast(),
      new CustomBattle(),
      new ClueCommunication(),
      new HarvestBase(),
      new CommitMission(),
    ]
  }

  getName(): string {
    return "多合一日常"
  }
  getDesc(): string {
    return [
      "在主界面或游戏未启动时运行此任务",
      "该任务会依次执行下列任务：",
    ].concat(this.tasks.map(v=>v.getName()))
    .reduce((pre: string, acc: string) => `${pre}\n${acc}`)
  }
  start(): void {

    this.tasks.forEach((task, index) => {
      logger.i(`进度 ${index + 1}/${this.tasks.length}`)
      task.start()
      setAutoCapture(false)
      core.wait(20)
    })
  }

}