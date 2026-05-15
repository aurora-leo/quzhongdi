import React, {useState, useMemo, useCallback} from 'react'
import Taro from '@tarojs/taro'
import StarBackground from '@/components/StarBackground'
import {submitReview} from '@/db/api'

export default function CreateReview() {
  const params = useMemo(() => Taro.getCurrentInstance().router?.params || {}, [])
  const orderId = params.orderId || ''
  const projectType = params.projectType || ''
  const projectName = params.projectName || ''

  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      Taro.showToast({title: '请输入评价内容', icon: 'none'})
      return
    }
    setLoading(true)
    try {
      await submitReview({
        order_id: orderId,
        project_type: projectType,
        project_name: projectName,
        rating,
        content: content.trim()
      })
      Taro.showToast({title: '评价成功', icon: 'success'})
      setTimeout(() => Taro.navigateBack(), 800)
    } catch (error: any) {
      Taro.showToast({title: error.message || '评价失败', icon: 'none'})
    } finally {
      setLoading(false)
    }
  }, [orderId, projectType, projectName, rating, content])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        <h2 className="text-2xl font-bold text-foreground text-center mb-6">评价</h2>

        <div className="rounded-2xl p-6 bg-card-white mb-6">
          <p className="text-xl text-foreground mb-4">{projectName}</p>
          <div className="flex flex-row gap-2 mb-6">
            {[1, 2, 3, 4, 5].map(s => (
              <div
                key={s}
                className="w-10 h-10 flex items-center justify-center"
                onClick={() => setRating(s)}
              >
                <div className={`text-3xl ${s <= rating ? 'i-mdi-star text-yellow-500' : 'i-mdi-star-outline text-muted-foreground'}`} />
              </div>
            ))}
          </div>

          <div className="border-2 border-input rounded-lg p-4 bg-background overflow-hidden mb-4" style={{minHeight: '120px'}}>
            <textarea
              className="w-full text-xl text-foreground bg-transparent outline-none"
              placeholder="写下您的真实体验，帮助更多家庭了解趣种地..."
              style={{height: '100px'}}
              value={content}
              onInput={(e) => {
                const ev = e as any
                setContent(ev.detail?.value ?? ev.target?.value ?? '')
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl btn-primary-green"
            style={{opacity: loading ? 0.6 : 1}}
          >
            {loading ? '提交中...' : '提交评价'}
          </button>
        </div>
      </div>
    </div>
  )
}
