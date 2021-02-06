# Vue 앱 디버깅

Vue.js 3 앱을 Visual Studio Code(VSCode)로 개발하는 중 디버그 탭을 이용할 수 있습니다.

우선 개발중인 프로젝트의 `vue.config.js` 파일에 아래와 같이 내용을 추가합니다. 파일이 없으면 새로 만들어줍니다.

```js
module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  }
}
```

크롬을 이용하기 때문에 VSCode의 [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) 확장 프로그램을 우선 설치한 후 진행하세요

`.vscode\launch.json` 파일을 만들고 아래 내용을 넣어주세요. 저는 [Yarn](https://classic.yarnpkg.com/en/)을 사용하고 있기때문에 `yarn serve` 명령어를 사용합니다. [npm](https://www.npmjs.com/)을 사용하시면 npm 으로 변경해주세요

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "command": "yarn serve",
      "name": "Vue 앱 실행",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Vue.js 크롬",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///./src/*": "${webRoot}/*"
      }
    }
  ],
  "compounds": [
    {
      "name": "디버그",
      "configurations": [
        "Vue 앱 실행",
        "Vue.js 크롬"
      ]
    }
  ]
}
```

이제 VSCode의 디버그 탭에 `Vue 앱 실행`, `Vue.js 크롬`, 그리고 `디버그` 메뉴가 만들어졌습니다.

앱 실행과 크롬 디버그를 동시에 하기위해 `디버그` 를 선택후 시작 버튼을 누르세요

VSCode에서 원하는 `.vue` 파일에 브레이크포인트를 지정하고 작동하는지 확인하세요
