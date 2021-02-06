# ref 와 reactive의 성능차이

[ref 와 reactive는 어떻게 다른가](difference-between-ref-and-reactive)에서 `ref`와 `reactive` 사용법과 차이점을 알아봤습니다.

이번에는, 두 반응성을 위한 유틸리티의 성능은 얼마나 차이나는지 알아봅니다.

> 주의하세요. 이 벤치마크는 10만개의 매우 큰 데이터를 한 페이지에 보여줍니다. 일반적인 사용사례와 다른 것을 염두하세요

## 10만개 새 데이터 만들기

테스트한 코드는 다음과 같습니다. `template` 없이 순수한 자바스크립트 연산만 알아봅니다.
약 10만개의 숫자 0을 배열에 넣는 테스트입니다.

```js
import { reactive, ref, shallowReactive, shallowRef } from 'vue';
export default {
  setup() {
    console.time('REF')
    const COUNT = 100000
    const refs = []
    for (let index = 0; index < COUNT; index++) {
      refs.push(ref(0))
    }
    console.timeEnd('REF')

    console.time('REACTIVE')
    const reactives = reactive({ items: [] })
    for (let index = 0; index < COUNT; index++) {
      reactives.items.push(0)
    }
    console.timeEnd('REACTIVE')

    console.time('SHALLOW REF')
    const shallowRefs = []
    for (let index = 0; index < COUNT; index++) {
      shallowRefs.push(shallowRef(0))
    }
    console.timeEnd('SHALLOW REF')

    console.time('SHALLOW REACTIVE')
    const shallowReactives = shallowReactive({ items: [] })
    for (let index = 0; index < COUNT; index++) {
      shallowReactives.items.push(0)
    }
    console.timeEnd('SHALLOW REACTIVE')
    return {}
  }
}
```

```bash
# 10만개의 0을 가지는 배열
REF: 17.365966796875 ms
REACTIVE: 317.284912109375 ms
SHALLOW REF: 10.8359375 ms
SHALLOW REACTIVE: 12.307861328125 ms
```

shallowRef > shallowReactive > ref > reactive 순으로 성능 차이를 보여줍니다. `reactive` 의 경우 갯수가 많아질수록 큰 차이를 보여줍니다.

## 10만개 데이터 조작

```js
import { reactive, ref, shallowReactive, shallowRef } from 'vue';
export default {
  setup() {
    // ... 10만개 데이터 생성과 같음
    console.time('Mutate Ref')
    for (let index = 0; index < COUNT; index++) {
      refs[index].value = Math.random()
    }
    console.timeEnd('Mutate Ref')

    console.time('Mutate Shallow Ref')
    for (let index = 0; index < COUNT; index++) {
      shallowRefs[index].value = Math.random()
    }
    console.timeEnd('Mutate Shallow Ref')

    console.time('Mutate Reactive')
    for (let index = 0; index < COUNT; index++) {
      reactives.items[index] = Math.random()
    }
    console.timeEnd('Mutate Reactive')

    console.time('Mutate Shallow Reactive')
    for (let index = 0; index < COUNT; index++) {
      shallowReactives.items[index] = Math.random()
    }
    console.timeEnd('Mutate Shallow Reactive')
    return {}
  }
}
```

위 코드는 의외의 결과를 보여줍니다. reactive, shallowReactive가 월등히 빠른 결과를 보여줍니다.

```bash
Mutate Ref: 0.178955078125 ms
Mutate Shallow Ref: 0.18505859375 ms
Mutate Reactive: 0.340087890625 ms
Mutate Shallow Reactive: 0.048828125 ms
```

`ref`와 `shallowRef`를 가지는 배열은 거의 동일한 시간이 걸렸습니다. 데이터를 만드는 경우와도 거의 비슷합니다.
그러나 `shallowReactive`는 빠른 데이터 조작 속도를 보여줍니다.

최초에 데이터가 많이 만들어지고, 조작이 적은 경우에는 `ref`, `shallowRef`, `shallowReactive` 중 어떤 것을 선택하여도 문제가 되지 않습니다. 그러나 데이터 조작이 매우 잦은 경우에는 `shallowReactive` 를 고르는 것을 고려해보아야합니다.

**물론**, 이 벤치마크는 10만개의 데이터를 한번에 만들고 조작하는 경우를 다루었습니다. 이정도 크기의 데이터를 다루지 않는 경우에는 `shallow-*` 를 사용하지 않아도 문제가 되지 않습니다. `reactive` 를 사용해도 괜찮습니다.
