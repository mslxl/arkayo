import * as logger from './logger'
import * as cache from './config'
import * as debugFlow from 'debug-flow'

importClass(org.opencv.core.Core)
importClass(org.opencv.core.Mat)
importClass(org.opencv.core.MatOfPoint)
importClass(org.opencv.core.Scalar)
importClass(org.opencv.core.Point)
importClass(org.opencv.core.MatOfPoint2f)
importClass(org.opencv.imgcodecs.Imgcodecs)
importClass(org.opencv.imgproc.Imgproc)
importClass(java.util.ArrayList)


/**
 * 
 * @param {Mat} mat 
 * @param {number[]} lower 
 * @param {number[]} upper 
 */
export function opencvInRange(img, lower, upper) {

    let lowerColor = colors.rgb(lower[2], lower[1], lower[0])
    let upperColor = colors.rgb(upper[2], upper[1], upper[0])
    let result = images.inRange(img, lowerColor, upperColor)

    debugFlow.debugBlock(() => {
        images.save(result, '/sdcard/inrange-after.jpg')
    })

    return result
}

export function opencvDetectPolyLocation(img, polyNum, mode) {
    if (mode === void 0) { mode = 0; }

    let mat = img.mat
    let contours = new ArrayList()
    let result = []

    Imgproc.findContours(mat, contours, new Mat(), mode, Imgproc.CHAIN_APPROX_SIMPLE, new Point(0.0, 0.0))
   
    for (let i = 0; i < contours.size(); i++) {
        const elem = contours.get(i);
        let epsilon = 0.02 * Imgproc.arcLength(new MatOfPoint2f(elem.toArray()), true)

        let contourPloy = new MatOfPoint2f()
        Imgproc.approxPolyDP(new MatOfPoint2f(elem.toArray()), contourPloy, epsilon, true)
        let moment = Imgproc.moments(elem)
        let x = parseInt(moment.m10 / moment.m00)
        let y = parseInt(moment.m01 / moment.m00)
        let curPolyNum = contourPloy.toArray().length
        logger.v(`Detected ${curPolyNum} poly at (${x}, ${y}) ${curPolyNum == polyNum ? "!!Target!!" : ""}`)

        if (curPolyNum == polyNum) {
            debugFlow.debugBlock(() => {
                let paint = img.clone()
                let paintMat = paint.mat

                let newPoint = new MatOfPoint(contourPloy.toArray())
                let tmpList = new ArrayList()
                tmpList.add(newPoint)
                Imgproc.drawContours(paintMat, tmpList, -1, new Scalar(255.0, 255.0, 0.0))
                Imgproc.drawMarker(paintMat, new Point(x, y), new Scalar(0.0, 0.0, 255.0))
                let savedImg = images.matToImage(paintMat)
                images.save(savedImg, '/sdcard/approxPolyDP-after.jpg')
                savedImg.recycle()
                paint.recycle()
            })

            result.push({
                x: x,
                y: y
            })
        }
    }
    return result
}