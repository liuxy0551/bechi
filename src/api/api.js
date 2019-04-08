import { wxRequest } from '@/utils/wxRequest';

const api = 'https://bechi.lkfcni.cn/api/v1/';

const upload = params => wxRequest(params, api + 'file/upload');

const getCategory = params => wxRequest(params, api + 'category/get');
const getArea = params => wxRequest(params, api + 'area/get');
const getProducts = params => wxRequest(params, api + 'product/list');
const getProduct = params => wxRequest(params, api + 'product/get');

const createGroupbuying = params => wxRequest(params, api + 'groupbuying/create');
const getGroupbuyings = params => wxRequest(params, api + 'groupbuying/list');
const startGroupbuyings = params => wxRequest(params, api + 'groupbuying/start');
const joinGroupbuyings = params => wxRequest(params, api + 'groupbuying/join');
const getGroupbuyingsByProduct = params => wxRequest(params, api + 'groupbuying/list_groupbuyingitems');

const getMaterials = params => wxRequest(params, api + 'material/list_category');

export default {
  upload,                    // 上传图片/视频

  getCategory,               // 获取商品分类
  getArea,                   // 获取商品专区
  getProducts,               // 获取商品列表
  getProduct,                // 获取商品详情

  createGroupbuying,         // 商品参与拼团
  getGroupbuyings,           // 获取拼团商品列表
  startGroupbuyings,         // 发起拼团
  joinGroupbuyings,          // 加入拼团
  getGroupbuyingsByProduct,  // 获取商品下所有拼团队伍

  getMaterials,              // 获取素材（营养师）分类
}
