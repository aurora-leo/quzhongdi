import React, {useState} from 'react'
import Taro, {useShareAppMessage} from '@tarojs/taro'
import StarBackground from '@/components/StarBackground'

interface Product {
  id: number
  name: string
  icon: string
  desc: string
  season: string
  cycle: string
}

interface SoilType {
  id: number
  name: string
  desc: string
  suitable: string
}

const products: Product[] = [
  {id: 1, name: '番茄', icon: 'i-mdi-fruit-cherries', desc: '酸甜可口，富含番茄红素，适合家庭种植。', season: '春季、秋季', cycle: '60-80天'},
  {id: 2, name: '黄瓜', icon: 'i-mdi-fruit-citrus', desc: '清脆爽口，水分充足，夏季消暑佳品。', season: '春季、夏季', cycle: '50-70天'},
  {id: 3, name: '辣椒', icon: 'i-mdi-chili-mild', desc: '品种丰富，从甜椒到朝天椒，满足各种口味。', season: '春季、夏季', cycle: '70-90天'},
  {id: 4, name: '茄子', icon: 'i-mdi-fruit-grapes', desc: '肉质细嫩，营养丰富，紫色外观增添田园色彩。', season: '春季、夏季', cycle: '80-100天'},
  {id: 5, name: '草莓', icon: 'i-mdi-fruit-cherries', desc: '香甜多汁，深受孩子喜爱，采摘体验感极佳。', season: '秋季、冬季', cycle: '90-120天'},
  {id: 6, name: '生菜', icon: 'i-mdi-leaf', desc: '生长快速，30天即可采收，适合新手体验。', season: '全年', cycle: '25-40天'},
  {id: 7, name: '胡萝卜', icon: 'i-mdi-carrot', desc: '根茎类蔬菜，适合沙质土壤，孩子挖掘乐趣多。', season: '春季、秋季', cycle: '70-90天'},
  {id: 8, name: '土豆', icon: 'i-mdi-food-variant', desc: '产量高、易管理，收获时充满惊喜与成就感。', season: '春季、秋季', cycle: '80-100天'}
]

const soilTypes: SoilType[] = [
  {id: 1, name: '黑土', desc: '肥沃疏松，有机质含量高，保水保肥能力强。', suitable: '番茄、黄瓜、茄子、土豆'},
  {id: 2, name: '酸性土壤', desc: 'pH值较低，富含铁铝元素，适合喜酸作物生长。', suitable: '草莓、蓝莓、茶树'},
  {id: 3, name: '沙质土壤', desc: '排水性好、透气性强，根系发育空间充足。', suitable: '胡萝卜、土豆、花生、红薯'},
  {id: 4, name: '红壤', desc: '富含铁铝氧化物，适合热带亚热带作物生长。', suitable: '辣椒、茄子、热带水果'},
  {id: 5, name: '壤土', desc: '砂黏适中，综合肥力高，是最理想的种植土壤。', suitable: '生菜、番茄、黄瓜、草莓'}
]

export default function NatureClass() {
  const [activeTab, setActiveTab] = useState<'product' | 'soil' | 'coop'>('product')
  useShareAppMessage(() => ({title: '趣种地自然课堂 · 云端种植体验'}))

  const goBooking = (project: string) => {
    Taro.navigateTo({url: `/pages/booking/index?type=nature_class&project=${encodeURIComponent(project)}`})
  }

  const goPoster = (project: string) => {
    Taro.navigateTo({
      url: `/pages/poster/index?type=project&projectType=nature_class&projectName=${encodeURIComponent(project)}`
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        {/* 页面标题 */}
        <h2 className="text-2xl font-bold text-foreground text-center mb-2">自然课堂</h2>
        <p className="text-lg text-muted-foreground text-center mb-6">
          用户云控商家种地，体验种植乐趣
        </p>

        {/* 合作模式说明 */}
        <div className="rounded-2xl p-5 mb-6 bg-card-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="i-mdi-handshake text-2xl text-primary" />
            <h3 className="text-xl font-bold text-foreground">合作模式</h3>
          </div>
          <p className="text-lg text-foreground leading-relaxed">
            平台与海南本地农庄、农户深度合作，由农户提供土地与日常养护服务，您远程选择产品品种与地块类型，全程云控种植。平台收取<strong className="text-primary">10%佣金</strong>，农户获得稳定收益，您收获新鲜安全的农产品。
          </p>
        </div>

        {/* Tab切换 */}
        <div className="flex flex-row gap-2 mb-5">
          {[
            {key: 'product' as const, label: '种植产品'},
            {key: 'soil' as const, label: '地块类型'},
            {key: 'coop' as const, label: '收获与邮寄'}
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2 flex items-center justify-center leading-none text-lg font-semibold rounded-xl"
              style={{
                background: activeTab === tab.key ? '#43A047' : 'rgba(67, 160, 71, 0.1)',
                color: activeTab === tab.key ? '#fff' : '#388E3C'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 种植产品列表 */}
        {activeTab === 'product' && (
          <div className="flex flex-col gap-3">
            {products.map(product => (
              <div key={product.id} className="rounded-xl p-4 bg-card-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`${product.icon} text-2xl text-primary`} />
                  <h4 className="text-xl font-bold text-foreground">{product.name}</h4>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed mb-2">
                  {product.desc}
                </p>
                <div className="flex flex-row gap-2 mb-3">
                  <span
                    className="px-3 py-1 rounded-full text-base"
                    style={{background: 'rgba(67, 160, 71, 0.1)', color: '#388E3C'}}
                  >
                    季节：{product.season}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-base"
                    style={{background: 'rgba(67, 160, 71, 0.1)', color: '#388E3C'}}
                  >
                    周期：{product.cycle}
                  </span>
                </div>
                <div className="flex flex-row gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => goBooking(product.name)}
                    className="flex-1 py-2 flex items-center justify-center leading-none text-lg font-semibold rounded-lg"
                    style={{background: 'rgba(67, 160, 71, 0.1)', color: '#388E3C'}}
                  >
                    预约种植
                  </button>
                  <button
                    type="button"
                    onClick={() => goPoster(product.name)}
                    className="py-2 px-4 flex items-center justify-center leading-none text-lg font-semibold rounded-lg"
                    style={{background: 'rgba(67, 160, 71, 0.05)', color: '#388E3C', border: '1px solid rgba(67,160,71,0.2)'}}
                  >
                    <div className="i-mdi-share-variant text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 地块类型列表 */}
        {activeTab === 'soil' && (
          <div className="flex flex-col gap-3">
            {soilTypes.map(soil => (
              <div key={soil.id} className="rounded-xl p-4 bg-card-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="i-mdi-terrain text-2xl text-primary" />
                  <h4 className="text-xl font-bold text-foreground">{soil.name}</h4>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed mb-2">
                  {soil.desc}
                </p>
                <p className="text-base" style={{color: '#558B2F'}}>
                  适合种植：{soil.suitable}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 收获与邮寄 */}
        {activeTab === 'coop' && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl p-4 bg-card-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="i-mdi-truck-delivery text-2xl text-primary" />
                <h4 className="text-xl font-bold text-foreground">成熟后邮寄服务</h4>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                作物成熟后，农户会第一时间通知您。您可选择以下两种方式：
              </p>
            </div>

            <div className="rounded-xl p-4 bg-card-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="i-mdi-package-variant-closed text-2xl text-primary" />
                <h4 className="text-xl font-bold text-foreground">选择邮寄</h4>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-2">
                填写收货地址，支付邮费与包装费，新鲜农产品直送到家。冷链配送保证品质，海南本地次日达，全国48小时达。
              </p>
              <div className="flex flex-row gap-2 mt-3">
                <span
                  className="px-3 py-1 rounded-full text-base"
                  style={{background: 'rgba(67, 160, 71, 0.1)', color: '#388E3C'}}
                >
                  冷链配送
                </span>
                <span
                  className="px-3 py-1 rounded-full text-base"
                  style={{background: 'rgba(67, 160, 71, 0.1)', color: '#388E3C'}}
                >
                  品质保证
                </span>
              </div>
            </div>

            <div className="rounded-xl p-4 bg-card-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="i-mdi-store text-2xl text-primary" />
                <h4 className="text-xl font-bold text-foreground">现场采摘</h4>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                预约时间前往农庄现场采摘，亲身体验收获的喜悦，享受亲子采摘乐趣，无需额外费用。
              </p>
            </div>

            <div className="rounded-xl p-4 bg-card-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="i-mdi-calculator text-2xl text-primary" />
                <h4 className="text-xl font-bold text-foreground">费用说明</h4>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                种植费用 = 种子/种苗费 + 土地租赁费 + 农户养护劳务费。平台统一收取总费用的<strong className="text-primary">10%</strong>作为服务佣金。邮寄费用按实际重量与距离计算。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
