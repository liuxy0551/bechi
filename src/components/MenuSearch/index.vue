<template>
  <div class="container">
    <el-autocomplete prefix-icon="el-icon-menu" placeholder="菜单搜索" v-model="searchTxt" size="medium"
                     value-key="title"  :fetch-suggestions="querySearch" @select="selectMenu" clearable>
    </el-autocomplete>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";


  export default {
    name: "MenuSearch",

    components: {},

    data() {
      return {
        searchTxt: '',
      }
    },

    computed: {
      ...mapGetters(['addRouters']),
      menuList(){
        let rst = [];

        for (let i = 0; i < this.addRouters.length; i++) {
          if(this.addRouters[i].children){
            for (let j = 0; j < this.addRouters[i].children.length; j++) {
              if(!this.addRouters[i].children[j].hidden){
                rst.push({
                  path: this.addRouters[i].path + '/' + this.addRouters[i].children[j].path,
                  title: this.addRouters[i].children[j].meta.title
                })
              }
            }
          }else{
          }
        }

        return rst;
      }
    },

    methods: {
      querySearch(queryString, cb) {
        let searchRes =  this.menuList.filter(item => item.title.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)

        cb(searchRes);
      },
      selectMenu(menu){
        this.$router.push(menu.path)
      },
    },

    created() {

    },
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {

  }
</style>
