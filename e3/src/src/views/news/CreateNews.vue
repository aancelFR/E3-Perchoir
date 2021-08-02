<template>
    <div>
        <h2>Créer a News List</h2>
        <form @submit.prevent="">
            <div class="form-group col-sm-6">
                <input
                    v-model="news.titre"
                    type="text"
                    class="form-control"
                    placeholder="Nom de l'actualitée"
                    @keypress="typing = true"
                    required
                />
            </div>
            <div class="form-group col-sm-6">
                <input
                    v-model="news.description"
                    type="text"
                    class="form-control"
                    placeholder="Description de l'actualitée"
                    @keypress="typing = true"
                    required
                />
            </div>
            <div class="form-group col-sm-5">
                <input
                    v-model="news.frequence"
                    min="0"
                    max="10"
                    type="number"
                    class="form-control"
                    placeholder="Fréquence d'affichage de l'actualitée"
                    @keypress="typing = true"
                    @change="typing = true"
                    required
                />
            </div>
            <div class="form-group col-sm-5">
                <select
                    v-model="news.category"
                    @change="typing = true"
                    @click="typing = true"
                    class="form-control"
                    required
                >
                    <option
                        v-for="category in this.$parent.categories"
                        :value="category._id"
                    >
                        {{ category.name }}
                    </option>
                </select>
            </div>
            <div class="form-group col-sm-2">
                <input
                    v-model="news.activate"
                    type="checkbox"
                    :checked="news.activate"
                    :value="news.activate"
                    class="form-control"
                    placeholder="Catégorie actif?"
                    @keypress="typing = true"
                />
            </div>
            <div class="form-group text-center">
                <button @click="addNews(event)" class="btn btn-success">
                    Créer
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { EventBus } from '../../event-bus';

export default {
    data() {
        return {
            news: {
                titre: '',
                description: '',
                activate: 1,
                frequence: 5,
                nbDisplay: 0,
                category: null,
            },
            url: `${this.urlApi}news/`,
            typing: false,
        };
    },
    methods: {
        addNews(event) {
            if (event) event.preventDefault();
            console.log(this.news);
            const url = `${this.url}add`;
            axios
                .post(url, this.news)
                .then((response) => {
                    this.clearNews();
                    this.refreshNews();
                    this.typing = false;
                })
                .catch((error) => {
                    console.info('err: ', error);
                });
        },
        clearNews() {
            this.news = {
                titre: '',
                description: '',
                activate: 1,
                frequence: 5,
                nbDisplay: 0,
                category: null,
            };
        },
        refreshNews() {
            EventBus.$emit('refreshNews');
        },
    },
};
</script>

<style>
</style>
