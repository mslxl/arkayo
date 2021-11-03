package com.mslxl.arkayo.util.ocr

data class OCRResult(
    val text: String,
    val x: Int,
    val y: Int,
    val width: Int,
    val height: Int
)

fun List<OCRResult>.filterByText(text: String) =
    filter { it.text.contains(text, ignoreCase = true) }

fun List<OCRResult>.containsText(text: String): Boolean {
    return this.map { it.text }.reduce { acc, s -> acc + s }.contains(text, false)
}

fun List<OCRResult>.containsAnyText(texts: List<String>): Boolean {
    val text = this.map { it.text }.reduce { acc, s -> acc + s }
    texts.forEach {
        if (text.contains(it, false)) {
            return true
        }
    }
    return false
}