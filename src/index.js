import iEditor from './lib/components/editor.vue';
import iMdView from './lib/components/md.vue';

const iviewEditor = {
    iEditor,
    iMdView
};

const install = function(Vue, opts = {}) {
    Vue.component('i-editor', iEditor);
    Vue.component('i-md-view', iMdView);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default Object.assign(iviewEditor, { install });
