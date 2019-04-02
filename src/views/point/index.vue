<template>
  <div class="container">
    <el-form label-position="left" label-width="120px">
      <el-form-item label="购买商品">
        <el-input style="width: 300px">
          <template slot="append">分</template>
        </el-input>
      </el-form-item>
      <el-form-item label="分享好友/朋友圈">
        <el-input style="width: 300px">
          <template slot="append">分</template>
        </el-input>
      </el-form-item>
      <el-form-item label="签到">
        <el-input style="width: 300px" placeholder="基本值">
          <template slot="append">分</template>
        </el-input>
        <el-input style="width: 300px" placeholder="叠加值">
          <template slot="append">分</template>
        </el-input>
        <el-input style="width: 300px" placeholder="封顶值">
          <template slot="append">分</template>
        </el-input>

      </el-form-item>
      <el-form-item label="生日积分">
        <el-input style="width: 300px" placeholder="购物">
          <template slot="append">倍</template>
        </el-input>
        <el-input style="width: 300px" placeholder="签到">
          <template slot="append">倍</template>
        </el-input>
        <el-input style="width: 300px" placeholder="赠送">
          <template slot="append">分</template>
        </el-input>

      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  export default {
    name: "PointIndex",

    components: {},

    data() {
      return {}
    },

    computed: {},

    created() {

    },

    methods: {},
  }
</script>

<style lang="scss" scoped>
  .container {

  }
</style>
