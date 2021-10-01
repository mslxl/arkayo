package com.mslxl.arkayo.task

interface ITaskBuilder<T : ITask> {
    val nameID: Int
    val descID: Int
    fun build(): T
    fun newInstance(): ITaskBuilder<T>
}