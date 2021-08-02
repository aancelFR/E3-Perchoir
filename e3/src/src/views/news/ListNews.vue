<template>
    <div>
        <div v-show="newss.length > 0" class="col-md-12">
            <h3>Newss Items</h3>
            <div v-for="news in newss" class="row mrb-10" :key="news._id">
                <div class="input-group m-b-5">
                    <span class="input-group-addon addon-right">
                        <input
                            v-model="news.activate"
                            type="checkbox"
                            :checked="news.activate"
                            :value="news.activate"
                            title="Mark as activate?"
                            @click="updateNews(news)"
                        />
                    </span>
                    <div class="form-group">
                        <input
                            v-model="news.titre"
                            type="text"
                            class="form-control"
                            style="width: 25%"
                            :class="news.activate ? 'news-activate' : ''"
                            @keypress="news.editing = true"
                            @keyup="news.editing = true"
                            @change="news.editing = true"
                            @keyup.enter="updateNews(news)"
                        />
                        <input
                            v-model="news.description"
                            type="url"
                            class="form-control"
                            style="width: 45%"
                            @keypress="news.editing = true"
                            @change="news.editing = true"
                            @keyup="news.editing = true"
                            @keyup.enter="updateNews(news)"
                        />
                        <input
                            v-model="news.frequence"
                            type="number"
                            min="0"
                            max="10"
                            class="form-control"
                            style="width: 10%"
                            @keypress="news.editing = true"
                            @change="news.editing = true"
                            @keyup="news.editing = true"
                            @keyup.enter="updateNews(news)"
                        />
                        <select
                            style="width: 20%"
                            v-model="news.category._id"
                            @change="updateNews(news)"
                            class="form-control"
                            required
                        >
                            <option
                                v-for="category in $parent.categories"
                                :value="category._id"
                            >
                                {{ category.name }}
                            </option>
                        </select>
                    </div>
                    <span
                        class="input-group-addon addon-left alert-danger"
                        title="Delete Actu?"
                        @click="deleteNews(news._id)"
                        >❌</span
                    >
                    <span
                        class="input-group-addon addon-left alert-info"
                        title="Force Display Actu?"
                        @click="forceDisplayNews(news._id)"
                        >⬆</span
                    >
                    <span
                        class="input-group-addon addon-left"
                        title="Save Actu?"
                        :class="
                            news.editing ? 'alert-warning' : 'alert-success'
                        "
                        @click="updateNews(news)"
                        >✔</span
                    >
                </div>
            </div>
        </div>
        <div
            v-show="newss.length == 0"
            class="row alert alert-info text-center"
        >
            <p class="">Pas d'actualitée</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { EventBus } from '../../event-bus';

export default {
    data() {
        return {
            newss: [],
            url: `${this.urlApi}news/`,
        };
    },
    created() {
        this.getNews();
        this.listenToEvents();
    },
    methods: {
        forceDisplayNews(id) {
            this.$socket.emit('forceDisplayNews', id);
        },
        getNews() {
            const uri = `${this.url}all`;
            axios.get(uri).then((response) => {
                this.newss = response.data;
            });
        },
        updateNews(news) {
            let updateDto = {};
            const id = news._id;
            const uri = `${this.url}update/${id}`;

            news.editing = false;

            setTimeout(() => {
                updateDto = { ...news };

                axios
                    .post(uri, updateDto)
                    .then((response) => {
                        // console.log('update res: ', response);
                    })
                    .catch((error) => {
                        // console.info('err: ', error);
                    });
            });
        },
        deleteNews(id) {
            const uri = `${this.url}delete/${id}`;

            axios.get(uri);

            this.getNews();
        },
        listenToEvents() {
            EventBus.$on('refreshNews', ($event) => {
                this.getNews();
            });
        },
    },
};
</script>

<style scoped>
.news__done {
    text-decoration: line-through !important;
}
.no_border_left_right {
    border-left: 0px;
    border-right: 0px;
}
.flat_form {
    border-radius: 0px;
}
.mrb-10 {
    margin-bottom: 10px;
}
.addon-left {
    background-color: none !important;
    border-left: 0px !important;
    cursor: pointer !important;
}
.addon-right {
    background-color: none !important;
    border-right: 0px !important;
}
</style>
