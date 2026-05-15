import React from 'react'
import Taro, {useShareAppMessage} from '@tarojs/taro'
import StarBackground from '@/components/StarBackground'

interface Sport {
  id: number
  name: string
  icon: string
  desc: string
  benefit: string
  origin: string
}

const sports: Sport[] = [
  {
    id: 1,
    name: '花炮',
    icon: 'i-mdi-trophy',
    desc: '花炮是流传于我国南方地区的传统民间体育项目，又称"抢花炮"，被誉为"东方橄榄球"。比赛时两队争夺炮架上的花炮，通过传递、掩护、拦截等方式将花炮送入对方得分区。',
    benefit: '锻炼团队协作、身体协调与战术意识，增强亲子默契。',
    origin: '起源于广西壮族地区，已有数百年历史，是全国少数民族传统体育运动会正式比赛项目。'
  },
  {
    id: 2,
    name: '竹竿舞',
    icon: 'i-mdi-human-male-female',
    desc: '竹竿舞是黎族、苗族等少数民族的传统舞蹈，又称"打柴舞"。舞者在有节奏开合的竹竿间跳跃穿梭，配合民族音乐展现出灵动优美的舞姿。',
    benefit: '培养节奏感与身体灵活性，提升反应速度与协调性。',
    origin: '海南黎族传统舞蹈，已入选国家级非物质文化遗产名录。'
  },
  {
    id: 3,
    name: '射艺',
    icon: 'i-mdi-bow-arrow',
    desc: '射艺是中国传统射箭运动的统称，包含礼射、武射等多种形式。参与者学习持弓、搭箭、瞄准、发射的完整流程，感受"发而不中，反求诸己"的儒家射道精神。',
    benefit: '提升专注力、耐心与身体控制能力，培养沉稳气质。',
    origin: '源于先秦礼射制度，是"六艺"之一，承载着中华礼乐文明的深厚底蕴。'
  },
  {
    id: 4,
    name: '踩高跷',
    icon: 'i-mdi-human-handsup',
    desc: '踩高跷是我国民间广为流传的传统游艺活动，参与者双脚踩在绑有踏脚的高跷上行走、奔跑甚至跳跃，体验高空行走的独特乐趣。',
    benefit: '锻炼平衡能力、勇气与身体协调性，增强自信心。',
    origin: '起源于古代百戏，流传于全国各地，是春节、庙会等传统节庆的常见表演项目。'
  },
  {
    id: 5,
    name: '拔河',
    icon: 'i-mdi-source-pull',
    desc: '拔河是中国传统团体竞技项目，双方队伍握住长绳两端，依靠团队合力将对方拉过中线。简单直接的比赛形式充满力量与激情。',
    benefit: '增强上肢力量与团队凝聚力，培养拼搏精神与集体荣誉感。',
    origin: '起源于春秋战国时期，最初用于军事训练，后演变为民间体育项目。'
  },
  {
    id: 6,
    name: '滚铁环',
    icon: 'i-mdi-circle-outline',
    desc: '滚铁环是传统儿童游戏，用铁钩推动铁环向前滚动，可直行、转弯甚至跨越障碍。铁环滚动的清脆声响承载着几代人的童年记忆。',
    benefit: '提升手眼协调与精细动作控制，锻炼耐心与专注力。',
    origin: '流传于全国各地，是20世纪中国城乡儿童最喜爱的户外活动之一。'
  }
]

export default function FamilySports() {
  useShareAppMessage(() => ({title: '趣种地亲子运动 · 传统文化体验'}))

  const goBooking = (project: string) => {
    Taro.navigateTo({url: `/pages/booking/index?type=family_sports&project=${encodeURIComponent(project)}`})
  }

  const goPoster = (project: string) => {
    Taro.navigateTo({
      url: `/pages/poster/index?type=project&projectType=family_sports&projectName=${encodeURIComponent(project)}`
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        {/* 页面标题 */}
        <h2 className="text-2xl font-bold text-foreground text-center mb-2">亲子运动</h2>
        <p className="text-lg text-muted-foreground text-center mb-6">
          传统文化运动项目体验
        </p>

        {/* 项目介绍 */}
        <div className="rounded-2xl p-5 mb-6 bg-card-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="i-mdi-heart text-2xl text-primary" />
            <h3 className="text-xl font-bold text-foreground">运动介绍</h3>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            亲子运动板块精选具有深厚文化底蕴的传统民间体育项目，让孩子在运动中感受中华传统文化的独特魅力。每一个项目都经过专业教练指导，安全有趣，适合亲子共同参与。
          </p>
        </div>

        {/* 运动项目列表 */}
        <div className="flex flex-col gap-4">
          {sports.map((sport, index) => (
            <div key={sport.id} className="rounded-2xl p-5 bg-card-white">
              {/* 序号与标题 */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{background: 'linear-gradient(135deg, #43A047, #2E7D32)'}}
                >
                  <span className="text-lg font-bold text-white">{index + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`${sport.icon} text-2xl text-primary`} />
                  <h3 className="text-xl font-bold text-foreground">{sport.name}</h3>
                </div>
              </div>

              {/* 描述 */}
              <p className="text-lg text-muted-foreground leading-relaxed mb-3">
                {sport.desc}
              </p>

              {/* 益处 */}
              <div
                className="rounded-lg p-3 mb-3"
                style={{background: 'rgba(67, 160, 71, 0.06)'}}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="i-mdi-star text-lg text-primary" />
                  <span className="text-lg font-semibold text-foreground">运动益处</span>
                </div>
                <p className="text-base text-muted-foreground">{sport.benefit}</p>
              </div>

              {/* 文化渊源 */}
              <div
                className="rounded-lg p-3 mb-4"
                style={{background: 'rgba(249, 168, 37, 0.08)'}}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="i-mdi-book-open-variant text-lg" style={{color: '#F9A825'}} />
                  <span className="text-lg font-semibold text-foreground">文化渊源</span>
                </div>
                <p className="text-base text-muted-foreground">{sport.origin}</p>
              </div>

              <div className="flex flex-row gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => goBooking(sport.name)}
                  className="flex-1 py-2 flex items-center justify-center leading-none text-lg font-semibold rounded-lg"
                  style={{background: 'rgba(67, 160, 71, 0.1)', color: '#388E3C'}}
                >
                  预约体验
                </button>
                <button
                  type="button"
                  onClick={() => goPoster(sport.name)}
                  className="py-2 px-4 flex items-center justify-center leading-none text-lg font-semibold rounded-lg"
                  style={{background: 'rgba(67, 160, 71, 0.05)', color: '#388E3C', border: '1px solid rgba(67,160,71,0.2)'}}
                >
                  <div className="i-mdi-share-variant text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
