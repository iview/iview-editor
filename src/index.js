import iEditor from './lib/components/editor.vue';

const iviewEditor = {
    iEditor
};

const install = function(Vue, opts = {}) {
    Vue.component('i-editor', iEditor);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default Object.assign(iviewEditor, { install });