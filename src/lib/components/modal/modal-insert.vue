<template>
    <Modal :title="t('insert-code', '插入程式码')" v-model="value" draggable @on-ok="handleInsert" @on-cancel="handleCancel" @on-visible-change="onVisibleChange">
        <Tabs v-model="insertTabType">
            <TabPane :label="t('youtube-video', 'Youtube 影片')" name="youtube">
                <Input v-model="insertData.youtube.url" :placeholder="t('youtube-placeholder', 'Youtube 影片网址')" />
            </TabPane>
        </Tabs>
    </Modal>
</template>

<script>
import qs from 'qs';
export default {
    name: 'modal-insert',
    props: {
        value: Boolean,
        t: Function
    },
    data () {
        return {
            insertTabType: 'youtube',
            insertData: {
                youtube: {
                    url: '',
                    template: '<iframe width="640" height="360" src="%s" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
                }
            }
        }
    },
    methods: {
        handleInsert () {
            let result;

            if (this.insertTabType === 'youtube') {
                const y = this.insertData.youtube;
                const youtubeUrl = this.youtubeUrlFormet(JSON.parse(JSON.stringify(y.url)));
                if (youtubeUrl) {
                    result = y.template.replace(/%s/g, youtubeUrl);
                }
                this.fieldReset();
            }

            if (result) {
                this.$emit('on-submit', result);
            }
        },
        handleCancel () {
            this.fieldReset();
        },
        onVisibleChange (val) {
            this.$emit('input', val);
        },
        fieldReset () {
            this.insertData.youtube.url = '';
        },
        youtubeUrlFormet (url) {
            const outputUrlTemplate = 'https://www.youtube.com/embed/%s';
            const outputUrlEmbed = outputUrlTemplate.replace(/%s/g, '');
            const urlPrefix = url.replace(/(http)(:\/\/)/, '$1s$2').match(/^https\:\/\/[\w-.]*\//);

            if (urlPrefix) {
                let result = ''
                let outputPath = ''
                const ytDomain = 'https://www.youtube.com/';
                const ytDomainMin = 'https://youtu.be/';
                let params = {
                    rel: 0,
                    modestbranding: 1
                };
                const isParams = () => {
                    return Boolean(Object.keys(params).length);
                };

                if (urlPrefix[0] === ytDomain) {
                    if (!url.match(outputUrlEmbed)) {
                        const ytQs = qs.parse(url.replace(/[^\?]*\?/, ''));
                        ytQs.list ? params.list = ytQs.list : false;
                        outputPath = ytQs.v;
                    } else {
                        const v = url.replace(outputUrlEmbed, '').replace(/\?.*/, '');
                        outputPath = v;
                    }
                } else if (urlPrefix[0] === ytDomainMin) {
                    const v = url.replace(urlPrefix[0], '').replace(/\?.*/, '');
                    outputPath = v;
                }
                outputPath += isParams() ? `?${qs.stringify(params)}` : '';
                return outputUrlTemplate.replace(/%s/g, outputPath);
            }
            return null;
        }
    }
}
</script>
