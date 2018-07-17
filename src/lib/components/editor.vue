<template>
    <div class="i-editor">
        <Affix :offset-top="offsetTop" v-if="affix">
            <div class="i-editor-tabs">
                <Tabs v-model="tabType" :animated="false" @on-click="handleChangeTab">
                    <TabPane :label="writeName" name="write"></TabPane>
                    <TabPane label="预览" name="preview"></TabPane>
                    <TabPane label="写摘要" name="summary" v-if="showSummary"></TabPane>
                    <div class="i-editor-upload" slot="extra">
                        <Upload :config="config" :before-upload="beforeUpload" :styles="1" @on-success="handleUploadSuccess"></Upload>
                        <Upload :config="config" :styles="6" @on-success="handleImportMd"></Upload>
                        <Button type="text" size="small" class="i-editor-upload-item" @click="showDiff = true">
                            <Tooltip content="全屏编辑" transfer>
                                <Icon type="md-expand"></Icon>
                            </Tooltip>
                        </Button>
                        <Button type="text" size="small" class="i-editor-upload-item" @click="showMdTip = true">
                            <Tooltip content="Markdown 语法提示" transfer>
                                <Icon type="logo-markdown"></Icon>
                            </Tooltip>
                        </Button>
                    </div>
                </Tabs>
            </div>
        </Affix>
        <div class="i-editor-tabs" v-else>
            <Tabs v-model="tabType" :animated="false" @on-click="handleChangeTab">
                <TabPane :label="writeName" name="write"></TabPane>
                <TabPane label="预览" name="preview"></TabPane>
                <TabPane label="写摘要" name="summary" v-if="showSummary"></TabPane>
                <div class="i-editor-upload" slot="extra">
                    <Upload :config="config" :before-upload="beforeUpload" :styles="1" @on-success="handleUploadSuccess"></Upload>
                    <Upload :config="config" :styles="6" @on-success="handleImportMd"></Upload>
                    <Button type="text" size="small" class="i-editor-upload-item" @click="showDiff = true">
                        <Tooltip content="全屏编辑" transfer>
                            <Icon type="md-expand"></Icon>
                        </Tooltip>
                    </Button>
                    <Button type="text" size="small" class="i-editor-upload-item" @click="showMdTip = true">
                        <Tooltip content="Markdown 语法提示" transfer>
                            <Icon type="logo-markdown"></Icon>
                        </Tooltip>
                    </Button>
                </div>
            </Tabs>
        </div>
        <div class="i-editor-md">
            <div class="i-editor-wrapper" v-show="tabType === 'write'" v-if="!showDiff">
                <Upload :paste="paste" :config="config" :before-upload="beforeUpload" type="drag" :styles="3" @on-success="handleUploadSuccess" @click.prevent.stop.native>
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
                <Markdown :content="content" :highlight="highlight" ref="markdown">

                </Markdown>
            </div>
            <div class="i-editor-wrapper" v-if="tabType === 'summary'">
                <Input
                        v-model="summary"
                        placeholder="摘要会在文章列表显示，只支持纯文本。"
                        type="textarea"
                        :autosize="{minRows: 6}"
                        ref="summary"
                />
            </div>
        </div>
        <Modal title="常用 Markdown 语法" scrollable width="300" v-model="showMdTip" class="i-editor-md-tip" draggable footer-hide>
            <row>
                <i-col span="10">
                    <div><strong>Markdown</strong></div>
                    <div># 标题</div>
                    <div>## 标题</div>
                    <div>**粗体**</div>
                    <div>*斜体*</div>
                    <div>[描述](http://)</div>
                    <div>`code`</div>
                    <div>```code```</div>
                    <div>![alt](http://)</div>
                    <div>- item</div>
                    <div>1. item</div>
                    <div>> 引用内容</div>
                </i-col>
                <i-col span="14">
                    <div><strong>结果</strong></div>
                    <div>H1</div>
                    <div>H2</div>
                    <div><strong>粗体</strong></div>
                    <div><i>斜体</i></div>
                    <div><a href="javascript:void(0)">链接</a></div>
                    <div><code>Inline Code</code></div>
                    <div><code>Code</code></div>
                    <div>图片</div>
                    <div><ul><li>无序列表</li></ul></div>
                    <div><ol><li>有序列表</li></ol></div>
                    <div><blockquote>引用内容</blockquote></div>
                </i-col>
            </row>
            <a href="http://wowubuntu.com/markdown/" target="_blank">更多语法</a>
        </Modal>
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
                    <p>全屏编辑</p>
                    <div class="i-editor-fullscreen-header-tip">
                        <Upload :config="config" :before-upload="beforeUpload" :styles="1" @on-success="handleUploadSuccess"></Upload>
                        <Button type="text" size="small" class="i-editor-item" @click="showDiff = false">
                            <Tooltip content="退出全屏" transfer>
                                <Icon type="md-contract"></Icon>
                            </Tooltip>
                        </Button>
                    </div>
                </div>
                <div class="i-editor-fullscreen-main">
                    <row :gutter="32">
                        <i-col span="12">
                            <Upload :paste="paste" :config="config" :before-upload="beforeUpload" v-if="showDiffEditor" type="drag" :styles="3" @on-success="handleUploadSuccess" @click.prevent.stop.native>
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
                            <Markdown :content="content" :highlight="highlight"></Markdown>
                        </i-col>
                    </row>
                </div>
                <div class="i-editor-fullscreen-tail"></div>
            </div>
        </Modal>
    </div>
</template>
<script>
    import insertText from '../util/insertText';
    import Upload from './upload.vue';
    import Markdown from './md.vue';

    export default {
        name: 'iEditor',
        components: { Upload, Markdown },
        props: {
            affix: Boolean,
            offsetTop: Number,
            placeholder: String,
            autosize: Object,
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
            paste: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                tabType: 'write',  // write || preview || summary
                content: this.value,
                showMdTip: false,
                showDiff: false,
                showDiffEditor: false,
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
//            coverUrl () {
//                return config.filePrefix + this.cover + '/large';
//            }
        },
        methods: {
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
//                const url = config.filePrefix + res.key + '/large';
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
                        title: '导入确认',
                        content: '导入后将覆盖您已经输入的内容，是否继续导入？',
                        onOk: () => {
                            this.content = result;
                        }
                    });
                } else {
                    this.content = result;
                }
            },
            focus () {
                if (this.$refs.content) {
                    this.$refs.content.focus();
                }
            }
        }
    }
</script>