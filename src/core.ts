import * as logger from './logger'
import * as conf from './config'
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
  logger.showConsole()
}
export function clickPos(pos: Point) {
  clickXY(pos.x, pos.y)
}

export function wait(s: number) {
  logger.v(`Wait ${s}s`)
  sleep(s * 1000)
}