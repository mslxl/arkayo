import XML_UI from 'raw-loader!./res/ui.xml'
import JSON_GAME from './res/game.json'
import * as logger from './logger'
import * as capture from './capture'
import * as conf from './config'
import TaskExitGame from './task/internal/exit-game'

import taskList from './task/task-list'
const data = {
  games: JSON_GAME,
  task: taskList
}

function renderUI(u: any, uiXml: string, data: any) {
  let rg = /\[\[(.*)\]\]/gm
  let xml = uiXml
  uiXml.match(rg)
    ?.map(e => e.substring(e.lastIndexOf('[') + 1, e.indexOf(']')))
    ?.forEach((e) => {
      if (typeof (data[e]) != 'undefined') {
        if ((typeof (data[e]) == 'object') && data[e] instanceof Array) {
          let i = (data[e] as any[]).reduce((pre, acc) => pre + '|' + acc)
          xml = xml.replace(`\[\[${e}\]\]`, i)
        } else {
          xml = xml.replace(`\[\[${e}\]\]`, data[e])
        }
      } else {
        logger.trace(`No data named ${e} referred in ui xml`)
      }
    })
  u.layout(xml)
}

function saveConfig(u: any) {
  conf.set('game', u.spGame.getSelectedItemPosition())
  conf.set('task', u.spTask.getSelectedItemPosition())
  let clickMode: boolean[] = [u.raAcc.isChecked(), u.raRoot.isChecked(), u.raShell.isChecked()]
  conf.set('click', clickMode.indexOf(true))
  conf.set('kill-game', u.cbKill.isChecked())
  conf.set('poweroff', u.cbPoweroff.isChecked())
  conf.set('console', u.cbConsole.isChecked())
}

function readConfig(u: any) {
  conf.doIfGet('game', v => u.spGame.setSelection(v))
  conf.doIfGet('task', v => u.spTask.setSelection(v))
  conf.doIfGet('click', v => {
    ([u.raAcc, u.raRoot, u.raShell])[v].setChecked(true)
  })
  conf.doIfGet('kill-game', (v) => u.cbKill.setChecked(v))
  conf.doIfGet('poweroff', (v) => u.cbPoweroff.setChecked(v))
  conf.doIfGet('console', (v) => {
    u.cbConsole.setChecked(v)
    logger.setEnable(v)
    logger.hideConsole(false)
  })
}
function initUI(u: any) {

  renderUI(u, XML_UI, {
    task: data.task.map((i) => i.name),
    game: data.games.map((i: any) => i.name)
  })

  readConfig(u)
  u.cbConsole.on('check', (checked: boolean) => {
    logger.setEnable(checked)
  })

  u.spTask.setOnItemSelectedListener(new android.widget.AdapterView.OnItemSelectedListener({
    onItemSelected: function (parent:any, view:any, i:number, id:any) {
      u.textTaskDesc.setText(data.task[i].src.getDesc())
    }
  }))



  u.btnLaunch.on('click', () => {
    saveConfig(u)
    let task = data.task[u.spTask.getSelectedItemPosition()].src
    threads.start(() => {
      (device as any).keepScreenOn()
      capture.requestPermission()
      sleep(1000)
      auto.waitFor()
      sleep(1000)
      try {
        let game = JSON_GAME[conf.get('game')]
        toastLog(`Launch ${game.name}`)
        launch(game.pkg)
        sleep(5000)
        task.start()
      } finally {
        device.cancelKeepingAwake()
        if (conf.getV('kill-game', true)) {
          new TaskExitGame().start()
        }
        if (conf.getV('poweroff', false)) {
          shell('reboot -p', true)
        }
      }

    })
  })
}

initUI(ui)

logger.v('Initialized successfully')