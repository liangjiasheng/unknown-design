Page({

  data: {
    drafts: [],
    banners: [],
    total: 0,
    loading: true,
    offset: 0
  },

  
  async onLoad() {
    await Promise.allSettled([this.getDrafts(), this.getBanners()])
    this.setData({
      loading: false
    });
  },

   /**
     * 页面上拉触底事件的处理函数
     */
  async onReachBottom() {
    if (this.data.drafts.length < this.data.total) {
      this.data.offset = this.data.drafts.length + 1;

      wx.showLoading({
        title: '加载中',
      })
      
      await this.getDrafts();
  
      wx.hideLoading()
    }
  },
  handleOpenBusinessView() {
    wx.openBusinessView({
      businessType: 'weappOrderConfirm',
      envVersion: 'develop',
      extraData: {
        transaction_id: 'fake-transid-6389ac5e-718890c0-7dfdc6f0'
      }
    })
  },
  getDrafts() {
    // 云函数获取数据
    return wx.cloud.callFunction({
      // 云函数名称
      name: 'getDrafts',
      data: {
        offset: this.data.offset
      }
    })
    .then(res => {
      if (res) {
        const {result: {data, total}} = res;
        console.log('云函数getDrafts获取数据成功' , res)
        this.setData({
          drafts: [...this.data.drafts, ...data],
          total
        });
      }
    })
    .catch(err => {
      console.log('云函数getDrafts获取数据失败' , err)
    })
  },
  getBanners() {
    // 云函数获取数据
    return wx.cloud.callFunction({
      // 云函数名称
      name: 'getBanners'
    })
    .then(res => {
      if (res) {
        const {result: {data}} = res;
        console.log('云函数getBanners获取数据成功' , data)
        this.setData({
          banners: data
        });
      }
    })
    .catch(err => {
      console.log('云函数getBanners获取数据失败' , err)
    })
  }
})