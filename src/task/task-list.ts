import TaskCustomBattle from './basic/custom-battle'
import TaskStartGame from './basic/start-game'
import TaskAll from './collection/all-in-one'
import TaskCommitMission from './basic/commit-mission'
import TaskHarvestBase from './basic/harvest-base'
import TaskRecruit from './basic/recruit'
import TaskPrepareBase from './basic/prepare-base'
import TaskOrundums from './collection/orundums-farming'
import TaskClueCommunication from './basic/clue-communication'
const tasks = [
  new TaskCustomBattle(),
  new TaskStartGame(),
  new TaskCommitMission(),
  new TaskHarvestBase(),
  new TaskClueCommunication(),
  //new TaskRecruit(),
  new TaskPrepareBase(),
  new TaskAll(),
  new TaskOrundums()
].map((t) => {
  return {
    name: t.getName(),
    src: t
  }
})
export default tasks