import React, {useState, useMemo, useCallback, useEffect} from 'react'
import Taro, {getEnv, useShareAppMessage} from '@tarojs/taro'
import {Image} from '@tarojs/components'
import StarBackground from '@/components/StarBackground'
import {supabase} from '@/client/supabase'

export default function PosterPage() {
  useShareAppMessage(() => ({title: '趣种地 · 亲子自然教育体验'}))

  const params = useMemo(() => {
    const p = Taro.getCurrentInstance().router?.params || {}
    return {
      type: (p.type || 'project') as 'project' | 'order',
      projectType: (p.projectType || 'nature_class') as string,
      projectName: p.projectName ? decodeURIComponent(p.projectName) : '',
      orderNo: p.orderNo ? decodeURIComponent(p.orderNo) : '',
      appointmentDate: p.appointmentDate || '',
      participantCount: p.participantCount || '',
      contactName: p.contactName ? decodeURIComponent(p.contactName) : ''
    }
  }, [])

  const [posterUrl, setPosterUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generatePoster = useCallback(async () => {
    setLoading(true)
    try {
      const body: Record<string, any> = {
        type: params.type,
        projectType: params.projectType,
        projectName: params.projectName
      }
      if (params.type === 'order') {
        body.orderNo = params.orderNo
        body.appointmentDate = params.appointmentDate
        body.participantCount = params.participantCount
        body.contactName = params.contactName
      }

      const {data, error} = await supabase.functions.invoke('generate-poster', {body})
      if (error) {
        const errMsg = await error?.context?.text?.()
        Taro.showToast({title: errMsg || '生成失败，请稍后重试', icon: 'none'})
        return
      }
      if (data?.success && data?.url) {
        setPosterUrl(data.url)
        setGenerated(true)
      } else {
        Taro.showToast({title: data?.error || '生成失败', icon: 'none'})
      }
    } catch (err: any) {
      Taro.showToast({title: err.message || '生成失败', icon: 'none'})
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    generatePoster()
  }, [generatePoster])

  const isWeApp = getEnv() === Taro.ENV_TYPE.WEAPP

  const handleSave = useCallback(async () => {
    if (!posterUrl) return

    if (!isWeApp) {
      Taro.showToast({title: '保存相册仅在微信小程序中可用', icon: 'none'})
      return
    }

    try {
      Taro.showLoading({title: '正在保存...'})
      const downloadRes = await Taro.downloadFile({url: posterUrl})
      if (downloadRes.statusCode === 200) {
        await Taro.saveImageToPhotosAlbum({filePath: downloadRes.tempFilePath})
        Taro.hideLoading()
        Taro.showToast({title: '海报已保存到相册', icon: 'success'})
      } else {
        Taro.hideLoading()
        Taro.showToast({title: '下载失败，请重试', icon: 'none'})
      }
    } catch (err: any) {
      Taro.hideLoading()
      if (err.errMsg && err.errMsg.includes('auth deny')) {
        Taro.showToast({title: '请授权访问相册权限', icon: 'none'})
      } else {
        Taro.showToast({title: '保存失败，请重试', icon: 'none'})
      }
    }
  }, [posterUrl, isWeApp])

  const handleRegenerate = () => {
    setPosterUrl('')
    setGenerated(false)
    generatePoster()
  }

  const isNature = params.projectType === 'nature_class'
  const typeLabel = isNature ? '自然课堂' : '亲子运动'
  const titleText = params.type === 'order'
    ? `分享${typeLabel}体验`
    : `分享${typeLabel}项目`

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        <h2 className="text-2xl font-bold text-foreground text-center mb-2">{titleText}</h2>
        <p className="text-lg text-muted-foreground text-center mb-6">
          {params.projectName || typeLabel}
        </p>

        {/* 海报展示区域 */}
        <div className="rounded-2xl overflow-hidden bg-card-white mb-6" style={{filter: 'drop-shadow(0 8px 24px rgba(43,130,47,0.15))'}}>
          {loading && (
            <div
              className="flex flex-col items-center justify-center"
              style={{height: '480px'}}
            >
              <div className="i-mdi-loading text-4xl text-primary mb-3" style={{animation: 'spin 1s linear infinite'}} />
              <p className="text-xl text-muted-foreground">正在生成专属海报...</p>
            </div>
          )}

          {!loading && generated && posterUrl && (
            <Image
              src={posterUrl}
              mode="widthFix"
              className="w-full"
              style={{display: 'block'}}
            />
          )}

          {!loading && !generated && (
            <div
              className="flex flex-col items-center justify-center"
              style={{height: '480px'}}
            >
              <div className="i-mdi-image-broken text-4xl text-muted-foreground mb-3" />
              <p className="text-xl text-muted-foreground">海报生成失败</p>
              <button
                type="button"
                onClick={handleRegenerate}
                className="mt-4 px-6 py-2 flex items-center justify-center leading-none text-lg font-semibold rounded-xl"
                style={{background: 'rgba(67,160,71,0.1)', color: '#388E3C'}}
              >
                重新生成
              </button>
            </div>
          )}
        </div>

        {/* 操作按钮区域 */}
        {generated && posterUrl && (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl btn-primary-green"
            >
              <div className="i-mdi-download text-xl mr-2" />
              保存到相册
            </button>

            <button
              type="button"
              onClick={handleRegenerate}
              className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl"
              style={{background: 'rgba(67,160,71,0.1)', color: '#388E3C'}}
            >
              <div className="i-mdi-refresh text-xl mr-2" />
              重新生成
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-base text-muted-foreground">长按海报图片可直接分享给好友</p>
        </div>
      </div>
    </div>
  )
}
