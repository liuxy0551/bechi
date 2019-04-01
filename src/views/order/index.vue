<template>
  <div class="container">
    <section class="tool-bar">
      <el-form :inline="true" size="medium">
        <el-form-item label="订单号">
          <el-input v-model.trim="inlineForm.omno" maxlength="100" clearable></el-input>
        </el-form-item>
        <el-form-item label="收件人">
          <el-input v-model.trim="inlineForm.omrecvname" maxlength="100" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model.trim="inlineForm.omrecvphone" maxlength="100" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品名">
          <el-input v-model.trim="inlineForm.prtitle" maxlength="100" clearable></el-input>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-col :span="11">
            <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="inlineForm.createtime_start"
                            placeholder="起始日期" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="middle-line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="inlineForm.createtime_end" placeholder="结束日期"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" :loading="loading" @click="doSearch">查询</el-button>
          <el-button icon="el-icon-refresh" :loading="loading" @click="doReset">重置</el-button>
          <el-button icon="el-icon-document" type="info" @click="doExportOrder">导出订单</el-button>
        </el-form-item>
      </el-form>

      <section style="margin-bottom: 20px">
        <el-switch
          v-model="expandAll"
          active-text="展开"
          inactive-text="不展开"
          @change="changeSwitch">
        </el-switch>
        <el-tag color="#fde7cb" type="info" style="margin-left: 20px;">退款中订单</el-tag>
      </section>

    </section>

    <el-menu :default-active="activeName" class="el-menu-demo" mode="horizontal" @select="handleClick">
      <el-menu-item v-for="item in menuList" :key="item.status" :index="item.status.toString()">{{`${item.name}
        ${item.count}`}}
      </el-menu-item>
    </el-menu>

    <el-table ref="orderTable" :data="orderData" v-loading="loading" size="small" :default-expand-all="expandAll"
              style="width: 100%;" @row-click="expandRow" :cell-class-name="cellFunction"
              :row-class-name="tableRowClassName">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.order_part" size="small" style="width: 100%"
                    :row-class-name="subTableRowClassName">
            <el-table-column prop="prmainpic" align="center" label="图片" width="180">
              <template slot-scope="scope">
                <table-cell-img :src="[scope.row.prmainpic]"></table-cell-img>
              </template>
            </el-table-column>
            <el-table-column prop="prtitle" align="center" label=" 商品名" width="240"></el-table-column>
            <el-table-column label="规格" width="240" align="center">
              <template slot-scope="scope">
                <span>{{getSkuCellText(scope.row.skuattritedetail, scope.row.prattribute)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="opnum" align="center" label="数量" width="120"></el-table-column>
            <el-table-column prop="skuprice" align="center" label="单价" width="120"></el-table-column>
            <el-table-column prop="opsubtruetotal" align="center" label="总价" width="120"></el-table-column>
            <el-table-column prop="opisinora" align="center" label="退款中" width="120">
              <template slot-scope="scope">
                {{scope.row.opisinora ? '是':'否'}}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="omno" align="center" label="订单号" width="280"></el-table-column>
      <el-table-column label="订单状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="tagType(scope.row.omstatus_zh)">{{scope.row.omstatus_zh}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="omtruemount" label="实付" align="center" width="120"></el-table-column>
      <el-table-column prop="pbname" align="center" label="品牌" width="180"></el-table-column>
      <el-table-column v-if="checkPermission(['admin', 'super'])" prop="pbname" align="center" label="订单所属" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.prcreateid" type="success">供应商</el-tag>
          <el-tag v-else>平台</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="omrecvname" align="center" label="收件人" width="120"></el-table-column>
      <el-table-column prop="omrecvphone" align="center" label="手机号" width="160"></el-table-column>
      <el-table-column prop="ommount" label="总价" align="center" width="120"></el-table-column>
      <el-table-column prop="omfreight" label="运费" align="center" width="120"></el-table-column>

      <el-table-column label="退款中" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.ominrefund ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column prop="ommessage" label="备注" width="180" align="center" show-tooltip-overflow></el-table-column>
      <el-table-column prop="createtime" label="下单时间" align="center" width="180"></el-table-column>

      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="gotoOrderDetail(scope.row)">查看</el-button>
          <!--<el-button type="text" v-if="scope.row.omstatus == 0" class="warning-text" @click="doCancelOrder(scope.row)">-->
          <!--取消订单-->
          <!--</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <section class="table-bottom">
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


  </div>
</template>

<script>
  import TableCellImg from "src/components/TableCellImg";
  import checkPermission from 'src/utils/permission' // 权限判断函数
  import {getStore} from "src/utils/index";



  export default {
    name: 'OrderIndex',

    components: {
      TableCellImg,
    },


    data() {
      return {
        checkPermission,

        activeName: '-1', //  -1 => 空 全部
        orderType: [],
        inlineForm: {
          omno: '',
          omrecvname: '',
          omrecvphone: '',
          prtitle: '',
          createtime_start: '',
          createtime_end: '',
        },

        menuList: [],

        expandAll: false,
        loading: false,
        orderData: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,

        repeat: true,
      }
    },

    computed: {},

    methods: {
      changeSwitch() {
        for (let i = 0; i < this.orderData.length; i++) {
          this.$refs.orderTable.toggleRowExpansion(this.orderData[i], this.expandAll);
        }
      },
      doSearch() {
        this.expandAll = false;
        this.currentPage = 1;
        if (this.inlineForm.createtime_end && this.inlineForm.createtime_start) {
          if (new Date(this.inlineForm.createtime_start) > new Date(this.inlineForm.createtime_end)) {
            let term = this.inlineForm.createtime_end;

            this.inlineForm.createtime_end = this.inlineForm.createtime_start;
            this.inlineForm.createtime_start = term;
          }
        }
        this.setOrderList();
        this.setOrderType();
      },
      doReset() {
        this.inlineForm = {
          omno: '',
          omrecvname: '',
          omrecvphone: '',
          prtitle: '',
          createtime_start: '',
          createtime_end: '',
        }
        this.doSearch();
      },

      doExportOrder() {
        this.$confirm(`确认导出订单报表?`,'提示').then(
          ()=>{
            let url = this.$api.get_all_order + '?',
              params = {};

            params = {
              omstatus: this.activeName == '-1' ? '' : this.activeName,
              ...this.inlineForm,
              export_xls: true,
              token: getStore('token')
            }

            for (let key in params) {
              url += `${key}=${params[key]}&`
            }

            location.href=url;
            this.$alert('请留意浏览器可能会进行拦截,注意保存文件,xls中日期显示异常时请设置单元格格式', '成功获取订单报表',);
          }
        )

      },

      //  获取每个订单类型的数量
      setOrderType() {
        this.$http.get(this.$api.order_count, {
          noLoading: true,
          params: {
            extentions: 'refund'
          }
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              data[0].status = -1;
              this.menuList = data;
            }
          }
        )
      },
      handleClick(key, keyPath) {
        this.activeName = key;
        this.expandAll = false;
        this.setOrderList();
      },

      expandRow(row) {
        this.$refs.orderTable.toggleRowExpansion(row);
      },
      cellFunction({row, column}) {
        if (['ommount', 'omfreight', 'omtruemount'].includes(column.property)) {
          return 'money-cell'
        }
      },
      tagType(statusZh) {
        switch (statusZh) {
          //  待支付 待发货
          case '待支付':
            return 'primary'
          case '待发货':
            return 'danger'
          case '已发货':
            return 'success'
          case '退款中':
            return 'warning'
          default:
            return 'info'
        }
      },
      tableRowClassName({row, rowIndex}) {
        let isOrderPartRefund = row.order_part.some(item => item.opisinora);

        if (row.ominrefund || isOrderPartRefund) {
          return 'warning-row';
        }

        return ''
      },

      getSkuCellText(detail, attribute) {
        let rst = '';

        for (let i = 0; i < detail.length; i++) {
          rst += attribute[i] + ': ' + detail[i];

          if (i + 1 < detail.length) {
            rst += ', '
          }
        }

        return rst;
      },
      subTableRowClassName({row, rowIndex}) {
        if (row.opisinora) {
          return 'warning-row';
        }

        return ''
      },

      setOrderList() {
        this.loading = true;
        this.$http.get(this.$api.get_all_order, {
          noLoading: true,
          params: {
            page_size: this.pageSize,
            page_num: this.currentPage,
            omstatus: this.activeName == '-1' ? '' : this.activeName,
            ...this.inlineForm
          }
        }).then(
          res => {
            this.loading = false;

            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.orderData = data;
              this.total = resData.total_count;
            }
          }
        )
      },
      sizeChange(pageSize) {
        this.expandAll = false;
        this.pageSize = pageSize;
        this.currentPage = 1;

        this.setOrderList();
      },
      pageChange(page) {
        this.expandAll = false;
        this.currentPage = page;
        this.setOrderList();
      },

      gotoOrderDetail(row) {
        if (row.ominrefund || row.order_part.find(item => item.opisinora)) {
          this.$message({
            message: '订单中含有售后中的商品',
            type: 'warning'
          });
        } else {
          //  对 用户刚下单就取消 的旧数据进行拦截
          if ([0, 10].includes(row.omstatus)) {
            this.$http.get(this.$api.get_order_by_LOid, {
              params: {
                omid: row.omid
              }
            }).then(
              res => {
                if (res.data.status == 200) {
                  let resData = res.data,
                    data = res.data.data;

                  //  售后了
                  if (data.ominrefund) {
                    this.$confirm(`用户发起了退货,是否前往退货审批页?`, '提示').then(
                      () => {
                        this.$router.push('/approval/returnProductAudit');
                        this.getList();
                        return
                      }
                    ).catch(e => {
                      this.getList()
                    })
                  }
                  //  取消了
                  if (data.omstatus == -40) {
                    this.$message.info(`用户已取消了订单`);
                    this.getList();
                    return
                  }
                  this.$router.push({
                    path: `/order/orderDetail`,
                    query: {
                      omid: row.omid
                    }
                  })
                }
              }
            )
            return
          } else {

          }
        }
        this.$router.push({
          path: `/order/orderDetail`,
          query: {
            omid: row.omid
          }
        })
      },
      doCancelOrder(row) {
        this.$confirm(`确认取消订单(${row.omno})?`, '提示').then(
          () => {
            this.$http.post(this.$api.cancle_order, {
              omid: row.omid
            }).then(
              res => {
                if (res.data.status == 200) {
                  let resData = res.data,
                    data = res.data.data;

                  this.setOrderList();
                  this.$notify({
                    title: '订单取消成功',
                    message: `订单号:${row.omno}`,
                    type: 'success'
                  });
                }
              }
            )

          }
        )
      },

      initProfileSearch() {
        if (this.$route.params.searchDate) {
          this.inlineForm.createtime_start = this.$route.params.searchDate;
          this.inlineForm.createtime_end = this.$route.params.searchDate;
        }
        if (this.$route.params.omstatus) {
          this.activeName = this.$route.params.omstatus.toString();
        }

        this.$route.params.searchDate = '';
        this.$route.params.omstatus = '-1';
      }
    },

    activated() {
      if (this.repeat) {
        this.repeat = false;
      } else {
        this.doSearch();

      }
    },

    created() {
      this.initProfileSearch();

      this.doSearch();
    }
  }
</script>

<style lang="less" scoped>
  .container {
  }
</style>
