<template>
  <div>
    <img src="./assets/logo.png" alt="Vue Logo">
    <MessageComponent msg="This is my first VUE app!" />
  </div>
</template>

<script>
import MessageComponent from './components/MessageComponent.vue'

export default {
  name: 'App',
  components: {
    MessageComponent
  }
}
</script>


