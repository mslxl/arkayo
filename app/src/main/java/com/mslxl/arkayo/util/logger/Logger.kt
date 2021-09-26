package com.mslxl.arkayo.util.logger

import android.util.Log

object Logger {
    fun e(tag: String, msg: String) {
        Log.e(tag, msg)
    }

    fun e(tag: String, msg: String?, tr: Throwable) {
        Log.e(tag, msg, tr)
    }

    fun i(tag: String, msg: String) {
        Log.i(tag, msg)
    }
}

inline fun <T> withLogger(tag: String, block: LoggerTag.() -> T): T {
    LoggerTag(tag).apply {
        return block.invoke(this)
    }
}

@JvmInline
value class LoggerTag(val tag: String) {
    fun e(tag: String, msg: String) {
        Logger.e(tag, msg)
    }

    fun e(tag: String, msg: String?, tr: Throwable) {
        Logger.e(tag, msg, tr)
    }

    fun i(tag: String, msg: String) {
        Logger.i(tag, msg)
    }
}