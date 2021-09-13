package com.mslxl.arkayo


import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals

infix fun <T : Any?, C : Any?> T.shouldBe(expected: C) {
    assertEquals(expected, this)
}

infix fun <T : Any?, C : Any?> T.shouldNotBe(unexpected: C) {
    assertNotEquals(unexpected, this)
}
