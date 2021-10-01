package com.mslxl.arkayo.ui.activity.main.dashboard

import android.animation.Animator
import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.mslxl.arkayo.R
import com.mslxl.arkayo.databinding.FragmentDashboardBinding
import com.mslxl.arkayo.task.TaskManager
import com.mslxl.arkayo.task.basic.TaskSeq
import com.mslxl.arkayo.ui.activity.TaskListActivity

class DashboardFragment : Fragment() {

    private lateinit var dashboardViewModel: DashboardViewModel
    private var _binding: FragmentDashboardBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!
    private var isShowFAB = false


    private val taskListLauncher: ActivityResultLauncher<Intent> =
        this.registerForActivityResult(ActivityResultContracts.StartActivityForResult()) {
            if (it.resultCode == Activity.RESULT_OK) {
                dashboardViewModel.taskQueue.add(
                    TaskManager.getTaskBuilderByID(
                        it.data!!.getIntExtra(
                            TaskListActivity.RESULT_TAG,
                            0
                        )
                    )
                )
                _binding?.recyclerTask?.adapter?.notifyDataSetChanged()
            }
        }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        dashboardViewModel =
            ViewModelProvider(this).get(DashboardViewModel::class.java)

        _binding = FragmentDashboardBinding.inflate(inflater, container, false)
        val root: View = binding.root

        binding.fabMenu.setOnClickListener {
            if (binding.fabAddLayout.visibility == View.VISIBLE)
                closeFABMenu()
            else
                showFABMenu()
        }
        binding.fabAdd.setOnClickListener {
            val activity = this.requireActivity()
            taskListLauncher.launch(Intent(activity, TaskListActivity::class.java))
        }
        binding.fabStart.setOnClickListener {
            val seq = TaskSeq.Builder().apply {
                this.list = dashboardViewModel.taskQueue.map { it.build() }
            }.build()
            TaskManager.startTask(this.requireContext(), seq)
        }


        val recycler = binding.recyclerTask
        recycler.layoutManager = LinearLayoutManager(this.requireContext())
        recycler.adapter = Adapter()
//        val textView: TextView = binding.textDashboard
//        dashboardViewModel.text.observe(viewLifecycleOwner, Observer {
//            textView.text = it
//        })

        return root
    }

    private fun closeFABMenu() {
        isShowFAB = false
        with(binding) {
            fabMenu.animate().rotation(0F)
            fabStartLayout.animate().translationY(0F)
            fabAddLayout.animate().translationY(0F).setListener(object : Animator.AnimatorListener {
                override fun onAnimationStart(p0: Animator?) {
                }

                override fun onAnimationEnd(p0: Animator?) {
                    if (!isShowFAB) {
                        fabStartLayout.visibility = View.GONE
                        fabAddLayout.visibility = View.GONE
                    }
                }

                override fun onAnimationCancel(p0: Animator?) {
                }

                override fun onAnimationRepeat(p0: Animator?) {
                }

            })
        }

    }


    private fun showFABMenu() {
        isShowFAB = true
        with(binding) {

            fabAddLayout.visibility = View.VISIBLE
            fabStartLayout.visibility = View.VISIBLE

            fabMenu.animate().rotationBy(180F)
            fabStartLayout.animate().translationY(-resources.getDimension(R.dimen.standard_75))
            fabAddLayout.animate().translationY(-resources.getDimension(R.dimen.standard_120))
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    inner class Adapter : RecyclerView.Adapter<ViewHolder>() {
        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            val itemView = LayoutInflater.from(this@DashboardFragment.requireContext())
                .inflate(R.layout.item_task_builder_item, parent, false)
            return ViewHolder(itemView)
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            val item = dashboardViewModel.taskQueue[position]
            holder.textView.text = this@DashboardFragment.requireContext().getString(item.nameID)
        }

        override fun getItemCount(): Int = dashboardViewModel.taskQueue.size

    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textView = itemView.findViewById<TextView>(R.id.textView)

    }
}