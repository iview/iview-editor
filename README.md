# iView Editor
[http://editor.iviewui.com](http://editor.iviewui.com)
> iView Editor 是基于 iView 的 markdown 编辑器，支持上传图片（可集成七牛等服务），支持全屏实时编辑预览。
## 如何使用
### 通过 npm 安装

```
npm install iview-editor --save
```
在 webpack 中使用插件，部分代码省略：
``` js
import Vue from 'vue';
import iView from 'iview';
import iEditor from 'iview-editor';

// 使用 css
import 'iview/dist/styles/iview.css';
import 'iview-editor/dist/i-editor.css';

// 使用插件
Vue.use(iView);
Vue.use(iEditor);
```

在 .vue 中使用：
``` html
<template>
    <i-editor v-model="content"></i-editor>
</template>
<script>
    export default {
        data () {
            return {
                content: ''
            }
        }
    }
</script>
```

### 通过 CDN 使用
``` html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>iView Editor</title>
        <link rel="stylesheet" type="text/css" href="http://unpkg.com/iview/dist/styles/iview.css">
        <link rel="stylesheet" type="text/css" href="http://unpkg.com/iview-editor/dist/iview-editor.css">
        <script type="text/javascript" src="http://vuejs.org/js/vue.min.js"></script>
        <script type="text/javascript" src="http://unpkg.com/iview/dist/iview.min.js"></script>
        <script type="text/javascript" src="http://unpkg.com/iview-editor/dist/iview-editor.js"></script>
    </head>
    <body>
        <div id="app">
            <i-editor v-model="content"></i-editor>
        </div>
        <script>
            new Vue({
                el: '#app',
                data: {
                    content: ''
                }
            })
        </script>
    </body>
</html>
```
