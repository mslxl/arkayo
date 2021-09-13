package com.mslxl.arkayo.util.screencap

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import java.io.File
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

class ShellScreenCapture : ScreenCapture() {
    lateinit var externalStorage: File
    override suspend fun requestPermission(ctx: Context) = suspendCoroutine<Unit> { continuation ->
        externalStorage = ctx.externalCacheDir!!
        val process = Runtime.getRuntime().exec("su")
        process.outputStream.bufferedWriter().use {
            it.write("exit")
            it.newLine()
            it.flush()
        }
        process.waitFor()
        continuation.resume(Unit)
    }

    override suspend fun capture(): Bitmap = suspendCoroutine { continuation ->
        val file = File(externalStorage, "${System.currentTimeMillis()}.png")
        val process =
            Runtime.getRuntime().exec(arrayOf("su", "-c", "screencap -p ${file.absolutePath}"))
        process.waitFor()
        val bitmap = file.inputStream().use {
            BitmapFactory.decodeStream(it)
        }
        file.deleteOnExit()
        continuation.resume(bitmap)
    }
}