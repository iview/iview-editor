<template>
    <Button type="text" size="small" @click="onClick">
        <Tooltip :content="content" transfer>
            <Icon :type="icon"></Icon>
        </Tooltip>
    </Button>
</template>

<script>
export default {
    name: 'editor-tool-btn',
    props: {
        content: String,
        icon: String
    },
    methods: {
        onClick () {
            this.$emit('on-click')
        }
    }
}
</script>
