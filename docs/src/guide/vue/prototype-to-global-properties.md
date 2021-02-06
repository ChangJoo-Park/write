# 글로벌 속성 주입 방식 변경

```js
import Vue from 'vue'
import axios from 'axios'

// prototype에서
Vue.prototype.$http = axios

// globalProperties로
const app = Vue.createApp({}) // app을 만든 이후
app.config.globalProperties.$http = axios
```