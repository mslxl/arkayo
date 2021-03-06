import * as logger from './logger'
import * as conf from './config'
import * as flow from 'debug-flow'


import XML_UI from 'raw-loader!./res/float-dim-show.xml'
export function clickXY(x: number, y: number) {
  logger.hideConsole()
  sleep(200)
  logger.v(`Click (${x}, ${y})`)
  switch (conf.getV('click', 0)) {
    case 0:
      click(x, y)
      break
    case 1:
      Tap(x, y)
      break
    case 2:
      shell(`input tap ${x} ${y}`, true)
  }
  showPoint(x, y)
  logger.showConsole()
}
export function clickPos(pos: Point) {
  clickXY(pos.x, pos.y)
}
export function clickRect(rect: { x: number, y: number, w: number, h: number }) {
  let x;
  let y;
  if (rect.w > 20) {
    x = random(rect.x + 10, rect.x + rect.w - 10)
  } else {
    x = random(rect.x, rect.x + rect.w)
  }
  if (rect.h > 20) {
    y = random(rect.y + 10, rect.y + rect.h - 10)
  } else {
    y = random(rect.y, rect.y + rect.h)
  }
  clickXY(x, y)
}
export function wait(s: number) {
  logger.v(`Wait ${s}s`)
  sleep(s * 1000)
}

export function showPoint(x: number, y: number) {
  flow.debugBlock(() => {
    ui.run(() => {
      let w = (floaty as any).rawWindow(XML_UI)
      w.setPosition(x - w.getWidth() / 2, y - w.getHeight() / 2)
      w.setTouchable(false)
      setTimeout(() => {
        w.close();
      }, 5 * 1000);
    })
  })
}