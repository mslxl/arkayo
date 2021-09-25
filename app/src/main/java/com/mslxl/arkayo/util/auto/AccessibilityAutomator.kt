package com.mslxl.arkayo.util.auto

import android.content.Context
import android.os.Build
import androidx.annotation.RequiresApi
import com.mslxl.arkayo.service.AutomatorAccessibilityService
import kotlin.random.Random
import kotlin.random.nextInt

class AccessibilityAutomator : Automator() {
    private var ctx: Context? = null
    override suspend fun requestPermission(ctx: Context) {
        this.ctx = ctx
        check()
    }

    private fun check() {
        val ctx = this.ctx!!
        if (!AutomatorAccessibilityService.checkAccessibilityAvailable(ctx)) {
            AutomatorAccessibilityService.startAccessibilityService(ctx)
        }
    }

    @RequiresApi(Build.VERSION_CODES.N)
    override suspend fun tap(
        x: Int,
        y: Int,
        offsetXRange: IntRange,
        offsetYRange: IntRange,
        timeRange: IntRange
    ) {
        check()
        AutomatorAccessibilityService.INSTANCE.doTap(
            x + Random.nextInt(offsetXRange),
            y + Random.nextInt(offsetYRange),
            Random.nextInt(timeRange)
        )
    }


    override suspend fun key(key: Key) {
        TODO("Is accessibility service key available? Wait me research!")
    }
}