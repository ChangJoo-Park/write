# deno 모듈 테스트하기

deno는 기본적으로 테스트 기능을 내장하고 있습니다. 다음 명령어로 deno의 test 기능을 사용할 수 있습니다

```bsah
deno test
```

위 명령어를 입력하면 `Deno.test()` 메소드를 실행한 모든 코드를 실행합니다.

테스트를 위해 모듈을 만듭니다. 파일 경로는 `accumulator.ts` 입니다.

```ts
/**
 * Add two numbers
 * @param a first number
 * @param b second number
 */
export const add = (a: number, b: number) => a + b;
```

`accumulator.ts` 에 위 내용을 입력하면 다른 deno 프로그램 파일에서 가져와 사용할 수 있습니다.
이번에는 테스트를 위해 만들었으므로 `accumulator.test.ts` 에서 `add` 모듈을 가져와봅니다

 ```ts
 import { add } from './accumulator.ts'
 ```

 `accumulator.test.ts` 테스트 파일에서 add를 가져왔습니다. add 메소드를 호출하면 두 숫자를 더할 수 있습니다
이제 첫번째 Deno 클래스의 test 메소드를 사용해봅니다

```ts
 import { add } from './accumulator.ts'

Deno.test('1과 2를 더하면 3 입니다', () => {
  console.log(add(1, 2) === 3)
})
 ```

[Deno.test 메소드](https://doc.deno.land/builtin/stable#Deno.test)는 test의 이름과 실행할 메소드를 파라미터로 사용합니다.
위 테스트는 `1과 2를 더하면 3 입니다` 라는 테스트를 정의하였고, 실행되면 `console.log` 로 `add` 메소드를 테스트한 결과를 보여줍니다.

deno는 Node.js와 마찬가지로 `assert` 를 제공합니다 다음 import 구문을 통해 `assert` 모듈을 가져옵니다
그리고 `console.log`를 `assert`로 변경합니다

```ts
import { assert } from "https://deno.land/std/testing/asserts.ts";
import { add } from './accumulator.ts'

Deno.test('1과 2를 더하면 3 입니다', () => {
  assert(1 + 2 === 3, '1과 2를 더하면 3이어야합니다')
})
```

이제 터미널에서 `deno test` 를 입력합니다. `deno test` 만 입력하면 해당 경로와 하위 경로에 있는 `{*_,*.,}test.{js,mjs,ts,jsx,tsx}` 파일을 모두 실행합니다
`deno test accumulator.test.ts` 와 같이 원하는 파일만 실행하도록 할수도 있습니다

deno의 testing 라이브러리는 `assert` 외에도 여러 다른 검증 도구를 제공합니다
[이 문서](https://deno.land/std@0.86.0/testing)에서 검증을 위한 다른 메소드를 확인해보세요
