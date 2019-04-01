<template>
  <div class="container">
    <block-title title="订单流程"></block-title>
    <section class="tool-tip-wrap detail-section">
      <el-steps :active="orderStep" align-center>
        <el-step v-for="item in showSteps" :title="item.title" :key="item.title"
                 :description="item.description"></el-step>
      </el-steps>
    </section>

    <section class="detail-section row-two">
      <section class="order-detail">
        <h1 class="title">
          订单详情
        </h1>
        <div class="detail-item-wrap">
          <p class="detail-item">
            <span class="label">订单号:</span>
            <span class="value">{{order.omno}}</span>
          </p>

          <p class="detail-item">
            <span class="label">总价:</span>
            <span class="value">￥ {{order.ommount}}</span>
          </p>
          <p class="detail-item">
            <span class="label">实付:</span>
            <span class="value">￥ {{order.omtruemount}}</span>
          </p>

          <p class="detail-item">
            <span class="label">下单时间:</span>
            <span class="value">{{order.createtime}}</span>
          </p>
          <p class="detail-item">
            <span class="label">收件人:</span>
            <span class="value">{{order.omrecvname}}</span>
          </p>
          <p class="detail-item">
            <span class="label">手机号:</span>
            <span class="value">{{order.omrecvphone}}</span>
          </p>
          <p class="detail-item">
            <span class="label">收货地址:</span>
            <span class="value">
              {{order.omrecvaddress}}
            </span>
          </p>
          <p class="detail-item">
            <span class="label">买家留言:</span>
            <span class="value">{{order.ommessage || '无'}}</span>
          </p>
        </div>
      </section>
      <section class="order-action-block">
        <el-form ref="actionForm" :model="actionForm" :rules="rules" label-position="left" label-width="100"
                 size="medium">
          <template v-if="order.omstatus == 0">
            <el-form-item label="新订单价格" prop="price">
              <el-input v-model.number="actionForm.price"  maxlength="11" ></el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item prop="olcompany" label="快递公司">
              <el-select v-model="actionForm.olcompany" placeholder="请选择,可搜索"
                         filterable>
                <el-option-group
                  v-for="group in expressOptions"
                  :key="group.label"
                  :label="group.label">
                  <el-option
                    v-for="(item,index) in group.options"
                    :key="index"
                    :label="item.lcname"
                    :value="item.lccode">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item prop="olexpressno" label="快递单号">
              <el-col :span="14">
                <el-input v-model.trim="actionForm.olexpressno" maxlength="100" ></el-input>
                <!--<el-input v-model.trim="actionForm.olexpressno" :disabled="order.omstatus != 10"></el-input>-->
              </el-col>
            </el-form-item>
          </template>

          <el-form-item>
            <!--TODO-->
            <template v-if="showAction"></template>
            <el-button style="margin-right: 10px;" type="primary" @click="doEditOrderPrice" v-if="order.omstatus == 0">修改订单价格</el-button>
              <el-button style="margin-right: 10px;" type="primary" @click="doDeliver" icon="el-icon-success" v-if="order.omstatus == 10">确定发货</el-button>
             <el-popover v-if="orderIsSend(order.omstatus)" placement="left" trigger="hover" >
              <div style="padding: 20px">
                <el-steps direction="vertical" :active="orderLogisticsList.length">
                  <el-step v-for="item in orderLogisticsList" :title="item.time" :key="item.time"
                           :description="item.status"></el-step>
                </el-steps>
              </div>
              <el-button slot="reference" icon="el-icon-search">查看物流</el-button>
            </el-popover>
          </el-form-item>
        </el-form>
      </section>
    </section>

    <block-title title="发货清单"></block-title>
    <el-table :data="order.order_part" size="small" stripe style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="prmainpic" align="center" label="图片" width="180">
        <template slot-scope="scope">
          <table-cell-img :src="[scope.row.prmainpic]"></table-cell-img>
        </template>
      </el-table-column>
      <el-table-column prop="prtitle" align="center" label=" 商品名" width="240" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="规格">
        <template slot-scope="scope">
          <span>{{getSkuCellText(scope.row.skuattritedetail, scope.row.prattribute)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="opnum" align="center" label="数量" width="120"></el-table-column>
      <el-table-column prop="skuprice" align="center" label="单价" width="120"></el-table-column>
      <el-table-column prop="opsubtruetotal" align="center" label="总价" width="120"></el-table-column>
      <el-table-column prop="opisinora" align="center" label="退款中" width="120">
        <template slot-scope="scope">
          {{scope.row.opisinora || order.ominrefund ? '是':'否'}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import TableCellImg from "src/components/TableCellImg";
  import checkPermission from 'src/utils/permission' // 权限判断函数

  const cancelSteps = [{
    title: '待支付',
    description: '等待买家付款',
  }, {
    title: '已取消',
    description: '买家/平台取消',
  }];
  const normalSteps = [
    {
      title: '待支付',
      description: '等待买家付款',
    }, {
      title: '待发货',
      description: '请填写快递信息',
    }, {
      title: '已发货',
      description: '已填写快递信息',
    }, {
      title: '待评价',
      description: '等待买家评价',
    }, {
      title: '已完成',
      description: '完成评价',
    },
  ];

  export default {
    name: "OrderDetail",

    components: {TableCellImg},

    data() {
      const moneyReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[0-9]\.[0-9]([0-9])?$)/;

      return {
        orderStep: 1,
        showSteps: normalSteps,

        order: {},

        actionForm: {
          price: 0,

          olcompany: '',
          olexpressno: '',
        },
        rules: {
          price: [
            {required: true, message: '新订单价格必填', trigger: 'blur'},
            {pattern: moneyReg, message: '请输入合理的价格(至多2位小数)', trigger: 'blur'},
          ],

          olcompany: [
            {required: true, message: '快递公司必选', trigger: 'change'},
          ],
          olexpressno: [
            {required: true, message: '快递单号必填', trigger: 'blur'},
          ],
        },
        expressOptions: [],

        orderLogisticsList: [],
      }
    },

    computed: {
      //  是供应商显示
      showAction(){
        if(this.checkPermission(['supplizer'])){
          return true
        }else{
          if(this.order.prcreateid){
            return false
          }
        }
      }
    },

    methods: {
      checkPermission,
      tableRowClassName({row, rowIndex}){
        if(row.opisinora || this.order.ominrefund){
          return 'warning-row';
        }

        return ''
      },
      getSkuCellText(detail, attribute ){
        let rst = '';

        for (let i = 0; i < detail.length; i++) {
          rst += attribute[i] + ': ' + detail[i];

          if(i+1 < detail.length){
            rst += ', '
          }
        }

        return rst;
      },

      doEditOrderPrice() {
        this.$refs.actionForm.validate(
          valid => {
            if (valid) {
              this.$confirm(`确认修改订单价格?`, '提示').then(
                () => {
                  this.$http.post(this.$api.update_order_price, {
                    "omid": this.order.omid,
                    "price": this.actionForm.price
                  }).then(
                    res => {
                      if (res.data.status == 200) {
                        let resData = res.data,
                          data = res.data.data;

                        this.init();
                        this.$notify({
                          title: '订单改价成功',
                          type: 'success'
                        });
                      }
                    }
                  )
                }
              );
            } else {
              this.$message.warning('请根据校验信息完善表单!');
            }
          }
        );
      },

      doDeliver() {
        this.$refs.actionForm.validate(
          valid => {
            if (valid) {
              this.$confirm(`确认发货?`, '提示').then(
                () => {
                  this.$http.post(this.$api.send_order, {
                    "omid": this.order.omid,
                    "olcompany": this.actionForm.olcompany,
                    "olexpressno": this.actionForm.olexpressno,
                  }).then(
                    res => {
                      if (res.data.status == 200) {
                        let resData = res.data,
                          data = res.data.data;

                        this.init();
                        this.$notify({
                          title: '发货成功',
                          type: 'success'
                        });
                      }
                    }
                  )
                }
              )
            } else {
              this.$message.warning('请根据校验信息完善表单!');
            }
          }
        )
      },

      orderIsSend(omstatus){
          return  [20, 35, 30].includes(Number(omstatus))
      },

      init() {
        this.$http.get(this.$api.get_order_by_LOid, {
          params: {
            omid: this.$route.query.omid
          }
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.order = data;
              if (data.omstatus == -40) { //  取消
                //  步骤对应
                this.showSteps = cancelSteps;
                this.orderStep = 2;
              } else { //  普通流程
                //  步骤对应
                switch (data.omstatus) {
                  case 0:
                    this.orderStep = 0;
                    break;
                  case 10:
                    this.orderStep = 1;
                    break;
                  case 20:
                    this.orderStep = 3;
                    break;
                  case 35:
                    this.orderStep = 4;
                    break;
                  case 30:
                    this.orderStep = 5;
                    break;
                  default:
                    break;
                }

                //  发货中的处理下actionForm和物流信息
                if (this.orderIsSend(data.omstatus)){
                  this.$http.get(this.$api.get_logistic, {
                    params: {
                      omid: this.order.omid
                    }
                  }).then(
                    res => {
                      if (res.data.status == 200) {
                        let resData = res.data,
                            data = res.data.data;

                        this.actionForm.olcompany = data.olcompany;
                        this.actionForm.olexpressno = data.olexpressno;

                        this.orderLogisticsList = data.oldata.list.reverse();
                      }
                    }
                  )
                }

                //  发货清单售后商品标明
              }
              //  改价
              this.actionForm.price = data.omtruemount;
            }
          }
        );

        this.$http.get(this.$api.get_list_company, {
          params: {}
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.expressOptions = [
                {
                  label: '常用快递',
                  options: data.common
                }, {
                  label: '快递列表',
                  options: data.all
                },
              ]
            }
          }
        )
      },
    },

    created() {
      this.init();
    },
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {
    .tool-tip-wrap {
      padding: 40px;
    }

    .detail-section {
      margin-bottom: 30px;
    }

    .row-two {
      .fj();

      .order-detail {
        border: 1px dotted black;
        flex: 1;
        border-radius: 10px;
        .fz(10px);
        padding: 20px;
        margin-right: 20px;

        .title {
          margin-bottom: 20px;
          font-size: 20px;
        }

        .detail-item-wrap {
          .fj();
          flex-wrap: wrap;
          .detail-item {
            flex: 50%;
            margin-bottom: 10px;
            padding-right: 6px;
            box-sizing: border-box;
            font-size: 14px;
          }
        }
      }

      .order-action-block {
        border: 1px dotted black;
        flex: 1;
        border-radius: 10px;
        /*height: 10px;*/
        padding: 20px;
        box-sizing: border-box;
      }
    }
  }
</style>
