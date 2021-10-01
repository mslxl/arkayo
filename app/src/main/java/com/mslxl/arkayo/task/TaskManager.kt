package com.mslxl.arkayo.task

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.IBinder
import com.mslxl.arkayo.service.TaskService
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
//        TaskSeq.Builder().reg()

    }

    val tasks get() = taskList.values.toList()
    val size get() = tasks.size
    fun getTaskBuilderByID(id: Int) = taskList[id]!!.newInstance()
    fun startTask(ctx: Context, task: ITask) {
        val connection = object : ServiceConnection {
            override fun onServiceConnected(p0: ComponentName?, binder: IBinder) {
                val binder = binder as TaskService.TaskBinder
                binder.setTask(task)
                binder.start()
            }

            override fun onServiceDisconnected(p0: ComponentName?) {
            }

        }
        val intent = Intent(ctx, TaskService::class.java)
        ctx.startService(intent)
        ctx.bindService(intent, connection, Context.BIND_AUTO_CREATE)
    }

}