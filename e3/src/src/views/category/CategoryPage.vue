<template>
  <div>
    <create-category />
    <list-category />
  </div>
</template>

<script>
import CreateCategory from './CreateCategory.vue';
import ListCategory from './ListCategory.vue';

export default {
  name: 'CategoryPage',
  components: { CreateCategory, ListCategory },
  data() {
    return {};
  },
};
</script>

<style>
</style>
