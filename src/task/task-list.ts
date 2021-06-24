import TaskCustomBattle from './custom-battle'
import TaskStartGame from './start-game'
import TaskAll from './all-in-one'
import TaskCommitMission from './commit-mission'
import TaskHarvestBase from './harvest-base'
import TaskRecruit from './recruit'
import TaskOrundums from './orundums-farming'
const tasks = [
  new TaskCustomBattle(),
  new TaskStartGame(),
  new TaskCommitMission(),
  new TaskHarvestBase(),
  new TaskRecruit(),
  new TaskAll(),
  new TaskOrundums()
].map((t) => {
  return {
    name: t.getName(),
    src: t
  }
})
export default tasks