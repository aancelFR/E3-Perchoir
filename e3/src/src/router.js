import Vue from 'vue';
import Router from 'vue-router';
import HomePage from './views/home/HomePage.vue';
import CategoryPage from './views/category/CategoryPage.vue';
import NewsPage from './views/news/NewsPage.vue';
import LivePage from './views/live/LivePage.vue';
import OBSPage from './views/obs/OBSPage.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
        },
        {
            path: '/live',
            name: 'live',
            component: LivePage,
        },
        {
            path: '/category',
            name: 'category',
            component: CategoryPage,
        },
        {
            path: '/news',
            name: 'news',
            component: NewsPage,
        },
        {
            path: '/obs-news',
            name: 'obs',
            component: OBSPage,
        },
    ],
});
