# 처음 만나는 Composition API

이 문서는 계속 업데이트 되는 내용이 있습니다.

## Composition API

Composition API 는 Vue.js 2 후반, Vue.js 3 초반에 나온 함수 기반 컴포넌트 스크립트 작성 방법입니다.
여러 함수들을 조합하여 사용할 수 있습니다.

Composition API 를 사용하는 경우 Vue.js 2의 스크립트 구성 방법을 그대로 사용할 수 없습니다. Vue.js 2 스타일로 컴포넌트를 만드려면 [defineComponent](https://v3.vuejs.org/api/global-api.html#definecomponent) 를 살펴보세요.
defineComponent는 지금 다루지 않을 예정입니다. 단, TypeScript 를 사용하시는 경우 defineComponent가 Vue.js 3 개발에 도움을 줄 수 있습니다.

## setup

Composition API 는 `setup` 메소드를 이해하는 것으로 시작할 수 있습니다. 기존 Vue.js 2 방식의 `<script>` 태그는 아래와 같이 구성합니다.

```js
export default {
  data() {},
  methods: {}
  // ... 기타
}
```

Composition API 는 `setup` 메소드를 정의합니다.

```js
export default {
  setup(props, context) {
    return {
      // 컴포넌트 템플릿에서 사용할 데이터, 메소드를 리턴합니다
    }
  }
}
```

Vue.js 3 는 실험적으로 아래와 같이 선언할 수 있습니다. `return` 대신 `export const` 를 이용합니다

```html
<template>
  <button @click="inc">{{ count }}</button>
</template>

<script setup>
  import { ref } from 'vue'

  export const count = ref(0)
  export const inc = () => count.value++
</script>
```


자세한 내용은 [RFC](https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-script-setup.md)를 확인하세요

## setup을 이용한 컴포넌트 구성
이번에는 Composition API 를 이용한 함수 조합 또는 합성 대신, Vue.js 2에서 Composition API를 이용한 `setup`은 어떻게 사용해야하는지 알아봅니다

### this는 어디에

Composition API는 `this`가 `undefined` 입니다. Vue.js 2 초기에 가장 많이 질문이 있었던 부분은 일반 함수 `function()` 과 arrow-function `() => {}` 에서 this가 가리키는 것이 서로 달랐던 문제였습니다. setup 메소드에서는 아예 사용하지 않습니다. 대신 `getCurrentInstance` 메소드를 이용합니다

> 주의하세요💥 :  getCurrentInstance 는 현재 Composition API 와 공식 Vue.js 3 문서에 기술되어있지 않습니다.
> 나중에 변경될 가능성이 있습니다.

```js
import { getCurrentInstance } from 'vue'
export default {
  setup () {
    // 현재 컴포넌트의 Vue 인스턴스를 사용하려면 this 대신 `getCurrentInstance` 를 사용하세요
    const vm = getCurrentInstance()
  }
}
```

이 예제에서는 `getCurrentInstance` 메소드를 setup의 최상단에 사용했으나, 실제 사용하는 경우에는 사용하는 메소드 안에서 사용해도 됩니다.

```js
import { onMounted, getCurrentInstance } from 'vue'
export default {
  setup () {
    onMounted(() => {
      const vm = getCurrentInstance()
    })
  }
}
```

이처럼 onMounted 라이프사이클 훅에서 현재 인스턴스가 필요하면 `getCurrentInstance` 를 이용할 수 있습니다.

다른 라이프사이클 훅 목록은 [공식문서](https://v3.vuejs.org/api/options-lifecycle-hooks.html#beforecreate) 를 확인하세요

### 컴포넌트 데이터와 메소드 사용하기

`setup` 메소드의 리턴 결과는 싱글 파일 컴포넌트(SFC) 중 `<template>` 안에서 언제든지 접근할 수 있습니다. 단순한 Hello World 를 보여주는 예제입니다.


```html
<template>
  <div>{{ message }}</div>
</template>
<script>
export default {
  setup () {
    const message = 'Hello World'

    return { message }
  }
}
</script>
```

`Hello World` 를 잘 보여줍니다. 그러면 데이터 `message` 는 메소드로 뒤집을 수 있을까요?

```html
<template>
  <div>{{ message }}</div>
  <button @click="reverse">뒤집기</button>
</template>
<script>
export default {
  setup () {
    const message = 'Hello World'
    const reverse = () => { message.split('').reverse().join('') }
    return { message, reverse }
  }
}
</script>
```

"뒤집기" 버튼을 누르면 Vue.js 2.0 처럼 자동으로 데이터 변경을 감지하고 변경된 결과를 템플릿에 보여줄 것 같지만 전혀 작동하지 않습니다.
`@click` 이벤트가 실행되지 않은건 아닙니다. 항상 `reverse` 에서 사용되는 message는 "Hello World" 입니다.

`this`가 없으니 `vm`을 사용하면 되지 않을까? 라고 생각하고 다음과 같이 변경해봅니다

```html
<template>
  <div>{{ message }}</div>
  <button @click="reverse">뒤집기</button>
</template>
<script>
import { getCurrentInstance } from 'vue'

export default {
  setup () {
    const message = 'Hello World'
    const reverse = () => {
      const vm = getCurrentInstance() // null을 리턴합니다
      vm.message.split('').reverse().join('')
    }
    return { message, reverse }
  }
}
</script>
```

만약 `const vm = getCurrentInstance()` 이 코드가 `setup`의  최상위에 있으면 `reverse` 메소드에서 `vm` 에 접근할 수 있습니다.
하지만 역시 message에 접근해서 내용을 바꾸는 것은 불가능합니다.
Vue.js 3.0 Composition API는 Reactivity를 완전히 바꾸어놓았습니다.
우선은 데이터와 메소드를 `setup` 메소드에서 리턴할 수 있는 것 까지 확인하고 "반응성"을 가지는 데이터를 만드는 것은 [ref와 reactive는 어떻게 다른가](difference-between-ref-and-reactive)에서 살펴봅니다.


## Mixin의 한계를 Composition API로 해결하기

Mixin은 동일한 기능을 여러 다른 컴포넌트에서 사용하는 경우에 사용합니다. Mixin은 간단하게 컴포넌트들에 필요한 것들을 외부로 꺼내어 관리할 수 있게 도와주는 도구입니다.
단, Vue.js 2의 Mixin은 다음의 한계를 가지고 있습니다

- 여러 Mixin이 같은 data 이름이나 method 이름을 사용하는 경우 충돌을 방지할 수 없습니다
- Mixin 사이에 연관관계를 만들 수 없습니다. A Mixin이 B Mixin에 영향을 주거나 받는 경우 명확하게 우선순위를 지정할 수 없습니다

이를 해소하기 위해 `Mixin factory` 기법이나 `Scoped Slots` 을 사용할 수 있습니다. 그러나 과도하게 추가 설정이 들어가기 때문에 불필요하게 구성하는 시간이 소요됩니다
길어진 코드는 관리할 것이 많다는 것을 의미하기도 합니다.

### Composition API 의 해결방법

Composition API는 필요한 함수를 필요한 시점에 `import` 해서 사용합니다. 때문에 필요한 경우에 여러 Mixin을 사용하더라도 함수 내부에 감싸져 있기 때문에 충돌의 염려가 없습니다. 그리고 여러 함수를 사용하는 경우에도 코드를 작성하는 시점에 원하는 순서나 조합으로 함수를 배치하여 명확한 연관관계를 설정할 수 있습니다.
