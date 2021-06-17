import * as logger from './logger'
import * as cache from './config'

const util: any = images
const coUtil: any = colors

let lastScala = 1
function isMatch(img: Image, firstPoint: Point, colors: (number | string)[][]): boolean {
  // 无对应点
  if (colors.length == 0) {
    return true
  }


  function tryMatch(scalaRatio: number): boolean {
    logger.v(`Try scala ${scalaRatio} at point (${firstPoint.x}, ${firstPoint.y})`)
    for (const elem of colors) {
      let offsetX: number = (elem[0] as number) * scalaRatio
      let offsetY: number = (elem[1] as number) * scalaRatio
      let colour: string = coUtil.parseColor(elem[2] as string)
      if (!coUtil.isSimilar(colour, util.pixel(img, firstPoint.x + offsetX, firstPoint.y + offsetY))) {
        return false
      }
    }
    lastScala = scalaRatio
    return true
  }

  // 尝试不进行缩放可匹配
  if (tryMatch(1)) {
    return true
  }

  // 按照上次成功的比例缩放匹配尝试
  if (lastScala != 1 && tryMatch(lastScala)) {
    return true
  }

  // 开始尝试不同比例
  // 找出最近的点
  let nearest = {
    m: Number.MAX_VALUE,
    p: colors[0],
  }
  for (const elem of colors) {
    let offsetX: number = elem[0] as number
    let offsetY: number = elem[1] as number
    let m = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2))
    if (m < nearest.m) {
      nearest.m = m
      nearest.p = elem
    }
  }

  let maxM = nearest.m * 2
  let minM = 2
  for (let curM = minM; curM <= maxM; curM++) {
    let scala = curM / nearest.m // 缩放比例
    if (tryMatch(scala)) {
      return true
    }
  }
  return false
}

/**
 * 这将是一个漫长的过程
 * @param img 
 * @param firstColor 
 * @param colors 
 * @returns 
 */
export function findColors(img: Image, firstColor: string, colors: (number | string)[][]): MatchResult | null {
  logger.i(`Detect colors(begin with ${firstColor})...`)
  let pos = util.findAllPointsForColor(img, firstColor)
  logger.i(`It could be consume a lot of times( ${pos.length} objects)...`)
  for (const p of pos) {
    if (isMatch(img, p, colors)) {
      return {
        x: p.x,
        y: p.y,
        scala: lastScala
      }
    }
  }
  return null
}

interface MatchResult {
  x: number,
  y: number,
  scala: number
}

export function findColorsWithCache(key: string, img: Image, firstColor: string, colors: (number | string)[][]): MatchResult | null {
  let storageKey = `color-cache-${key}-${firstColor}`
  let cacheData = cache.get(storageKey)
  if (cacheData == null) {
    let v = findColors(img, firstColor, colors)
    cache.set(storageKey, v)
    return v
  } else {
    lastScala = cacheData.scala
    if (isMatch(img, cacheData, colors)) {
      let v = {
        x: cacheData.x,
        y: cacheData.y,
        scala: lastScala
      }
      if (lastScala != cacheData.scala) {
        cache.set(storageKey, v)
      }
      return v
    }else{
      return null
    }
  }
}

export const findMultiColors = findColors
export const findMultiColorsWithCache = findColorsWithCache