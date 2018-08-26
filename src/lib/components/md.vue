<template>
    <div class="i-editor-md">
        <slot></slot>
        <div class="dev-md-content" v-html="html" ref="content"></div>
    </div>
</template>
<script>
import marked from 'marked';
import SanitizeState from 'marked-sanitizer-github';
import { SanitizeConfig, SanitizeWhitelist } from 'marked-sanitizer-github';
import hljs from 'highlightjs/highlight.pack.js';
import pinyinUtil from '../util/pinyin/pinyinUtil';

export default {
    props: {
        content: String,
        highlight: {
            type: Function,
            default (code) {
                return hljs.highlightAuto(code).value;
            }
        },
        whitelist: {
            type: Array,
            default () {
                return [];
            }
        },
        renderer: {
            type: Object,
            default () {
                return {}
            }
        }
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

            // HTML tags filter
            const state = new SanitizeState()
            const config = new SanitizeConfig()
            const whitelist = new SanitizeWhitelist()
            this.whitelist.forEach(v => {
                whitelist.ELEMENTS.add(v)
            })
            config.whitelist = whitelist
            state.config = config

            const _this = this;

            this.html = marked(this.content, {
                breaks: true,
                headerIds: false,
                highlight (code) {
                    return _this.highlight(code);
                },
                renderer: Object.assign(renderer, this.renderer),
                sanitize: true,
                sanitizer: state.getSanitizer()
            });
        }
    },
    mounted () {
        this.renderMd();
    }
}
</script>