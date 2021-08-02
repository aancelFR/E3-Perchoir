<template>
    <div>
        <div v-show="lives.length > 0" class="col-md-12">
            <h3>Lives Items</h3>
            <div v-for="live in lives" class="row mrb-10">
                <div class="input-group m-b-5">
                    <span
                        class="input-group-addon"
                        title="Activate live?"
                        @click="activateLive(live)"
                        ><icon v-show="live.activate">🔴</icon
                        ><icon v-show="!live.activate">⚫</icon></span
                    >
                    <div class="form-group">
                        <input
                            v-model="live.titre"
                            type="text"
                            class="form-control"
                            style="width: 40%"
                            :class="live.activate ? 'live-activate' : ''"
                            @keypress="live.editing = true"
                            @keyup="live.editing = true"
                            @change="live.editing = true"
                            @keyup.enter="updateLive(live)"
                        />
                        <input
                            v-model="live.url"
                            type="url"
                            class="form-control"
                            style="width: 60%"
                            @keypress="live.editing = true"
                            @change="live.editing = true"
                            @keyup="live.editing = true"
                            @keyup.enter="updateLive(live)"
                        />
                    </div>
                    <span
                        class="input-group-addon addon-left alert-danger"
                        title="Delete live?"
                        v-show="!live.activate"
                        @click="deleteLive(live._id)"
                        >❌</span
                    >
                    <span
                        class="input-group-addon addon-left"
                        title="Save live?"
                        :class="
                            live.editing ? 'alert-warning' : 'alert-success'
                        "
                        @click="updateLive(live)"
                        >✔</span
                    >
                </div>
            </div>
        </div>
        <div
            v-show="lives.length == 0"
            class="row alert alert-info text-center"
        >
            <p class="">Pas de live</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { EventBus } from '../../event-bus';

export default {
    data() {
        return {
            lives: [],
            url: `${this.urlApi}live/`,
        };
    },
    created() {
        this.getLive();
        this.listenToEvents();
    },
    methods: {
        getLive() {
            console.info(this.url);
            const uri = `${this.url}all`;
            axios.get(uri).then((response) => {
                this.lives = response.data;
            });
        },
        activateLive(live) {
            live.activate = 1;
            this.updateLive(live);
        },
        updateLive(live) {
            let updateDto = {};
            const id = live._id;
            const uri = `${this.url}update/${id}`;

            live.editing = false;

            setTimeout(() => {
                updateDto = { ...live };

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
        deleteLive(id) {
            const uri = `${this.url}delete/${id}`;

            axios.get(uri);

            this.getLive();
        },
        listenToEvents() {
            EventBus.$on('refreshLive', ($event) => {
                this.getLive();
            });
        },
    },
};
</script>

<style scoped>
.live__done {
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
.addon-left,
.addon-right {
    background-color: none !important;
    border-left: 0px !important;
    cursor: pointer !important;
}
.addon-right {
    background-color: none !important;
    border-right: 0px !important;
}
</style>
