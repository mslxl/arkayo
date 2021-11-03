package com.mslxl.arkayo.util.cv

import android.util.Log
import org.opencv.android.OpenCVLoader

object ArkayoCV {
    init {
        if (!OpenCVLoader.initDebug())
            Log.e("OpenCV", "Unable to load OpenCV!");
        else
            Log.d("OpenCV", "OpenCV loaded Successfully!");
    }
}