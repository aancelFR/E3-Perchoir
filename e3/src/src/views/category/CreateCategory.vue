<template>
    <div>
        <h2>Créer a Category List</h2>
        <form @submit.prevent="">
            <div class="form-group col-sm-6">
                <input
                    v-model="category.name"
                    type="text"
                    class="form-control"
                    placeholder="Nom de la catégorie"
                    @keypress="typing = true"
                />
            </div>
            <div class="form-group col-sm-6">
                <input
                    v-model="category.order"
                    type="number"
                    class="form-control"
                    placeholder="Prioriter de la catégorie."
                    @keypress="typing = true"
                />
            </div>
            <div class="form-group col-sm-6">
                <input
                    v-model="category.color"
                    type="text"
                    class="form-control"
                    placeholder="Couleur."
                    @keypress="typing = true"
                />
            </div>
            <div class="form-group col-sm-6">
                <input
                    v-model="category.activate"
                    type="checkbox"
                    :checked="category.activate"
                    :value="category.activate"
                    class="form-control"
                    placeholder="Catégorie actif?"
                    @keypress="typing = true"
                />
            </div>
            <div class="form-group text-center">
                <button @click="addCategory(event)" class="btn btn-success">
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
            category: {
                name: '',
                order: 0,
                activate: 1,
                color: '#000000',
            },
            url: `${this.urlApi}category/`,
            typing: false,
        };
    },
    methods: {
        addCategory(event) {
            if (event) event.preventDefault();

            const url = `${this.url}add`;

            axios
                .post(url, this.category)
                .then((response) => {
                    this.clearCategory();
                    this.refreshCategory();
                    this.typing = false;
                })
                .catch((error) => {
                    console.info('err: ', error);
                });
        },
        clearCategory() {
            this.category = {
                name: '',
                order: 0,
                activate: 1,
                color: 'Red',
            };
        },
        refreshCategory() {
            EventBus.$emit('refreshCategory');
        },
    },
};
</script>

<style>
</style>
