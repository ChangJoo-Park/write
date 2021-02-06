# deno의 nodemon, denon

앞의 [macOS 에서 Deno 설치하기](/install-deno-macos)의 웹서버 예제 실행하기 섹션에서 다음과 같이 server.ts 파일을 실행합니다.

```bash
deno run --allow-run --allow-net app.ts
```

Node.js와 다르게 파일 이름만 입력해서는 실행되지 않습니다. 웹서버 프로그램이기 때문에 네트워크의 접근 권한을 위해 `--allo-net` 플래그와 함께 실행하여야 합니다.

매번 긴 명령어를 입력할 수는 없으니 Node.js의 [nodemon](https://www.npmjs.com/package/nodemon)과 같은 역할을 하는 [denon](https://deno.land/x/denon@2.4.7)을 사용합니다


denon은 파일이 변경되면 자동으로 갱신된 코드를 재실행합니다.

## denon 설치하기

```bash
deno install -qAf --unstable https://deno.land/x/denon/denon.ts
```

위 명령어를 실행하면 denon이 설치됩니다. 설치가 완료되면 다음 명령어로 프로젝트를 denon 이 알 수 있도록 초기화해야합니다

```bash
denon --init
```

설정이 완료되면 만들어진 `scripts.json` 을 열어 다음과 같이 수정합니다

```json
{
  "$schema": "https://deno.land/x/denon@2.4.7/schema.json",
  "scripts": {
    "start": {
      "cmd": "deno run --allow-run --allow-net app.ts",
      "desc": "run my app.ts file"
    }
  }
}
```

Node.js package.json의 `scripts` 유사하지만 cmd 와 desc로 나뉘어 있는 것을 볼 수 있습니다. `start` 스크립트의 `cmd` 에 터미널에 직접 입력했던 명령어를 입력해줍니다.

## denon 실행하기

denon 명령어는 deno 명령어와 같은 역할을 합니다. 단지 파일이 변경되면 재시작 하는 역할을 해줄뿐입니다.
deno 명령어가 아닌 denon을 이용해서 deno 프로그램을 실행하려면 다음과 같이 입력하세요

```bash
denon start
```

이제 파일을 수정하면 denon이 알아서 재실행 해줍니다.


## denon을 사용하지 않고 deno만 이용해서 파일 변경 적용하기

deno의 `--unstable` 플래그와 함께 `--watch` 플래그를 사용하면 denon과 같은 파일 변경 감지 기능을 사용할 수 있습니다.
단, scripts 와 같은 기능은 지원하지 않기 때문에 denon을 사용하는 것을 권합니다.

```
deno run --watch --unstable main.ts
```