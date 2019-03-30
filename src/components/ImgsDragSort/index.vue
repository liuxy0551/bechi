<template>
  <div class="imgs-drag-sort">
    <el-button @click="dlgVisible = true" icon="el-icon-sort" type="info">图片排序</el-button>
    <el-dialog :visible.sync="dlgVisible" title="图片排序" width="80%">
      <draggable
        :list="list"
        @drag="drag"
        @dragend="dragEnd"
        class="drag-imgs-wrap">
        <img v-for="item in list" :options="{}" :src="item.url"  class="drag-img"/>
      </draggable>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dlgVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    name: "ImgsDragSort",

    components: {
      draggable
    },

    props: {
      list: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        dlgVisible: false,
      }
    },

    computed: {},

    methods: {
      drag(){
        console.log('drag');
        // this.$emit('change', this.list);
      },
      dragEnd(){
        console.log('dragEnd');
        // this.$emit('change', this.list);
      },
    },

    created() {

    },
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .imgs-drag-sort {
    .drag-imgs-wrap{
      .drag-img{
        .wl(100px, 100px);
        border: 1px solid black;
        margin:  0 10px 10px 0;
      }
    }
  }
</style>
