let isEnable = false

export function setEnable(enable:boolean) {
  isEnable = enable
  if(enable){
    showConsole()
  }else{
    hideConsole()
  }
}

export function showConsole() {
  if (isEnable) {
    console.show()
  }
}

export function hideConsole(wait:boolean = false) {
  console.hide()
  if(wait){
    sleep(200)
  }
}

export function log(str:any) {
  console.log(str)
}

export function i(str:any){
  console.info(str)
}

export function v(str:any){
  console.verbose(str)
}

export function e(str:any){
  console.error(str)
}

export function trace(str:any){
  console.trace(str)
}