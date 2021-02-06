# macOS 에서 Deno 설치하기

[curl](https://curl.se/)을 이용하여 Deno를 설치하려면 터미널에서 다음 명령어를 입력해주세요

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

[Homebrew](https://brew.sh)로 Deno를 설치하려면 터미널에서 다음 명령어를 입력해주세요

```bash
brew install deno
```

## 첫번째 Deno 애플리케이션 실행하기

Deno 가 잘 설치되어있는지 확인하기 위해 다음 명령어를 터미널에서 실행하세요

```bash
# Deno는 URL을 이용하여 필요한 파일을 실행할 수 있습니다.
deno run https://deno.land/std/examples/welcome.ts
```

## 웹서버 예제 실행하기

Deno 공식 홈페이지의 간단한 [웹 서버 예제](https://deno.land/#getting-started) 를 실행하려면 다음과 같이 해보세요

```bash
# app.ts를 만듭니다. vscode 등의 에디터를 이용해서 직접 만들어도 됩니다
cat <<EOT >> app.ts

import { serve } from "https://deno.land/std@0.86.0/http/server.ts";

const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
EOT

deno run --allow-run --allow-net app.ts
```

이제 브라우저에서 http://localhost:8000 에 접속해보세요
