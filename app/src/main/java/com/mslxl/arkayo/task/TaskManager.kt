package com.mslxl.arkayo.task

import com.mslxl.arkayo.task.basic.TaskStartGame

object TaskManager {
    private val taskList = HashMap<Int, ITaskBuilder<*>>()
    private fun ITaskBuilder<*>.reg() {
        val builder = this
        taskList[builder.nameID] = builder
    }

    init {
        // Register all tasks below
        TaskStartGame.Builder.reg()

    }

    val tasks get() = taskList.values.toList()
    val size get() = tasks.size
    fun getTaskBuilderByID(id: Int) = taskList[id]
}