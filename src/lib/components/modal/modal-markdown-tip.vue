<template>
    <Modal :title="t('markdown-basic', '常用 Markdown 语法')" scrollable width="300" v-model="value" class="i-editor-md-tip" draggable footer-hide @on-visible-change="onVisibleChange">
        <row>
            <i-col span="10"><strong>Markdown</strong></i-col>
            <i-col span="14"><strong>结果</strong></i-col>
        </row>
        <row>
            <i-col span="10"># {{ t('header', '标题') }}</i-col>
            <i-col span="14"><h1>{{ t('header', '标题') }}</h1></i-col>
        </row>
        <row>
            <i-col span="10">## {{ t('header', '标题') }}</i-col>
            <i-col span="14"><h2>{{ t('header', '标题') }}</h2></i-col>
        </row>
        <row>
            <i-col span="10">**{{ t('bold', '粗体') }}**</i-col>
            <i-col span="14"><strong>{{ t('bold', '粗体') }}</strong></i-col>
        </row>
        <row>
            <i-col span="10">*{{ t('oblique', '斜体') }}*</i-col>
            <i-col span="14"><i>{{ t('oblique', '斜体') }}</i></i-col>
        </row>
        <row>
            <i-col span="10">[{{ t('description', '描述') }}](http://)</i-col>
            <i-col span="14"><a href="javascript:void(0)">{{ t('a-link', '链接') }}</a></i-col>
        </row>
        <row>
            <i-col span="10">`{{ t('inline-code', 'Inline code') }}`</i-col>
            <i-col span="14"><code>{{ t('inline-code', 'Inline code') }}</code></i-col>
        </row>
        <row>
            <i-col span="10">```{{ t('block-code', 'Block code') }}```</i-col>
            <i-col span="14"><code>{{ t('block-code', 'Block code') }}</code></i-col>
        </row>
        <row>
            <i-col span="10">![{{ t('a-link', '链接') }}](http://)</i-col>
            <i-col span="14">{{ t('img', '图片') }}</i-col>
        </row>
        <row>
            <i-col span="10">* {{ t('ul', '无序列表') }}</i-col>
            <i-col span="14"><ul><li>{{ t('ul', '无序列表') }}</li></ul></i-col>
        </row>
        <row>
            <i-col span="10">1. {{ t('ol', '有序列表') }}</i-col>
            <i-col span="14"><ol><li>{{ t('ol', '有序列表') }}</li></ol></i-col>
        </row>
        <row>
            <i-col span="10">> {{ t('blockquote', '引用内容') }}</i-col>
            <i-col span="14"><blockquote>{{ t('blockquote', '引用内容') }}</blockquote></i-col>
        </row>
        <a href="http://wowubuntu.com/markdown/" target="_blank">{{ t('markdown-more', '更多语法') }}</a>
    </Modal>
</template>

<script>
export default {
    name: 'modal-markdown-tip',
    props: {
        value: Boolean,
        t: Function
    },
    methods: {
        onVisibleChange (val) {
            this.$emit('input', val);
        }
    }
}
</script>
