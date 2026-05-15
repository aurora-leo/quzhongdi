import React, {useState, useCallback} from 'react'
import Taro from '@tarojs/taro'
import StarBackground from '@/components/StarBackground'
import {submitFeedback} from '@/db/api'

export default function Suggest() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      Taro.showToast({title: '请输入您的姓名', icon: 'none'})
      return
    }
    if (!phone.trim()) {
      Taro.showToast({title: '请输入您的电话', icon: 'none'})
      return
    }
    if (!content.trim()) {
      Taro.showToast({title: '请输入您的意见或建议', icon: 'none'})
      return
    }

    setLoading(true)
    try {
      await submitFeedback({name: name.trim(), phone: phone.trim(), content: content.trim()})
      Taro.showToast({title: '提交成功，感谢您的建议', icon: 'success'})
      setName('')
      setPhone('')
      setContent('')
    } catch (error: any) {
      Taro.showToast({title: error.message || '提交失败，请稍后重试', icon: 'none'})
    } finally {
      setLoading(false)
    }
  }, [name, phone, content])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        <h2 className="text-2xl font-bold text-foreground text-center mb-6">意见建议征集</h2>

        <div className="rounded-2xl p-6 bg-card-white">
          {/* 姓名 */}
          <div className="mb-5">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xl text-foreground">姓名</span>
              <span className="text-destructive">*</span>
            </div>
            <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
              <input
                className="w-full text-xl text-foreground bg-transparent outline-none"
                placeholder="请输入您的姓名"
                value={name}
                onInput={(e) => {
                  const ev = e as any
                  setName(ev.detail?.value ?? ev.target?.value ?? '')
                }}
              />
            </div>
          </div>

          {/* 电话 */}
          <div className="mb-5">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xl text-foreground">电话</span>
              <span className="text-destructive">*</span>
            </div>
            <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
              <input
                className="w-full text-xl text-foreground bg-transparent outline-none"
                placeholder="请输入您的电话"
                type="tel"
                value={phone}
                onInput={(e) => {
                  const ev = e as any
                  setPhone(ev.detail?.value ?? ev.target?.value ?? '')
                }}
              />
            </div>
          </div>

          {/* 意见建议 */}
          <div className="mb-6">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xl text-foreground">意见或建议</span>
              <span className="text-destructive">*</span>
            </div>
            <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
              <textarea
                className="w-full text-xl text-foreground bg-transparent outline-none"
                placeholder="请写下您的意见或建议"
                rows={5}
                value={content}
                onInput={(e) => {
                  const ev = e as any
                  setContent(ev.detail?.value ?? ev.target?.value ?? '')
                }}
              />
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl btn-primary-green"
            style={{opacity: loading ? 0.6 : 1}}
          >
            {loading ? '提交中...' : '提交建议'}
          </button>
        </div>
      </div>
    </div>
  )
}
