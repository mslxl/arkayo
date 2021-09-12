package com.mslxl.arkayo.util

import android.content.Context
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