<template>
  <section class="block-title">
    <img src="/static/images/icon-title.png" alt="">
    <span>{{title}}</span>
    <slot></slot>
  </section>
</template>

<script>
  export default {
    name: "index",

    props: [
      'title'
    ],

    components: {},

    data() {
      return {}
    },

    computed: {},

    methods: {},

    created() {

    },
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .block-title{
    .fj(flex-start);
    align-items: center;
    margin: 25px 0;

    img{
      .wl(20px, 20px);
      margin-right: 10px;
    }
  }

</style>
