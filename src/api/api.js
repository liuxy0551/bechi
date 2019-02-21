import { wxRequest } from '@/utils/wxRequest';

const api = 'https://wahahaweb.lkfcni.cn:8100/traninsys/';
// const api = 'http://yuan.vaiwan.com/';

const getOpenid = params => wxRequest(params, api + 'portal/getOpenid');
const unifiedOrder = params => wxRequest(params, api + 'portal/unifiedOrder');

const login = params => wxRequest(params, api + 'portal/login');
const eidtPwd = params => wxRequest(params, api + 'portal/eidtPwd');
const getUser = params => wxRequest(params, api + 'portal/getUser');
const getCarouselList = params => wxRequest(params, api + 'portal/getCarouselList');

const getCourseList = params => wxRequest(params, api + 'portal/getCourseList');
const getCourseDetail = params => wxRequest(params, api + 'portal/getCourseDetail');
const getTitle = params => wxRequest(params, api + 'portal/getTitle');
const getMyCourseList = params => wxRequest(params, api + 'portal/getMyCourseList');
const getReportList = params => wxRequest(params, api + 'portal/getReportList');
const getElectiveCourseList = params => wxRequest(params, api + 'portal/getElectiveCourseList');
const delReport = params => wxRequest(params, api + 'portal/delReport');
const dropCourse = params => wxRequest(params, api + 'portal/dropCourse');
const addReport = params => wxRequest(params, api + 'portal/addReport');
const registerCourse = params => wxRequest(params, api + 'portal/registerCourse');
const cancelCourse = params => wxRequest(params, api + 'portal/cancelCourse');
const turnCourse = params => wxRequest(params, api + 'portal/turnCourse');
const turnCourseResult = params => wxRequest(params, api + 'portal/turnCourseResult');
const getCustomer = params => wxRequest(params, api + 'portal/getCustomer');
const decodeUserInfo = params => wxRequest(params, api + 'portal/decodeUserInfo');
const sendSms = params => wxRequest(params, api + 'sms/sendSms');
const refindPwd = params => wxRequest(params, api + 'portal/refindPwd');

export default {
  getOpenid,              // 获取openId
  unifiedOrder,           // 支付下单

  login,                  // 登录
  eidtPwd,                // 修改密码
  getUser,                // 获取登录用户信息
  getCarouselList,        // 获取轮播图

  getCourseList,          // 获取上架课程信息列表
  getCourseDetail,        // 获取课程详情
  getTitle,               // 获取一级主题列表
  getMyCourseList,        // 获取我的课程表
  getReportList,          // 获取补报记录
  getElectiveCourseList,  // 获取选课记录
  delReport,              // 取消补课申请
  dropCourse,             // 退课申请
  addReport,              // 补报课程
  registerCourse,         // 报名课程
  cancelCourse,           // 取消支付课程占位
  turnCourse,             // 转课
  turnCourseResult,       // 转课情况选择处理
  getCustomer,            // 获取客服列表
  decodeUserInfo,         // 解密微信用户信息
  sendSms,                // 发送短信
  refindPwd,              // 找回密码
}
