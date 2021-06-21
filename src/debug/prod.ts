export const debugStatus = false

export function debugBlock(block:()=>void){
    // Donothing in prod
}

export function run<T> (block:()=>T):T{
    return block()
}