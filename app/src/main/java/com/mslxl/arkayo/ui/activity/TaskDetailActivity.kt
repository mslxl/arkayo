package com.mslxl.arkayo.ui.activity

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.mslxl.arkayo.R
import com.mslxl.arkayo.databinding.ActivityTaskDetailBinding
import com.mslxl.arkayo.task.TaskManager

class TaskDetailActivity : AppCompatActivity() {

    private lateinit var binding: ActivityTaskDetailBinding

    companion object {
        private const val TASK_ID = "taskid"
        fun showTask(taskId: Int, parentActivity: Activity) {
            val intent = Intent(parentActivity, TaskDetailActivity::class.java).apply {
                putExtra(TASK_ID, taskId)
            }
            parentActivity.startActivity(intent)

        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val taskID = intent.getIntExtra(TASK_ID, 0)
        if (taskID == 0) finish()

        binding = ActivityTaskDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(findViewById(R.id.toolbar))
        binding.toolbarLayout.title = getString(taskID)
        binding.textfieldDetail.text = getString(TaskManager.getTaskBuilderByID(taskID)!!.descID)

        binding.fab.setOnClickListener { view ->
            TaskManager.startTask(
                this,
                TaskManager.getTaskBuilderByID(R.string.task_name_startGame)!!.build()
            )
        }
    }
}