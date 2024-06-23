<template>
  <div>
    <h1>Sellers</h1>
    <ul>
      <li v-for="seller in paginatedSellers" :key="seller.id">
        {{ seller.name }} - Sales: {{ seller.sales }} - Rating: {{ seller.rating }} - Color: {{ seller.color }}
      </li>
    </ul>
    <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
    <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
  </div>
</template>

<script setup lang="ts" >
import {  computed, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const currentPage = ref(1);

const paginatedSellers = computed(() => store.getters.paginatedSellers(currentPage.value));
const totalPages = computed(() => store.getters.totalPages);

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};


</script>
