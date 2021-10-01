package com.mslxl.arkayo.ui.activity.main.dashboard

import androidx.lifecycle.ViewModel
import com.mslxl.arkayo.task.ITaskBuilder

class DashboardViewModel : ViewModel() {

    //    private val _text = MutableLiveData<String>().apply {
//        value = "This is dashboard Fragment"
//    }
//    val text: LiveData<String> = _text
    val taskQueue: MutableList<ITaskBuilder<*>> = ArrayList()
}