package com.mslxl.arkayo.util.screencap

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.PixelFormat
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.media.Image
import android.media.ImageReader
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.os.Build
import android.os.Bundle
import android.os.SystemClock
import android.util.DisplayMetrics
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity
import com.mslxl.arkayo.service.MediaForegroundService
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine


class MediaProjectionScreenCapture private constructor() : ScreenCapture() {
    companion object {
        private var INSTANCE: MediaProjectionScreenCapture? = null
        fun getInstance(): MediaProjectionScreenCapture {
            if (INSTANCE == null)
                INSTANCE = MediaProjectionScreenCapture()
            return INSTANCE!!
        }

        private fun destroyInstance() {
            INSTANCE = null
        }
    }

    private lateinit var ctx: Context
    private var screenWidth = 0
    private var screenHeight = 0
    private var screenDensity = 0
    private lateinit var mMediaProjectionManager: MediaProjectionManager
    private lateinit var mImageReader: ImageReader
    private lateinit var mWindowManager: WindowManager
    private lateinit var mMediaProjection: MediaProjection
    private lateinit var mVirtualDisplay: VirtualDisplay
    private lateinit var screencapCallback: () -> Unit

    override suspend fun requestPermission(ctx: Context) = suspendCoroutine<Unit> { continuation ->
        this.ctx = ctx
        val mForegroundService = Intent(ctx, MediaForegroundService::class.java)
        mForegroundService.putExtra("Foreground", "This is a foreground service.")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ctx.startForegroundService(mForegroundService)
        } else {
            ctx.startService(mForegroundService)
        }

        setupScreenSize(ctx)
        setupWM(ctx)
        ScreenCaptureActivity.startForPermission(ctx)
        screencapCallback = {
            continuation.resume(Unit)
        }

    }

    private fun setupScreenSize(ctx: Context) {
        val metrics: DisplayMetrics = ctx.resources.displayMetrics
        screenWidth = metrics.widthPixels //获取到的是px，像素，绝对像素，需要转化为dpi
        screenHeight = getRealHeight(ctx)

    }


    private fun getRealHeight(context: Context): Int {
        val wm = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        val display = wm.defaultDisplay
        var screenHeight = 0
        val dm = DisplayMetrics()
        display.getRealMetrics(dm)
        screenHeight = dm.heightPixels
        return screenHeight
    }

    private fun setupWM(context: Context) {
        mMediaProjectionManager =
            context.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager

        @SuppressLint("WrongConstant")
        mImageReader = ImageReader.newInstance(screenWidth, screenHeight, PixelFormat.RGBA_8888, 1)
        mWindowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

        val metrics = DisplayMetrics()
        mWindowManager.defaultDisplay.getMetrics(metrics)
        screenDensity = metrics.densityDpi
    }

    fun permissionResult(resultCode: Int, data: Intent?) {
        if (resultCode == Activity.RESULT_OK && data != null) {
            mMediaProjection =
                mMediaProjectionManager.getMediaProjection(resultCode, data)
            virtualDisplay()
        } else {
            throw Exception("request virtual display fail")
        }

    }

    /**
     * 开始录屏
     */
    private fun virtualDisplay() {
        mVirtualDisplay =
            mMediaProjection.createVirtualDisplay(
                "screen-mirror",
                screenWidth,
                screenHeight,
                screenDensity,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
                mImageReader.getSurface(),
                null,
                null
            )
        screencapCallback.invoke()
    }

    override suspend fun capture(): Bitmap {

        var image: Image? = null
        image = mImageReader.acquireLatestImage()
        while (image == null) {
            SystemClock.sleep(10)
            image = mImageReader.acquireLatestImage()
        }
        val width = image.width
        val height = image.height
        val planes = image.planes
        val buffer = planes[0].buffer
        //每个像素的间距
        //每个像素的间距
        val pixelStride = planes[0].pixelStride
        //总的间距
        //总的间距
        val rowStride = planes[0].rowStride
        val rowPadding = rowStride - pixelStride * width
        var bitmap =
            Bitmap.createBitmap(width + rowPadding / pixelStride, height, Bitmap.Config.ARGB_8888)
        bitmap.copyPixelsFromBuffer(buffer)
        bitmap = Bitmap.createBitmap(bitmap, 0, 0, width, height)
        image.close()
        return bitmap
    }

    override suspend fun destroy() {
        super.destroy()
        val mForegroundService = Intent(ctx, MediaForegroundService::class.java)
        ctx.stopService(mForegroundService)
        destroyInstance()

    }
}

class ScreenCaptureActivity : AppCompatActivity() {
    companion object {
        private const val REQUEST_PERMISSION = 0
        private const val REQUEST_CAPTURE = 1
        private const val REQUEST_MEDIA_PROJECTION = 18
        inline fun Context.withIntent(block: Intent.() -> Unit) {
            val intent = Intent(this, ScreenCaptureActivity::class.java).apply(block).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            startActivity(intent)
        }

        fun startForPermission(ctx: Context) {
            ctx.withIntent {
                putExtra("purpose", REQUEST_PERMISSION)
            }
        }

        fun startForCapture(ctx: Context) {
            ctx.withIntent {
                putExtra("purpose", REQUEST_CAPTURE)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        var projectionManager: MediaProjectionManager? = null
        projectionManager = getSystemService(MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        startActivityForResult(
            projectionManager.createScreenCaptureIntent(),
            REQUEST_MEDIA_PROJECTION
        )
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == REQUEST_MEDIA_PROJECTION) {
            MediaProjectionScreenCapture.getInstance().permissionResult(resultCode, data)
            finish()
        }
    }

}