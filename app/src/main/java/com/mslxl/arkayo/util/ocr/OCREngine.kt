package com.mslxl.arkayo.util.ocr

import android.content.Context
import android.graphics.Bitmap
import androidx.preference.PreferenceManager
import com.mslxl.arkayo.R
import com.mslxl.arkayo.util.withGameServer

abstract class OCREngine {
    companion object {
        const val LANG_zh_CN = "zh_CN"
        const val LANG_zh_TW = "zh_TW"
        const val LANG_en = "en"
        const val LANG_jp = "jp"
        const val LANG_kr = "kr"

        @Suppress("ObjectPropertyName")
        private var _engine: OCREngine? = null
        val engine get() = _engine!!
        fun use(engine: OCREngine) {
            engine.init()
            if (engine.lang.isEmpty())
                engine.lang = LANG_zh_CN
            _engine = engine
        }

        fun detect(img: Bitmap) = engine.detect(img)
        fun autoConfig(ctx: Context) {
            val sharedPrefs = PreferenceManager.getDefaultSharedPreferences(ctx)
            val e = when (sharedPrefs.getString(
                "pref_ocrSrc",
                ctx.getString(R.string.pref_ocrSrc_def)
            )) {
                "Tesseract" -> Tesseract(ctx)
                else -> throw UnsupportedOperationException()
            }
            use(e)

            ctx.withGameServer(
                hg = LANG_zh_CN,
                bili = LANG_zh_CN
            ) {
                engine.lang = it
            }
        }
    }

    open fun init() {}
    abstract var lang: String

    abstract fun detect(img: Bitmap): List<OCRResult>
}