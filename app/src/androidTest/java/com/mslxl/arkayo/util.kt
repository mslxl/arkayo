package com.mslxl.arkayo

//assertEquals("com.mslxl.arkayo", appContext.packageName)

import org.junit.Assert.assertEquals

infix fun <T : Any?, C : Any?> T.shouldBe(expected: C) {
    assertEquals(expected, this)
}
