package com.mslxl.arkayo.service

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.app.ActivityManager
import android.content.Context
import android.content.Intent
import android.graphics.Path
import android.os.Build
import android.provider.Settings
import android.view.accessibility.AccessibilityEvent
import androidx.annotation.RequiresApi
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

class AutomatorAccessibilityService : AccessibilityService() {
    companion object {
        private var _INSTANCE: AutomatorAccessibilityService? = null
        val INSTANCE get() = _INSTANCE!!

        fun openAccessibilitySettings(ctx: Context) {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            ctx.startActivity(intent)
        }

        fun checkAccessibilityAvailable(ctx: Context): Boolean {
            val activityMan = ctx.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            val runningServices = activityMan.getRunningServices(100)
            if (runningServices.size < 1) return false
            runningServices.forEach {
                if (it.service.className == AutomatorAccessibilityService::class.java.name) {
                    return true
                }
            }
            return false
        }

        fun startAccessibilityService(ctx: Context) {
            val intent = Intent(ctx, AutomatorAccessibilityService::class.java).apply {
            }
            ctx.startService(intent)
        }
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {

    }

    override fun onCreate() {
        super.onCreate()
        _INSTANCE = this
    }

    @RequiresApi(Build.VERSION_CODES.N)
    suspend fun doTap(
        x: Int,
        y: Int,
        time: Int
    ) = suspendCoroutine<Unit> { continuation ->
        val path = Path()
        path.moveTo(x.toFloat(), y.toFloat())
        val builder = GestureDescription.Builder()
        builder.addStroke(
            GestureDescription.StrokeDescription(path, 0, time.toLong())
        )
        this.dispatchGesture(
            builder.build(),
            object : AccessibilityService.GestureResultCallback() {
                override fun onCancelled(gestureDescription: GestureDescription?) {
                    super.onCancelled(gestureDescription)
                    continuation.resume(Unit)
                }

                override fun onCompleted(gestureDescription: GestureDescription?) {
                    super.onCompleted(gestureDescription)
                    continuation.resume(Unit)
                }
            },
            null
        )
    }

    override fun onInterrupt() {
    }
}