import { defineStore } from 'pinia'

//  TS 类型定义
interface UserState {
  token: string
  sessionId: string
  session_key: string
  openid: string
  unionid: string
  userInfo: any
  wxUserInfo: any
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: uni.getStorageSync('token') || '',
    sessionId: uni.getStorageSync('sessionId') || '',
    session_key: '',
    openid: '',
    unionid: '',
    userInfo: null, //  平台用户数据
    wxUserInfo: null, // 微信用户信息
  }),

  actions: {
    // 设置token
    setToken(token: string): void {
      this.token = token
    },
    // 退出登录
    logout() {
      const map1 = ['token', 'userInfo', 'sessionId']
      const map2 = ['sessionId', 'session_key', 'openid', 'unionid', 'userInfo', 'token']
      map1.forEach((key) => {
        uni.removeStorageSync(key)
      })

      map2.forEach((key) => {
        this[key] = ''
      })
    },
    // 登录
    async login() {
      // const {code} = await wx.login();
      const authData = await Axios.post(`/user/login`, {})
      this.sessionId = authData.sessionId
      uni.setStorageSync('sessionId', authData.sessionId)
      this.getUserInfo()
    },
    // 获取用户信息
    async getUserInfo() {
      if (!this.token) return
      const params = { token: this.token }
      const result = await Axios.post('/member/sh/memberInformation/getMemberInfoById', params)
      if (result && result.code == 200) {
        if (result.data.iconUrl === '') {
          result.data.iconUrl =
            'http://192.168.1.187:10088/static/user-center/icon-user-center-default-avatar.png'
        }
        // 已实名用户
        if (result.data.idCard === '' || result.data.idCard === ' ') {
          result.data.crtfStas = false
        } else {
          result.data.crtfStas = true
        }

        this.userInfo = result.data
        uni.setStorageSync('userInfo', result.data)
      } else {
        uni.showToast({ icon: 'none', title: result.msg || result.data })
      }
    },
  },
})
export function useAppStoreHook() {
  return useUserStore()
}
