package com.mslxl.arkayo.util.ocr

import android.graphics.Bitmap

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


    }

    open fun init() {}
    abstract var lang: String

    abstract fun detect(img: Bitmap): List<OCRResult>
}