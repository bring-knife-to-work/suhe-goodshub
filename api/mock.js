// ==================== Mock Data ====================

// 首页轮播图
export const banners = [
  { id: 1, image: 'https://picsum.photos/750/300?random=1', link: '' },
  { id: 2, image: 'https://picsum.photos/750/300?random=2', link: '' },
  { id: 3, image: 'https://picsum.photos/750/300?random=3', link: '' }
]

// 分类数据
export const categories = [
  { id: 1, name: '推荐', icon: '🔥' },
  { id: 2, name: '女装', icon: '👗' },
  { id: 3, name: '男装', icon: '👔' },
  { id: 4, name: '鞋靴', icon: '👟' },
  { id: 5, name: '箱包', icon: '👜' },
  { id: 6, name: '配饰', icon: '💍' },
  { id: 7, name: '美妆', icon: '💄' },
  { id: 8, name: '数码', icon: '📱' },
  { id: 9, name: '家居', icon: '🏠' },
  { id: 10, name: '食品', icon: '🍜' },
  { id: 11, name: '母婴', icon: '🍼' },
  { id: 12, name: '运动', icon: '⚽' }
]

// 二级分类
export const subCategories = {
  2: [
    { id: 21, name: '连衣裙' },
    { id: 22, name: 'T恤' },
    { id: 23, name: '衬衫' },
    { id: 24, name: '外套' },
    { id: 25, name: '针织衫' },
    { id: 26, name: '半身裙' }
  ],
  3: [
    { id: 31, name: '衬衫' },
    { id: 32, name: 'T恤' },
    { id: 33, name: '西装' },
    { id: 34, name: '夹克' },
    { id: 35, name: '牛仔裤' },
    { id: 36, name: '休闲裤' }
  ],
  4: [
    { id: 41, name: '运动鞋' },
    { id: 42, name: '皮鞋' },
    { id: 43, name: '凉鞋' },
    { id: 44, name: '拖鞋' },
    { id: 45, name: '靴子' }
  ],
  5: [
    { id: 51, name: '双肩包' },
    { id: 52, name: '手提包' },
    { id: 53, name: '斜挎包' },
    { id: 54, name: '钱包' },
    { id: 55, name: '行李箱' }
  ]
}

// 商品数据生成
const goodsImages = [
  'https://picsum.photos/400/400?random=10',
  'https://picsum.photos/400/400?random=11',
  'https://picsum.photos/400/400?random=12',
  'https://picsum.photos/400/400?random=13',
  'https://picsum.photos/400/400?random=14',
  'https://picsum.photos/400/400?random=15',
  'https://picsum.photos/400/400?random=16',
  'https://picsum.photos/400/400?random=17',
  'https://picsum.photos/400/400?random=18',
  'https://picsum.photos/400/400?random=19'
]

const goodsNames = [
  '简约纯棉圆领T恤 舒适百搭上衣',
  '韩版高腰A字半身裙 显瘦气质',
  '商务休闲修身西装外套',
  '复古做旧牛仔裤 百搭直筒裤',
  '舒适透气运动鞋 轻盈缓震',
  '真皮手提斜挎两用包 大容量',
  '时尚百搭小白鞋 经典款',
  '日系棉麻衬衫 文艺清新',
  '简约石英手表 防水学生表',
  '真无线蓝牙耳机 降噪HIFI音质'
]

const goodsDescs = [
  '精选优质长绒棉面料，亲肤透气，版型挺括不易变形。基础百搭款，衣橱必备单品。',
  '高腰A字版型设计，有效修饰身材比例。优质面料，垂感好不易皱，优雅有气质。',
  '精选高品质面料，版型挺括有型。经典平驳领设计，适合商务和日常穿着。',
  '复古水洗工艺处理，做旧效果独特。直筒版型不挑身材，百搭好穿。',
  '采用轻量化EVA鞋底，柔软缓震。透气飞织鞋面，舒适不闷脚。',
  '精选头层牛皮，手感柔软细腻。大容量设计，通勤出行必备。',
  '经典小白鞋款式，百搭不过时。优质皮革面料，舒适耐磨。',
  '精选优质棉麻面料，透气舒适。简约设计，文艺范十足。',
  '简约表盘设计，质感出众。日本机芯，走时精准。30米生活防水。',
  '蓝牙5.3芯片，连接稳定低延迟。13mm动圈单元，音质出色。'
]

let goodsIdCounter = 100
export function generateGoods(categoryId = 1, start = 0, count = 10) {
  const items = []
  for (let i = 0; i < count; i++) {
    const idx = (start + i) % goodsNames.length
    items.push({
      goodsId: goodsIdCounter++,
      name: goodsNames[idx],
      desc: goodsDescs[idx],
      image: goodsImages[idx] + '&t=' + (start + i),
      images: [goodsImages[idx], goodsImages[(idx + 1) % goodsImages.length], goodsImages[(idx + 2) % goodsImages.length]],
      price: parseFloat((Math.random() * 500 + 29).toFixed(2)),
      originalPrice: parseFloat((Math.random() * 800 + 100).toFixed(2)),
      sales: Math.floor(Math.random() * 10000),
      stock: Math.floor(Math.random() * 500 + 50),
      categoryId: categoryId,
      specs: ['颜色：白色', '颜色：黑色', '颜色：蓝色'],
      rating: (Math.random() * 2 + 3).toFixed(1)
    })
  }
  return items
}

// 首页推荐商品
export const recommendGoods = generateGoods(1, 0, 6)

// 限时秒杀
export const flashSales = generateGoods(1, 10, 4).map(g => ({
  ...g,
  price: parseFloat((g.price * 0.5).toFixed(2)),
  flashEndTime: Date.now() + 2 * 60 * 60 * 1000 // 2小时后结束
}))

// 订单数据
export const orderStatusMap = {
  0: '待付款',
  1: '待发货',
  2: '待收货',
  3: '待评价',
  4: '已完成',
  '-1': '已取消'
}

export function generateOrders(count = 5) {
  const orders = []
  const statuses = [0, 1, 2, 3, 4]
  for (let i = 0; i < count; i++) {
    const goodsCount = Math.floor(Math.random() * 3) + 1
    const items = []
    let totalAmount = 0
    for (let j = 0; j < goodsCount; j++) {
      const g = generateGoods(1, i * 10 + j, 1)[0]
      g.count = Math.floor(Math.random() * 3) + 1
      items.push(g)
      totalAmount += g.price * g.count
    }
    orders.push({
      orderId: 200000 + i,
      orderNo: 'ORD' + Date.now().toString().slice(-8) + i,
      status: statuses[i % statuses.length],
      statusText: orderStatusMap[statuses[i % statuses.length]],
      items,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      freight: i % 2 === 0 ? 0 : 8,
      createTime: new Date(Date.now() - i * 86400000).toLocaleString('zh-CN'),
      address: {
        name: '张三',
        phone: '13800138000',
        address: '北京市朝阳区建国路88号SOHO现代城A座1208'
      }
    })
  }
  return orders
}

// 地址数据
export const addresses = [
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '建国路88号SOHO现代城A座1208',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detail: '陆家嘴金融中心B座2301',
    isDefault: false
  }
]
