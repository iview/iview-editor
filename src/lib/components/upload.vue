<template>
    <Upload
            :type="type"
            :action="config.action"
            :show-upload-list="false"
            :data="uploadForm"
            :format="['jpg','jpeg','png','gif']"
            :on-format-error="handleFormatError"
            :max-size="5120"
            :on-exceeded-size="handleMaxSize"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-progress="handleProgress">
        <slot>
            <Button type="text" size="small" :disabled="uploadStatus === 1" class="dev-common-upload-item" v-if="styles === 1">
                <Tooltip content="上传图片" transfer>
                    <Icon type="ios-image"></Icon>
                </Tooltip>
                <span v-show="uploadStatus">({{ uploadPercent }}%)</span>
            </Button>
            <template v-if="styles === 2">
                <div v-if="cover" :style="coverStyle" class="dev-common-upload-cover"></div>
                <div style="padding: 30px 0;font-size: 12px" v-else>
                    <Icon type="ios-image" size="24"></Icon>
                    <p v-if="uploadStatus">上传中（{{ uploadPercent }}%）</p>
                    <p v-else>点击或拖拽上传</p>
                </div>
            </template>
            <Button type="primary" ghost icon="ios-camera" :disabled="uploadStatus === 1" v-if="styles === 4">
                编辑封面图片
                <span v-show="uploadStatus">({{ uploadPercent }}%)</span>
            </Button>
            <div class="dev-user-info-avatar-upload" :class="{show: uploadStatus || showBtn}" v-if="styles === 5">
                <div>
                    <Icon type="ios-camera"></Icon>
                    <p>修改我的头像<span v-show="uploadStatus">({{ uploadPercent }}%)</span></p>
                </div>
            </div>
            <Button type="text" size="small" class="dev-common-upload-item" v-if="styles === 6">
                <Tooltip content="导入 Markdown 文件" transfer>
                    <Icon type="md-document"></Icon>
                </Tooltip>
            </Button>
        </slot>
    </Upload>
</template>
<script>
//    import $ from '../libs/util';
//    import config from '../config/config';

    export default {
        inject: ['app'],
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
            config: Object
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
            coverStyle () {
                return {
                    backgroundImage: 'url(' + config.filePrefix + this.cover + '/small' + ')',
                    height: '104px'
                }
            }
        },
        methods: {
            beforeUpload (file) {
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
                }
                const url = this.info ? '/v1/file/getinfotoken' : '/v1/file/gettoken';

                return $.ajax({
                    method: 'post',
                    url: url,
                    data: {
                        token: this.app.token
                    }
                }).then(res => {
                    const data = res.data;

                    if (data.code !== 200) {
//                        this.$Message.error(data.msg);
                        if (data.error_code === 'error_need_update') {
                            this.app.handleVipTip({
                                name: '图片上传'
                            })
                        }
                        this.noUploadAccess = true;
                    } else {
                        this.noUploadAccess = false;
                        this.uploadForm = {
                            token: data.data.token,
                            key: data.data.key
                        };
                    }
                })
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
                    desc: '您上传的文件 ' + file.name + ' 体积过大，请上传不超过 5M 的文件。',
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