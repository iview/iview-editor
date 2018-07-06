<template>
    <div class="i-editor-md">
        <slot></slot>
        <div class="dev-md-content" v-html="html" ref="content"></div>
    </div>
</template>
<script>
    import marked from 'marked';
//    import hljs from 'highlightjs/highlight.pack.js';
    import pinyinUtil from '../util/pinyin/pinyinUtil';

    export default {
        props: {
            content: String,
            highlight: Function
        },
        data () {
            return {
                html: ''
            }
        },
        watch: {
            content () {
                this.renderMd();
            }
        },
        methods: {
            renderMd () {
                const renderer = new marked.Renderer();
                renderer.heading = function (text, level) {
                    let id = pinyinUtil.getFirstLetter(text);
                    id = id.replace(/\s/g, '_').replace(/\?|？|,/g, '');
                    return `<h${level} id="${id}">${text}</h${level}>`;
                };

                const _this = this;

                this.html = marked(this.content, {
                    breaks: true,
                    headerIds: false,
                    highlight (code) {
                        return _this.highlight(code);
                    },
                    renderer: renderer
                });
            }
        },
        mounted () {
            this.renderMd();
        }
    };
</script>