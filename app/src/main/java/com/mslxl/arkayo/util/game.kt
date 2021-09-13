package com.mslxl.arkayo.util

import android.content.Context
import android.graphics.Bitmap
import androidx.preference.PreferenceManager

fun <T> Context.withGameServer(
    hg: (() -> T)? = null,
    bili: (() -> T)?
): T {
    val sharedPrefs = PreferenceManager.getDefaultSharedPreferences(this)
    val ret = when (sharedPrefs.getString("pref_gameVersion", null)) {
        "HyperGryph" -> hg?.invoke()
        "Bilibili" -> bili?.invoke()
        else -> null
    } ?: throw Exception()
    return ret
}

fun <T> Bitmap.use(block: (bitmap: Bitmap) -> T): T {
    block.invoke(this).let {
        if (!isRecycled) {
            recycle()
        }
        return it
    }
}