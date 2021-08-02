<template>
    <div>
        <h2>Créer a Live List</h2>
        <form @submit.prevent="">
            <div class="form-group col-sm-4">
                <input
                    v-model="live.titre"
                    type="text"
                    class="form-control"
                    placeholder="Nom du live"
                />
            </div>
            <div class="form-group col-sm-8">
                <input
                    v-model="live.url"
                    type="url"
                    class="form-control"
                    placeholder="Url du live"
                />
            </div>
            <div class="form-group text-center">
                <button @click="addLive(event)" class="btn btn-success">
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
            live: {
                titre: '',
                url: '',
                activate: 0,
            },
            url: `${this.urlApi}live/`,
        };
    },
    methods: {
        addLive(event) {
            if (event) event.preventDefault();

            const url = `${this.url}add`;
            const creationDto = {
                titre: this.live.titre,
                url: this.live.url,
                activate: 0,
            };

            axios
                .post(url, creationDto)
                .then((response) => {
                    this.clearLive();
                    this.refreshLive();
                })
                .catch((error) => {
                    console.info('err: ', error);
                });
        },
        clearLive() {
            this.live = {
                titre: '',
                url: '',
                activate: 0,
            };
        },
        refreshLive() {
            EventBus.$emit('refreshLive');
        },
    },
};
</script>

<style>
</style>
