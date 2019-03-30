<template>
  <div class="container">
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :show-file-list="false"
      accept="image/*"
      :on-success="handleMainPicSuccess"
      :before-upload="beforeMainPicUpload"
    >
      <img v-if="prMainPicUrl" v-lazy="prMainPicUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>

      <div slot="tip" class="el-upload__tip">
        建议为方形,大小不要超过15M,上传成功后会显示,上传大图请耐心等待
      </div>
    </el-upload>

  </div>
</template>

<script>
  /**
   * 单个图片上传组件
   *
   */
  export default {
    name: "index",

    components: {},

    props:{
      //  上传接口url
      uploadUrl: {
        type: String
      }
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

  .container {

  }
</style>
