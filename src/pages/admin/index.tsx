import React, {useState, useCallback, useEffect} from 'react'
import Taro from '@tarojs/taro'
import StarBackground from '@/components/StarBackground'
import {getAllOrders, updateOrderStatus, updateOrderLogistics} from '@/db/api'
import {useAuth} from '@/contexts/AuthContext'

interface OrderItem {
  id: string
  order_no: string
  project_type: string
  project_name: string
  appointment_date: string
  status: string
  contact_name: string
  contact_phone: string
  logistics_no: string
  logistics_carrier: string
  participant_count: number
}

const statusMap: Record<string, string> = {
  pending: '待种植', sown: '已播种', growing: '生长中', mature: '已成熟',
  shipping: '待邮寄', shipped: '已邮寄', picked: '已采摘',
  confirmed: '已确认', completed: '已完成', cancelled: '已取消'
}

export default function AdminDashboard() {
  const {profile} = useAuth()
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [filter, setFilter] = useState<'all' | 'nature' | 'sports'>('all')
  const [showLogisticsModal, setShowLogisticsModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [carrier, setCarrier] = useState('顺丰速运')
  const [logisticsNo, setLogisticsNo] = useState('')
  const [loading, setLoading] = useState(false)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllOrders()
      setOrders(data as OrderItem[])
    } catch (error: any) {
      Taro.showToast({title: error.message || '加载失败', icon: 'none'})
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (profile?.role !== 'admin') {
      Taro.showToast({title: '无权限访问', icon: 'none'})
      setTimeout(() => Taro.navigateBack(), 1000)
      return
    }
    loadOrders()
  }, [profile, loadOrders])

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true
    if (filter === 'nature') return o.project_type === 'nature_class'
    return o.project_type === 'family_sports'
  })

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus)
      Taro.showToast({title: '状态已更新', icon: 'success'})
      loadOrders()
    } catch (error: any) {
      Taro.showToast({title: error.message, icon: 'none'})
    }
  }

  const openLogistics = (id: string) => {
    setSelectedOrderId(id)
    setShowLogisticsModal(true)
  }

  const handleSaveLogistics = async () => {
    if (!logisticsNo.trim()) {
      Taro.showToast({title: '请输入物流单号', icon: 'none'})
      return
    }
    try {
      await updateOrderLogistics(selectedOrderId, carrier, logisticsNo.trim())
      Taro.showToast({title: '物流信息已保存', icon: 'success'})
      setShowLogisticsModal(false)
      setLogisticsNo('')
      loadOrders()
    } catch (error: any) {
      Taro.showToast({title: error.message, icon: 'none'})
    }
  }

  if (profile?.role !== 'admin') return null

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        <h2 className="text-2xl font-bold text-foreground text-center mb-4">商家后台</h2>

        {/* 筛选 */}
        <div className="flex flex-row gap-2 mb-4">
          {(['all', 'nature', 'sports'] as const).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="flex-1 py-2 flex items-center justify-center leading-none text-lg font-semibold rounded-lg"
              style={{
                background: filter === f ? 'linear-gradient(135deg, #43A047, #2E7D32)' : 'rgba(67,160,71,0.1)',
                color: filter === f ? '#fff' : '#388E3C'
              }}
            >
              {f === 'all' ? '全部' : f === 'nature' ? '自然课堂' : '亲子运动'}
            </button>
          ))}
        </div>

        {/* 订单列表 */}
        <div className="flex flex-col gap-3">
          {filteredOrders.map(order => {
            const isNature = order.project_type === 'nature_class'
            const canProgress = isNature && ['pending', 'sown', 'growing'].includes(order.status)
            const canConfirm = !isNature && order.status === 'pending'
            const canLogistics = order.status === 'shipped' && !order.logistics_no
            const showLogisticsInfo = order.logistics_no

            return (
              <div key={order.id} className="rounded-2xl p-4 bg-card-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base text-muted-foreground">{order.order_no}</span>
                  <span
                    className="px-2 py-1 rounded-full text-sm"
                    style={{background: 'rgba(56,142,60,0.1)', color: '#388E3C'}}
                  >
                    {statusMap[order.status] || order.status}
                  </span>
                </div>
                <p className="text-lg font-bold text-foreground mb-1">{order.project_name}</p>
                <p className="text-base text-muted-foreground mb-1">
                  {order.contact_name} · {order.contact_phone} · {order.appointment_date}
                </p>
                <p className="text-base text-muted-foreground mb-3">
                  {isNature ? '自然课堂' : '亲子运动'} · {order.participant_count}人
                </p>

                <div className="flex flex-row gap-2 flex-wrap">
                  {canProgress && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = order.status === 'pending' ? 'sown' : order.status === 'sown' ? 'growing' : 'mature'
                        handleUpdateStatus(order.id, next)
                      }}
                      className="px-3 py-2 flex items-center justify-center leading-none text-base font-semibold rounded-lg btn-primary-green"
                    >
                      {order.status === 'pending' ? '标记已播种' : order.status === 'sown' ? '标记生长中' : '标记已成熟'}
                    </button>
                  )}
                  {canConfirm && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                      className="px-3 py-2 flex items-center justify-center leading-none text-base font-semibold rounded-lg btn-primary-green"
                    >
                      确认预约
                    </button>
                  )}
                  {canLogistics && (
                    <button
                      type="button"
                      onClick={() => openLogistics(order.id)}
                      className="px-3 py-2 flex items-center justify-center leading-none text-base font-semibold rounded-lg"
                      style={{background: 'rgba(67,160,71,0.1)', color: '#388E3C'}}
                    >
                      填写物流
                    </button>
                  )}
                  {showLogisticsInfo && (
                    <span className="text-base text-primary">
                      {order.logistics_carrier} {order.logistics_no}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 物流弹窗 */}
      {showLogisticsModal && (
        <div
          className="fixed inset-0 flex items-center justify-center px-5"
          style={{zIndex: 50, background: 'rgba(0,0,0,0.5)'}}
          onClick={() => setShowLogisticsModal(false)}
        >
          <div className="w-full rounded-2xl p-6 bg-white" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-foreground mb-4">填写物流信息</h3>
            <div className="mb-4">
              <span className="text-lg text-foreground mb-2 block">快递公司</span>
              <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
                <input
                  className="w-full text-xl text-foreground bg-transparent outline-none"
                  value={carrier}
                  onInput={(e) => {
                    const ev = e as any
                    setCarrier(ev.detail?.value ?? ev.target?.value ?? '')
                  }}
                />
              </div>
            </div>
            <div className="mb-6">
              <span className="text-lg text-foreground mb-2 block">物流单号</span>
              <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
                <input
                  className="w-full text-xl text-foreground bg-transparent outline-none"
                  placeholder="请输入物流单号"
                  value={logisticsNo}
                  onInput={(e) => {
                    const ev = e as any
                    setLogisticsNo(ev.detail?.value ?? ev.target?.value ?? '')
                  }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveLogistics}
              className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl btn-primary-green"
            >
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
