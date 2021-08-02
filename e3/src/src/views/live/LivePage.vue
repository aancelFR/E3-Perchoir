<template>
    <div>
        <create-live />
        <list-live />
    </div>
</template>

<script>
import CreateLive from './CreateLive.vue';
import ListLive from './ListLive.vue';

export default {
    name: 'LivePage',
    components: { CreateLive, ListLive },
    data() {
        return {};
    },
};
</script>

<style>
</style>
