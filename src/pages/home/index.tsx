import React from 'react'
import Taro from '@tarojs/taro'
import StarBackground from '@/components/StarBackground'

export default function Home() {
  const goToProjects = () => {
    Taro.switchTab({url: '/pages/projects/index'})
  }

  const goToOrders = () => {
    Taro.switchTab({url: '/pages/orders/index'})
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-8">
        {/* Logo区域 */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{background: 'linear-gradient(135deg, #43A047, #2E7D32)'}}
          >
            <div className="i-mdi-sprout text-4xl text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text-green mb-2">趣种地</h1>
          <p className="text-lg text-muted-foreground">亲子自然教育与研学实践平台</p>
        </div>

        {/* 快捷入口 */}
        <div className="flex flex-row gap-3 mb-6">
          <div
            className="flex-1 rounded-2xl p-4 bg-card-white"
            onClick={goToProjects}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="i-mdi-sprout text-2xl text-primary" />
              <span className="text-xl font-bold text-foreground">营地项目</span>
            </div>
            <p className="text-base text-muted-foreground">自然课堂与亲子运动</p>
          </div>
          <div
            className="flex-1 rounded-2xl p-4 bg-card-white"
            onClick={goToOrders}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="i-mdi-clipboard-list text-2xl text-primary" />
              <span className="text-xl font-bold text-foreground">我的订单</span>
            </div>
            <p className="text-base text-muted-foreground">查看预约与进度</p>
          </div>
        </div>

        {/* 平台介绍 */}
        <div className="rounded-2xl p-6 mb-8 bg-card-white">
          <p className="text-xl leading-relaxed text-foreground">
            趣种地面向大众家庭开放，提供自然教育、农事体验、科普研学、亲子互动等多元化服务，让每个家庭都能在自然中收获快乐与成长。
          </p>
        </div>

        {/* 项目预览入口 */}
        <div className="rounded-2xl p-6 mb-8 bg-card-white">
          <h2 className="text-2xl font-bold text-foreground mb-4">热门项目</h2>
          <div className="flex flex-col gap-3">
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{background: 'rgba(67, 160, 71, 0.08)'}}
            >
              <div className="i-mdi-sprout text-2xl text-primary" />
              <span className="text-xl text-foreground">热带农业科普教育</span>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{background: 'rgba(67, 160, 71, 0.08)'}}
            >
              <div className="i-mdi-fruit-cherries text-2xl text-primary" />
              <span className="text-xl text-foreground">农事采摘体验</span>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{background: 'rgba(67, 160, 71, 0.08)'}}
            >
              <div className="i-mdi-party-popper text-2xl text-primary" />
              <span className="text-xl text-foreground">节日主题活动</span>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{background: 'rgba(67, 160, 71, 0.08)'}}
            >
              <div className="i-mdi-run text-2xl text-primary" />
              <span className="text-xl text-foreground">互动拓展</span>
            </div>
          </div>

          <button
            type="button"
            onClick={goToProjects}
            className="mt-5 w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl btn-primary-green"
          >
            查看更多项目
          </button>
        </div>

        {/* 底部装饰 */}
        <div className="text-center py-6">
          <p className="text-base text-muted-foreground">
            面向所有大众家庭开放，欢迎前来体验
          </p>
        </div>
      </div>
    </div>
  )
}
