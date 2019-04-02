<template>
  <div class="table-cell-img" :style="{width: outWidth}">
    <template v-if="src.length">
      <el-popover
        v-for="item in src" :key="item"
        placement="left"
        trigger="hover"
        :open-delay="500">
        <img style="width: 350px;max-height: 100%;" :src="item" alt="">
        <img slot="reference" class="small" :style="{width: width}" v-lazy="item" alt="">
      </el-popover>
    </template>

    <div class="no-img" v-else>无</div>
  </div>
</template>

<script>
  export default {
    name: "TableCellImg",

    components: {},

    props: {
      src: {
        type: Array,
        default: []
      },
      width: {
        type: String,
        default: '50px',
      },
      outWidth: {
        type: String,
        default: '50px',
      },
    },
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

  .table-cell-img {
    width: 50px;
    height: 50px;
    display: inline-block;

      .small {
        width: 50px;
        height: 50px;
        border: 1px solid black;
        margin-right: 10px;
        cursor: zoom-in;

        &:last-child{
          /*margin-right: 0;*/
        }
      }



    .max {
      width: 50px;
      height: 50px;
    }

    .no-img {
      line-height: 50px;
      display: inline-block;
    }
  }
</style>
