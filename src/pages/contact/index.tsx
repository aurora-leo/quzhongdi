import React from 'react'
import Taro, {getEnv} from '@tarojs/taro'
import StarBackground from '@/components/StarBackground'

export default function Contact() {
  const isWeApp = getEnv() === Taro.ENV_TYPE.WEAPP

  const copyPhone = () => {
    Taro.setClipboardData({
      data: '135XXXX6789',
      success: () => {
        Taro.showToast({title: '电话已复制', icon: 'success'})
      }
    })
  }

  const copyAddress = () => {
    Taro.setClipboardData({
      data: '海南省海口市美兰区演丰镇趣种地',
      success: () => {
        Taro.showToast({title: '地址已复制', icon: 'success'})
      }
    })
  }

  const openMap = () => {
    if (!isWeApp) {
      Taro.showToast({title: '地图导航仅在微信小程序中可用', icon: 'none'})
      return
    }
    Taro.openLocation({
      latitude: 20.044,
      longitude: 110.5,
      name: '趣种地营地',
      address: '海南省海口市美兰区演丰镇趣种地'
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        <h2 className="text-2xl font-bold text-foreground text-center mb-6">联系我们</h2>

        {/* 地图导航 */}
        {isWeApp && (
          <div className="rounded-2xl overflow-hidden mb-6 bg-card-white">
            <div
              className="w-full flex items-center justify-center"
              style={{height: '200px', background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)'}}
              onClick={openMap}
            >
              <div className="text-center">
                <div className="i-mdi-map-marker text-5xl text-primary mb-2" />
                <p className="text-xl font-bold text-foreground">点击查看地图导航</p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl p-6 bg-card-white">
          {/* 地址 */}
          <div
            className="flex items-start gap-4 p-4 rounded-xl mb-4"
            style={{background: 'rgba(67, 160, 71, 0.06)'}}
            onClick={copyAddress}
          >
            <div className="i-mdi-map-marker text-3xl text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-lg text-muted-foreground mb-1">地址</p>
              <p className="text-xl text-foreground leading-relaxed">
                海南省海口市美兰区演丰镇趣种地
              </p>
            </div>
            <div className="i-mdi-content-copy text-xl text-muted-foreground shrink-0" />
          </div>

          {/* 电话 */}
          <div
            className="flex items-start gap-4 p-4 rounded-xl mb-4"
            style={{background: 'rgba(67, 160, 71, 0.06)'}}
            onClick={copyPhone}
          >
            <div className="i-mdi-phone text-3xl text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-lg text-muted-foreground mb-1">电话</p>
              <p className="text-xl text-foreground">135XXXX6789</p>
            </div>
            <div className="i-mdi-content-copy text-xl text-muted-foreground shrink-0" />
          </div>

          {/* 营业时间 */}
          <div
            className="flex items-start gap-4 p-4 rounded-xl mb-4"
            style={{background: 'rgba(67, 160, 71, 0.06)'}}
          >
            <div className="i-mdi-clock-outline text-3xl text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-lg text-muted-foreground mb-1">营业时间</p>
              <p className="text-xl text-foreground">09:00 - 18:00</p>
            </div>
          </div>

          {/* 开放说明 */}
          <div
            className="flex items-start gap-4 p-4 rounded-xl"
            style={{background: 'rgba(67, 160, 71, 0.06)'}}
          >
            <div className="i-mdi-information-outline text-3xl text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-lg text-muted-foreground mb-1">开放说明</p>
              <p className="text-xl text-foreground leading-relaxed">
                面向所有大众家庭开放，欢迎前来体验！
              </p>
            </div>
          </div>
        </div>

        {isWeApp && (
          <button
            type="button"
            onClick={openMap}
            className="mt-5 w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl btn-primary-green"
          >
            <div className="i-mdi-navigation text-xl mr-2" />
            一键导航到营地
          </button>
        )}

        {/* 底部提示 */}
        <div className="text-center py-6">
          <p className="text-base text-muted-foreground">
            期待与您在趣种地相遇
          </p>
        </div>
      </div>
    </div>
  )
}
