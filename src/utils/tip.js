/**
 * 提示与加载工具类
 */
export default class Tips {
  constructor() {
    this.isLoading = false;
  }

  // 成功提示
  static success(title, onHide) {
    wx.showToast({
      title: title,
      icon: 'success',
      mask: true,
    });
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide()
      }, 500)
    }
  }

  // 错误提示
  static error(title, onHide) {
    wx.showToast({
      title: title,
      image: "/images/error.png",
      mask: true,
      duration: 2500
    });
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide()
      }, 500)
    }
  }

  // 加载中
  static loading(title = "加载中") {
    if (Tips.isLoading) {
      return
    }
    Tips.isLoading = true;
    wx.showLoading({
      title: title,
      mask: true
    })
  }

  // 加载完毕
  static loaded() {
    if (Tips.isLoading) {
      Tips.isLoading = false;
      wx.hideLoading()
    }
  }
}

/**
 * 静态变量，是否加载中
 */
Tips.isLoading = false;
