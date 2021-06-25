import * as stack from '../stack'
import * as logger from '../logger'
export default abstract class TaskRunner{
  private __start: () => void
  abstract start():void
  abstract getName():string
  stop():void{

  }
  getDesc():string{
    return this.getName()
  }


  constructor(){
    this.__start = this.start
    let it = this
    this.start = function(){
      stack.pushTask(it)
      logger.i(`[${stack.getStackName()}]: 开始运行`,true)
      it.__start()
      logger.i(`[${stack.getStackName()}]: 运行结束`,true)
      stack.popTask()
    }  
  }
}