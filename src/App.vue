<script setup lang="ts">
import {onMounted} from 'vue';
import {useStore} from 'vuex';


const store = useStore();

onMounted(() => {
  store.dispatch('load_sellers');
})

</script>


<template>
  <div>
    <RouterView ></RouterView>
  </div>
</template>