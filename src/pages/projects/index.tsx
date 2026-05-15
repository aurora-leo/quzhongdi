import React from 'react'
import Taro from '@tarojs/taro'
import {Image} from '@tarojs/components'
import StarBackground from '@/components/StarBackground'

interface Category {
  id: string
  title: string
  desc: string
  image: string
  path: string
}

const categories: Category[] = [
  {
    id: 'nature',
    title: '自然课堂',
    desc: '用户云控商家种地，体验现代农业科技与传统农耕结合的乐趣，成熟后可选择邮寄到家。',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_06916ee0-5623-473f-8214-5fc8888b93f5.jpg',
    path: '/pages/nature-class/index'
  },
  {
    id: 'sports',
    title: '亲子运动',
    desc: '传统文化运动项目体验，包括花炮、竹竿舞、射艺等，让孩子在运动中感受传统文化魅力。',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_63dda17f-387c-476d-9ebd-086d46405b31.jpg',
    path: '/pages/family-sports/index'
  }
]

export default function Projects() {
  const goToDetail = (path: string) => {
    Taro.navigateTo({url: path})
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        <h2 className="text-2xl font-bold text-foreground text-center mb-6">营地项目</h2>

        <div className="flex flex-col gap-5">
          {categories.map(category => (
            <div
              key={category.id}
              className="rounded-2xl overflow-hidden bg-card-white"
              onClick={() => goToDetail(category.path)}
            >
              <Image
                src={category.image}
                mode="aspectFill"
                className="w-full"
                style={{height: '220px'}}
              />
              <div className="p-5">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {category.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {category.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 text-primary">
                  <span className="text-lg">查看详情</span>
                  <div className="i-mdi-chevron-right text-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
