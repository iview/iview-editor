<template>
    <div class="i-editor">
        <Affix :offset-top="offsetTop" v-if="affix">
            <div class="i-editor-tabs">
                <Tabs v-model="tabType" :animated="false" @on-click="handleChangeTab">
                    <TabPane :label="t('write', writeName)" name="write"></TabPane>
                    <TabPane :label="t('preview', '预览')" name="preview"></TabPane>
                    <TabPane :label="t('summary', '写摘要')" name="summary" v-if="showSummary"></TabPane>
                    <div class="i-editor-upload" slot="extra">
                        <Upload :config="config" :before-upload="beforeUpload" :styles="1" @on-success="handleUploadSuccess" :t="t"></Upload>
                        <Upload :config="config" :styles="6" @on-success="handleImportMd" :t="t"></Upload>
                        <EditorToolBtn class="i-editor-upload-item" @on-click="showInsert = true"
                            :content="t('insert-code', '插入程式码')" icon="md-code" />
                        <EditorToolBtn class="i-editor-upload-item" @on-click="showMdTip = true"
                            :content="t('markdown-tip', 'Markdown 语法提示')" icon="logo-markdown" />
                        <EditorToolBtn class="i-editor-upload-item" @on-click="showDiff = true"
                            :content="t('fullscreen', '全屏编辑')" icon="md-expand" />
                    </div>
                </Tabs>
            </div>
        </Affix>
        <div class="i-editor-tabs" v-else>
            <Tabs v-model="tabType" :animated="false" @on-click="handleChangeTab">
                <TabPane :label="t('write', writeName)" name="write"></TabPane>
                <TabPane :label="t('preview', '预览')" name="preview"></TabPane>
                <TabPane :label="t('summary', '写摘要')" name="summary" v-if="showSummary"></TabPane>
                <div class="i-editor-upload" slot="extra">
                    <Upload :config="config" :before-upload="beforeUpload" :styles="1" @on-success="handleUploadSuccess" :t="t"></Upload>
                    <Upload :config="config" :styles="6" @on-success="handleImportMd" :t="t"></Upload>
                    <EditorToolBtn class="i-editor-upload-item" @on-click="showInsert = true"
                        :content="t('insert-code', '插入程式码')" icon="md-code" />
                    <EditorToolBtn class="i-editor-upload-item" @on-click="showMdTip = true"
                        :content="t('markdown-tip', 'Markdown 语法提示')" icon="logo-markdown" />
                    <EditorToolBtn class="i-editor-upload-item" @on-click="showDiff = true"
                        :content="t('fullscreen', '全屏编辑')" icon="md-expand" />
                </div>
            </Tabs>
        </div>
        <div class="i-editor-md">
            <div class="i-editor-wrapper" v-show="tabType === 'write'" v-if="!showDiff">
                <Upload :paste="paste" :config="config" :before-upload="beforeUpload" type="drag" :styles="3" :t="t" @on-success="handleUploadSuccess" @click.prevent.stop.native>
                    <Input
                            v-model="content"
                            :placeholder="placeholder"
                            type="textarea"
                            :autosize="autosize"
                            ref="content"
                    />
                </Upload>
            </div>
            <div class="i-editor-wrapper" v-if="tabType === 'preview'">
                <Markdown :content="content" :highlight="highlight" :whitelist="whitelist" :renderer="renderer" ref="markdown">
                </Markdown>
            </div>
            <div class="i-editor-wrapper" v-if="tabType === 'summary'">
                <Input
                        v-model="summary"
                        :placeholder="t('summary-placeholder', '摘要会在文章列表显示，只支持纯文本。')"
                        type="textarea"
                        :autosize="{ minRows: 6 }"
                        ref="summary"
                />
            </div>
        </div>
        <Modal
                :closable="false"
                :mask-closable="false"
                v-model="showDiff"
                width="100"
                class-name="i-editor-fullscreen"
                footer-hide
                :transition-names="['','']"
        >
            <div v-if="showDiff" class="i-editor-fullscreen-container">
                <div slot="header" class="i-editor-fullscreen-header">
                    <p>{{ t('fullscreen', '全屏编辑') }}</p>
                    <div class="i-editor-fullscreen-header-tip">
                        <Upload :config="config" :before-upload="beforeUpload" :styles="1" @on-success="handleUploadSuccess" :t="t"></Upload>
                        <EditorToolBtn class="i-editor-item" @on-click="showInsert = true"
                            :content="t('insert-code', '插入程式码')" icon="md-code" />
                        <EditorToolBtn class="i-editor-item" @on-click="showMdTip = true"
                            :content="t('markdown-tip', 'Markdown 语法提示')" icon="logo-markdown" />
                        <EditorToolBtn class="i-editor-item" @on-click="showDiff = false"
                            :content="t('fullscreen-exit', '退出全屏')" icon="md-contract" />
                    </div>
                </div>
                <div class="i-editor-fullscreen-main">
                    <row :gutter="32">
                        <i-col span="12">
                            <Upload :paste="paste" :config="config" :before-upload="beforeUpload" v-if="showDiffEditor" type="drag" :styles="3" :t="t" @on-success="handleUploadSuccess" @click.prevent.stop.native>
                                <Input
                                        v-model="content"
                                        :placeholder="placeholder"
                                        type="textarea"
                                        :autosize="autosize"
                                        ref="content"
                                />
                            </Upload>
                        </i-col>
                        <i-col span="12">
                            <Markdown :content="content" :highlight="highlight" :whitelist="whitelist" :renderer="renderer"></Markdown>
                        </i-col>
                    </row>
                </div>
                <div class="i-editor-fullscreen-tail"></div>
            </div>
        </Modal>
        <ModalMarkdownTip v-model="showMdTip" :t="t" />
        <ModalInsert v-model="showInsert" @on-submit="handleInsert" :t="t" />
    </div>
</template>
<script>
import insertText from '../util/insertText';
import Upload from './upload.vue';
import Markdown from './md.vue';
import EditorToolBtn from './editor-tool-btn.vue';
import ModalMarkdownTip from './modal/modal-markdown-tip.vue';
import ModalInsert from './modal/modal-insert.vue';

export default {
    name: 'iEditor',
    components: {
        Upload,
        Markdown,
        EditorToolBtn,
        ModalMarkdownTip,
        ModalInsert
    },
    props: {
        affix: Boolean,
        offsetTop: Number,
        placeholder: String,
        autosize: Object,
        i18n: {
            type: Boolean,
            default: false
        },
        i18nPrefix: {
            type: String,
            default: 'i-ed-'
        },
        writeName: {
            type: String,
            default: '内容'
        },
        changeScroll: Boolean,
        cover: String,
        showSummary: {
            type: Boolean,
            default: false
        },
        config: {
            type: Object,
            default () {
                return {
                    action: '/',
                    maxSize: 5120
                }
            }
        },
        value: {
            type: String,
            default: ''
        },
        paste: {
            type: Boolean,
            default: false
        },
        beforeUpload: {
            type: Function,
            default () {
                return true;
            }
        },
        imgUrl: {
            type: Function,
            default (res) {
                return res;
            }
        },
        highlight: {
            type: Function,
            default (code) {
                return code;
            }
        },
        whitelist: {
            type: Array,
            default () {
                return ['iframe'];
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
            tabType: 'write',  // write || preview || summary
            content: this.value,
            showMdTip: false,
            showDiff: false,
            showDiffEditor: false,
            showInsert: false,
            summary: ''
        };
    },
    watch: {
        showDiff (val) {
            // 避免出现输入框的滚动条
            this.$nextTick(() => {
                this.showDiffEditor = val;
            });
        },
        value (val) {
            this.content = val;
        },
        content (val) {
            this.$emit('input', val);
        }
    },
    computed: {
        // coverUrl () {
        //     return config.filePrefix + this.cover + '/large';
        // }
    },
    methods: {
        t (translate, defaultText, params) {
            return this.i18n ? this.$t(`${this.i18nPrefix}${translate}`, params) : defaultText;
        },
        handleChangeTab (name) {
            if (name === 'write') {
                this.$nextTick(() => {
                    this.$refs.content.focus();
                });
            } else if (name === 'preview') {
                if (this.changeScroll) {
                    this.$nextTick(() => {
                        const md = this.$refs.markdown.$el;
                        window.scrollTo(0, md.offsetTop);
                    });
                }
            } else if (name === 'summary') {
                this.$nextTick(() => {
                    this.$refs.summary.focus();
                });
            }
        },
        handleUploadSuccess (res) {
            // const url = config.filePrefix + res.key + '/large';
            const url = this.imgUrl(res);
            const md_link = `![](${url})`;

            const $content = this.$refs.content.$refs.textarea;
            insertText($content, md_link);

            this.$nextTick(() => {
                this.content = $content.value;  // 不加此行，改变了 value 不会重绘，原数据则没有改变
                this.$refs.content.focus();
            });
        },
        handleImportMd (result) {
            if (this.content !== '') {
                this.$Modal.confirm({
                    title: this.t('import-md-title', '导入确认'),
                    content: this.t('import-md-content', '导入后将覆盖您已经输入的内容，是否继续导入？'),
                    onOk: () => {
                        this.content = result;
                    }
                });
            } else {
                this.content = result;
            }
        },
        handleInsert (result) {
            const $content = this.$refs.content.$refs.textarea;
            insertText($content, result);

            this.$nextTick(() => {
                this.content = $content.value;  // 不加此行，改变了 value 不会重绘，原数据则没有改变
                this.$refs.content.focus();
            });
        },
        focus () {
            if (this.$refs.content) {
                this.$refs.content.focus();
            }
        }
    }
}
</script>