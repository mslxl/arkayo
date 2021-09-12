package com.mslxl.arkayo.util.ocr

import android.content.Context
import android.graphics.Bitmap
import com.googlecode.tesseract.android.TessBaseAPI
import java.io.File

class Tesseract(val ctx: Context) : OCREngine() {
    private companion object {
        val langTraindataFile = mapOf(
            LANG_zh_CN to "chi_sim.traineddata",
            LANG_zh_TW to "chi_tra.traineddata",
            LANG_jp to "jpn.traineddata",
            LANG_en to "eng.traineddata",
        )
    }

    override var lang: String = LANG_zh_CN
        set(value) {
            if (!langTraindataFile.containsKey(value))
                throw Exception()
            field = value
        }


    private fun getTrainDataDir(): File {
        val dataDir = ctx.getExternalFilesDir(null)!!
        val tessdata = File(dataDir, "tessdata")
        if (!tessdata.exists())
            tessdata.mkdirs()

        langTraindataFile.values.map {
            it to File(tessdata, it)
        }.filter { !it.second.exists() }.forEach {
            it.second.outputStream().use { os ->
                ctx.assets.open("tessdata_best/${it.first}").copyTo(os)
            }
        }
        return tessdata

    }


    override fun detect(img: Bitmap): List<OCRResult> {
        val api = TessBaseAPI().apply {
            init(getTrainDataDir().parent, langTraindataFile[lang]!!.substringBefore('.'))
            pageSegMode = TessBaseAPI.PageSegMode.PSM_AUTO
        }
        api.setImage(img)
        api.utF8Text
        val iter = api.resultIterator
        val result = ArrayList<OCRResult>()
        do {
            val utF8Text =
                iter.getUTF8Text(TessBaseAPI.PageIteratorLevel.RIL_TEXTLINE).filter { it != ' ' }
            val rect = iter.getBoundingRect(TessBaseAPI.PageIteratorLevel.RIL_TEXTLINE)
            result.add(
                OCRResult(
                    utF8Text,
                    rect.left,
                    rect.top,
                    rect.right - rect.left,
                    rect.bottom - rect.top
                )
            )
        } while (iter.next(TessBaseAPI.PageIteratorLevel.RIL_TEXTLINE))
        return result
    }

}