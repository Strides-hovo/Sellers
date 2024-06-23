<script setup lang="ts">

import {computed, onMounted, Ref, ref, watchEffect} from 'vue';
import {useStore} from 'vuex';

import Loader from "@/components/Loader.vue";
import {Seller} from '@/store'
const store = useStore();
const currentPage = ref(1);
const loading = ref(false)
const sectionTop = ref<HTMLElement | null>(null)
const sellers: Ref<Seller[]> = ref([]);
const totalPages = computed(() => store.getters.totalPages);


const checkSeller = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target) {
    const trElement = target.closest('tr');
    if (trElement) {
      trElement.classList.toggle('active');
    }
  }
}

const scrollDown = () => {
  if (loading.value || currentPage.value == totalPages.value){
    return;
  }

  loading.value = true
  setTimeout(() => {
    currentPage.value += 1;
    loading.value = false
  }, 1000);
}


const scrollUp = () => {
  if (loading.value || currentPage.value <= 2){
    return;
  }

  loading.value = true
  setTimeout(() => {
    currentPage.value -= 1;
    loading.value = false
  }, 1000);
}

const onLoad = () => {
  let options = {
    rootMargin: "10px",
    threshold: [0, 0.25, 0.5, 0.75, 1],
  };
  let callback = function (entries: any) {
    if (entries[0].isIntersecting) {
      scrollDown()
    }
  };

  let observer = new IntersectionObserver(callback, options);
  const observe = ref<HTMLElement|null>(document.querySelector(".observer"))
  if (observe.value){
    observer.observe(observe.value)
  }


}

const scrollTo = (view: HTMLElement) => {
  scrollUp()
  view.scrollIntoView({ behavior: 'smooth' })

}

watchEffect(async () => {
  const sell =  store.getters.paginatedSellers(currentPage.value)
  sellers.value = await sell
})



onMounted(() => {
  onLoad()
})

const res = (evt: Event) => {
  let width: number = (evt.target as Window).innerWidth;
  const sellerNameContainer = document.querySelectorAll('.seller-name');
  sellerNameContainer.forEach((value: Element, key: number, parent: NodeListOf<Element>) => {
    (value as HTMLElement).style.minWidth = `${(width / 4)}px`;
  });
}

window.addEventListener('resize', res)



</script>

<template>
  <Loader v-if="loading"/>

  <main class="table-responsive">
    <div id="top" ref="sectionTop"></div>
    <table  class="table table-bordered border-primary">
      <thead>
      <tr>
        <th scope="col">#id</th>
        <th scope="col">avatar</th>
        <th scope="col">color</th>
        <th scope="col">name</th>
        <th scope="col">sales</th>
        <th scope="col">rating</th>
      </tr>
      </thead>
      <tbody>
      <TransitionGroup name="list">
        <tr
            v-for="selle of sellers"
            :key="selle.id"
            @click.stop="checkSeller($event)"
            role="button"
        >
          <td>{{ selle.id }}</td>
          <td><img :src="selle.avatar" alt="" width="50" height="50"></td>
          <td>{{ selle.color }}</td>
          <td class="seller-name">{{ selle.name }}</td>
          <td>{{ selle.sales }}</td>
          <td>{{ selle.rating }}</td>

        </tr>
      </TransitionGroup>
      </tbody>
    </table>
    <button @click="scrollTo(<HTMLElement>sectionTop)" class="btn btn-info btn-up btn-group-lg fs-1 " > &#8679; </button>
    <div v-if="currentPage === totalPages" class="text-center text-bg-info text-white p-3">Клиенты больше нету</div>
    <div class="observer"  ref="observer"></div>
  </main>

</template>

<style lang="scss">
.observer {
  height: 120px;
}
.btn-up{
  position: fixed;
  bottom: 0;
  right: 0;
}

.active{
  --bs-table-bg: rgba(128, 0, 128, .5);
}
.seller-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-move {
  transition: transform 0.5s ease;
}
</style>