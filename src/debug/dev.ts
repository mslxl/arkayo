export const debugStatus = true

export function debugBlock(block:()=>void){
    block()
}