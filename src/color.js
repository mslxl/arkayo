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
/**
 * 
 * @param {*} img Not mat
 * @param {*} polyNum 
 * @param {*} mode findContours.mode
 * @param {number} minArea 面积
 * @returns {x:number,y:number}[]
 */
export function opencvDetectPolyLocation(img, polyNum, mode = 0, minArea = 0) {

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


        if (curPolyNum == polyNum) {
            if (minArea != 0) {
                if (Imgproc.contourArea(elem) < minArea) {
                    continue
                }
            }
            logger.v(`Detected ${curPolyNum} poly at (${x}, ${y}) area = ${Imgproc.contourArea(elem)}!!Target!!`)
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
        } else {
            debugFlow.debugBlock(()=>{
                logger.v(`Detected ${curPolyNum} poly at (${x}, ${y})`)
            })
        }
    }
    img.recycle()
    return result
}

export function opencvDetectColorLocation(img, lower, upper) {

    let cvtImg = debugFlow.run(() => {
        let org = img.clone()
        let ret = opencvInRange(org, lower, upper)
        org.recycle()
        return ret
    })

    let mat = cvtImg.mat
    let target = new Mat(mat.size(), mat.type())
    let list = new ArrayList()
    Imgproc.findContours(mat, list, new Mat(), Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE)
    debugFlow.debugBlock(() => {
        logger.v(`opencvDetectColorLocation: size ${list.size()}`)
        Imgproc.cvtColor(target, target, Imgproc.COLOR_GRAY2BGR)
    })
    let result = []
    for (let i = 0; i < list.size(); i++) {
        let point = list.get(i)

        let rect = Imgproc.boundingRect(point)
        let returnItem = {
            x: rect.x,
            y: rect.y,
            w: rect.width,
            h: rect.height,
            centreX: rect.x + rect.width / 2,
            centreY: rect.y + rect.height / 2
        }
        result.push(returnItem)

        debugFlow.debugBlock(() => {
            let tmpList = new ArrayList()
            tmpList.add(point)
            Imgproc.drawContours(target, tmpList, -1, new Scalar(0.0, 0.0, 255.0))

            Imgproc.rectangle(target, new Point(rect.x, rect.y),
                new Point(rect.x + rect.width, rect.y + rect.height),
                new Scalar(255.0, 255.0, 0.0)
            )
            Imgproc.drawMarker(target, new Point(returnItem.centreX, returnItem.centreY), new Scalar(255.0, 0.0, 0.0))

        })
    }
    debugFlow.debugBlock(() => {
        let saveImg = images.matToImage(target)
        images.save(saveImg, '/sdcard/detectColor.jpg')
        saveImg.recycle()
        logger.v(`opencvDetectColorLocation:  ${JSON.stringify(result)}`)
    })
    cvtImg.recycle()
    img.recycle()
    $debug.gc()
    return result
}

export function searchCircle(img, minRadius = 0, maxRadius = 0) {
    let gray = images.cvtColor(img, "BGR2GRAY")
    let result = images.findCircles(gray, {
        minRadius: minRadius,
        maxRadius: maxRadius,
        minDst: 50
    })
    gray.recycle()
    return result
}