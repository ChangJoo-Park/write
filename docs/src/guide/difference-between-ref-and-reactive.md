# ref 와 reactive는 어떻게 다른가

[처음 만나는 Composition API](composition-api) 에서 `setup` 메소드를 이용하고, 데이터와 메소드를 리턴한 다음 `<template>` 에서 사용하는 컴포넌트를 살펴보았습니다.

그러나 데이터를 변경할 수는 없었습니다, `this`는 제공하지 않고, `getCurrentInstance`로 가져온 Vue 인스턴스인 `vm` 를 이용해도 데이터를 할 수 없었습니다.

Vue.js 3 부터는 반응성을 위한 두가지 유틸리티 `ref` `reactive` 두가지를 제공합니다. 우선, 선택하는 기준은 다음과 같습니다.

- ref : 반응성이 필요한 데이터가 JavaScript 원시 자료형(primitive)인 경우
- reactive : 반응성이 필요한 데이터가 원시 자료형이 아닌 경우. 보통 객체
- 고르기 어려우면 항상 `ref` 를 사용해도 문제되지 않습니다.

## ref로 반응성을 추가한 message

```html
<template>
  <div>{{ message }}</div>
  <button @click="reverse">뒤집기</button>
</template>
<script>
import { ref, getCurrentInstance } from 'vue'

export default {
  setup () {
    // 반응성을 가진 문자열로 만듭니다
    const message = ref('Hello World')
    const reverse = () => {
      message.value = message.value
        .split('')
        .reverse()
        .join('')
    }
    return { message, reverse }
  }
}
</script>
```

이제 "뒤집기" 버튼이 정상적으로 작동합니다. 메시지를 뒤집고 새로 message ref의 value에 넣어주면 `<template>` 에도 변경사항이 전달됩니다.
`ref` 로 만든 객체는 아래와 같이 구성되어있습니다.

```js
Object {
  __v_isRef: true,
  _rawValue: "Hello World",
  _shallow: false,
  _value: "Hello World"
}
```

`value` 가 변경되면 Vue.js 3 반응성 시스템에 따라 영향을 받는 모든 곳에 변경사항을 전파합니다. `ref`를 사용하는 경우 `value` 를 사용하는 것에 유의하세요.
`ref` 외에도 깊은 반응성을 갖지 않는 `shallowRef`를 제공합니다. 이 장에서는 다루지 않습니다.


## reactive로 반응성을 추가한 message

message는 자바스크립트 원시 자료형인 문자열이기 때문에 reactive로 반응성을 추가할 수 없습니다. 아래 예제는 당연히 작동하지 않습니다.

```html
<template>
  <div>{{ message }}</div>
  <button @click="reverse">뒤집기</button>
</template>
<script>
import { reactive, getCurrentInstance } from 'vue'

export default {
  setup () {
    // 원시 자료형은 반응성을 갖지 못합니다.
    const message = reactive('Hello World')
    const reverse = () => {
      message = message
        .split('')
        .reverse()
        .join('')
    }
    return { message, reverse }
  }
}
</script>
```

reactive를 이용해서 message에 반응성을 추가하려면 아래와 같이 사용하여야 합니다. 아래 방법은 이 예제 뿐만 아니라 `<template>` 태그에서 데이터와 메소드를 분리하여 확인할 수 있도록 명시적으로 변수를 선언하는 방법을 보여줍니다.


```html
<template>
  <div>{{ state.message }}</div>
  <button @click="action.reverse">뒤집기</button>
</template>
<script>
import { reactive, getCurrentInstance } from 'vue'

export default {
  setup () {
    const state = reactive({
      message: 'Hello World'
    })
    const action = {
      reverse() {
        state.message = state.message.split('').reverse().join('')
      }
    }
    return { state, action }
  }
}
</script>
```

`state` 를 `console.log`로 출력하면 다음과 같이 나옵니다.

```js
Object {
  message: "Hello World"
}
```

`ref`와 다르게 다른 속성이 없습니다. Vue.js 3는 `reactive` 로 반응성을 얻기 위해 [Proxy](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Proxy)와 [Reflect](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Reflect)를 사용합니다. Proxy는 target 객체와 handler를 이용해서 객체가 호출되거나 새로운 값이 지정될 때 다른 동작을 하도록 만들 수 있습니다. Vue.js 는 Reflect를 이용해 핸들러의 기본 동작을 Vue.js 의 메소드로 변경합니다.

`reactive` 핸들러는 Vue.js 코어의 `baseHandler.ts` 중 [`mutableHandler` 코드](https://github.com/vuejs/vue-next/blob/f316a332b055d3f448dc735365551d89041f1098/packages/reactivity/src/baseHandlers.ts#L187-L193)부터 자세히 살펴볼 수 있습니다.

Vue.js 3  `reactive` 에서 사용하는 [get 핸들러 createGetter](https://github.com/vuejs/vue-next/blob/f316a332b055d3f448dc735365551d89041f1098/packages/reactivity/src/baseHandlers.ts#L72-L124)와 [set 핸들러 createSetter](https://github.com/vuejs/vue-next/blob/f316a332b055d3f448dc735365551d89041f1098/packages/reactivity/src/baseHandlers.ts#L129-L162) 도 살펴보세요

Vue.js 3의 `ref` 와 `reactive` 는 Vue.js 2 의 `this`만큼 많은 질문을 만들어낼 것으로 보입니다. 맨 위에 말씀드렸던 내용 중 "고르기 어려우면 항상 `ref` 를 사용해도 문제되지 않습니다." 의 이유는 다음과 같습니다.

`ref` 를 이용해서 객체를 만들면 반응성을 가진 객체를 만드는 시점에 `reactive` 로 감싸줍니다.

`ref` 의 생성자 중 [`convert` 메소드의 구현](https://github.com/vuejs/vue-next/blob/master/packages/reactivity/src/ref.ts#L52-L54) 을 살펴보세요.
