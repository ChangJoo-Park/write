# deno로 첫번째 API 서버 만들어보기

이전 [install-deno-macos](/install-deno-macos) 에서 `http` 라이브러리의 `serve` 모듈을 이용해 서버를 만들어보았습니다.

`http` 라이브러리는 `listenAndServe` 라는 모듈을 추가로 제공합니다. 내부적으로는 `serve`를 이용합니다.
`listenAndServe` 의 전체 코드는 다음과 같습니다. 내부적으로 `serve`를 이용합니다.

```ts
/**
 * Start an HTTP server with given options and request handler
 *
 *     const body = "Hello World\n";
 *     const options = { port: 8000 };
 *     listenAndServe(options, (req) => {
 *       req.respond({ body });
 *     });
 *
 * @param options Server configuration
 * @param handler Request handler
 */
export async function listenAndServe(
  addr: string | HTTPOptions,
  handler: (req: ServerRequest) => void,
): Promise<void> {
  const server = serve(addr);

  for await (const request of server) {
    handler(request);
  }
}
```

## 첫번째 유사 express 앱 만들기

우선, express의 헬로월드 예제입니다.

```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

이번에는 deno를 이용해 위와 유사한 역할을 하는 웹서버를 만들어봅니다

```ts
import {
  listenAndServe,
  ServerRequest,
} from "https://deno.land/std/http/server.ts";

const options: Deno.ListenOptions = { port: 3000 };

const handler = (req: ServerRequest) =>
  req.respond({ status: 200, body: "Hello World!" });

listenAndServe(options, handler);
```

`listenAndServe` 모듈을 이용해서 거의 유사한 웹서버를 만들었습니다. 단, express의 예제는 `http://localhost:3000` 에만 Hello World! 메시지를 보여주는데 deno로 만든 예제는 모든 요청에 대해 Hello World! 를 리턴하는 것이 다릅니다

경로 `/` 에만 Hello World! 를 보여주려면, `req.url`이 `/` 일 때만 처리하도록 변경하면 됩니다.

약간 코드를 추가하여 express 처럼 `app.get` 같은 라우트 등록 메소드를 만들어봅니다

```ts
import {
  listenAndServe,
  ServerRequest,
} from "https://deno.land/std/http/server.ts";

const options: Deno.ListenOptions = { port: 8000 };

/**
 *  Router 클래스는 `get` 인스턴스 메소드를 이용하여 라우트를 등록하고,
 * `route` 인스턴스 메소드를 이용하여 등록된 라우트로 요청이 들어오면 처리합니다.
 * 등록되어 있지 않은 요청을 받으면 NOT FOUND를 리턴합니다.
 */
class Router {
  _get: { [k: string]: (req: ServerRequest) => void } = {};
  /**
   * GET METHOD 라우트를 등록합니다
   * @param path
   * @param handler
   */
  get(path: string, handler: (req: ServerRequest) => void) {
    this._get[path] = handler;
  }
  /**
   * 요청받은 ServerRequest를 처리합니다
   * @param req {ServerRequest}
   */
  route(req: ServerRequest) {
    if (this._get[req.url]) {
      return this._get[req.url](req);
    }

    return req.respond({ status: 404, body: "NOT FOUND", });
  }
}
const router = new Router();

router.get(
  "/",
  (req: ServerRequest) =>
    req.respond({ status: 200, body: 'Hello World!') }),
);

listenAndServe(options, ((req: ServerRequest) => router.route(req)));
```

실제 운영을 목적으로 하는 애플리케이션에서 이렇게 만들지는 않겠지만 [oak](https://github.com/oakserver/oak)나 [dinatra](https://github.com/syumai/dinatra) 같은 deno를 이용하여 만든 웹 앱 프레임워크들은 외부로부터의 요청을 위와 같이 처리하고 있습니다.

URL 파라미터 처리 또는 요청의 body 등을 처리하면 다른 웹 프레임워크들과 조금은 가까워지지만 다른 잘 만들어진 웹 프레임워크를 사용하고, 기여하는 것을 추천합니다.
