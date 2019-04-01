import {logout, getInfo} from 'src/api/login'
import {login, supplizerLogin, authRefresh} from 'src/service/index'
import {getStore, setStore, removeStore} from "src/utils/index";


const user = {
  state: {
    userInfo: {},
    token: getStore('token'),
    name: '',
    avatar: '',
    roles: [],
    interval: null,
  },

  mutations: {
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },

    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INTERVAL: (state, interval) => {
      state.interval = interval
    },

    INIT_USER_INFO: (state) => {
      let saveUserInfo = getStore('User-Info');

      if (saveUserInfo) {
        state.userInfo = JSON.parse(saveUserInfo);
        state.roles = [state.userInfo.level]
      }
    }
  },

  actions: {
    //  登录,整合下供应商和管理员的,字段也统一下
    //  role: supplizer,admin,super(在router的beforeEach中拿缓存的,避免刷新)
    //  router中配置好role
    Login({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        setStore('token', 'ASD')
        commit('SET_TOKEN', 'ASD');
        commit('SET_ROLES', ['admin'])
        resolve()
      })
    },

    // 登出
    LogOut: function ({commit, state}) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeStore('token');
        resolve()
      })
    },

    // 获取用户信息
    GetInfo({commit, state}) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default user
