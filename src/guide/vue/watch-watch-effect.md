# watch와 watchEffect의 차이

Vue.js 3은 `watch` 외에 `watchEffect` 가 추가되었습니다. 두 키워드 모두 반응성을 가진 데이터 변경을 감지하는데 사용합니다.
큰 차이점은 다음과 같습니다.

- watch는 이전값, 현재값 모두 필요한 경우 사용합니다.
- watchEffect는 현재값만 필요할 때 사용합니다.
- watchEffect는 감시하는 대상을 명시적으로 지정하지 않습니다.
- watchEffect는 watchEffect에 전달하는 콜백 메소드 안에 반응성을 가진 데이터를 사용하는 경우에만 호출됩니다.

테스트를 위한 예제입니다. `watch` 1개와 `watchEffect` 3개를 만들었습니다.

```html
<template>
  <div>{{ count }}</div>
  <div>{{ count2 }}</div>
  <button @click="count = Math.random()">change</button>
  <button @click="count2 = Math.random()">change</button>
</template>

<script>
import { ref, watch, watchEffect } from 'vue'
export default {
  setup() {
    const count = ref(0)
    const count2 = ref(1)
    // count가 변화될 때 이전/현재 값을 사용할 수 있습니다.
    watch(count, (current, previous) => { console.log('[count] watch => ', current, previous) })
    // count 또는 count2가 변경되는 경우 호출됩니다.
    watchEffect(() => { console.log('[count, count2] watchEffect', count.value, count2.value) })
    // count가 변경될 때 호출됩니다.
    watchEffect(() => { console.log('[count] watchEffect', count.value) })
    // count2가 변경될 때 호출됩니다.
    watchEffect(() => { console.log('[count2] watchEffect', count2.value) })
    return { count, count2 }
  }
}
</script>
```

각 시점별 출력된 로그입니다.

컴포넌트가 등록될 때

```bash
[count, count2] watchEffect 0 1
[count] watchEffect 0
[count2] watchEffect 1
```

count가 변경될 때

```bash
[count] watch =>  0.16419505711416238 0
[count, count2] watchEffect 0.16419505711416238 1
[count] watchEffect 0.16419505711416238
```

count2가 변경될 때

```bash
[count, count2] watchEffect 0 0.7238270105035622
[count2] watchEffect 0.7238270105035622
```

## 사이드이펙트

`watchEffect` 는 반응성을 가진 데이터가 만들어질 때에도 호출됩니다. 이름에 "effect" 가 붙은 것 처럼 반응성 데이터가 만들어질때의 "사이드이펙트" 도 감지합니다.
Vue.js 3은 `ref`와 `reactive` 가 만들어내는 `ReactiveEffect` 라는 사이드이펙트를 만들어냅니다. 이 사이드이펙트는 `effectStack` 에서 관리됩니다.

`ref` 와 `reactive` 는 값이 변화되는 마지막 시점에 [trigger](https://github.com/vuejs/vue-next/blob/376883d1cfea6ed92807cce1f1209f943a04b625/packages/reactivity/src/effect.ts#L165-L255) 를 호출합니다.
이것으로 반응성 데이터 조작의 "사이드이펙트" 를 발생시킵니다. 발생한 "사이드이펙트" 는 [doWatch](https://github.com/vuejs/vue-next/blob/376883d1cfea6ed92807cce1f1209f943a04b625/packages/runtime-core/src/apiWatch.ts#L133-L314) 에서 처리됩니다.

`watchEffect` 는 `watch` 구현의 최소화 버전입니다. `watch` 는 반응성을 가지는 데이터의 이전, 이후값에 대한 타입 체크 및 상태를 확인 한 다음 처리하는 반면 `watchEffect` 는 사이드이펙트 발생 여부만 사용합니다.


추가로 `ReactiveEffect` 는 아래와 같은 추가 옵션과 핸들러를 가지고 있습니다. 이 장에서 자세히 다루지 않습니다.

```ts
export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: (job: ReactiveEffect) => void
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
  onStop?: () => void
  allowRecurse?: boolean
}
```
