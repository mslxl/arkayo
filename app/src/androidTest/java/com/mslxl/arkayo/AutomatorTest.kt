package com.mslxl.arkayo

import androidx.test.platform.app.InstrumentationRegistry
import com.mslxl.arkayo.util.auto.AccessibilityAutomator
import com.mslxl.arkayo.util.auto.Automator
import com.mslxl.arkayo.util.auto.ShellAutomator
import kotlinx.coroutines.runBlocking
import org.junit.Test

class AutomatorTest {
    fun test(automator: Automator) {
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        Automator.use(automator)
        runBlocking {
            Automator.requestPermission(appContext)
            Automator.tap(100, 100)
            Thread.sleep(2000)
            Automator.key(Automator.Key.Back)
        }
    }

    @Test
    fun shell() {
        test(ShellAutomator())
    }

    @Test
    fun accessibility() {
        test(AccessibilityAutomator())
    }
}