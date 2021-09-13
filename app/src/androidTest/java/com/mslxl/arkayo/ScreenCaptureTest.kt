package com.mslxl.arkayo

import android.graphics.Bitmap
import androidx.test.platform.app.InstrumentationRegistry
import com.mslxl.arkayo.util.screencap.MediaProjectionScreenCapture
import com.mslxl.arkayo.util.screencap.ScreenCapture
import com.mslxl.arkayo.util.screencap.ShellScreenCapture
import kotlinx.coroutines.runBlocking
import org.junit.Test
import java.io.File

class ScreenCaptureTest {
    private fun saveImg(bitmap: Bitmap, testName: String): Bitmap {
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        val dir = File(appContext.getExternalFilesDir(null), "test").apply {
            if (!exists()) mkdirs()
        }
        val file = File(dir, "$testName.png")
        file.outputStream().use {
            bitmap.compress(Bitmap.CompressFormat.PNG, 90, it)
        }
        return bitmap
    }

    private fun Bitmap.save(id: String) = saveImg(this, id)

    @Test
    fun shell() {
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        ScreenCapture.use(ShellScreenCapture())
        runBlocking {
            ScreenCapture.requestPermission(appContext)
            repeat(5) { times ->
                ScreenCapture.capture().save("shell_$times")
                Thread.sleep(500)
            }
        }
    }

    @Test
    fun media() {
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        ScreenCapture.use(MediaProjectionScreenCapture.getInstance())
        runBlocking {
            ScreenCapture.requestPermission(appContext)
            repeat(5) { times ->
                ScreenCapture.capture().save("media_$times")
                Thread.sleep(500)
            }
        }
    }
}