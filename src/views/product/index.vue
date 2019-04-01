<template>
  <div class="container">
    <!--工具栏-->
    <section class="tool-bar space-between">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="商品名">
          <el-input v-model.trim="searchForm.kw" clearable></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="searchForm.pbid" @change="doSearch(true)" filterable clearable>
            <el-option
              v-for="item in brandOptions"
              :key="item.pbid"
              :label="item.pbname"
              :value="item.pbid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-cascader :options="categoryOptions" :props="categoryProps" change-on-select :clearable="true" filterable
                       v-model="searchForm.pcid" @change="doSearch(true)">
          </el-cascader>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.prstatus" @change="doSearch(true)">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-permission="[ 'admin', 'super']" v-model="searchForm.showUpgradeProd" @change="doSearch(true)">
            只显示开店大礼包商品
          </el-checkbox>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" :loading="loading" @click="doSearch(true)">查询</el-button>
        <el-button icon="el-icon-refresh" :loading="loading" @click="doReset" style="margin-bottom: 20px;">重置
        </el-button>
      </el-form>

      <section class="action-wrap">
        <el-button type="primary" icon="el-icon-plus" @click="doAddProduct(false)">新增</el-button>
        <el-button v-permission="[ 'admin', 'super']" type="primary" icon="el-icon-plus" @click="doAddProduct(true)">
          新增开店大礼包
        </el-button>
      </section>
    </section>

    <el-table :data="tableData" v-loading="loading" stripe style="width: 100%" :cell-class-name="cellFunction"
              @selection-change="handleSelectionChange" @sort-change="handleSortChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        type="index"></el-table-column>
      <el-table-column align="center" width="120" label="图片">
        <template slot-scope="scope">
          <table-cell-img :src="[scope.row.prmainpic]" :key="scope.row.prid"></table-cell-img>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="prtitle" label="商品名" width="280" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="prprice" sortable label="价格" width="120"></el-table-column>
      <el-table-column align="center" prop="prstocks" label="库存"></el-table-column>
      <el-table-column align="center" prop="prstatus_zh" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.prstatus=='0'">{{scope.row.prstatus_zh}}</el-tag>
          <el-tag v-else-if="scope.row.prstatus=='10'" type="warning">{{scope.row.prstatus_zh}}</el-tag>
          <el-tag v-else-if="scope.row.prstatus=='60'" type="danger">{{scope.row.prstatus_zh}}</el-tag>
          <el-popover
            v-else-if="scope.row.prstatus=='30'"
            placement="top-start" title="拒绝理由" width="200" trigger="click" @show="showNoPassReason(scope.row)">
            {{noPassReason}}
            <el-tag slot="reference" type="info">{{scope.row.prstatus_zh}}</el-tag>
          </el-popover>
          <el-tag v-else type="info">{{scope.row.prstatus_zh}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="brand.pbname" label="品牌" width="180"></el-table-column>
      <el-table-column align="center" prop="brand.pbname" label="分类" width="240">
        <template slot-scope="scope">
          {{categoryCellText(scope.row.category)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="prsalesvalue" sortable label="总销量" width="120"></el-table-column>
      <el-table-column align="center" prop="supplizer" label="供应源" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.prfrom == '0' ? '' : 'success'">{{scope.row.supplizer}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="createtime" sortable label="创建时间" width="240"></el-table-column>
      <el-table-column align="center" width="220" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.prstatus != 10" type="text" @click="doEdit(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.prstatus == 0" type="text" class="warning-text"
                     @click="doUnShelveOne(scope.row)">下架
          </el-button>
          <el-button v-if="scope.row.prstatus == 60" type="text" class="success-text"
                     @click="doOnShelveOne(scope.row)">上架
          </el-button>
          <el-button v-if="scope.row.prstatus == 30" type="text" class="success-text"
                     @click="doResubmit(scope.row)">重新提交
          </el-button>
          <el-button type="text" class="info-text" @click="doShowComment(scope.row)">查看评论</el-button>
          <el-button type="text" class="danger-text" @click="doDeleteOne(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <section class="table-bottom">
      <section class="actions-block">
        <el-button type="warning" :disabled="selectedRows.length == 0" @click="doUnShelveSelect">批量下架</el-button>
        <el-button type="danger" :disabled="selectedRows.length == 0" @click="doDeleteSelect">批量删除</el-button>
      </section>

      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="sizeChange"
        @current-change="pageChange">
      </el-pagination>
    </section>

    <product-comment :visible="commentVisible" :product="commentProduct" @close="closeProdComment"></product-comment>
  </div>
</template>

<script>
  import TableCellImg from "src/components/TableCellImg";
  import permission from 'src/directive/permission/index.js' // 权限判断指令
  import ProductComment from "./components/productComment";


  export default {
    name: 'ProductIndex',

    directives: {permission},

    components: {
      TableCellImg,
      ProductComment,
    },

    data() {
      return {
        testUrl: 'https://planet.daaiti.cn/img/product/2019/1/14/5GLtROuEHskQzz3wxjDy3fcfc57a-fd0f-11e8-a04f-00163e08d30f.jpg_562x1000.jpg',
        repeat: true,

        //  查询表单用
        brandOptions: [],
        categoryOptions: [],
        categoryProps: {
          value: 'pcid',
          label: 'pcname',
          children: 'subs',
        },
        statusOption: [
          {
            value: 'all',
            label: '全部',
          }, {
            value: 'usual',
            label: '已上架',
          }, {
            value: 'auditing',
            label: '审核中',
          }, {
            value: 'off_shelves',
            label: '已下架',
          }, {
            value: 'reject',
            label: '审核失败',
          }, {
            value: 'sell_out',
            label: '售罄',
          },
        ],
        searchForm: {
          showUpgradeProd: false,

          kw: '',
          pbid: '',
          pcid: [],
          prstatus: 'all',
          order_type: '',
        },

        noPassReason: '',
        loading: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        selectedRows: [],

        commentVisible: false,
        commentProduct: {},
      }
    },

    computed: {},

    methods: {
      getCategory() {
        this.$http.get(this.$api.category_list, {
          params: {
            up: '',
            deep: 2
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
      getBrand() {
        this.$http.get(this.$api.brand_list, {
          params: {
            pbstatus: 'all',
          }
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.brandOptions = data;
            }
          });
      },

      doSearch(replace = false) {
        if (replace) {
          this.currentPage = 1;
        }

        let searchParams = {
          pcid: '',
          ...this.searchForm,
        };

        if (this.searchForm.pcid.length) {
          searchParams.pcid = this.searchForm.pcid[this.searchForm.pcid.length - 1];
        } else {
          searchParams.pcid = ''
        }

        if (searchParams.showUpgradeProd) {
          searchParams.itid = 'upgrade_product'
        }

        this.getProduct(searchParams);
      },
      doReset() {
        this.searchForm = {
          showUpgradeProd: false,

          kw: '',
          pcid: [],
          prstatus: 'all',
          order_type: '',
        };
        this.doSearch();
      },

      getProduct(searchParams = {}) {
        this.loading = true;
        this.$http.get(this.$api.product_list, {
          noLoading: true,
          params: {
            page_size: this.pageSize,
            page_num: this.currentPage,

            ...searchParams,
          }
        }).then(res => {
          this.loading = false;

          if (res.data.status == 200) {
            this.tableData = res.data.data;
            this.total = res.data.total_count;
          }
        })
      },
      filterPrStatus(value, row, column) {
        const property = column['property'];

        console.log(value, row, column);
        return row[property] === value;
      },
      categoryCellText(arr) {
        let rst = ''

        if (arr) {
          for (let i = 0; i < arr.length; i++) {
            rst += arr[i].pcname;

            if (i != arr.length - 1) {
              rst += ' / '
            }
          }
        }

        return rst
      },
      showNoPassReason(row) {
        this.$http.get(this.$api.list_approval_notes, {
          params: {
            ptid: 'toshelves',
            avcontent: row.prid,
          }
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.noPassReason = data.notes[0].anabo
            }
          }
        )
      },
      sizeChange(pageSize) {
        this.pageSize = pageSize;
        this.currentPage = 1;

        this.doSearch();
      },
      pageChange(page) {
        this.currentPage = page;
        this.doSearch();
      },
      cellFunction({row, column}) {
        if (['prprice', 'prsalesvalue'].includes(column.property)) {
          return 'money-cell'
        }
      },

      doAddProduct(addBig) {
        let query = {}

        // console.log(addBig);
        // return
        if (addBig) {
          query = {
            addBig: 'true'
          }
        }
        this.$router.push({
          path: '/product/productEdit',
          query
        })
      },
      doEdit(product) {
        this.$router.push({
          path: '/product/productEdit',
          query: {
            prid: product.prid
          }
        })
      },

      doResubmit(row) {
        this.$confirm(`确认提交商品(${row.tctitle})申请?`, '提示').then(
          () => {
            this.$http.post(this.$api.resubmit_product, {
              prid: row.prid
            }).then(
              res => {
                if (res.data.status == 200) {
                  let resData = res.data,
                    data = res.data.data;

                  this.$notify({
                    title: '商品提交成功',
                    message: `商品名:${row.tctitle}`,
                    type: 'success'
                  });
                  this.doSearch();
                }
              }
            )
          }
        )
      },
      doDeleteOne(row) {
        this.$confirm(`确认删除商品(${row.prtitle})?`, '提示').then(
          () => {
            this.$http.post(this.$api.delete_product, {
              prids: [row.prid],
            }).then(
              res => {
                if (res.data.status == 200) {
                  let resData = res.data,
                    data = res.data.data;

                  this.doSearch();
                  this.$notify({
                    title: '商品删除成功',
                    message: `商品名:${row.prtitle}`,
                    type: 'success'
                  });
                }
              }
            )
          }
        )
      },
      //  下架1个
      doUnShelveOne(row) {
        this.doOneShelveAction([row], false);
      },
      //  上架1个
      doOnShelveOne(row) {
        this.doOneShelveAction([row], true);
      },
      /**
       * 批量上下架商品
       * @param prid
       * @param shelve  是否上架
       */
      doOneShelveAction(rows, shelve) {
        let type = shelve ? '上架' : '下架',
          status = shelve ? 0 : 60;
        let tip = rows[0].prtitle + (rows.length > 1 ? `等${rows.length}件商品` : ''),
          prids = rows.map(item => item.prid);

        this.$confirm(`确认${type}商品(${tip})?`, '提示').then(
          () => {
            this.$http.post(this.$api.off_shelves_product, {
              prids,
              "status": status
            }).then(
              res => {
                if (res.data.status == 200) {
                  let resData = res.data,
                    data = res.data.data;

                  this.doSearch();
                  this.$notify({
                    title: `商品已${type}`,
                    message: `商品名:${tip}`,
                    type: 'success'
                  });
                }
              }
            )
          }
        )
      },
      doUnShelveSelect() {
        if (this.selectedRows.some(item => item.prstatus != 0)) {
          this.$message.warning('批量下架的商品必须全部是上架中的')
        } else {
          let prids = this.selectedRows.map(item => item.prid),
            prtitles = this.selectedRows.map(item => item.prtitle).join(' , ');

          this.$confirm(`确认下架商品(${prtitles})?`, '提示').then(
            () => {
              this.$http.post(this.$api.off_shelves_product, {
                prids,
                status: 60,
              }).then(
                res => {
                  if (res.data.status == 200) {
                    let resData = res.data,
                      data = res.data.data;

                    this.doSearch();
                    this.$notify({
                      title: '商品下架成功',
                      type: 'success'
                    });
                  }
                }
              )
            }
          )
        }
      },
      doDeleteSelect() {
        let prids = this.selectedRows.map(item => item.prid),
          prtitles = this.selectedRows.map(item => item.prtitle).join(' , ');

        this.$confirm(`确认删除商品(${prtitles})?`, '提示').then(
          () => {
            this.$http.post(this.$api.delete_product, {
              prids
            }).then(
              res => {
                if (res.data.status == 200) {
                  let resData = res.data,
                    data = res.data.data;

                  this.doSearch();
                  this.$notify({
                    title: '商品删除成功',
                    type: 'success'
                  });
                }
              }
            )
          }
        )
      },

      doShowComment(row) {
        this.commentProduct = row;
        this.commentVisible = true;
      },
      closeProdComment(){
        this.commentVisible = false;
      },

      handleSelectionChange(val) {
        this.selectedRows = val;
      },
      handleSortChange({column, prop, order}) {
        switch (prop) {
          case 'prprice':
            prop = 'price';
            break;
          case 'prsalesvalue':
            prop = 'sale_value';
            break;
          case 'createtime':
            prop = 'time';
            break;
          default:
            break;
        }
        order = order == 'ascending' ? 'asc' : 'desc';

        if (prop) {
          this.searchForm.order_type = `${prop}|${order}`
          this.doSearch();
        }
      },

      initProfileSearch() {
        if (this.$route.params.prstatus) {
          this.searchForm.prstatus = this.$route.params.prstatus
        }

        this.$route.params.prstatus = 'all'
      }
    },

    activated() {
      if (this.repeat) {
        this.repeat = false;
      } else {
        this.initProfileSearch();

        this.doSearch()
        this.getCategory();
        this.getBrand();
      }
    },

    created() {
      this.initProfileSearch();

      this.doSearch()
      this.getCategory();
      this.getBrand();
    },
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {
    .table-bottom {
      margin-top: 20px;
      .fj();
    }

    .action-wrap {
      .fj();

    }
  }
</style>
