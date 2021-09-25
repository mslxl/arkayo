package com.mslxl.arkayo.ui.activity

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.mslxl.arkayo.R
import com.mslxl.arkayo.databinding.ActivityTaskListBinding
import com.mslxl.arkayo.task.TaskManager

class TaskListActivity : AppCompatActivity() {
    private lateinit var binding: ActivityTaskListBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityTaskListBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val recycler = binding.recyclerTask
        recycler.layoutManager = LinearLayoutManager(this)
        recycler.adapter = Adapter()
    }

    inner class Adapter : RecyclerView.Adapter<ViewHolder>() {
        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            val itemView = LayoutInflater.from(this@TaskListActivity)
                .inflate(R.layout.item_task_preview, parent, false)
            return ViewHolder(itemView)
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            holder.id = TaskManager.tasks[position].nameID
        }

        override fun getItemCount(): Int = TaskManager.tasks.size

    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val taskNameField: TextView = itemView.findViewById(R.id.text_task_field)
        private val detailBtn: ImageButton = itemView.findViewById(R.id.btn_detail)
        private val addBtn: ImageButton = itemView.findViewById(R.id.btn_add)

        init {
            detailBtn.setOnClickListener {
                TaskDetailActivity.showTask(id, this@TaskListActivity)
            }
        }

        var id: Int = 0
            get() = field
            set(value) {
                if (value != 0)
                    taskNameField.text = getString(value)
                field = value
            }
    }
}