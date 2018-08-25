<template>
    <div class="i-editor">
        <Affix :offset-top="offsetTop" v-if="affix">
            <div class="i-editor-tabs">
                <Tabs v-model="tabType" :animated="false" @on-click="handleChangeTab">
                    <TabPane :label="t('write', writeName)" name="write"></TabPane>
                    <TabPane :label="t('preview', '预览')" name="preview"></TabPane>
                    <TabPane :label="t('summary', '写摘要')" name="summary" v-if="showSummary"></TabPane>
                    <div class="i-editor-upload" slot="extra">
                        <Upload :config="config" :before-upload="beforeUpload" :styles="1" @on-success="handleUploadSuccess"></Upload>
                        <Upload :config="config" :styles="6" @on-success="handleImportMd"></Upload>
                        <Button type="text" size="small" class="i-editor-upload-item" @click="showDiff = true">
                            <Tooltip :content="t('fullscreen', '全屏编辑')" transfer>
                                <Icon type="md-expand"></Icon>
                            </Tooltip>
                        </Button>
                        <Button type="text" size="small" class="i-editor-upload-item" @click="showInsert = true">
                            <Tooltip :content="t('insert-code', '插入程式码')" transfer>
                                <Icon type="md-code"></Icon>
                            </Tooltip>
                        </Button>
                        <Button type="text" size="small" class="i-editor-upload-item" @click="showMdTip = true">
                            <Tooltip :content="t('markdown-tip', 'Markdown 语法提示')" transfer>
                                <Icon type="logo-markdown"></Icon>
                            </Tooltip>
                        </Button>
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
                    <Upload :config="config" :before-upload="beforeUpload" :styles="1" @on-success="handleUploadSuccess"></Upload>
                    <Upload :config="config" :styles="6" @on-success="handleImportMd"></Upload>
                    <Button type="text" size="small" class="i-editor-upload-item" @click="showDiff = true">
                        <Tooltip :content="t('fullscreen', '全屏编辑')" transfer>
                            <Icon type="md-expand"></Icon>
                        </Tooltip>
                    </Button>
                    <Button type="text" size="small" class="i-editor-upload-item" @click="showInsert = true">
                        <Tooltip :content="t('insert-code', '插入程式码')" transfer>
                            <Icon type="md-code"></Icon>
                        </Tooltip>
                    </Button>
                    <Button type="text" size="small" class="i-editor-upload-item" @click="showMdTip = true">
                        <Tooltip :content="t('markdown-tip', 'Markdown 语法提示')" transfer>
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
                <Markdown :content="content" :highlight="highlight" :whitelist="whitelist" ref="markdown">

                </Markdown>
            </div>
            <div class="i-editor-wrapper" v-if="tabType === 'summary'">
                <Input
                        v-model="summary"
                        :placeholder="t('summary-placeholder', '摘要会在文章列表显示，只支持纯文本。')"
                        type="textarea"
                        :autosize="{minRows: 6}"
                        ref="summary"
                />
            </div>
        </div>
        <Modal :title="t('markdown-basic', '常用 Markdown 语法')" scrollable width="300" v-model="showMdTip" class="i-editor-md-tip" draggable footer-hide>
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
        <Modal :title="t('insert-code', '插入程式码')" v-model="showInsert" draggable @on-ok="handleInsert">
            <Tabs v-model="insertTabType">
                <TabPane :label="t('youtube-video', 'Youtube 影片')" name="youtube">
                    <Input v-model="insertData.youtube.url" :placeholder="t('youtube-placeholder', 'Youtube 影片网址')" />
                </TabPane>
            </Tabs>
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
                    <p>{{ t('fullscreen', '全屏编辑') }}</p>
                    <div class="i-editor-fullscreen-header-tip">
                        <Upload :config="config" :before-upload="beforeUpload" :styles="1" @on-success="handleUploadSuccess"></Upload>
                        <Button type="text" size="small" class="i-editor-item" @click="showDiff = false">
                            <Tooltip :content="t('fullscreen-exit', '退出全屏')" transfer>
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
                            <Markdown :content="content" :highlight="highlight" :whitelist="whitelist"></Markdown>
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
    import qs from 'qs';

    export default {
        name: 'iEditor',
        components: { Upload, Markdown },
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
            },
            whitelist: {
                type: Array,
                default () {
                    return ['iframe'];
                }
            }
        },
        data () {
            return {
                tabType: 'write',  // write || preview || summary
                insertTabType: 'youtube',
                content: this.value,
                showMdTip: false,
                showDiff: false,
                showDiffEditor: false,
                showInsert: false,
                insertData: {
                    youtube: {
                        url: '',
                        template: '<iframe width="640" height="360" src="%s" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
                    }
                },
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
            t (translate, defaultText) {
                return this.i18n ? this.$t(`${this.i18nPrefix}${translate}`) : defaultText;
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
            handleInsert () {
                let result

                if (this.insertTabType === 'youtube') {
                    const y = this.insertData.youtube;
                    const youtubeUrl = this.youtubeUrlFormet(y.url);
                    if (youtubeUrl) {
                        result = y.template.replace(/%s/g, youtubeUrl);
                    }
                }

                if (result) {
                    const $content = this.$refs.content.$refs.textarea;
                    insertText($content, result);

                    this.$nextTick(() => {
                        this.content = $content.value;  // 不加此行，改变了 value 不会重绘，原数据则没有改变
                        this.$refs.content.focus();
                    });
                }
            },
            focus () {
                if (this.$refs.content) {
                    this.$refs.content.focus();
                }
            },
            youtubeUrlFormet (url) {
                const outputUrlTemplate = 'https://www.youtube.com/embed/%s';
                const urlPrefix = url.replace(/(http)(:\/\/)/, '$1s$2').match(/^https\:\/\/[\w-.]*\//);

                if (urlPrefix) {
                    let outputUrlStr = ''
                    const ytDomain = 'https://www.youtube.com/';
                    const ytDomainMin = 'https://youtu.be/';

                    if (urlPrefix[0] === ytDomain) {
                        let params = {
                            rel: 0,
                            modestbranding: 1
                        };
                        const isParams = Boolean(Object.keys(params).length)
                        const ytQs = qs.parse(url.replace(/[^\?]*\?/, ''));
                        ytQs.list ? params.list = ytQs.list : false;
                        outputUrlStr = ytQs.v + (isParams ? `?${qs.stringify(params)}` : '');
                    } else if (urlPrefix[0] === ytDomainMin) {
                        outputUrlStr = url.replace(urlPrefix[0], '').replace(/\?.*/, '');
                    }
                    return outputUrlTemplate.replace(/%s/g, outputUrlStr);
                }
                return null;
            }
        }
    }
</script>