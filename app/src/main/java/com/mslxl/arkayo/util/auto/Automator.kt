package com.mslxl.arkayo.util.auto

import android.content.Context

abstract class Automator {
    enum class Key {
        Back
    }

    companion object {
        private var _automator: Automator? = null
        val automator get() = _automator!!
        fun use(automator: Automator) {
            _automator = automator
        }

        suspend fun requestPermission(ctx: Context) = automator.requestPermission(ctx)
        suspend fun tap(x: Int, y: Int) = automator.tap(x, y)
        suspend fun destroy() = automator.destroy()
        suspend fun key(key: Key) = automator.key(key)

    }

    abstract suspend fun requestPermission(ctx: Context)
    abstract suspend fun tap(
        x: Int, y: Int,
        offsetXRange: IntRange = -10..10,
        offsetYRange: IntRange = -10..10,
        timeRange: IntRange = 100..900
    )

    abstract suspend fun key(key: Key)
    suspend fun destroy() {}


}