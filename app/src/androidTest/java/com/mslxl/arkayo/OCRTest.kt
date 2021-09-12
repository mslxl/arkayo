package com.mslxl.arkayo

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.mslxl.arkayo.util.ocr.OCREngine
import com.mslxl.arkayo.util.ocr.Tesseract
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File

@RunWith(AndroidJUnit4::class)
class OCRTest {
    @Test
    fun tesseract() {
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        OCREngine.use(Tesseract(appContext))
        OCREngine.engine.lang = OCREngine.LANG_zh_CN

        val testText = "你好世界"
        val bitmap = Bitmap.createBitmap(300, 300, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        val paint = Paint().apply {
            color = Color.RED
            strokeWidth = 5f
            textSize = 14f
        }
        canvas.drawText(testText, 20f, 20f, paint)

        File(appContext.getExternalFilesDir(null), "$testText.png").apply {
            createNewFile()
        }.outputStream().use {
            bitmap.compress(Bitmap.CompressFormat.PNG, 90, it)
        }
        var found = false
        val text = OCREngine.detect(bitmap)

        text.forEach {
            if (it.text.contains(testText))
                found = true
        }
        found shouldBe true
    }
}