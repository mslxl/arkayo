package com.mslxl.arkayo.service

import android.app.Service
import android.content.Intent
import android.os.Binder
import android.os.IBinder

class TaskService : Service() {
    class TaskBinder(service: TaskService) : Binder() {

    }

    override fun onBind(p0: Intent?): IBinder {
        return TaskBinder(this)
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