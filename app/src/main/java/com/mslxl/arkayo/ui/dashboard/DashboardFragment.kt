package com.mslxl.arkayo.ui.dashboard

import android.animation.Animator
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.mslxl.arkayo.R
import com.mslxl.arkayo.databinding.FragmentDashboardBinding

class DashboardFragment : Fragment() {

    private lateinit var dashboardViewModel: DashboardViewModel
    private var _binding: FragmentDashboardBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!
    private var isShowFAB = false

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
}