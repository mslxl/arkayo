package com.mslxl.arkayo.task.basic

import android.content.Context
import com.mslxl.arkayo.R
import com.mslxl.arkayo.task.ITask
import com.mslxl.arkayo.task.ITaskBuilder

class TaskSeq private constructor(
    private val taskList: List<ITask>,
    override val builder: ITaskBuilder<TaskSeq>
) : ITask {
    class Builder : ITaskBuilder<TaskSeq> {
        var list: List<ITask> = emptyList()
        override val nameID: Int
            get() = R.string.task_name_taskSeq
        override val descID: Int
            get() = R.string.task_desc_taskSeq

        fun of(vararg items: ITask): Builder {
            list = items.toList()
            return this
        }

        override fun build(): TaskSeq {
            return TaskSeq(list, this)
        }

        override fun newInstance(): ITaskBuilder<TaskSeq> = Builder()
    }

    override val taskID: Int
        get() = R.string.task_name_taskSeq

    override suspend fun start(ctx: Context) {
        taskList.forEach {
            it.start(ctx)
        }
    }
}