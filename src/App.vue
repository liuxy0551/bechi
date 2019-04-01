<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import {getStore} from "src/utils";


  export default {
    name: 'App',

    data() {
      return {
        interval: null,
      }
    },

    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      },
      key() {
        return this.$route.fullPath
      },
    },

    methods: {
      authRefresh() {
        if(getStore('token')){
          this.$http.get(this.$api.auth_fresh, {
            noLoading: true,
            params: {}
          }).then(
            res => {
              if (res.data.status == 200) {
                let resData = res.data,
                    data = res.data.data;

                this.$store.commit('SET_TOKEN', data);
              }
            }
          )
        }
      },
    },

    destroyed() {
      // clearInterval(this.interval);
    },

    created() {
      //  5分钟刷新一下token
      // this.interval = setInterval(this.authRefresh, 1000 * 60 * 5);
      // console.log('v 周3下午10点30');
    }
  }
</script>
