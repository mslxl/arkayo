package com.mslxl.arkayo.util.screencap

import android.content.Context
import android.graphics.Bitmap
import kotlinx.coroutines.runBlocking

abstract class ScreenCapture {
    companion object {
        private var _capture: ScreenCapture? = null
        val capture: ScreenCapture get() = _capture!!
        fun use(cap: ScreenCapture) {
            if (_capture != null) {
                runBlocking {
                    _capture?.destroy()
                }
            }

            cap.init()
            _capture = cap
        }

        suspend fun requestPermission(ctx: Context) = capture.requestPermission(ctx)
        suspend fun capture() = capture.capture()

    }

    open fun init() {}
    abstract suspend fun requestPermission(ctx: Context)
    abstract suspend fun capture(): Bitmap
    open suspend fun destroy() {}

}