import React, {useState, useMemo, useCallback, useEffect} from 'react'
import Taro from '@tarojs/taro'
import {Picker} from '@tarojs/components'
import StarBackground from '@/components/StarBackground'
import {createOrder, getAvailableCoupons, getMyPoints} from '@/db/api'
import {useAuth} from '@/contexts/AuthContext'

const natureProjects = ['番茄', '黄瓜', '辣椒', '茄子', '草莓', '生菜', '胡萝卜', '土豆']
const soilTypes = ['黑土', '酸性土壤', '沙质土壤', '红壤', '壤土']
const sportsProjects = ['花炮', '竹竿舞', '射艺', '踩高跷', '拔河', '滚铁环']

export default function Booking() {
  const {user} = useAuth()
  const params = useMemo(() => {
    const p = Taro.getCurrentInstance().router?.params || {}
    return {
      type: (p.type || 'nature_class') as 'nature_class' | 'family_sports',
      project: (p.project || '') as string
    }
  }, [])

  const isNature = params.type === 'nature_class'
  const projectList = isNature ? natureProjects : sportsProjects

  const [projectName, setProjectName] = useState(() => {
    const idx = projectList.indexOf(params.project)
    return idx >= 0 ? idx : 0
  })
  const [soilIdx, setSoilIdx] = useState(0)
  const [date, setDate] = useState('')
  const [count, setCount] = useState('1')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const [coupons, setCoupons] = useState<any[]>([])
  const [couponIdx, setCouponIdx] = useState(-1)
  const [points, setPoints] = useState(0)
  const [usePoints, setUsePoints] = useState(false)

  const loadCouponsAndPoints = useCallback(async () => {
    try {
      const c = await getAvailableCoupons()
      setCoupons(c)
      const p = await getMyPoints()
      setPoints(p)
    } catch (e) {
      console.error('load coupons/points failed', e)
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadCouponsAndPoints()
    }
  }, [user, loadCouponsAndPoints])

  const basePrice = isNature ? 100 : 80
  const people = parseInt(count) || 1
  const originalAmount = basePrice * people

  const selectedCoupon = couponIdx >= 0 && coupons[couponIdx] ? coupons[couponIdx] : null
  const couponDiscount = selectedCoupon ? (selectedCoupon.coupons?.amount || 0) : 0
  const pointsDiscount = usePoints && points >= 100 ? Math.min(Math.floor(points / 100), Math.floor(originalAmount - couponDiscount)) : 0
  const finalAmount = Math.max(0, originalAmount - couponDiscount - pointsDiscount)

  const handleSubmit = useCallback(async () => {
    if (!date) {
      Taro.showToast({title: '请选择预约日期', icon: 'none'})
      return
    }
    if (!count.trim() || parseInt(count) < 1) {
      Taro.showToast({title: '请输入参与人数', icon: 'none'})
      return
    }
    if (!name.trim()) {
      Taro.showToast({title: '请输入联系人姓名', icon: 'none'})
      return
    }
    if (!phone.trim()) {
      Taro.showToast({title: '请输入联系人电话', icon: 'none'})
      return
    }

    setLoading(true)
    try {
      await createOrder({
        project_type: params.type,
        project_name: projectList[projectName],
        soil_type: isNature ? soilTypes[soilIdx] : undefined,
        appointment_date: date,
        participant_count: parseInt(count),
        contact_name: name.trim(),
        contact_phone: phone.trim(),
        coupon_id: selectedCoupon?.coupon_id || undefined,
        points_used: pointsDiscount * 100,
        original_amount: originalAmount
      })
      Taro.showToast({title: '预约成功', icon: 'success'})
      setTimeout(() => {
        Taro.switchTab({url: '/pages/orders/index'})
      }, 800)
    } catch (error: any) {
      Taro.showToast({title: error.message || '预约失败，请稍后重试', icon: 'none'})
    } finally {
      setLoading(false)
    }
  }, [params.type, projectName, soilIdx, date, count, name, phone, isNature, projectList, selectedCoupon, pointsDiscount, originalAmount])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        <h2 className="text-2xl font-bold text-foreground text-center mb-6">立即预约</h2>

        <div className="rounded-2xl p-6 bg-card-white">
          {/* 项目类型 */}
          <div className="mb-5">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xl text-foreground">项目类型</span>
            </div>
            <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
              <span className="text-xl text-foreground">{isNature ? '自然课堂' : '亲子运动'}</span>
            </div>
          </div>

          {/* 具体项目 */}
          <div className="mb-5">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xl text-foreground">具体项目</span>
              <span className="text-destructive">*</span>
            </div>
            <Picker
              mode="selector"
              range={projectList}
              value={projectName}
              onChange={(e) => setProjectName(e.detail.value as number)}
            >
              <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
                <span className="text-xl text-foreground">{projectList[projectName]}</span>
              </div>
            </Picker>
          </div>

          {/* 地块类型（仅自然课堂） */}
          {isNature && (
            <div className="mb-5">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xl text-foreground">地块类型</span>
                <span className="text-destructive">*</span>
              </div>
              <Picker
                mode="selector"
                range={soilTypes}
                value={soilIdx}
                onChange={(e) => setSoilIdx(e.detail.value as number)}
              >
                <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
                  <span className="text-xl text-foreground">{soilTypes[soilIdx]}</span>
                </div>
              </Picker>
            </div>
          )}

          {/* 预约日期 */}
          <div className="mb-5">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xl text-foreground">预约日期</span>
              <span className="text-destructive">*</span>
            </div>
            <Picker
              mode="date"
              value={date}
              onChange={(e) => setDate(e.detail.value as string)}
            >
              <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
                <span className="text-xl text-foreground">{date || '请选择预约日期'}</span>
              </div>
            </Picker>
          </div>

          {/* 参与人数 */}
          <div className="mb-5">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xl text-foreground">参与人数</span>
              <span className="text-destructive">*</span>
            </div>
            <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
              <input
                className="w-full text-xl text-foreground bg-transparent outline-none"
                placeholder="请输入参与人数"
                type="number"
                value={count}
                onInput={(e) => {
                  const ev = e as any
                  setCount(ev.detail?.value ?? ev.target?.value ?? '')
                }}
              />
            </div>
          </div>

          {/* 联系人姓名 */}
          <div className="mb-5">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xl text-foreground">联系人姓名</span>
              <span className="text-destructive">*</span>
            </div>
            <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
              <input
                className="w-full text-xl text-foreground bg-transparent outline-none"
                placeholder="请输入联系人姓名"
                value={name}
                onInput={(e) => {
                  const ev = e as any
                  setName(ev.detail?.value ?? ev.target?.value ?? '')
                }}
              />
            </div>
          </div>

          {/* 联系人电话 */}
          <div className="mb-5">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xl text-foreground">联系人电话</span>
              <span className="text-destructive">*</span>
            </div>
            <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
              <input
                className="w-full text-xl text-foreground bg-transparent outline-none"
                placeholder="请输入联系人电话"
                type="tel"
                value={phone}
                onInput={(e) => {
                  const ev = e as any
                  setPhone(ev.detail?.value ?? ev.target?.value ?? '')
                }}
              />
            </div>
          </div>

          {/* 优惠券 */}
          {coupons.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xl text-foreground">优惠券</span>
              </div>
              <Picker
                mode="selector"
                range={['不使用优惠券', ...coupons.map((c: any) => `${c.coupons?.name} -¥${c.coupons?.amount}`)]}
                value={couponIdx + 1}
                onChange={(e) => {
                  const v = e.detail.value as number
                  setCouponIdx(v - 1)
                }}
              >
                <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
                  <span className="text-xl text-foreground">
                    {couponIdx >= 0 && coupons[couponIdx]
                      ? `${coupons[couponIdx].coupons?.name} -¥${coupons[couponIdx].coupons?.amount}`
                      : '不使用优惠券'}
                  </span>
                </div>
              </Picker>
            </div>
          )}

          {/* 积分抵扣 */}
          {points >= 100 && (
            <div className="mb-5 flex items-center gap-3" onClick={() => setUsePoints(!usePoints)}>
              <div
                className="w-5 h-5 rounded flex items-center justify-center"
                style={{border: '2px solid', borderColor: usePoints ? '#388E3C' : '#ccc'}}
              >
                {usePoints && <div className="i-mdi-check text-sm" style={{color: '#388E3C'}} />}
              </div>
              <span className="text-lg text-foreground">使用积分抵扣（当前{points}积分，可抵¥{Math.min(Math.floor(points / 100), Math.floor(originalAmount - couponDiscount))}）</span>
            </div>
          )}

          {/* 金额明细 */}
          <div className="mb-6 rounded-xl p-4" style={{background: 'rgba(67, 160, 71, 0.06)'}}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg text-foreground">原价</span>
              <span className="text-lg text-foreground">¥{originalAmount}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg text-foreground">优惠券</span>
                <span className="text-lg text-primary">-¥{couponDiscount}</span>
              </div>
            )}
            {pointsDiscount > 0 && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg text-foreground">积分抵扣</span>
                <span className="text-lg text-primary">-¥{pointsDiscount}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2" style={{borderTop: '1px dashed rgba(56,142,60,0.2)'}}>
              <span className="text-xl font-bold text-foreground">实付金额</span>
              <span className="text-2xl font-bold text-primary">¥{finalAmount}</span>
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl btn-primary-green"
            style={{opacity: loading ? 0.6 : 1}}
          >
            {loading ? '提交中...' : '提交预约'}
          </button>
        </div>
      </div>
    </div>
  )
}
