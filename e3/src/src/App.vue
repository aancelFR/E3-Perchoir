<template>
    <div id="app" :class="$route.name == 'obs' ? 'noNavBar' : ''">
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                    <a class="navbar-brand" href="#">E3 2021</a>
                </div>
                <ul class="nav navbar-nav">
                    <li><router-link to="/home">Accueil</router-link></li>
                    <li><router-link to="/live">Lives</router-link></li>
                    <li>
                        <router-link to="/category">Categories</router-link>
                    </li>
                    <li><router-link to="/news">Actu</router-link></li>
                    <li><router-link to="/obs-news">OBS</router-link></li>
                </ul>
            </div>
        </nav>
        <div class="container">
            <router-view />
        </div>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {};
    },
};
</script>

<style>
.form-control {
    border-radius: 0px;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
    opacity: 0;
}
.form-control[type='checkbox'],
.form-control[type='radio'] {
    margin: 0px;
    box-shadow: none;
}
</style>
