import React, {useState} from 'react'
import Taro, {getEnv} from '@tarojs/taro'
import StarBackground from '@/components/StarBackground'
import {useAuth} from '@/contexts/AuthContext'

export default function Login() {
  const {signInWithWechat, signInWithUsername, signUpWithUsername, signOut} = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const isWeApp = getEnv() === Taro.ENV_TYPE.WEAPP

  const handleWechatLogin = async () => {
    if (!agreed) {
      Taro.showToast({title: '请同意用户协议', icon: 'none'})
      return
    }
    setLoading(true)
    const {error} = await signInWithWechat()
    setLoading(false)
    if (error) {
      Taro.showToast({title: error.message, icon: 'none'})
      return
    }
    redirectAfterLogin()
  }

  const handleUsernameLogin = async () => {
    if (!agreed) {
      Taro.showToast({title: '请同意用户协议', icon: 'none'})
      return
    }
    if (!username.trim() || !password.trim()) {
      Taro.showToast({title: '请输入用户名和密码', icon: 'none'})
      return
    }
    setLoading(true)
    const {error} = await signInWithUsername(username.trim(), password)
    setLoading(false)
    if (error) {
      Taro.showToast({title: error.message, icon: 'none'})
      return
    }
    redirectAfterLogin()
  }

  const handleRegister = async () => {
    if (!agreed) {
      Taro.showToast({title: '请同意用户协议', icon: 'none'})
      return
    }
    if (!username.trim() || !password.trim()) {
      Taro.showToast({title: '请输入用户名和密码', icon: 'none'})
      return
    }
    if (password.length < 6) {
      Taro.showToast({title: '密码至少6位', icon: 'none'})
      return
    }
    setLoading(true)
    const {error} = await signUpWithUsername(username.trim(), password)
    setLoading(false)
    if (error) {
      Taro.showToast({title: error.message, icon: 'none'})
      return
    }
    Taro.showToast({title: '注册成功，请登录', icon: 'success'})
    setMode('login')
  }

  const redirectAfterLogin = () => {
    const redirectPath = Taro.getStorageSync('loginRedirectPath') || '/pages/home/index'
    Taro.removeStorageSync('loginRedirectPath')
    const tabPaths = ['/pages/home/index', '/pages/projects/index', '/pages/orders/index', '/pages/contact/index', '/pages/profile/index']
    const isTab = tabPaths.some(p => redirectPath.includes(p))
    if (isTab) {
      Taro.switchTab({url: redirectPath})
    } else {
      Taro.redirectTo({url: redirectPath})
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-8">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{background: 'linear-gradient(135deg, #43A047, #2E7D32)'}}
          >
            <div className="i-mdi-sprout text-4xl text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text-green mb-2">趣种地</h1>
          <p className="text-lg text-muted-foreground">登录后即可预约和查看订单</p>
        </div>

        <div className="rounded-2xl p-6 bg-card-white">
          {/* 微信登录 */}
          {isWeApp && (
            <button
              type="button"
              onClick={handleWechatLogin}
              disabled={loading}
              className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl mb-5"
              style={{background: '#07C160', color: '#fff', opacity: loading ? 0.6 : 1}}
            >
              <div className="i-mdi-wechat text-xl mr-2" />
              微信一键登录
            </button>
          )}

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-base text-muted-foreground">{isWeApp ? '或使用账号密码' : '账号密码登录'}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* 用户名 */}
          <div className="mb-4">
            <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
              <input
                className="w-full text-xl text-foreground bg-transparent outline-none"
                placeholder="用户名"
                value={username}
                onInput={(e) => {
                  const ev = e as any
                  setUsername(ev.detail?.value ?? ev.target?.value ?? '')
                }}
              />
            </div>
          </div>

          {/* 密码 */}
          <div className="mb-5">
            <div className="border-2 border-input rounded-lg px-4 py-3 bg-background overflow-hidden">
              <input
                className="w-full text-xl text-foreground bg-transparent outline-none"
                placeholder="密码"
                type="password"
                value={password}
                onInput={(e) => {
                  const ev = e as any
                  setPassword(ev.detail?.value ?? ev.target?.value ?? '')
                }}
              />
            </div>
          </div>

          {/* 协议 */}
          <div className="flex items-center gap-2 mb-5" onClick={() => setAgreed(!agreed)}>
            <div
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{border: '2px solid', borderColor: agreed ? '#388E3C' : '#ccc'}}
            >
              {agreed && <div className="i-mdi-check text-sm" style={{color: '#388E3C'}} />}
            </div>
            <div className="flex flex-wrap text-base text-muted-foreground">
              <span>我已阅读并同意</span>
              <span className="text-primary">《用户协议》</span>
              <span>和</span>
              <span className="text-primary">《隐私政策》</span>
            </div>
          </div>

          {mode === 'login' ? (
            <button
              type="button"
              onClick={handleUsernameLogin}
              disabled={loading}
              className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl btn-primary-green"
              style={{opacity: loading ? 0.6 : 1}}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3 flex items-center justify-center leading-none text-xl font-semibold rounded-xl btn-primary-green"
              style={{opacity: loading ? 0.6 : 1}}
            >
              {loading ? '注册中...' : '注册'}
            </button>
          )}

          <div className="text-center mt-4">
            {mode === 'login' ? (
              <span className="text-lg text-primary" onClick={() => setMode('register')}>还没有账号？立即注册</span>
            ) : (
              <span className="text-lg text-primary" onClick={() => setMode('login')}>已有账号？立即登录</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
