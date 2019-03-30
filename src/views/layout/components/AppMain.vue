<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
       <!--<router-view :key="key"></router-view>todo -->
       <router-view ></router-view>
      </keep-alive>
      <!--<router-view/>-->
    </transition>
  </section>
</template>

<script>
  import {mapGetters} from "vuex";


  export default {
  name: 'AppMain',
  computed: {
    ...mapGetters(['cachedViews']),
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
  padding: 20px 20px 50px 20px;
  box-sizing: border-box;
}
</style>
