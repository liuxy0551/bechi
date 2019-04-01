import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('src/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('src/views/login/index'),
    hidden: true
  },
  {path: '/404', component: () => import('src/views/errorPage/404'), hidden: true},
  {path: '/401', component: () => import('src/views/errorPage/401'), hidden: true},

  {
    path: '',
    component: Layout,
    redirect: 'profile',
    children: [
      {
        path: 'profile',
        name: 'ProfileIndex',
        component: () => import('src/views/profile/index'),
        meta: {title: '概览', icon: 'gailan', noCache: true}
      }
    ]
  },
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

//  这些router会被权限过滤,不设置meta.roles的话也是看的到的
//  supplizer,admin,super

//  快捷数组
export const level0 = ['supplizer']; //  供应商可见
export const level1 = ['supplizer', 'admin', 'super']; //  三角色都可见
export const level2 = ['admin', 'super'];  //  管理员可见
export const level3 = ['super']; //  超管可见

export const asyncRouterMap = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'User',
    meta: {title: '用户', icon: 'people'},
    children: [
      {
        path: 'index',
        name: 'UserIndex',
        component: () => import('src/views/user/index'),
        meta: {title: '用户'},
      }
    ]
  },
  {
    path: '/mall',
    component: Layout,
    redirect: '/mall/indexBanner',
    name: 'Mall',
    meta: {title: '商城'},
    children: [
      {
        path: 'indexBanner',
        name: 'IndexBanner',
        component: () => import('src/views/mall/indexBanner'),
        meta: {title: '轮播图设置'},
      },{
        path: 'freightTmpl',
        name: 'freightTmpl',
        component: () => import('src/views/mall/freightTmpl'),
        meta: {title: '运费模板'},
      },
    ]
  },
  {
    path: '/product',
    component: Layout,
    alwaysShow: true, //  当配置供应商只能看到所有商品时,所有商品会升级显示为1级菜单,加上这个还是能显示为二级
    redirect: '/product/index',
    name: 'Product',  //  有二级菜单的时候加下,面包屑就会显示 概览/一级菜单/二级
    meta: {title: '商品', icon: 'shangpin'},
    children: [
      {
        path: 'index',
        name: 'ProductIndex',
        component: () => import('src/views/product/index'),
        meta: {title: '普通商品', icon: 'yes', noCache: false}
      }, {
        path: 'productEdit',
        name: 'ProductEdit',
        hidden: true,
        component: () => import('src/views/product/productEdit'),
        meta: {title: '商品编辑', icon: 'yes', noCache: false}
      },

      {
        path: 'productCategory',
        name: 'ProductCategory',
        component: () => import('src/views/product/productCategory'),
        meta: {title: '商品分类', icon: 'yes', noCache: true}
      },
    ]
  },
  {
    path: '/point',
    component: Layout,
    redirect: '/point/pointIndex',
    name: 'Point',
    meta: {title: '积分'},
    children: [
      {
        path: 'pointIndex',
        name: 'PointIndex',
        component: () => import('src/views/point/index'),
        meta: {title: '积分获取'},
      },{
        path: 'pointProduct',
        name: 'pointProduct',
        component: () => import('src/views/point/product'),
        meta: {title: '积分商品'},
      },
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    alwaysShow: true,
    name: 'Order',
    meta: {title: '订单', icon: 'dingdan', roles: level1},
    children: [
      {
        path: 'index',
        name: 'OrderIndex',
        component: () => import('src/views/order/index'),
        meta: {title: '普通订单', noCache: false, icon: 'yes', roles: level1}
      }, {
        path: 'orderDetail',
        name: 'OrderDetail',
        hidden: true,
        component: () => import('src/views/order/orderDetail'),
        meta: {title: '订单详情', noCache: true, roles: level1}
      },
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/index',
    alwaysShow: true,
    name: 'Activity',
    meta: {title: '活动'},
    children: [
      {
        path: 'index',
        name: 'ActivityIndex',
        component: () => import('src/views/activity/index'),
        meta: {title: '活动管理'}
      },{
        path: 'bargain',
        name: 'Bargain',
        component: () => import('src/views/activity/bargain'),
        meta: {title: '砍价'}
      },{
        path: 'timeLimitedSale',
        name: 'TimeLimitedSale',
        component: () => import('src/views/activity/timeLimitedSale'),
        meta: {title: '限时抢购'}
      },{
        path: 'groupPurchase',
        name: 'GroupPurchase',
        component: () => import('src/views/activity/groupPurchase'),
        meta: {title: '拼团'}
      },{
        path: 'coupon',
        name: 'Coupon',
        component: () => import('src/views/activity/coupon'),
        meta: {title: '优惠券'}
      },
    ]
  },

  {
    path: '/material',
    component: Layout,
    redirect: '/material/index',
    alwaysShow: true,
    name: 'Material',
    meta: {title: '素材'},
    children: [
      {
        path: 'index',
        name: 'MaterialIndex',
        component: () => import('src/views/material/index'),
        meta: {title: '素材', noCache: false, icon: 'yes'}
      },
      {
        path: 'classify',
        name: 'MaterialClassify',
        component: () => import('src/views/material/classify'),
        meta: {title: '素材分类'}
      },{
        path: 'commentAudit',
        name: 'CommentAudit',
        component: () => import('src/views/material/commentAudit'),
        meta: {title: '评论审核'}
      }
    ]
  },

  {
    path: '/nutritionist',
    component: Layout,
    name: 'Nutritionist',
    redirect: '/nutritionist/index',
    meta: {title: '营养师'},
    children: [
      {
        path: 'index',
        component: ()=> import('src/views/nutritionist/index'),
        name: 'NutritionistIndex',
        meta: {title: '营养师'}
      }
    ]
  },

  {
    path: '/statistic',
    component: Layout,
    name: 'Statistic',
    redirect: '/statistic/index',
    meta: {title: '数据统计'},
    children: [
      {
        path: 'index',
        component: ()=> import('src/views/statistic/index'),
        name: 'StatisticIndex',
        meta: {title: '数据统计'}
      }
    ]
  },
{
    path: '/setting',
    component: Layout,
    name: 'Setting',
    redirect: '/setting/auth',
    meta: {title: '数据统计'},
    children: [
      {
        path: 'auth',
        component: ()=> import('src/views/setting/auth'),
        name: 'Auth',
        meta: {title: '权限相关'}
      }
    ]
  },

];
/*export const asyncRouterMap2 = [
  {
    path: '/product',
    component: Layout,
    alwaysShow: true, //  当配置供应商只能看到所有商品时,所有商品会升级显示为1级菜单,加上这个还是能显示为二级
    redirect: '/product/index',
    name: 'Product',  //  有二级菜单的时候加下,面包屑就会显示 概览/一级菜单/二级
    meta: {title: '商品', icon: 'shangpin', roles: level1},
    children: [
      {
        path: 'index',
        name: 'ProductIndex',
        component: () => import('src/views/product/index'),
        meta: {title: '普通商品', icon: 'yes', noCache: false, roles: level1}
      }, {
        path: 'productEdit',
        name: 'ProductEdit',
        hidden: true,
        component: () => import('src/views/product/productEdit'),
        meta: {title: '商品编辑', icon: 'yes', noCache: false, roles: level1}
      },

      {
        path: 'productCategory',
        name: 'ProductCategory',
        component: () => import('src/views/product/productCategory'),
        meta: {title: '商品分类', icon: 'yes', noCache: true, roles: level2}
      },
      {
        path: 'productTag',
        name: 'ProductTag',
        component: () => import('src/views/product/productTag'),
        meta: {title: '场景和商品标签', icon: 'yes', noCache: true, roles: level2}
      },

      {
        path: 'productBrand',
        name: 'ProductBrand',
        component: () => import('src/views/product/productBrand'),
        meta: {title: '品牌和标签', icon: 'yes', noCache: true, roles: level2}
      },
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: 'order',
    alwaysShow: true,
    name: 'Order',
    meta: {title: '订单', icon: 'dingdan', roles: level1},
    children: [
      {
        path: 'allOrder',
        name: 'AllOrder',
        component: () => import('src/views/order/allOrder'),
        meta: {title: '所有订单', noCache: false, icon: 'yes', roles: level1}
      },

      {
        path: 'order',
        name: 'OrderIndex',
        component: () => import('src/views/order/index'),
        meta: {title: '普通订单', noCache: false, icon: 'yes', roles: level1}
      }, {
        path: 'orderDetail',
        name: 'OrderDetail',
        hidden: true,
        component: () => import('src/views/order/orderDetail'),
        meta: {title: '订单详情', noCache: true, roles: level1}
      },

      {
        path: 'actiOrder',
        name: 'ActiOrder',
        component: () => import('src/views/order/actiOrder'),
        meta: {title: '活动订单', noCache: false, icon: 'yes', roles: level1}
      },
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/distributor',
    alwaysShow: true,
    name: 'DistributorPa',
    meta: {title: '用户', icon: 'huiyuan', roles: level2},
    children: [
      {
        path: 'suppliers',
        name: 'Suppliers',
        component: () => import('src/views/user/suppliers'),
        meta: {title: '供应商', icon: 'yes', noCache: true, roles: level2}
      }, {
        path: 'supplierEdit',
        name: 'SupplierEdit',
        hidden: true,
        component: () => import('src/views/user/supplierEdit'),
        meta: {title: '供应商编辑', noCache: true, roles: level2}
      },
      {
        path: 'distributor',
        name: 'Distributor',
        component: () => import('src/views/user/distributor'),
        meta: {title: '分销商', icon: 'yes', noCache: true, roles: level2}
      },

      {
        path: 'user',
        name: 'User',
        component: () => import('src/views/user/user'),
        meta: {title: '消费者', icon: 'yes', noCache: true, roles: level2}
      },
    ]
  },

  {
    path: '/circle',
    component: Layout,
    redirect: 'circle',
    meta: {title: '圈子', icon: 'article', roles: level1},
    children: [
      {
        path: 'circle',
        name: 'CircleIndex',
        component: () => import('src/views/circle/index'),
        meta: {title: '圈子', noCache: true, icon: 'article', roles: level1}
      }, {
        path: 'editCircle',
        name: 'EditCircle',
        hidden: true,
        component: () => import('src/views/circle/editCircle'),
        meta: {title: '资讯编辑', noCache: false, roles: level1}
      }
    ]
  },

  {
    path: '/marketing',
    component: Layout,
    redirect: '/marketing/coupon',
    alwaysShow: true,
    name: 'Marketing',
    meta: {title: '营销', icon: 'yingxiaoshezhi', roles: level1},
    children: [
      {
        path: 'coupon',
        name: 'Coupon',
        component: () => import('src/views/marketing/coupon'),
        meta: {title: '优惠券', icon: 'yes', noCache: true, roles: level1}
      }, {
        path: 'editCoupon',
        name: 'EditCoupon',
        hidden: true,
        component: () => import('src/views/marketing/editCoupon'),
        meta: {title: '优惠券编辑', noCache: true, roles: level1}
      }, {
        path: 'attendance',
        name: 'Attendance',
        component: () => import('src/views/marketing/attendance'),
        meta: {title: '签到设置',icon: 'yes', noCache: true, roles: level2}
      }, {
        path: 'indexBanner',
        name: 'IndexBanner',
        component: () => import('src/views/marketing/indexBanner'),
        meta: {title: '首页轮播图', icon: 'yes', noCache: true, roles: level2}
      },
    ]
  },

  {
    path: '/commission',
    component: Layout,
    redirect: 'commission',
    alwaysShow: true,
    name: 'Commission',
    meta: {title: '佣金', icon: 'yongjin', roles: level2},
    children: [
      {
        path: 'commission',
        name: 'CommissionIndex',
        component: () => import('src/views/commission/index'),
        meta: {title: '佣金概览', icon: 'yes', noCache: true, roles: level2}
      }, {
        path: 'commissionSetting',
        name: 'CommissionSetting',
        component: () => import('src/views/commission/commissionSetting'),
        meta: {title: '佣金设置', icon: 'yes', noCache: true, roles: level2}
      },
    ]
  },

  {
    path: '/approval',
    component: Layout,
    alwaysShow: true,
    redirect: '/approval/withdrawAudit',
    name: 'Approval',
    meta: {title: '审批', icon: 'shenpi', roles: level1},
    children: [
      {
        path: 'withdrawAudit',
        name: 'WithdrawAudit',
        component: () => import('src/views/approval/withdrawAudit'),
        meta: {title: '提现审批', icon: 'yes', noCache: true, roles: level2}
      },
      {
        path: 'returnProductAudit',
        name: 'ReturnProductAudit',
        component: () => import('src/views/approval/returnProductAudit'),
        meta: {title: '退货审批', icon: 'yes', noCache: false, roles: level1}
      }, {
        path: 'returnProdOrderDetail',
        name: 'ReturnProdOrderDetail',
        hidden: true,
        component: () => import('src/views/approval/returnProdOrderDetail'),
        meta: {title: '退货订单详情', icon: 'yes', noCache: true, roles: level1}
      },
      {
        path: 'agentAudit',
        name: 'AgentAudit',
        component: () => import('src/views/approval/agentAudit'),
        meta: {title: '新代理商审批', icon: 'yes', noCache: true, roles: level2}
      }, {
        path: 'productAudit',
        name: 'ProductAudit',
        component: () => import('src/views/approval/productAudit'),
        meta: {title: '普通商品审批', icon: 'yes', noCache: true, roles: level2}
      }, {
        path: 'circleAudit',
        name: 'CircleAudit',
        component: () => import('src/views/approval/circleAudit'),
        meta: {title: '圈子审核', icon: 'yes', noCache: true, roles: level2}
      },

      //  活动
      {
        path: 'firstOrderActiAudit',
        name: 'FirstOrderActiAudit',
        component: () => import('src/views/approval/firstOrderActiAudit'),
        meta: {title: '新人首单活动商品审批', icon: 'yes', noCache: true, roles: level2}
      }, {
        path: 'guessActiAudit',
        name: 'GuessActiAudit',
        component: () => import('src/views/approval/guessActiAudit'),
        meta: {title: '每日竞猜活动商品审批', icon: 'yes', noCache: true, roles: level2}
      }, {
        path: 'magicGiftBoxAudit',
        name: 'MagicGiftBoxAudit',
        component: () => import('src/views/approval/magicGiftBoxAudit'),
        meta: {title: '魔术礼盒活动商品审批', icon: 'yes', noCache: true, roles: level2}
      }, {
        path: 'trialProductAudit',
        name: 'TrialProductAudit',
        component: () => import('src/views/approval/trialProductAudit'),
        meta: {title: '试用商品审批', icon: 'yes', noCache: true, roles: level2}
      },

      {
        path: 'activationCodeActi',
        name: 'ActivationCodeActi',
        component: () => import('src/views/approval/activationCodeActi'),
        meta: {title: '激活码审批', icon: 'yes', noCache: true, roles: level2}
      },

      {
        path: 'supplizerBalanceApplyAudit',
        name: 'SupplizerBalanceApplyAudit',
        component: () => import('src/views/approval/supplizerBalanceApplyAudit'),
        meta: {title: '供应商结算异常申请审批', icon: 'yes', noCache: true, roles: level2}
      },
    ]
  },

  {
    path: '/service',
    component: Layout,
    redirect: 'service',
    alwaysShow: true,
    meta: {title: '客服', icon: 'kefu', roles: level1},
    children: [
      {
        path: 'service',
        name: 'ServiceIndex',
        component: () => import('src/views/service/index'),
        meta: {title: '前台客服问答', noCache: true, roles: level2}
      },{
        path: 'backQuesAnswer',
        name: 'BackQuesAnswer',
        component: () => import('src/views/service/backQuesAnswer'),
        meta: {title: '后台客服问答', noCache: true,  roles: level2}
      },{
        path: 'platformRule',
        name: 'PlatformRule',
        component: () => import('src/views/service/platformRule'),
        meta: {title: '平台规则', noCache: true,  roles: level0}
      },
    ]
  },

  {
    path: '/activity',
    component: Layout,
    alwaysShow: true,
    redirect: '/activity/index',
    name: 'Activity',
    meta: {title: '活动', icon: 'huodong'},
    children: [
      {
        path: 'index',
        name: 'ActivityIndex',
        component: () => import('src/views/activity/index'),
        meta: {title: '活动管理', icon: 'yes', noCache: true, roles: level2}
      }, {
        path: 'firstOrder',
        name: 'FirstOrder',
        component: () => import('src/views/activity/firstOrder'),
        meta: {title: '新人首单', icon: 'yes', noCache: true, roles: level1}
      }, {
        path: 'guess',
        name: 'Guess',
        component: () => import('src/views/activity/guess'),
        meta: {title: '每日竞猜', icon: 'yes', noCache: true, roles: level1}
      }, {
        path: 'magicGiftBox',
        name: 'MagicGiftBox',
        component: () => import('src/views/activity/magicGiftBox'),
        meta: {title: '魔术礼盒', icon: 'yes', noCache: true, roles: level1}
      },
      {
        path: 'trialProduct',
        name: 'TrialProduct',
        component: () => import('src/views/activity/trialProduct'),
        meta: {title: '试用商品', icon: 'yes', noCache: true, roles: level1}
      }, {
        path: 'trialProductEdit',
        name: 'TrialProductEdit',
        hidden: true,
        component: () => import('src/views/activity/trialProductEdit'),
        meta: {title: '试用商品编辑', noCache: true, roles: level1}
      },

      //  供应商
      // {
      //   path: 'supplizerActi',
      //   name: 'SupplizerActi',
      //   component: () => import('src/views/activity/supplizerActi'),
      //   meta: {title: '活动',noCache: true, roles: level0}
      // },
    ]
  },

  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/index',
    name: 'Setting',
    alwaysShow: true,
    meta: {title: '配置', icon: 'shezhi', roles: level2},
    children: [
      {
        path: 'index',
        name: 'SettingIndex',
        component: () => import('src/views/setting/index'),
        meta: {title: '激活码收款', icon: 'yes', noCache: true, roles: level2}
      }, {
        path: 'manager',
        name: 'Manager',
        component: () => import('src/views/setting/manager'),
        meta: {title: '管理员', icon: 'yes', noCache: true, roles: level3}
      }, {
        path: 'approvalSetting',
        name: 'ApprovalSetting',
        component: () => import('src/views/setting/approvalSetting'),
        meta: {title: '审批流', icon: 'yes', noCache: false, roles: level3}
      },{
        path: 'noticeMaintain',
        name: 'NoticeMaintain',
        component: () => import('src/views/setting/noticeMaintain'),
        meta: {title: '通告', noCache: false, roles: level2},
      },
    ]
  },

  {
    path: '/personSetting',
    component: Layout,
    redirect: '/personSetting/withdraw',
    alwaysShow: true,
    // name: 'personSettingPa',
    meta: {title: '设置', icon: 'personSetting', roles: level0},
    children: [
      {
        path: 'personSetting',
        name: 'PersonSetting',
        component: () => import('src/views/personSetting/personSetting'),
        meta: {title: '商户信息', noCache: true, roles: level0}
      },{
        path: 'withdraw',
        name: 'Withdraw',
        component: () => import('src/views/personSetting/withdraw'),
        meta: {title: '提现', noCache: true, roles: level0}
      },{
        path: 'balance',
        name: 'Balance',
        component: () => import('src/views/personSetting/balance'),
        meta: {title: '结算', noCache: true, roles: level0}
      },
    ]
  },

  {path: '*', redirect: '/404', hidden: true},
]*/
