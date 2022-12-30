// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 获取设计稿
exports.main = async (event, context) => {
  const { offset, limit = 5 } = event;
  const { data } = await db.collection('draft').skip(offset).limit(limit).get();
  const { total } = await db.collection('draft').count();
  return {
    data,
    total
  };
}