import React from 'react'
import Taro from '@tarojs/taro'
import StarBackground from '@/components/StarBackground'
import {useAuth} from '@/contexts/AuthContext'

export default function Profile() {
  const {user, profile, signOut} = useAuth()
  const isAdmin = profile?.role === 'admin'

  const handleLogout = async () => {
    await signOut()
    Taro.reLaunch({url: '/pages/login/index'})
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        {/* 用户信息卡片 */}
        <div className="rounded-2xl p-6 mb-6 bg-card-white">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{background: 'linear-gradient(135deg, #43A047, #2E7D32)'}}
            >
              <div className="i-mdi-account text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {profile?.nickname || profile?.username || '趣种地用户'}
              </h2>
              <p className="text-lg text-muted-foreground">
                {user?.email || user?.phone || ''}
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="flex-1 rounded-xl p-3 text-center" style={{background: 'rgba(67, 160, 71, 0.08)'}}>
              <p className="text-2xl font-bold text-primary">{profile?.points || 0}</p>
              <p className="text-base text-muted-foreground">积分</p>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center" style={{background: 'rgba(67, 160, 71, 0.08)'}}>
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-base text-muted-foreground">优惠券</p>
            </div>
          </div>
        </div>

        {/* 功能入口 */}
        <div className="rounded-2xl overflow-hidden bg-card-white mb-6">
          <div className="p-4 flex items-center gap-3 border-b" style={{borderColor: 'rgba(56, 142, 60, 0.1)'}} onClick={() => Taro.switchTab({url: '/pages/orders/index'})}>
            <div className="i-mdi-clipboard-list text-2xl text-primary" />
            <span className="text-xl text-foreground flex-1">我的订单</span>
            <div className="i-mdi-chevron-right text-xl text-muted-foreground" />
          </div>
          <div className="p-4 flex items-center gap-3 border-b" style={{borderColor: 'rgba(56, 142, 60, 0.1)'}} onClick={() => Taro.navigateTo({url: '/pages/reviews/my'})}>
            <div className="i-mdi-star text-2xl text-primary" />
            <span className="text-xl text-foreground flex-1">我的评价</span>
            <div className="i-mdi-chevron-right text-xl text-muted-foreground" />
          </div>
          <div className="p-4 flex items-center gap-3 border-b" style={{borderColor: 'rgba(56, 142, 60, 0.1)'}} onClick={() => Taro.navigateTo({url: '/pages/suggest/index'})}>
            <div className="i-mdi-message-text text-2xl text-primary" />
            <span className="text-xl text-foreground flex-1">意见建议</span>
            <div className="i-mdi-chevron-right text-xl text-muted-foreground" />
          </div>
          <div className="p-4 flex items-center gap-3" onClick={() => Taro.navigateTo({url: '/pages/contact/index'})}>
            <div className="i-mdi-map-marker text-2xl text-primary" />
            <span className="text-xl text-foreground flex-1">联系我们</span>
            <div className="i-mdi-chevron-right text-xl text-muted-foreground" />
          </div>
        </div>

        {/* 商家后台入口 */}
        {isAdmin && (
          <div className="rounded-2xl overflow-hidden bg-card-white mb-6">
            <div className="p-4 flex items-center gap-3" onClick={() => Taro.navigateTo({url: '/pages/admin/index'})}>
              <div className="i-mdi-shield-account text-2xl text-primary" />
              <span className="text-xl text-foreground flex-1">商家后台</span>
              <div className="i-mdi-chevron-right text-xl text-muted-foreground" />
            </div>
          </div>
        )}

        {/* 退出登录 */}
        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl"
            style={{background: 'rgba(224, 224, 224, 0.5)', color: '#666'}}
          >
            退出登录
          </button>
        )}

        {!user && (
          <button
            type="button"
            onClick={() => Taro.navigateTo({url: '/pages/login/index'})}
            className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl btn-primary-green"
          >
            去登录
          </button>
        )}
      </div>
    </div>
  )
}
