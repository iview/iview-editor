<template>
    <Upload
            :type="type"
            :paste="paste"
            :action="config.action"
            :show-upload-list="false"
            :data="config.uploadForm"
            :format="['jpg','jpeg','png','gif']"
            :on-format-error="handleFormatError"
            :max-size="config.maxSize"
            :on-exceeded-size="handleMaxSize"
            :before-upload="beforeUploadFile"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-progress="handleProgress">
        <slot>
            <Button type="text" size="small" :disabled="uploadStatus === 1" class="i-editor-upload-item" v-if="styles === 1">
                <Tooltip content="上传图片" transfer>
                    <Icon type="ios-image"></Icon>
                </Tooltip>
                <span v-show="uploadStatus">({{ uploadPercent }}%)</span>
            </Button>
            <Button type="text" size="small" class="i-editor-upload-item" v-if="styles === 6">
                <Tooltip content="导入 Markdown 文件" transfer>
                    <Icon type="md-document"></Icon>
                </Tooltip>
            </Button>
        </slot>
    </Upload>
</template>
<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'select'
            },
            /**
             * 1: 编辑器的上传
             * 2: 发文章时的封面大图
             * 3: 编辑器的拖拽上传
             * 4: 上传用户封面
             * 5: 上传用户头像
             * 6: 上传 markdown 文件
             */
            styles: {
                type: Number,
                default: 0
            },
            cover: String,
            // 为 true 时，是设置头像、封面，获取token的链接不同
            info: {
                type: Boolean,
                default: false
            },
            // styles 为 5 时使用
            showBtn: Boolean,
            config: Object,
            beforeUpload: Function,
            paste: Boolean
        },
        data () {
            return {
                uploadForm: {},
                uploadPercent: 0,
                uploadStatus: 0,  // 0未上传，1上传中
                noUploadAccess: false
            };
        },
        computed: {

        },
        methods: {
            beforeUploadFile (file) {
                if (this.styles === 6) {
                    const file_type = file.type;

                    if (file_type !== 'text/markdown') {
                        this.$Notice.warning({
                            title: '文件格式不正确',
                            desc: '您上传的文件 ' + file.name + ' 格式不符合要求，请上传 .md 格式的文件。',
                            duration: 6
                        });
                        return false;
                    }

                    const reader = new FileReader();
                    reader.readAsText(file);
                    const _this = this;
                    reader.onload = function () {
                        _this.$emit('on-success', this.result);
                    };

                    return false;
                } else {
                    return this.beforeUpload(file);
                }
            },
            handleSuccess (res) {
                this.uploadStatus = 0;
                if (this.styles === 3) {
                    if (this.uploadPercent === 100 && this.showUploadProgress) {
                        this.showUploadProgress();
                        this.showUploadProgress = null;
                    }
                }
                this.$emit('on-success', res);
            },
            handleError () {
                this.uploadStatus = 0;
                this.$emit('on-error');
                if (this.styles === 3) {
                    if (this.showUploadProgress) {
                        this.showUploadProgress();
                        this.showUploadProgress = null;
                    }
                }
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '您上传的文件 ' + file.name + ' 格式不符合要求，请上传 jpg、png、gif 格式的文件。',
                    duration: 6
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '文件过大',
                    desc: '您上传的文件 ' + file.name + ' 体积过大，请上传不超过 ' + this.config.maxSize / 1024 + ' 的文件。',
                    duration: 6
                });
            },
            handleProgress (event) {
                this.$emit('on-progress', event);
                this.uploadStatus = 1;
                this.uploadPercent = parseInt(event.percent);

                if (this.styles === 3) {
                    if (this.noUploadAccess) return;
                    if (!this.showUploadProgress) {
                        this.showUploadProgress = this.$Message.loading({
                            duration: 0,
                            render: h => {
                                return h('span', '图片上传中（' + this.uploadPercent + '%）');
                            }
                        });
                    }
                }
            }
        }
    };
</script>