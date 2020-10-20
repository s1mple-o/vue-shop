import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import '../src/assets/gobal.css'
// 导入字体样式
import '../src/assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

// 挂载至vue
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
        router,
        render: h => h(App)
    }).$mount('#app')
    /* eslint-disable eol-last */