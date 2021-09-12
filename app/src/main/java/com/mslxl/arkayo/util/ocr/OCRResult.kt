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