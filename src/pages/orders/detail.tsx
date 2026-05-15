import React, {useState, useMemo, useCallback, useEffect} from 'react'
import Taro, {getEnv} from '@tarojs/taro'
import StarBackground from '@/components/StarBackground'
import {getOrderById, updateOrderHarvest, cancelOrder, requestRefund} from '@/db/api'
import {supabase} from '@/client/supabase'

interface OrderData {
  id: string
  order_no: string
  project_type: string
  project_name: string
  soil_type: string
  appointment_date: string
  participant_count: number
  contact_name: string
  contact_phone: string
  status: string
  shipping_fee: number
  total_amount: number
  pay_status: string
  logistics_no: string
  logistics_carrier: string
  logistics_status: string
  refund_status: string
  reviewed: boolean
  created_at: string
}

const growthSteps = [
  {key: 'pending', label: '待种植'},
  {key: 'sown', label: '已播种'},
  {key: 'growing', label: '生长中'},
  {key: 'mature', label: '已成熟'}
]

const statusMap: Record<string, string> = {
  pending: '待处理',
  sown: '已播种',
  growing: '生长中',
  mature: '已成熟',
  shipping: '待邮寄',
  shipped: '已邮寄',
  picked: '已采摘',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消'
}

export default function OrderDetail() {
  const id = useMemo(() => Taro.getCurrentInstance().router?.params?.id || '', [])
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)

  const loadOrder = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      await supabase.auth.getUser()
      const data = await getOrderById(id)
      if (data) {
        setOrder(data as OrderData)
      }
    } catch (error: any) {
      Taro.showToast({title: error.message || '加载失败', icon: 'none'})
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadOrder()
  }, [loadOrder])

  const isWeApp = getEnv() === 'WEAPP'

  const handlePickShipping = useCallback(async () => {
    if (!order) return
    Taro.showModal({
      title: '选择邮寄',
      content: '作物成熟后，我们将通过冷链配送到您指定的地址。邮寄费用15元（含包装费），确认选择邮寄吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await updateOrderHarvest(order.id, 'shipping')
            Taro.showToast({title: '已选择邮寄', icon: 'success'})
            loadOrder()
            setShowPayModal(true)
          } catch (error: any) {
            Taro.showToast({title: error.message || '操作失败', icon: 'none'})
          }
        }
      }
    })
  }, [order, loadOrder])

  const handlePickOnsite = useCallback(async () => {
    if (!order) return
    Taro.showModal({
      title: '选择现场采摘',
      content: '预约成功后，请在营业时间内前往农庄现场采摘，无需额外费用。确认选择现场采摘吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await updateOrderHarvest(order.id, 'picked')
            Taro.showToast({title: '已选择现场采摘', icon: 'success'})
            loadOrder()
          } catch (error: any) {
            Taro.showToast({title: error.message || '操作失败', icon: 'none'})
          }
        }
      }
    })
  }, [order, loadOrder])

  const handleCancel = useCallback(async () => {
    if (!order) return
    Taro.showModal({
      title: '取消订单',
      content: '确认取消该预约吗？取消后不可恢复。',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cancelOrder(order.id)
            Taro.showToast({title: '订单已取消', icon: 'success'})
            loadOrder()
          } catch (error: any) {
            Taro.showToast({title: error.message || '取消失败', icon: 'none'})
          }
        }
      }
    })
  }, [order, loadOrder])

  const handleRefund = useCallback(async () => {
    if (!order) return
    Taro.showModal({
      title: '申请退款',
      content: `确认申请退还邮寄费用 ¥${order.shipping_fee || 15} 吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await requestRefund(order.id, order.shipping_fee || 15)
            Taro.showToast({title: '退款申请已提交', icon: 'success'})
            loadOrder()
          } catch (error: any) {
            Taro.showToast({title: error.message || '申请失败', icon: 'none'})
          }
        }
      }
    })
  }, [order, loadOrder])

  const handlePay = useCallback(async () => {
    if (!isWeApp) {
      Taro.showToast({title: '微信支付仅在微信小程序中可用', icon: 'none'})
      return
    }
    if (!order) return

    try {
      Taro.showLoading({title: '正在准备支付...'})
      const loginRes = await Taro.login()
      if (!loginRes.code) {
        Taro.hideLoading()
        Taro.showToast({title: '获取登录信息失败', icon: 'none'})
        return
      }

      const {data: openidData, error: openidError} = await supabase.functions.invoke('get-wechat-openid', {
        body: {code: loginRes.code}
      })
      if (openidError || !openidData?.success) {
        const errMsg = openidData?.error || '获取openid失败'
        Taro.hideLoading()
        Taro.showToast({title: errMsg, icon: 'none'})
        return
      }
      const openid = openidData.openid

      const {data: payData, error: payError} = await supabase.functions.invoke('create-wechat-payment', {
        body: {
          order_id: order.id,
          openid: openid,
          amount: order.shipping_fee || 15
        }
      })
      Taro.hideLoading()

      if (payError || !payData?.success) {
        const errMsg = payData?.error || '支付发起失败'
        Taro.showToast({title: errMsg, icon: 'none'})
        return
      }

      const pp = payData.paymentParams
      Taro.requestPayment({
        timeStamp: pp.timeStamp,
        nonceStr: pp.nonceStr,
        package: pp.package,
        signType: pp.signType,
        paySign: pp.paySign,
        success: () => {
          Taro.showToast({title: '支付成功', icon: 'success'})
          setShowPayModal(false)
          loadOrder()
        },
        fail: () => {
          Taro.showToast({title: '支付已取消', icon: 'none'})
        }
      })
    } catch (err: any) {
      Taro.hideLoading()
      Taro.showToast({title: err.message || '支付失败', icon: 'none'})
    }
  }, [order, isWeApp, loadOrder])

  const goReview = useCallback(() => {
    if (!order) return
    Taro.navigateTo({
      url: `/pages/reviews/create?orderId=${order.id}&projectType=${order.project_type}&projectName=${encodeURIComponent(order.project_name)}`
    })
  }, [order])

  const goPoster = useCallback(() => {
    if (!order) return
    const params = [
      `type=order`,
      `projectType=${order.project_type}`,
      `projectName=${encodeURIComponent(order.project_name)}`,
      `orderNo=${encodeURIComponent(order.order_no)}`,
      `appointmentDate=${order.appointment_date}`,
      `participantCount=${order.participant_count}`,
      `contactName=${encodeURIComponent(order.contact_name)}`
    ].join('&')
    Taro.navigateTo({url: `/pages/poster/index?${params}`})
  }, [order])

  if (!order && !loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <StarBackground />
        <div className="relative z-10 px-5 py-6 text-center">
          <p className="text-xl text-muted-foreground">订单不存在</p>
        </div>
      </div>
    )
  }

  const isNature = order?.project_type === 'nature_class'
  const currentGrowthIndex = growthSteps.findIndex(s => s.key === order?.status)
  const isMature = order?.status === 'mature'
  const needPay = order?.status === 'shipping' && order?.pay_status === 'unpaid'
  const canCancel = order?.status === 'pending' || (!isNature && order?.status === 'confirmed')
  const canRefund = order?.pay_status === 'paid' && order?.refund_status === 'none'
  const showLogistics = order?.logistics_no && order?.status === 'shipped'
  const canReview = order?.status === 'picked' || order?.status === 'shipped' || (!isNature && order?.status === 'completed')
  const alreadyReviewed = order?.reviewed

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        <h2 className="text-2xl font-bold text-foreground text-center mb-6">订单详情</h2>

        {order && (
          <div className="flex flex-col gap-4">
            {/* 订单基本信息 */}
            <div className="rounded-2xl p-5 bg-card-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base text-muted-foreground">{order.order_no}</span>
                <span
                  className="px-3 py-1 rounded-full text-base"
                  style={{background: 'rgba(56, 142, 60, 0.1)', color: '#388E3C'}}
                >
                  {statusMap[order.status] || order.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`${isNature ? 'i-mdi-sprout' : 'i-mdi-run'} text-2xl text-primary`} />
                <span className="text-2xl font-bold text-foreground">{order.project_name}</span>
              </div>
              <p className="text-lg text-muted-foreground">{isNature ? '自然课堂' : '亲子运动'}</p>
            </div>

            {/* 详细信息 */}
            <div className="rounded-2xl p-5 bg-card-white">
              {isNature && order.soil_type && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="i-mdi-terrain text-xl text-primary" />
                  <span className="text-lg text-foreground">地块类型：{order.soil_type}</span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="i-mdi-calendar text-xl text-primary" />
                <span className="text-lg text-foreground">预约日期：{order.appointment_date}</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="i-mdi-account-group text-xl text-primary" />
                <span className="text-lg text-foreground">参与人数：{order.participant_count}人</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="i-mdi-account text-xl text-primary" />
                <span className="text-lg text-foreground">联系人：{order.contact_name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="i-mdi-phone text-xl text-primary" />
                <span className="text-lg text-foreground">电话：{order.contact_phone}</span>
              </div>
            </div>

            {/* 自然课堂 - 种植进度 */}
            {isNature && (
              <div className="rounded-2xl p-5 bg-card-white">
                <h3 className="text-xl font-bold text-foreground mb-4">种植进度</h3>
                <div className="flex items-center gap-1">
                  {growthSteps.map((step, idx) => {
                    const active = idx <= currentGrowthIndex
                    const isCurrent = idx === currentGrowthIndex
                    return (
                      <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{
                              background: active ? '#43A047' : '#E0E0E0',
                              border: isCurrent ? '2px solid #2E7D32' : 'none'
                            }}
                          >
                            <span className="text-sm font-bold text-white">{idx + 1}</span>
                          </div>
                          <span
                            className="text-base"
                            style={{color: active ? '#388E3C' : '#9E9E9E'}}
                          >
                            {step.label}
                          </span>
                        </div>
                        {idx < growthSteps.length - 1 && (
                          <div
                            className="flex-1 h-1 mb-5"
                            style={{background: idx < currentGrowthIndex ? '#43A047' : '#E0E0E0'}}
                          />
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 自然课堂 - 收获选择 */}
            {isNature && isMature && (
              <div className="rounded-2xl p-5 bg-card-white">
                <h3 className="text-xl font-bold text-foreground mb-3">作物已成熟</h3>
                <p className="text-lg text-muted-foreground mb-4">请选择收获方式：</p>
                <div className="flex flex-row gap-3">
                  <button
                    type="button"
                    onClick={handlePickShipping}
                    className="flex-1 py-3 flex items-center justify-center leading-none text-lg font-semibold rounded-xl btn-primary-green"
                  >
                    邮寄到家
                  </button>
                  <button
                    type="button"
                    onClick={handlePickOnsite}
                    className="flex-1 py-3 flex items-center justify-center leading-none text-lg font-semibold rounded-xl"
                    style={{background: 'rgba(67, 160, 71, 0.1)', color: '#388E3C', border: '1px solid rgba(67, 160, 71, 0.3)'}}
                  >
                    现场采摘
                  </button>
                </div>
              </div>
            )}

            {/* 物流信息 */}
            {showLogistics && (
              <div className="rounded-2xl p-5 bg-card-white">
                <h3 className="text-xl font-bold text-foreground mb-3">物流信息</h3>
                <div className="flex items-center gap-3 mb-2">
                  <div className="i-mdi-truck text-xl text-primary" />
                  <span className="text-lg text-foreground">{order.logistics_carrier} {order.logistics_no}</span>
                </div>
                <p className="text-lg text-muted-foreground">已发货，请注意查收</p>
              </div>
            )}

            {/* 支付按钮 */}
            {isNature && needPay && (
              <div className="rounded-2xl p-5 bg-card-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg text-foreground">邮寄费用</span>
                  <span className="text-2xl font-bold text-primary">¥{order.shipping_fee || 15}</span>
                </div>
                <p className="text-base text-muted-foreground mb-4">含邮费与冷链包装费</p>
                <button
                  type="button"
                  onClick={() => setShowPayModal(true)}
                  className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl btn-primary-green"
                >
                  立即支付
                </button>
              </div>
            )}

            {/* 退款申请 */}
            {canRefund && (
              <div className="rounded-2xl p-5 bg-card-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="i-mdi-cash-refund text-2xl text-primary" />
                  <span className="text-xl font-bold text-foreground">已支付邮寄费</span>
                </div>
                <p className="text-lg text-muted-foreground mb-4">如需退款，可申请退还邮寄费用</p>
                <button
                  type="button"
                  onClick={handleRefund}
                  className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl"
                  style={{background: 'rgba(67, 160, 71, 0.1)', color: '#388E3C'}}
                >
                  申请退款
                </button>
              </div>
            )}

            {/* 退款中提示 */}
            {order.refund_status === 'refunding' && (
              <div className="rounded-2xl p-5 bg-card-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="i-mdi-clock-outline text-2xl text-yellow-600" />
                  <span className="text-xl font-bold text-foreground">退款处理中</span>
                </div>
                <p className="text-lg text-muted-foreground">您的退款申请正在处理中，请耐心等待</p>
              </div>
            )}

            {/* 评价入口 */}
            {canReview && !alreadyReviewed && (
              <div className="rounded-2xl p-5 bg-card-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="i-mdi-star text-2xl text-primary" />
                  <span className="text-xl font-bold text-foreground">体验已完成</span>
                </div>
                <p className="text-lg text-muted-foreground mb-4">分享一下您的体验感受吧</p>
                <button
                  type="button"
                  onClick={goReview}
                  className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl btn-primary-green"
                >
                  去评价
                </button>
              </div>
            )}

            {/* 操作按钮 */}
            {canCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl"
                style={{background: 'rgba(224, 224, 224, 0.5)', color: '#666'}}
              >
                取消订单
              </button>
            )}

            {/* 分享海报入口 */}
            <button
              type="button"
              onClick={goPoster}
              className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl"
              style={{background: 'rgba(67, 160, 71, 0.1)', color: '#388E3C'}}
            >
              <div className="i-mdi-share-variant text-xl mr-2" />
              生成分享海报
            </button>
          </div>
        )}
      </div>

      {/* 支付弹窗 */}
      {showPayModal && order && (
        <div
          className="fixed inset-0 flex items-end justify-center"
          style={{zIndex: 50, background: 'rgba(0,0,0,0.5)'}}
          onClick={() => setShowPayModal(false)}
        >
          <div
            className="w-full rounded-t-2xl p-6 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-foreground">支付邮寄费用</span>
              <div
                className="i-mdi-close text-2xl text-muted-foreground"
                onClick={() => setShowPayModal(false)}
              />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg text-foreground">邮寄费用</span>
              <span className="text-2xl font-bold text-primary">¥{order.shipping_fee || 15}</span>
            </div>
            <p className="text-base text-muted-foreground mb-6">含邮费与冷链包装费</p>
            <button
              type="button"
              onClick={handlePay}
              className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl btn-primary-green"
            >
              微信支付
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
