import * as stack from './stack'

let isEnable = false;

(console as any).setGlobalLogConfig({
  file: '/sdcard/Download/arkayo.log'
})

export function setEnable(enable: boolean) {
  isEnable = enable
  if (enable) {
    showConsole()
  } else {
    hideConsole()
  }
}

export function showConsole() {
  if (isEnable) {
    console.show()
  }
}

export function hideConsole(wait: boolean = false) {
  console.hide()
  if (wait) {
    sleep(800)
  }
}

export function log(str: any, hideTask: boolean = false) {
  showConsole()
  console.log(`${hideTask ? "" : `[${stack.getLastName()}]: `}${str}`)
}

export function i(str: any, hideTask: boolean = false) {
  showConsole()
  console.info(`${hideTask ? "" : `[${stack.getLastName()}]: `}${str}`)
}

export function v(str: any, hideTask: boolean = false) {
  showConsole()
  console.verbose(`${hideTask ? "" : `[${stack.getLastName()}]: `}${str}`)
}

export function e(str: any, hideTask: boolean = false) {
  showConsole()
  console.error(`${hideTask ? "" : `[${stack.getLastName()}]: `}${str}`)
}

export function trace(str: any, hideTask: boolean = false) {
  showConsole()
  console.trace(`${hideTask ? "" : `[${stack.getLastName()}]: `}${str}`)
}