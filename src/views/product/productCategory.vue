<template>
  <div class="container">
    <!--工具栏-->
    <section class="tool-bar space-between">
      <el-form :inline="true">
        <el-form-item label="所属分类">
          <el-cascader :options="categoryOptions" :props="categoryProps" change-on-select :clearable="true" filterable
                       v-model="searchForm.pcid" @change="doSearch">
          </el-cascader>
        </el-form-item>
        <el-button type="primary"  :loading="loading" @click="doSearch">查询</el-button>
        <el-button icon="el-icon-refresh"  :loading="loading" @click="doReset">重置</el-button>
      </el-form>

      <el-button type="primary" icon="el-icon-plus" @click="doAdd">新增</el-button>
    </section>
    <!--三级分类树表-->
    <tree-table :data="data" :columns="columns" v-loading="loading" :eval-func="func" :expand-all="expandAll"
                border>
      <el-table-column label="图片" align="center"  width="220">
        <template slot-scope="scope">
          <table-cell-img :src="[scope.row.pcpic]" :key="scope.row.pcpic"></table-cell-img>
        </template>
      </el-table-column>
      <el-table-column label="顶部图片" align="center">
        <template slot-scope="scope">
          <table-cell-img width="141px" out-width="141px" :src="[scope.row.pctoppic]" :key="scope.row.pctoppic"></table-cell-img>
        </template>
      </el-table-column>

      <el-table-column label="权重" align="center"  width="220" :render-header="sortHeaderRender">
        <template slot-scope="scope">
          <el-input v-model="scope.row.pcsort" maxlength="11" @keyup.native.enter="changeCaSort(scope.row)"
                  @focus="focusCell(scope)"  style="width: 160px;"></el-input>
          <el-button type="text" v-if="scope.$index == focusedRowIndex" @click="changeCaSort(scope.row)">保存</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="doEdit(scope.row)">编辑</el-button>
          <el-button type="text" class="danger-text" @click="doRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </tree-table>

    <!--编辑dialog-->
    <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" width="700px" top="5vh" :close-on-click-modal="false"
               :title="categroyForm.pcid?'分类编辑':'分类新增'">
      <el-form :model="categroyForm" :rules="rules" ref="categroyForm" size="medium"  label-position="left" label-width="120px">
        <el-form-item label="所属分类" prop="parentpcid">
          <el-cascader :options="options" :props="cascaderProps" filterable :clearable="true" :change-on-select="true"
                       v-model="selectParentPcId" @change="selectParentPcIdChange" placeholder="添加一级分类时为空"
                       :disabled="categroyForm.pcid != ''">
          </el-cascader>
          <span class="form-item-end-tip">例:新增第三级分类,请选第二级分类</span>
        </el-form-item>
        <el-form-item label="分类名" prop="pcname">
          <el-input v-model="categroyForm.pcname" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="pcdesc">
          <el-input v-model="categroyForm.pcdesc" maxlength="1000" ></el-input>
        </el-form-item>
        <el-form-item label="权重" prop="pcsort">
          <el-input v-model.number="categroyForm.pcsort" maxlength="11" style="width: 200px;"></el-input>
        </el-form-item>

        <el-form-item label="图片" prop="pcpic">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            accept="image/*"
            :on-success="handlePcpicSuccess"
            :before-upload="beforePicUpload"
          >
            <img v-if="categroyForm.pcpic" :key="categroyForm.pcpic" v-lazy="categroyForm.pcpic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>

            <div slot="tip" class="el-upload__tip">
              建议为方形,大小不要超过15M,上传成功后会显示,上传大图请耐心等待
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="一级分类顶部图片" prop="pctoppic" align="left">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            accept="image/*"
            :on-success="handlePctoppicSuccess"
            :before-upload="beforePicUpload"
            :on-preview="handlePictureCardPreview"
          >
            <img v-if="categroyForm.pctoppic" :key="categroyForm.pctoppic" v-lazy="categroyForm.pctoppic" class="avatar avatar-top">
            <i v-else class="el-icon-plus avatar-uploader-icon avatar-uploader-icon-top"></i>

            <div slot="tip" class="el-upload__tip">
              建议宽高为750/265(2.83),大小不要超过15M,上传成功后会显示,上传大图请耐心等待
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import treeTable from 'src/components/TreeTable'
  import treeToArray from './customEval'
  import elDragDialog from 'src/directive/el-dragDialog'
  import TableCellImg from "src/components/TableCellImg";
  import {beforePicUpload} from "src/utils/validate";
  import {getStore, setStore} from "src/utils/index";

  const natureNumberReg = /^(\d+)$/;   //  自然数
  const positiveNumberReg = /^([1-9]\d*)$/;   //  正整数
  export default {
    name: 'ProductCategory',

    components: {
      treeTable,
      TableCellImg
    },

    directives: {elDragDialog},

    computed: {
      uploadUrl() {
        return this.$api.upload_file + getStore('token')+ '&type=category'
      },
    },

    data() {
      const paidValidator = (rule, value, callback) => {
        console.log(!value && !this.categroyForm.pctoppic);
        if (!value && !this.categroyForm.pctoppic) {
          callback(new Error('请选所属分类或上传顶部图片!'))
        } else {
          callback();
        }
      };
      const toppicValidator = (rule, value, callback) => {

        if (!value && !this.categroyForm.parentpcid) {
          callback(new Error('请选所属分类或上传顶部图片!'))
        } else {
          callback();
        }
      };

      return {
        categoryOptions: [],
        categoryProps: {
          value: 'pcid',
          label: 'pcname',
          children: 'subs',
        },
        searchForm: {
          pcid: [],
        },

        func: treeToArray,
        loading: false,
        expandAll: false,
        data: {},
        columns: [
          {
            text: '分类名',
            value: 'pcname',
            width: 200
          },
        ],
        focusedRowIndex: -1,
        // args: [null, null, 'timeLine'],

        dialogVisible: false,
        selectParentPcId: [],
        categroyForm: {
          pcid: '',
          parentpcid: '',
          pcname: '',
          pcdesc: '',
          pcsort: 1,
          pcpic: '',
          pctoppic: ''
        },
        rules: {
          parentpcid: [
            {validator: paidValidator, trigger: 'change'},
          ],
          pcname: [
            {required: true, message: '分类名必填', trigger: 'blur'}
          ],
          pcdesc: [
            {required: true, message: '描述必填', trigger: 'blur'}
          ],
          pcsort: [
            {required: true, message: '权重必填', trigger: 'blur'},
            {pattern: positiveNumberReg, message: '请输入合理的数字(>0)', trigger: 'blur'},
          ],
          pcpic: [
            {required: true, message: '图片必传', trigger: 'change'}
          ],
          pctoppic: [
            {validator: toppicValidator, trigger: 'change'},
          ],
        },

        //  商品分类选项
        options: [],
        cascaderProps: {
          value: 'pcid',
          label: 'pcname',
          children: 'subs',
        },

      }
    },
    watch: {
      selectParentPcId(val) {
        if (val.length) {
          this.categroyForm.parentpcid = val[val.length - 1];
        }
      }
    },
    methods: {
      getSearchCategory(){
        this.$http.get(this.$api.category_list, {
          params: {
            up: '',
            deep: 1
          }
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.categoryOptions = data;
            }
          });
      },
      doSearch(){
        this.setCategory();
      },
      doReset(){
        this.searchForm = {
          pcid: []
        }
        this.doSearch();
      },

      setCategory() {
        this.loading = true;
        let pcid = '';

        if (this.searchForm.pcid.length) {
          pcid = this.searchForm.pcid[this.searchForm.pcid.length - 1];
        } else {
          pcid = ''
        }

        this.$http.get(this.$api.category_list, {
          noLoading: true,
          params: {
            up: pcid,
            deep: 2
          }
        }).then(
          res => {
            this.loading = false;

            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              for (let i = 0; i < data.length; i++) {
                data[i].id = data[i].pcid;
                data[i].children = data[i].subs;

                if (data[i].subs) {
                  for (let j = 0; j < data[i].subs.length; j++) {
                    data[i].subs[j].id = data[i].subs[j].pcid;
                    data[i].subs[j].children = data[i].subs[j].subs;

                    if (data[i].subs[j].subs) {
                      for (let k = 0; k < data[i].subs[j].subs.length; k++) {
                        data[i].subs[j].subs[k].id = data[i].subs[j].subs[k].pcid;
                        data[i].subs[j].subs[k].children = data[i].subs[j].subs[k].subs;
                      }
                    }
                  }
                }
              }

              this.data = data;
            }
          }
        )
      },

      sortHeaderRender(h,{column}){
        return(
          <el-tooltip class="tooltip" placement="top">
            <span slot="content">
              权重是一个顺序展示的概念,数字小的放在前面,同权重按创建时间从早到晚排序
            </span>
            <div>{column.label}
              <i class="el-icon-question"></i>
            </div>
          </el-tooltip>
        )
      },
      focusCell(scope){
        this.focusedRowIndex = scope.$index;
      },
      changeCaSort(row){
        if(positiveNumberReg.test(row.pcsort)){
          let updateRow = {
            pcid: row.pcid,
            parentpcid: row.parentpcid,
            pcname: row.pcname,
            pcdesc: row.pcdesc,
            pcsort: row.pcsort,
            pcpic: row.pcpic,
            pctoppic: row.pctoppic,
          }

          this.$http.post(this.$api.update_category, updateRow).then(
            res => {
              if (res.data.status == 200) {
                let resData = res.data,
                  data = res.data.data;

                this.$notify({
                  title: `权重改动成功`,
                  message: `分类名称:${row.pcname}`,
                  type: 'success'
                });
                this.setCategory();
                this.focusedRowIndex = -1;
              }
            }
          );
        }else {
          this.$message.warning('请输入合理权重值');
        }
      },

      //  初始化表单
      resetDlgForm(){
        this.categroyForm = {
          pcid: '',
          parentpcid: '',
          pcname: '',
          pcdesc: '',
          pcsort: 1,
          pcpic: '',
          pctoppic: ''
        };
        this.selectParentPcId = [];
        this.setDialogCategory();
      },
      setDialogCategory() {
        this.$http.get(this.$api.category_list, {
          params: {
            up: '',
            deep: 1
          }
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.options = data;
            }});
      },
      selectParentPcIdChange(val) {
        if (this.selectParentPcId.length) {
          this.categroyForm.parentpcid = '';
        } else {
          this.categroyForm.parentpcid = this.selectParentPcId[this.selectParentPcId.length - 1];
        }
      },
      doAdd() {
        this.dialogVisible = true;
        this.resetDlgForm();
      },
      doEdit(row) {
        this.resetDlgForm();
        this.dialogVisible = true;

        let select = [],
            self = row;
        while (self.parent){
          select.push(self.parent.id);
          self = self.parent;
        }

        this.selectParentPcId = select.reverse();
        this.categroyForm = {
          pcid: row.pcid,
          parentpcid: row.parentpcid,
          pcname: row.pcname,
          pcdesc: row.pcdesc,
          pcsort: row.pcsort,
          pcpic: row.pcpic,
          pctoppic: row.pctoppic
        };
      },
      doSave() {
        this.$refs.categroyForm.validate(
          valid => {
            if (valid) {
              let type = this.categroyForm.pcid == '' ? '新增' : '编辑';

              if(this.categroyForm.pcid){ //  编辑
                this.$http.post(this.$api.update_category, this.categroyForm).then(
                  res => {
                    if (res.data.status == 200) {
                      let resData = res.data,
                          data = res.data.data;

                      this.$notify({
                        title: `分类${type}成功`,
                        message: `分类名:${this.categroyForm.pcname}`,
                        type: 'success'
                      });
                      this.dialogVisible = false;
                      this.setCategory();
                    }
                  }
                )
              }else{
                this.$http.post(this.$api.create_category, this.categroyForm).then(
                  res => {
                    if (res.data.status == 200) {
                      let resData = res.data,
                        data = res.data.data;

                      this.$notify({
                        title: `分类${type}成功`,
                        message: `分类名:${this.categroyForm.pcname}`,
                        type: 'success'
                      });
                      this.dialogVisible = false;
                      this.setCategory();
                    }
                  }
                )
              }
            } else {
              this.$message.warning('请根据校验信息完善表单!');
            }
          }
        )
      },


      handlePictureCardPreview(file) {

      },
      //  分类主图上传
      handlePcpicSuccess(res, file) {
        this.categroyForm.pcpic = res.data;
      },
      beforePicUpload(file) {
        const isLt15M = file.size / 1024 / 1024 < 15;

        if (!isLt15M) {
          this.$message.error('上传图片大小不能超过 15MB!');
        }

        return isLt15M;
      },

      handlePctoppicSuccess(res, file) {
        this.categroyForm.pctoppic = res.data;
      },

      doRemove(row) {
        if (!row.children || row._level == 3) { //  下面是否有子级分类
          this.$confirm(`确认删除分类(${row.pcname}),其分类下的品牌也会一并下架?`, '提示').then(
            () => {
              this.$http.post(this.$api.delete_category, {
                pcid: row.pcid
              }).then(
                res => {
                  if (res.data.status == 200) {
                    let resData = res.data,
                      data = res.data.data;

                    this.setCategory();
                    this.$notify({
                      title: '分类删除成功',
                      message: `分类名:${row.pcname}`,
                      type: 'success'
                    });
                  }
                }
              )
            }
          );
        } else {
          this.$message.warning(`请先删除(${row.pcname})下面的分类`);
        }

      },
    },

    created() {
      this.setCategory();
      this.getSearchCategory();
    }
  }
</script>


<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {
    .avatar-top {
      width: 447.14px;
    }
    .avatar-uploader-icon-top {
      width: 447.14px;
    }
  }
</style>
