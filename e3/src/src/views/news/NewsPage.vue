<template>
    <div>
        <create-news />
        <list-news />
    </div>
</template>

<script>
import axios from 'axios';
import CreateNews from './CreateNews.vue';
import ListNews from './ListNews.vue';
import { EventBus } from '../../event-bus';

export default {
    name: 'NewsPage',
    components: { CreateNews, ListNews },
    data() {
        return {
            categories: [],
        };
    },
    created() {
        this.getCategory();
        this.listenToEvents();
    },
    methods: {
        getCategory() {
            const uri = `${this.urlApi}category/all`;
            axios.get(uri).then((response) => {
                this.categories = response.data;
            });
        },
        listenToEvents() {
            EventBus.$on('refreshCategory', ($event) => {
                this.getCategory();
            });
        },
    },
};
</script>

<style>
</style>
