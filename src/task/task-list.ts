import TaskCustomBattle from './custom-battle'
import TaskStartGame from './start-game'
import TaskAll from './all-in-one'
import TaskCommitMission from './commit-mission';
import TaskHarvestBase from './harvest-base'
const tasks = [
  {
    name: 'Custom battle',
    src: new TaskCustomBattle()
  },
  {
    name: 'Launch Game',
    src: new TaskStartGame()
  },
  {
    name: 'Commit mission',
    src: new TaskCommitMission()
  },
  {
    name: 'Harvest base',
    src: new TaskHarvestBase()
  },
  {
    name: 'All in one',
    src: new TaskAll()
  }
]
export default tasks