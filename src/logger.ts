let isEnable = false;

(console as any).setGlobalLogConfig({
  file:'/sdcard/Download/arkayo.log'
})

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
  showConsole()
  console.log(str)
}

export function i(str:any){
  showConsole()
  console.info(str)
}

export function v(str:any){
  showConsole()
  console.verbose(str)
}

export function e(str:any){
  showConsole()
  console.error(str)
}

export function trace(str:any){
  showConsole()
  console.trace(str)
}