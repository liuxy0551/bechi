<template>
  <ul class="m-recommend" v-if="list.length">
    <li v-for="(item,index) in list">
      <img :src="item.prmainpic" class="m-one-product-img" alt="">
      <div class="m-one-product-text">
        <p>【{{item.brand.pbname}}】{{item.prtitle}} </p>
        <p class="m-flex-between">
          <span >￥{{item.prprice}}</span>
          <s class="m-grey">￥{{item.prprice}}</s></p>
      </div>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {

      }
    },
    props: {
      list: { type: Array, default: null },
      gift: { type: Boolean, default: false }
    },
    methods: {

    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>

  .m-recommend{
    display: flex;
    flex-flow: row;
    align-items: center;
    flex-wrap: wrap;
    padding: 15px 16.5px;
    li{
      list-style: none;
      width: 162.5px;
      height: auto;
      border-radius: 5px;
      box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.16);
      background-color: #ffffff;
      padding-bottom: 10px;
      margin-bottom: 15px;
      margin-right: 15px;
      .m-one-product-img{
        display: block;
        width: 162.5px;
        height: 162.5px;
        border-radius: 5px;
      }
      .m-one-product-text{
        padding: 0 7.5px;
        .m-flex-between {
          width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      p{
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 1px;
        font-size: 12px;
        text-align: left;
        line-height: 30px;
        margin-bottom: -10px;
      }
    }
  }
</style>
