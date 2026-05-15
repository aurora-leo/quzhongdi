import {supabase} from '@/client/supabase'

export interface FeedbackInput {
  name: string
  phone: string
  content: string
}

export async function submitFeedback(input: FeedbackInput) {
  const {data, error} = await supabase
    .from('feedback')
    .insert({
      name: input.name,
      phone: input.phone,
      content: input.content
    })
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// ========== 订单相关API ==========

export interface OrderInput {
  project_type: 'nature_class' | 'family_sports'
  project_name: string
  soil_type?: string
  appointment_date: string
  participant_count: number
  contact_name: string
  contact_phone: string
  coupon_id?: string
  points_used?: number
  original_amount?: number
}

export async function createOrder(input: OrderInput) {
  const orderNo = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`
  const {data: userData} = await supabase.auth.getUser()
  if (!userData.user) throw new Error('请先登录')

  const {data, error} = await supabase
    .from('orders')
    .insert({
      order_no: orderNo,
      user_id: userData.user.id,
      project_type: input.project_type,
      project_name: input.project_name,
      soil_type: input.soil_type || null,
      appointment_date: input.appointment_date,
      participant_count: input.participant_count,
      contact_name: input.contact_name,
      contact_phone: input.contact_phone,
      coupon_id: input.coupon_id || null,
      points_used: input.points_used || 0,
      original_amount: input.original_amount || 0
    })
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getMyOrders() {
  const {data, error} = await supabase
    .from('orders')
    .select('*')
    .order('created_at', {ascending: false})

  if (error) {
    throw new Error(error.message)
  }

  return Array.isArray(data) ? data : []
}

export async function getAllOrders() {
  const {data, error} = await supabase
    .from('orders')
    .select('*')
    .order('created_at', {ascending: false})

  if (error) {
    throw new Error(error.message)
  }

  return Array.isArray(data) ? data : []
}

export async function getOrderById(id: string) {
  const {data, error} = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateOrderStatus(id: string, status: string) {
  const {data, error} = await supabase
    .from('orders')
    .update({status})
    .eq('id', id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateOrderHarvest(id: string, choice: 'shipping' | 'picked') {
  const updates: Record<string, any> = {
    status: choice === 'shipping' ? 'shipping' : 'picked'
  }
  if (choice === 'shipping') {
    updates.shipping_fee = 15.00
    updates.total_amount = 15.00
  }

  const {data, error} = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function cancelOrder(id: string, reason?: string) {
  const {data, error} = await supabase
    .from('orders')
    .update({status: 'cancelled', cancel_reason: reason || null})
    .eq('id', id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateOrderLogistics(id: string, carrier: string, logisticsNo: string) {
  const {data, error} = await supabase
    .from('orders')
    .update({
      logistics_carrier: carrier,
      logistics_no: logisticsNo,
      logistics_status: 'shipped'
    })
    .eq('id', id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function requestRefund(id: string, amount: number) {
  const {data, error} = await supabase
    .from('orders')
    .update({
      refund_status: 'refunding',
      refund_amount: amount
    })
    .eq('id', id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// ========== 评价相关API ==========

export interface ReviewInput {
  order_id: string
  project_type: string
  project_name: string
  rating: number
  content: string
}

export async function submitReview(input: ReviewInput) {
  const {data: userData} = await supabase.auth.getUser()
  if (!userData.user) throw new Error('请先登录')

  const {data, error} = await supabase
    .from('reviews')
    .insert({
      order_id: input.order_id,
      user_id: userData.user.id,
      project_type: input.project_type,
      project_name: input.project_name,
      rating: input.rating,
      content: input.content
    })
    .select()

  if (error) {
    throw new Error(error.message)
  }

  // 标记订单已评价
  await supabase.from('orders').update({reviewed: true}).eq('id', input.order_id)

  // 奖励积分
  await addPoints(userData.user.id, 10, '提交评价奖励', input.order_id)

  return data
}

export async function getMyReviews() {
  const {data, error} = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', {ascending: false})

  if (error) {
    throw new Error(error.message)
  }

  return Array.isArray(data) ? data : []
}

export async function getProjectReviews(projectType: string, projectName: string) {
  const {data, error} = await supabase
    .from('reviews')
    .select('*')
    .eq('project_type', projectType)
    .eq('project_name', projectName)
    .order('created_at', {ascending: false})
    .limit(20)

  if (error) {
    throw new Error(error.message)
  }

  return Array.isArray(data) ? data : []
}

// ========== 积分相关API ==========

export async function getMyPoints() {
  const {data, error} = await supabase
    .from('profiles')
    .select('points')
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data?.points || 0
}

export async function addPoints(userId: string, amount: number, reason: string, orderId?: string) {
  // 插入积分记录
  const {error: logError} = await supabase
    .from('points_log')
    .insert({
      user_id: userId,
      type: 'earn',
      amount,
      reason,
      order_id: orderId || null
    })

  if (logError) {
    console.error('addPoints log error:', logError)
  }

  // 更新用户积分
  const {error: profileError} = await supabase.rpc('increment_points', {
    uid: userId,
    amt: amount
  })

  if (profileError) {
    // fallback: direct update
    const {data: profile} = await supabase.from('profiles').select('points').eq('id', userId).single()
    await supabase.from('profiles').update({points: (profile?.points || 0) + amount}).eq('id', userId)
  }
}

// ========== 优惠券相关API ==========

export async function getAvailableCoupons() {
  const {data, error} = await supabase
    .from('user_coupons')
    .select('id, coupon_id, coupons(*)')
    .eq('status', 'unused')
    .gt('coupons.valid_until', new Date().toISOString())

  if (error) {
    throw new Error(error.message)
  }

  return Array.isArray(data) ? data : []
}

export async function useCoupon(userCouponId: string) {
  const {data, error} = await supabase
    .from('user_coupons')
    .update({status: 'used', used_at: new Date().toISOString()})
    .eq('id', userCouponId)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
