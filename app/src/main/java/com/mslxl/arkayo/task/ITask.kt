package com.mslxl.arkayo.task

import android.content.Context

interface ITask {

    val taskID: Int
    val builder: ITaskBuilder<*>
    suspend fun start(ctx: Context)
    suspend fun stop() {}
}