// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 获取轮播图
exports.main = async (event, context) => {
  return db.collection('banner').get();
}