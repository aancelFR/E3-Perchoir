<template>
    <div>
        <div
            class="news-block"
            style="
                background-image: url('/Tchat_Barre_red.png');
                width: 25px;
                height: 100px;
            "
        ></div>
        <div class="news-block" style="width: 10%">{{ news.titre }}</div>
        <div class="news-block" style="width: 80%">{{ news.description }}</div>
    </div>
</template>

<script>
import axios from 'axios';
import { EventBus } from '../../event-bus';

export default {
    name: 'OBSPage',
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
        };
    },
    created() {
        console.log('create');
        this.listenToEvents();
    },
    methods: {
        listenToEvents() {
            EventBus.$on('displayNews', ($event) => {
                this.news = $event;
            });
        },
        getHueRotateByColor() {},
        getcolors(x) {
            const red = Math.sqrt(Math.cos(x + (Math.PI + 1) / 2) + 1 / 2);
            const green = Math.sqrt(Math.cos(x) + 1 / 2);
            const blue = Math.sqrt(Math.cos(x - (Math.PI + 1) / 2) + 1 / 2);
            return { r: red, g: green, b: blue };
        },
        componentToHex(c) {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        },
        rgbToHex(r, g, b) {
            return (
                '#' +
                this.componentToHex(r) +
                this.componentToHex(g) +
                this.componentToHex(b)
            );
        },
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
                hex
            );
            return result
                ? {
                      r: parseInt(result[1], 16),
                      g: parseInt(result[2], 16),
                      b: parseInt(result[3], 16),
                  }
                : null;
        },
    },
};
</script>

<style>
.noNavBar .navbar {
    display: none !important;
}
.noNavBar .container {
    width: 100%;
    top: 0px;
    padding: 0px;
    margin: 0px;
}
.news-block {
    display: inline-block;
    height: 100px;
    top: 0px;
    padding: 0px;
    margin: 0px;
}
</style>
