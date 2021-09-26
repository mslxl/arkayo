package com.mslxl.arkayo.service

import android.app.Service
import android.content.Intent
import android.os.Binder
import android.os.IBinder
import android.os.Looper
import com.mslxl.arkayo.task.ITask
import com.mslxl.arkayo.util.logger.Logger
import kotlinx.coroutines.runBlocking
import kotlin.concurrent.thread

class TaskService : Service() {
    lateinit var task: ITask

    class TaskBinder(val service: TaskService) : Binder() {
        fun setTask(task: ITask) {
            service.task = task
        }

        fun start() = service.start()
    }

    override fun onBind(p0: Intent): IBinder {
        return TaskBinder(this)
    }


    fun start() {
        thread {
            Looper.prepare()
            runBlocking {
                try {
                    task.start(this@TaskService.baseContext)
                } catch (e: Exception) {
                    Logger.e("TaskService", null, e);
                }
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return super.onStartCommand(intent, flags, startId)
    }

    override fun onDestroy() {
        super.onDestroy()
    }
}