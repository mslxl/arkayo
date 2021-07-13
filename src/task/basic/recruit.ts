import TaskRunner from '../i'
import * as capture from '../../capture'
import * as ocr from '../../ocr'
import * as core from '../../core'
import * as logger from '../../logger'
import * as colorHelper from '../../color'
import BackToMain from '../internal/back-to-main'
import adjustTo9H from './recruit/opencv-adjustTo9H'

import 'core-js/features/map'
import { WrapResult } from '../../ocr'

export default class Recruit extends TaskRunner {
    getName(): string {
        return "自动公招（6月25日数据）"
    }
    getDesc(): string {
        return [
            "在主界面运行",
            "该任务数据添加于 6 月 25 日。任务在发现 6 星 tag 时会停止运行，在发现能锁 5 星或 4 星时则会自动公招并满 9 小时",
            "都不能锁则直接拉满 9 小时",
            "注意：由于上游 Auto.js 的 Bug，该任物尚不能正常运行。详见：Issue #681"
        ].reduce((pre: string, acc: string) => `${pre}。\n${acc}`)
    }
    start(): void {
        capture.refresh()
        let t = ocr.findText('公开招募', ocr.wrapResult(ocr.detect(capture.shot())))
        if (!t) { return }
        core.clickRect(t)


        function clickT(text: string[], meta: WrapResult[]): boolean {
            let tt = ocr.findAnyText(text, meta)
            if (tt) {
                core.clickRect(tt)
                core.wait(5)
                return true
            }
            return false
        }

        capture.setAutoCapture(false)
        while (true) {
            capture.refresh()
            let meta = ocr.wrapResult(ocr.detect(capture.shot()))
            if (clickT(['聘用', '用候选', '开始招募'], meta)) {
                continue
            }

            if (clickT(['SK', 'KI', 'IP'], meta)) {
                continue
            }

            t = ocr.findAnyText(['重复获得', '首次获得', '的信物', '凭证'],  meta)
            if (t) {
                let width = Math.max(device.width, device.height)
                let height = Math.min(device.width, device.height)
                core.clickXY(random(10, width - 10), random(10, height - 10))
                core.wait(10)
                continue
            }

            t = ocr.findAnyText(['可获得的干员', '职业需求', '招募预算'],  meta)
            if (t) {
                if (this.calc()) {
                    this.back()
                    return
                }
                core.wait(10)
                continue
            }
            break
        }

    }

    /**
     * @returns Suggest stop
     */
    calc(): boolean {
        capture.refresh()
        let elems = ocr.wrapResult(ocr.detect(capture.shot()))
        const stopPriority = ['高级', '资深']  // 我在想什么桃子
        const normalPriority = [
            ['复活', '控场'], ['控场', '特种'], // 红
            ['复活', '削弱'], ['削弱', '近战'], ['削弱', '特种'], // 槐琥
            ['控场', '先锋'], ['控场', '费用'],// 德狗
            ['削弱', '辅助'], // 初雪
            ['费用', '支援'], ['支援', '先锋'], // 丢人
            ['防护', '近卫'], // 星极
            ['防护', '输出'], // 相声 火神 星极
            ['生存', '重装'], ['生存', '防护'], // 火神
            ['输出', '重装'], // 相声 火神
            ['输出', '辅助'], // 真理
            ['输出', '特种'], // 崖心 师蝎
            ['生存', '特种'], // 师蝎
            ['群攻', '削弱'], // 陨星
            ['防护', '位移'], // 面包
            ['控场', '近战'], //德狗 红
            ['召唤', '远程'], ['召唤', '辅助'], ['召唤', '控场'], // 梅尔
            ['控场', '远程'], // 梅尔 格劳克斯
            ['控场', '辅助'], // 梅尔 格劳克斯
            ['爆发', '远程'], ['爆发', '狙击'], ['爆发', '输出'], // 守林人
            ['减速', '特种'], ['减速', '位移'], // 熊猫人
            ['减速', '控场'], // 格劳克斯
            ['减速', '治疗'], ['输出', '治疗'], // 夜魔 (鹰小姐 光影衣服什么时候复刻阿)
            //---- 4 ------
            ['复活'], ['特种'], ['复活', '防护'],
            ['位移'], ['支援', '远程'], ['支援', '近战'],
            ['支援', '医疗'], ['支援', '治疗'], ['支援', '近卫'],
            ['削弱', '远程'], ['削弱', '狙击'], ['削弱', '术师'],
            ['削弱', '输出'], ['削弱', '群攻'], ['削弱', '复活'],
            ['费用', '治疗'], ['减速', '近战'], ['减速', '狙击'],
            ['生存', '远程'], ['生存', '狙击'], ['减速', '术师'],
            ['减速', '近卫'], ['减速', '输出'], ['减速', '群攻'],
            ['输出', '支援'],
        ]

        // 检查 stop tag
        for (const item of elems) {
            for (const tag of stopPriority) {
                if (item.t.indexOf(tag) != -1) {
                    // 这还自动什么，赶紧手动
                    return true
                }
            }

        }
        // 真正的自动

        // normalPriority 转为 字典 同时进行匹配, 将匹配结果放在 dict 中
        let tagMap: Map<string, boolean> = new Map()
        let dict: { name: string, status: boolean }[][] = normalPriority.map(item => item.map(tag => {
            let matched = false
            // 查表，如果存在则已匹配，不存在则进行匹配操作
            if (!tagMap.get(tag)) {
                for (const t of elems) {
                    if (t.t.indexOf(tag) != -1) {
                        matched = true
                        tagMap.set(tag, true)
                        break
                    }
                }
            } else {
                matched = true
            }

            return {
                name: tag,
                status: matched
            }
        })
        )
        logger.i(`TagMap: ${JSON.stringify(tagMap)}`)

        // 找一个满足条件的最高优先
        let statifyItem = null
        outter:
        for (const item of dict) {
            for (const tagElem of item) {
                if (!tagElem.status) {
                    continue outter
                }
            }
            // 这个 item 满足条件，不满足的都 continue 了
            statifyItem = item
            break
        }

        // 按着这个招聘,没有直接拉满 9 小时
        if (statifyItem) {
            logger.i(`StatifyItem: ${JSON.stringify(statifyItem)}`)
            for (const tag of statifyItem) {
                for (const e of elems) {
                    if (e.t.indexOf(tag.name) != -1) {
                        core.clickRect(e)
                    }
                }
            }
        }
        adjustTo9H()
        return false
    }



    back() {
        new BackToMain().start()
    }
}