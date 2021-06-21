import {e} from '../logger'

export const debugStatus = true

export function debugBlock(block:()=>void){
    try{
        block()
    }catch(err){
        e(err)
    }
    
}

export function run<T> (block:()=>T):T{
    return block()
}