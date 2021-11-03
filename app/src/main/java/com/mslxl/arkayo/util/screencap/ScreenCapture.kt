package com.mslxl.arkayo.util.screencap

import android.content.Context
import android.graphics.Bitmap
import androidx.preference.PreferenceManager
import com.mslxl.arkayo.R
import com.mslxl.arkayo.util.ocr.OCREngine
import com.mslxl.arkayo.util.ocr.Tesseract
import kotlinx.coroutines.runBlocking

abstract class ScreenCapture {
    companion object {
        private var _capture: ScreenCapture? = null
        val capture: ScreenCapture get() = _capture!!
        fun use(cap: ScreenCapture) {
            if (_capture != null) {
                runBlocking {
                    try {
                        _capture?.destroy()
                    }catch (e:Exception){
                        e.printStackTrace()
                    }
                }
            }
            cap.init()
            _capture = cap
        }

        suspend fun requestPermission(ctx: Context) = capture.requestPermission(ctx)
        suspend fun capture() = capture.capture()
        fun autoConfig(ctx: Context) {
            val sharedPrefs = PreferenceManager.getDefaultSharedPreferences(ctx)
            val e = when (sharedPrefs.getString(
                "pref_screencapMode",
                ctx.getString(R.string.pref_screencapMode_def)
            )) {
                "MediaProjection" -> MediaProjectionScreenCapture.getInstance()
                "Root" -> ShellScreenCapture()
                else -> throw UnsupportedOperationException()
            }
            use(e)
        }
    }

    open fun init() {}
    abstract suspend fun requestPermission(ctx: Context)
    abstract suspend fun capture(): Bitmap
    open suspend fun destroy() {}

}