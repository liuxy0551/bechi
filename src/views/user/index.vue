<template>
  <div class="container">
    <section class="tool-bar">
      <el-form inline>
        <el-form-item label="id">
          <el-input v-model="searchForm.id"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" :loading="loading" @click="doSearch(true)">查询</el-button>
        <el-button icon="el-icon-refresh" :loading="loading" @click="doReset">重置</el-button>
      </el-form>
    </section>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column label="id" prop="id" align="center"></el-table-column>
      <el-table-column label="头像" prop="id" align="center">
        <template slot-scope="{row}">
          <table-cell-img :src="['http://dummyimage.com/200x100']"></table-cell-img>
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="id" align="center"></el-table-column>
      <el-table-column label="手机号" prop="id" align="center"></el-table-column>
      <el-table-column label="身份证号" prop="id" align="center"></el-table-column>
      <el-table-column label="积分" prop="id" align="center"></el-table-column>
    </el-table>
    <pagination :total="total" :page="currentPage" :page-size="pageSize"></pagination>
  </div>
</template>

<script>
  export default {
    name: "UserIndex",

    components: {},

    data() {
      return {
        searchForm: {
          id: '',
          phone: '',
          name: '',
        },

        loading: false,
        total: 10,
        currentPage: 1,
        pageSize: 10,
        tableData: [
          {
            id: 1
          }
        ],
      }
    },

    computed: {},

    created() {

    },

    methods: {
      doSearch(){

      },
      doReset(){

      },
    },
  }
</script>

<style lang="scss" scoped>
  .container {

  }
</style>
