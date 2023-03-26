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
    // this.data.offset = 0;
    this.data.offset = this.data.drafts.length;

      wx.showLoading({
        title: '加载中',
      })
      
      await this.getDrafts();
  
      wx.hideLoading()
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
        if (!data.length) {
          wx.showToast({
            title: '数据加载完毕',
          })
          return;
        }
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
  },

  handleClick(e) {
    const draft = JSON.stringify(e.currentTarget.dataset.draft);
    console.log(draft)
    wx.navigateTo({
      url: `/pages/detail/index?draft=${draft}`
    })
  }
})