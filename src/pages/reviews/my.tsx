import React, {useState, useCallback, useEffect} from 'react'
import Taro from '@tarojs/taro'
import StarBackground from '@/components/StarBackground'
import {getMyReviews} from '@/db/api'

interface Review {
  id: string
  project_name: string
  rating: number
  content: string
  created_at: string
}

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)

  const loadReviews = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getMyReviews()
      setReviews(data as Review[])
    } catch (error: any) {
      Taro.showToast({title: error.message || '加载失败', icon: 'none'})
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        <h2 className="text-2xl font-bold text-foreground text-center mb-6">我的评价</h2>

        {reviews.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="i-mdi-star-outline text-5xl text-muted-foreground mb-3" />
            <p className="text-xl text-muted-foreground">暂无评价</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {reviews.map(review => (
            <div key={review.id} className="rounded-2xl p-5 bg-card-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-foreground">{review.project_name}</span>
                <div className="flex flex-row gap-1">
                  {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className={`text-base ${i < review.rating ? 'i-mdi-star text-yellow-500' : 'i-mdi-star-outline text-muted-foreground'}`} />
                  ))}
                </div>
              </div>
              <p className="text-lg text-foreground leading-relaxed mb-2">{review.content}</p>
              <p className="text-base text-muted-foreground">{review.created_at.slice(0, 10)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
