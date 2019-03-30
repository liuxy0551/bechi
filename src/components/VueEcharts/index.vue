<template>
  <div class="m-echart">
    <div :id="id" :style="{height:height + 'px'}"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  import echarts from "echarts";


  export default {
    props: {
      id:{
        type:String,
        default:''
      },
      width:{
        type:Number,
        default:400
      },
      height:{
        type:Number,
        default:400
      },
      option:{
        type:Object,
        default:{}
      }
    },
    data() {
      return {}
    },
    methods: {},
    created() {

    },
    mounted(){
      let myEcharts = echarts.init(document.getElementById(`${this.id}`))
      myEcharts.setOption(this.option)
    },
    watch:{
      option:{
        handler(val, oldVal) {
          let myEcharts = echarts.init(document.getElementById(`${this.id}`))
          myEcharts.setOption(this.option)
        },
        deep:true
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .m-echart{
    margin: 0.2rem 0;
  }
</style>
