<template>
  <div class="container">
    <el-table :data="tableData" v-loading="loading">
      <el-table-column label="件数" prop="id" align="center"></el-table-column>
      <el-table-column label="运费" prop="id" align="center"></el-table-column>
      <el-table-column label="" prop="id" align="center" :render-header="actionHeaderRender">
        <template slot-scope="{row}">
          <el-button type="text" class="" @click="doAdd(row)">编辑</el-button>
          <el-button type="text" class="danger-text" @click="doRemove(row)">删除</el-button>
        </template>

      </el-table-column>
    </el-table>

    <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" width="700px" top="5vh" :close-on-click-modal="false"
               :title="formData.id?'编辑':'新增'">
      <el-form :model="formData" :rules="rules" ref="form"  label-position="left" label-width="120px">
        <el-form-item label="件数" prop="pcname">
          <el-input v-model.number="formData.num" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="pcdesc">
          <el-input v-model.number="formData.price" maxlength="1000" ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSave">确 定</el-button>
      </span>
    </el-dialog>

    <pagination :total="total" :page="currentPage" :page-size="pageSize"></pagination>
  </div>
</template>

<script>
  export default {
    name: "FreightTmpl",

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

        dialogVisible: false,
        formData: {
          num: 0,
          price: 0
        },
        rules: [
          {

          }
        ],

      }
    },

    computed: {},

    created() {

    },

    methods: {
      actionHeaderRender(h,{column}){
        return h('el-button', {
          props: {
            type: 'primary',
            icon: 'el-icon-plus'
          },
          on: {
            click: () => {
              this.doAdd();
            }
          }
        }, '新增');
      },
      doAdd(){
        this.dialogVisible = true
      },
      doEdit(row){
        this.dialogVisible = true
      },

      doSave(){
        this.dialogVisible = false
      },

      doRemove(row){
        this.$confirm(`确认删除运费模板()?`,'提示').then(
          ()=>{

          }
        )
      },
    },
  }
</script>

<style lang="scss" scoped>
  .container {

  }
</style>
