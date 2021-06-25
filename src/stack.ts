import TaskRunner from "./task/i"
/**
 * 用做信息记录
 */
const taskStack: TaskRunner[] = []

export function pushTask(task: TaskRunner) {
    taskStack.push(task)
}

export function popTask(): TaskRunner | undefined {
    return taskStack.pop()
}

export function getStackName(): string {
    return taskStack.map(t => t.getName()).reduce((pre, acc) => `${pre} → ${acc}`)
}
export function getLastName(): string {
    if (taskStack.length == 0) {
        return '*'
    } else {
        return taskStack[taskStack.length - 1].getName()
    }
}