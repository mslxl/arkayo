import * as capture from '../../../capture'
import * as ocr from '../../../ocr'
import * as core from '../../../core'
import * as loggger from '../../../logger'
import {debugBlock} from 'debug-flow'

importClass(org.opencv.core.Mat)
importClass(org.opencv.core.MatOfDMatch)
importClass(org.opencv.core.Scalar)
importClass(org.opencv.core.CvType)
importClass(org.opencv.core.MatOfKeyPoint)
importClass(org.opencv.features2d.BRISK)
importClass(org.opencv.features2d.BFMatcher)
importClass(org.opencv.features2d.Feature2D)
importClass(org.opencv.features2d.Features2d)
importClass(org.opencv.imgcodecs.Imgcodecs)
importClass(org.opencv.imgproc.Imgproc)

export default function adjustTo9H() {
    capture.refresh()
    let up = images.read('./res/recruit/up-arrow.jpg')
    let re = capture.shot()

    let kre = detectFeature(re)
    let kup = detectFeature(up)
    let matcher = new BFMatcher()
    let matchPoints = new MatOfDMatch()
    matcher.match(kup.desc, kre.desc, matchPoints)
    let dmatchs = transArrayFromJava(matchPoints.toArray())
    dmatchs = dmatchs.sort((a,b)=>a.distance - b.distance)
    dmatchs = dmatchs.slice(0,5)
    let minX = Number.MAX_VALUE
    let minY = Number.MAX_VALUE
    for (const it of dmatchs) {
        let point = kre.kp.toArray()[it.trainIdx]
        if(point.x < minX){
            minX = point.x
        }
        if(point.y < minY){
            minY = point.y
        }
        debugBlock(()=>loggger.v(`${point.x},${point.y} distance: ${it.distance}`))
    }
    core.clickXY(minX,minY)

    up.recycle()
}


function detectFeature(img) {
    let mat = img.mat
    let detector = BRISK.create()
    let target = new Mat(mat.size(), mat.type())
    Imgproc.cvtColor(mat, target, Imgproc.COLOR_BGR2GRAY)
    Imgproc.Laplacian(target, target, mat.depth(), 3)

    let kp = new MatOfKeyPoint()
    let desc = new Mat()
    detector.detectAndCompute(target, new Mat(), kp, desc)
    desc.convertTo(desc, CvType.CV_32F)
    img.recycle()
    return {
        kp: kp,
        desc: desc
    }
}

function transArrayFromJava(javaObj){
    let arr = []
    for(let i = 0;i < javaObj.length;i++){
        arr.push(javaObj[i])
    }
    return arr
}
