<script setup>
import TheNavBar from './components/TheNavBar.vue';
</script>

<template>
  <div>
    <TheNavBar/>
    <main class="py-6">
      <div class="container">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style>
.container{
  max-width: 1100px;
  margin: 0% auto;
  padding: 0 1rem;
}
</style>