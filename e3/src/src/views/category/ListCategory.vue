<template>
    <div>
        <div v-show="categories.length > 0" class="col-md-12">
            <h3>Categories Items</h3>
            <div v-for="category in categories" class="row mrb-10">
                <div class="input-group m-b-5">
                    <span class="input-group-addon addon-right">
                        <input
                            v-model="category.activate"
                            type="checkbox"
                            :checked="category.activate"
                            :value="category.activate"
                            title="Mark as activate?"
                            @click="updateCategory(category)"
                        />
                    </span>
                    <div class="form-group">
                        <input
                            v-model="category.name"
                            type="text"
                            class="form-control"
                            style="width: 60%"
                            :class="
                                category.activate ? 'category-activate' : ''
                            "
                            @keypress="category.editing = true"
                            @keyup.enter="updateCategory(category)"
                        />
                        <input
                            v-model="category.order"
                            type="number"
                            class="form-control"
                            style="width: 20%"
                            @keypress="category.editing = true"
                            @change="category.editing = true"
                            @keyup.enter="updateCategory(category)"
                        />
                        <input
                            v-model="category.color"
                            type="text"
                            class="form-control"
                            :class="
                                category.activate ? 'category-activate' : ''
                            "
                            style="width: 20%"
                            @keypress="category.editing = true"
                            @keyup.enter="updateCategory(category)"
                        />
                    </div>
                    <span
                        class="input-group-addon addon-left alert-danger"
                        v-show="category.news.length == 0"
                        title="Delete category?"
                        @click="deleteCategory(category._id)"
                        >❌</span
                    >
                    <span
                        class="input-group-addon addon-left"
                        title="Save category?"
                        :class="
                            category.editing ? 'alert-warning' : 'alert-success'
                        "
                        @click="updateCategory(category)"
                        >✔</span
                    >
                </div>
            </div>
        </div>
        <div
            v-show="categories.length == 0"
            class="row alert alert-info text-center"
        >
            <p class="">Pas de category</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { EventBus } from '../../event-bus';

export default {
    data() {
        return {
            categories: [],
            url: `${this.urlApi}category/`,
        };
    },
    created() {
        this.getCategory();
        this.listenToEvents();
    },
    methods: {
        getCategory() {
            const uri = `${this.url}all`;
            axios.get(uri).then((response) => {
                this.categories = response.data;
            });
        },
        updateCategory(category) {
            let updateDto = {};
            const id = category._id;
            const uri = `${this.url}update/${id}`;

            category.editing = false;

            setTimeout(() => {
                updateDto = { ...category };

                axios
                    .post(uri, updateDto)
                    .then((response) => {
                        console.log('update res: ', response);
                    })
                    .catch((error) => {
                        console.info('err: ', error);
                    });
            });
        },
        deleteCategory(id) {
            const uri = `${this.url}delete/${id}`;

            axios.get(uri);

            this.getCategory();
        },
        listenToEvents() {
            EventBus.$on('refreshCategory', ($event) => {
                this.getCategory();
            });
        },
    },
};
</script>

<style scoped>
.category__done {
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
