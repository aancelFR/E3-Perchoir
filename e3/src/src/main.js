import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import App from './App.vue';
import router from './router';
import { EventBus } from './event-bus';

Vue.config.productionTip = false;
Vue.prototype.urlApi = 'https://nomdedomainaremplacer.fr:4000/api/';
Vue.use(
    new VueSocketIO({
        connection: 'https://nomdedomainaremplacer.fr:4001',
    })
);
new Vue({
    sockets: {
        connect: function() {},
        // eslint-disable-next-line
        refreshNews: function(val) {
            EventBus.$emit('refreshNews');
        },
        // eslint-disable-next-line
        refreshCategory: function(val) {
            EventBus.$emit('refreshCategory');
        },

        // eslint-disable-next-line
        refreshLive: function(val) {
            EventBus.$emit('refreshLive');
        },
        // eslint-disable-next-line
        displayNews: function(val) {
            EventBus.$emit('displayNews', val);
        },
    },
    router,
    created() {},
    methods: {},
    render: h => h(App),
}).$mount('#app');
