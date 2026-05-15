import React, {useState, useCallback, useEffect} from 'react'
import Taro, {useDidShow} from '@tarojs/taro'
import StarBackground from '@/components/StarBackground'
import {getMyOrders} from '@/db/api'
import {withRouteGuard} from '@/components/RouteGuard'

interface OrderItem {
  id: string
  order_no: string
  project_type: string
  project_name: string
  appointment_date: string
  status: string
  pay_status: string
  refund_status: string
  created_at: string
}

const statusMap: Record<string, {label: string; color: string}> = {
  pending: {label: '待处理', color: '#F9A825'},
  sown: {label: '已播种', color: '#388E3C'},
  growing: {label: '生长中', color: '#43A047'},
  mature: {label: '已成熟', color: '#2E7D32'},
  shipping: {label: '待邮寄', color: '#F9A825'},
  shipped: {label: '已邮寄', color: '#388E3C'},
  picked: {label: '已采摘', color: '#388E3C'},
  confirmed: {label: '已确认', color: '#388E3C'},
  completed: {label: '已完成', color: '#2E7D32'},
  cancelled: {label: '已取消', color: '#9E9E9E'}
}

type FilterTab = 'active' | 'cancelled'

function Orders() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(false)
  const [filterTab, setFilterTab] = useState<FilterTab>('active')

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getMyOrders()
      setOrders(data as OrderItem[])
    } catch (error: any) {
      Taro.showToast({title: error.message || '加载失败', icon: 'none'})
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  useDidShow(() => {
    loadOrders()
  })

  const goDetail = (id: string) => {
    Taro.navigateTo({url: `/pages/orders/detail?id=${id}`})
  }

  const getStatusInfo = (status: string) => {
    return statusMap[status] || {label: status, color: '#9E9E9E'}
  }

  const filteredOrders = orders.filter(o => {
    if (filterTab === 'cancelled') return o.status === 'cancelled'
    return o.status !== 'cancelled'
  })

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        <h2 className="text-2xl font-bold text-foreground text-center mb-5">我的订单</h2>

        {/* 筛选Tab */}
        <div className="flex flex-row gap-2 mb-5">
          {([
            {key: 'active' as FilterTab, label: '全部订单'},
            {key: 'cancelled' as FilterTab, label: '已取消'}
          ]).map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterTab(tab.key)}
              className="flex-1 py-2 flex items-center justify-center leading-none text-lg font-semibold rounded-xl"
              style={{
                background: filterTab === tab.key ? '#43A047' : 'rgba(67, 160, 71, 0.1)',
                color: filterTab === tab.key ? '#fff' : '#388E3C'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="i-mdi-clipboard-text-outline text-5xl text-muted-foreground mb-3" />
            <p className="text-xl text-muted-foreground">
              {filterTab === 'cancelled' ? '暂无取消订单' : '暂无订单'}
            </p>
            {filterTab === 'active' && (
              <p className="text-lg text-muted-foreground mt-2">快去预约体验吧</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {filteredOrders.map(order => {
            const info = getStatusInfo(order.status)
            const isNature = order.project_type === 'nature_class'
            const refundLabel = order.refund_status === 'refunding' ? ' · 退款中' : ''
            return (
              <div
                key={order.id}
                className="rounded-2xl p-5 bg-card-white"
                onClick={() => goDetail(order.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base text-muted-foreground">{order.order_no}</span>
                  <span
                    className="px-3 py-1 rounded-full text-base"
                    style={{background: `${info.color}15`, color: info.color}}
                  >
                    {info.label}{refundLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${isNature ? 'i-mdi-sprout' : 'i-mdi-run'} text-xl text-primary`} />
                  <span className="text-xl font-bold text-foreground">{order.project_name}</span>
                </div>
                <p className="text-lg text-muted-foreground">
                  {isNature ? '自然课堂' : '亲子运动'} · {order.appointment_date}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default withRouteGuard(Orders)
