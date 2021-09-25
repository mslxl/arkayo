package com.mslxl.arkayo.util.auto

import android.content.Context
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine
import kotlin.random.Random
import kotlin.random.nextInt

class ShellAutomator : Automator() {
    override suspend fun requestPermission(ctx: Context) = suspendCoroutine<Unit> { continuation ->
        val process = Runtime.getRuntime().exec("su")
        process.outputStream.bufferedWriter().use {
            it.write("exit")
            it.newLine()
            it.flush()
        }
        process.waitFor()
        continuation.resume(Unit)
    }

    override suspend fun tap(
        x: Int,
        y: Int,
        offsetXRange: IntRange,
        offsetYRange: IntRange,
        timeRange: IntRange
    ) = suspendCoroutine<Unit> { continuation ->
        val process = Runtime.getRuntime().exec(
            arrayOf(
                "su",
                "-c",
                "input tap ${x + Random.nextInt(offsetXRange)} ${y + Random.nextInt(offsetYRange)}"
            )
        )
        process.waitFor()
        continuation.resume(Unit)
    }


    override suspend fun key(key: Key) = suspendCoroutine<Unit> { continuation ->
        val keyCode = when (key) {
            Key.Back -> 4
            else -> throw Exception("Not impl yet")
        }
        val process = Runtime.getRuntime().exec(arrayOf("su", "-c", "input keyevent $keyCode"))
        process.waitFor()
        continuation.resume(Unit)
    }
}