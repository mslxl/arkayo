package com.mslxl.arkayo.task.basic

import android.content.Context
import android.content.Intent
import com.mslxl.arkayo.R
import com.mslxl.arkayo.task.ITask
import com.mslxl.arkayo.task.ITaskBuilder
import com.mslxl.arkayo.util.withGameServer
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine

class TaskStartGame : ITask {
    object Builder : ITaskBuilder<TaskStartGame> {
        override val nameID: Int = R.string.task_name_startGame
        override val descID: Int = R.string.task_desc_startGame
        override fun build() = TaskStartGame()
        override fun newInstance() = this
    }

    override val taskID: Int = R.string.task_name_startGame
    override val builder = Builder

    override suspend fun start(ctx: Context) = suspendCoroutine<Unit> { continuation ->
        val pkgMan = ctx.packageManager
        ctx.withGameServer(
            bili = "com.hypergryph.arknights.bilibili",
            hg = "com.hypergryph.arknights"
        ) { pkg ->
            val intent = pkgMan.getLaunchIntentForPackage(pkg)?.apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            if (intent != null) {
                ctx.startActivity(intent)
                continuation.resume(Unit)
            } else {
                continuation.resumeWithException(Exception("No package"))
            }
        }
    }


}