// CDN资源配置
// 将大图片资源移动到CDN，减少代码包体积
export const CDN_CONFIG = {
  // 导师头像
  TEACHER_AVATARS: {
    't1': '/images/joy.jpg',
    't2': '/images/joy.jpg',
    't3': '/images/joy.jpg',
    't4': '/images/joy.jpg',
    '1': 'https://picsum.photos/seed/teacher1/100/100.jpg',
    '2': 'https://picsum.photos/seed/teacher2/100/100.jpg',
    '3': 'https://picsum.photos/seed/teacher3/100/100.jpg',
    '4': 'https://picsum.photos/seed/teacher4/100/100.jpg',
    '5': 'https://picsum.photos/seed/teacher5/100/100.jpg',
    '6': 'https://picsum.photos/seed/teacher6/100/100.jpg'
  },
  
  // Banner图片
  BANNERS: [
    'https://picsum.photos/seed/fitness1/800/400.jpg',
    'https://picsum.photos/seed/yoga2/800/400.jpg',
    'https://picsum.photos/seed/gym3/800/400.jpg'
  ],
  
  // 课程相关图片
  COURSE_IMAGES: {
    'default': 'https://picsum.photos/seed/course/400/200.jpg'
  },
  
  // 门店图片
  STORE_IMAGES: {
    'nanshan': 'https://picsum.photos/seed/nanshan/400/300.jpg',
    'futian': 'https://picsum.photos/seed/futian/400/300.jpg',
    'baoan': 'https://picsum.photos/seed/baoan/400/300.jpg'
  }
}

// 获取CDN图片URL的工具函数
export function getCDNUrl(type: string, key: string) {
  switch (type) {
    case 'teacher':
      return CDN_CONFIG.TEACHER_AVATARS[key] || CDN_CONFIG.TEACHER_AVATARS['1']
    case 'banner':
      return CDN_CONFIG.BANNERS[parseInt(key)] || CDN_CONFIG.BANNERS[0]
    case 'course':
      return CDN_CONFIG.COURSE_IMAGES[key] || CDN_CONFIG.COURSE_IMAGES.default
    case 'store':
      return CDN_CONFIG.STORE_IMAGES[key] || CDN_CONFIG.STORE_IMAGES.nanshan
    default:
      return ''
  }
}