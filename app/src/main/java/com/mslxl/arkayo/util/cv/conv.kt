package com.mslxl.arkayo.util.cv

import android.graphics.Bitmap
import org.opencv.android.Utils
import org.opencv.core.Mat
import org.opencv.imgproc.Imgproc

inline fun Bitmap.cvApply(block:(Mat)->Unit):Bitmap{
    val mat = Mat()
    Utils.bitmapToMat(this,mat)
    Imgproc.cvtColor(mat,mat,Imgproc.COLOR_RGBA2BGR)
    block(mat)
    val bitmap = Bitmap.createBitmap(mat.width(),mat.height(),Bitmap.Config.ARGB_8888)
    Utils.matToBitmap(mat,bitmap)
    return bitmap
}
inline fun <T> Bitmap.cvLet(block: (Mat) -> T):T{
    val mat = Mat()
    Utils.bitmapToMat(this,mat)
    Imgproc.cvtColor(mat,mat,Imgproc.COLOR_RGBA2BGR)
    return block(mat)
}
inline fun Bitmap.cv(block: (Mat) -> Unit){
    cvLet(block)
}