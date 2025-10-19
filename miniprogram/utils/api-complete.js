/**
 * Complete WeChat Mini Program API Module
 * This is a working JavaScript version of the api.ts module
 */

/**
 * GET请求
 */
function get(url, params, options) {
  return new Promise(function(resolve, reject) {
    // 添加基础URL或使用模拟数据
    var fullUrl = url;
    if (url.startsWith('/api/') || url.startsWith('/auth/')) {
      // 在开发环境中使用模拟数据
      if (typeof wx !== 'undefined') {
        // 微信小程序环境，返回模拟数据
        resolve(getMockData(url, params));
        return;
      } else {
        // 测试环境
        console.log('GET request:', url, params);
        resolve(getMockData(url, params));
        return;
      }
    }
    
    var requestOptions = {
      url: fullUrl,
      method: 'GET',
      data: params,
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('Request failed: ' + res.statusCode));
        }
      },
      fail: function(err) {
        reject(err);
      }
    };
    
    if (options) {
      Object.assign(requestOptions, options);
    }
    
    if (typeof wx !== 'undefined') {
      wx.request(requestOptions);
    }
  });
}

/**
 * POST请求
 */
function post(url, data, options) {
  return new Promise(function(resolve, reject) {
    // 添加基础URL或使用模拟数据
    var fullUrl = url;
    if (url.startsWith('/api/') || url.startsWith('/auth/')) {
      // 在开发环境中使用模拟数据
      if (typeof wx !== 'undefined') {
        // 微信小程序环境，返回模拟数据
        resolve(getMockData(url, data));
        return;
      } else {
        // 测试环境
        console.log('POST request:', url, data);
        resolve(getMockData(url, data));
        return;
      }
    }
    
    var requestOptions = {
      url: fullUrl,
      method: 'POST',
      data: data,
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('Request failed: ' + res.statusCode));
        }
      },
      fail: function(err) {
        reject(err);
      }
    };
    
    if (options) {
      Object.assign(requestOptions, options);
    }
    
    if (typeof wx !== 'undefined') {
      wx.request(requestOptions);
    }
  });
}

/**
 * 获取模拟数据
 */
function getMockData(url, params) {
  // 引入CDN配置
  const { CDN_CONFIG } = require('./cdn-config.js');
  
  switch(url) {
    case '/auth/wx-login':
      return {
        token: 'mock_token_' + Date.now(),
        userInfo: {
          ...params.userInfo,
          userId: 'user_' + Date.now(),
          remainingClasses: {
            '爵士舞': 5,
            '韩舞': 3
          }
        }
      };
    case '/api/stores':
      return [
        {
          id: 1,
          name: 'Home 24H Studio',
          address: '石厦北二街新天世纪a座614',
          phone: '19925187494',
          latitude: 22.5218025,
          longitude: 114.0532133,
          openTime: '10:30',
          closeTime: '22:00'
        },
        {
          id: 2,
          name: '福田店',
          address: '石厦北二街新天世纪a座614',
          phone: '19925187494',
          latitude: 22.5474,
          longitude: 114.0595,
          openTime: '10:30',
          closeTime: '22:00'
        }
      ];
      
    case '/api/teachers':
      console.log('API: 获取导师列表')
      const teachers = [
        {
          teacherId: '1',
          name: '张教练',
          avatar: '/images/joy.jpg',
          specialty: '瑜伽',
          experience: '5年',
          rating: 4.8,
          intro: '专业瑜伽教练，擅长多种瑜伽流派'
        },
        {
          teacherId: '2',
          name: '李教练',
          avatar: '/images/joy.jpg',
          specialty: '健身',
          experience: '8年',
          rating: 4.9,
          intro: '资深健身教练，专注于力量训练'
        },
        {
          teacherId: '3',
          name: '王教练',
          avatar: '/images/joy.jpg',
          specialty: '游泳',
          experience: '6年',
          rating: 4.7,
          intro: '专业游泳教练，擅长各种泳姿教学'
        },
        {
          teacherId: '4',
          name: '刘教练',
          avatar: '/images/joy.jpg',
          specialty: '舞蹈',
          experience: '4年',
          rating: 4.8,
          intro: '舞蹈教练，精通多种舞蹈风格'
        },
        {
          teacherId: '5',
          name: '陈教练',
          avatar: '/images/joy.jpg',
          specialty: '拳击',
          experience: '7年',
          rating: 4.9,
          intro: '专业拳击教练，注重实战技巧'
        },
        {
          teacherId: '6',
          name: '赵教练',
          avatar: '/images/joy.jpg',
          specialty: '普拉提',
          experience: '5年',
          rating: 4.7,
          intro: '普拉提教练，专注于核心训练'
        }
      ];
      
      console.log('API: 返回导师列表:', teachers)
      return teachers;
        
    case '/api/teachers/t1':
      return {
        teacherId: 't1',
        name: 'BOA',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=200&h=200&fit=crop&crop=face',
        danceTypes: ['jazz', 'kpop'],
        specialties: ['爵士舞基础', '韩舞编舞'],
        experience: '5年',
        rating: 4.8,
        classCount: 156,
        intro: '专业爵士舞和韩舞导师，擅长基础教学和编舞创作',
        store: 'nanshan'
      };
      
    case '/api/teachers/t2':
      return {
        teacherId: 't2',
        name: 'QURY',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        danceTypes: ['hiphop'],
        specialties: ['街舞基础', 'Freestyle'],
        experience: '8年',
        rating: 4.7,
        classCount: 203,
        intro: '资深街舞导师，擅长各种街舞风格和Freestyle',
        store: 'futian'
      };
      
    case '/api/teachers/t3':
      return {
        teacherId: 't3',
        name: 'LISA',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        danceTypes: ['kpop', 'waacking'],
        specialties: ['韩舞女团', 'Waacking技巧'],
        experience: '6年',
        rating: 4.9,
        classCount: 178,
        intro: '韩舞和Waacking专业导师，女团风格教学专家',
        store: 'nanshan'
      };
      
    case '/api/teachers/t4':
      return {
        teacherId: 't4',
        name: 'MIKE',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        danceTypes: ['jazz', 'hiphop'],
        specialties: ['爵士舞进阶', '街舞融合'],
        experience: '7年',
        rating: 4.6,
        classCount: 142,
        intro: '爵士舞和街舞融合创新导师，擅长多元化风格教学',
        store: 'baoan'
      };
      
    case '/api/teachers/1':
    case '/api/teachers/t1':
      console.log('API: 获取导师详情，ID: 1')
      const teacher1 = {
        teacherId: '1',
        name: '张教练',
        avatar: CDN_CONFIG.TEACHER_AVATARS['1'],
        danceTypes: ['瑜伽'],
        specialties: ['哈他瑜伽', '流瑜伽'],
        experience: '5年',
        rating: 4.8,
        classCount: 156,
        intro: '专业瑜伽教练，擅长多种瑜伽流派'
      };
      console.log('API: 返回导师详情:', teacher1)
      return teacher1;
      
    case '/api/teachers/2':
    case '/api/teachers/t2':
      console.log('API: 获取导师详情，ID: 2')
      const teacher2 = {
        teacherId: '2',
        name: '李教练',
        avatar: CDN_CONFIG.TEACHER_AVATARS['2'],
        danceTypes: ['健身'],
        specialties: ['力量训练', '体能训练'],
        experience: '8年',
        rating: 4.9,
        classCount: 203,
        intro: '资深健身教练，专注于力量训练'
      };
      console.log('API: 返回导师详情:', teacher2)
      return teacher2;
      
    case '/api/teachers/3':
    case '/api/teachers/t3':
      return {
        teacherId: '3',
        name: '王教练',
        avatar: CDN_CONFIG.TEACHER_AVATARS['3'],
        danceTypes: ['游泳'],
        specialties: ['自由泳', '蛙泳'],
        experience: '6年',
        rating: 4.7,
        classCount: 178,
        intro: '专业游泳教练，擅长各种泳姿教学'
      };
      
    case '/api/teachers/4':
    case '/api/teachers/t4':
      return {
        teacherId: '4',
        name: '刘教练',
        avatar: CDN_CONFIG.TEACHER_AVATARS['4'],
        danceTypes: ['舞蹈'],
        specialties: ['现代舞', '民族舞'],
        experience: '4年',
        rating: 4.8,
        classCount: 142,
        intro: '舞蹈教练，精通多种舞蹈风格'
      };
      
    case '/api/teachers/5':
    case '/api/teachers/t5':
      return {
        teacherId: '5',
        name: '陈教练',
        avatar: CDN_CONFIG.TEACHER_AVATARS['5'],
        danceTypes: ['拳击'],
        specialties: ['拳击基础', '实战技巧'],
        experience: '7年',
        rating: 4.9,
        classCount: 189,
        intro: '专业拳击教练，注重实战技巧'
      };
      
    case '/api/teachers/6':
    case '/api/teachers/t6':
      return {
        teacherId: '6',
        name: '赵教练',
        avatar: CDN_CONFIG.TEACHER_AVATARS['6'],
        danceTypes: ['普拉提'],
        specialties: ['垫上普拉提', '器械普拉提'],
        experience: '5年',
        rating: 4.7,
        classCount: 167,
        intro: '普拉提教练，专注于核心训练'
      };
      
    case '/api/teachers/1/courses':
    case '/api/teachers/t1/courses':
    case '/api/teachers/2/courses':
    case '/api/teachers/t2/courses':
    case '/api/teachers/3/courses':
    case '/api/teachers/t3/courses':
    case '/api/teachers/4/courses':
    case '/api/teachers/t4/courses':
    case '/api/teachers/5/courses':
    case '/api/teachers/t5/courses':
    case '/api/teachers/6/courses':
    case '/api/teachers/t6/courses':
      var teacherId = url.split('/')[3];
      // 处理带t前缀的ID，如't1'转换为'1'
      if (teacherId.startsWith('t')) {
        teacherId = teacherId.substring(1);
      }
      var today = new Date().toISOString().split('T')[0];
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      var courses = [];
      
      if (teacherId === '1') {
        courses = [
          {
            courseId: 'c1',
            name: '哈他瑜伽',
            date: today,
            startTime: '19:00',
            endTime: '20:30',
            danceTypeName: '瑜伽',
            difficulty: 2,
            capacity: 20,
            bookedCount: 12,
            price: 98,
            description: '适合初学者的哈他瑜伽课程',
            storeName: '南山店',
            duration: 90
          },
          {
            courseId: 'c2',
            name: '流瑜伽',
            date: tomorrowStr,
            startTime: '14:00',
            endTime: '15:30',
            danceTypeName: '瑜伽',
            difficulty: 3,
            capacity: 15,
            bookedCount: 8,
            price: 108,
            description: '流瑜伽进阶课程',
            storeName: '南山店',
            duration: 90
          }
        ];
      } else if (teacherId === '2') {
        courses = [
          {
            courseId: 'c3',
            name: '力量训练基础',
            date: today,
            startTime: '10:00',
            endTime: '11:30',
            danceTypeName: '健身',
            difficulty: 1,
            capacity: 25,
            bookedCount: 18,
            price: 88,
            description: '力量训练基础入门课程',
            storeName: '南山店',
            duration: 90
          },
          {
            courseId: 'c4',
            name: '体能训练',
            date: tomorrowStr,
            startTime: '16:00',
            endTime: '17:30',
            danceTypeName: '健身',
            difficulty: 4,
            capacity: 12,
            bookedCount: 10,
            price: 128,
            description: '提升体能训练技巧',
            storeName: '南山店',
            duration: 90
          }
        ];
      } else if (teacherId === '3') {
        courses = [
          {
            courseId: 'c5',
            name: '自由泳技巧',
            date: today,
            startTime: '19:00',
            endTime: '20:30',
            danceTypeName: '游泳',
            difficulty: 3,
            capacity: 18,
            bookedCount: 15,
            price: 118,
            description: '自由泳技巧教学',
            storeName: '福田店',
            duration: 90
          },
          {
            courseId: 'c6',
            name: '蛙泳基础',
            date: tomorrowStr,
            startTime: '10:00',
            endTime: '11:30',
            danceTypeName: '游泳',
            difficulty: 3,
            capacity: 15,
            bookedCount: 9,
            price: 108,
            description: '蛙泳基础技巧',
            storeName: '福田店',
            duration: 90
          }
        ];
      } else if (teacherId === '4') {
        courses = [
          {
            courseId: 'c7',
            name: '现代舞基础',
            date: today,
            startTime: '14:00',
            endTime: '15:30',
            danceTypeName: '舞蹈',
            difficulty: 4,
            capacity: 15,
            bookedCount: 12,
            price: 128,
            description: '现代舞基础技巧',
            storeName: '福田店',
            duration: 90
          },
          {
            courseId: 'c8',
            name: '民族舞进阶',
            date: tomorrowStr,
            startTime: '19:00',
            endTime: '20:30',
            danceTypeName: '舞蹈',
            difficulty: 4,
            capacity: 12,
            bookedCount: 8,
            price: 138,
            description: '民族舞进阶课程',
            storeName: '福田店',
            duration: 90
          }
        ];
      } else if (teacherId === '5') {
        courses = [
          {
            courseId: 'c9',
            name: '拳击基础',
            date: today,
            startTime: '10:00',
            endTime: '11:30',
            danceTypeName: '拳击',
            difficulty: 2,
            capacity: 20,
            bookedCount: 15,
            price: 98,
            description: '拳击基础入门课程',
            storeName: '宝安店',
            duration: 90
          },
          {
            courseId: 'c10',
            name: '实战技巧',
            date: tomorrowStr,
            startTime: '16:00',
            endTime: '17:30',
            danceTypeName: '拳击',
            difficulty: 4,
            capacity: 10,
            bookedCount: 8,
            price: 138,
            description: '拳击实战技巧训练',
            storeName: '宝安店',
            duration: 90
          }
        ];
      } else if (teacherId === '6') {
        courses = [
          {
            courseId: 'c11',
            name: '垫上普拉提',
            date: today,
            startTime: '19:00',
            endTime: '20:30',
            danceTypeName: '普拉提',
            difficulty: 3,
            capacity: 15,
            bookedCount: 12,
            price: 118,
            description: '垫上普拉提基础课程',
            storeName: '宝安店',
            duration: 90
          },
          {
            courseId: 'c12',
            name: '器械普拉提',
            date: tomorrowStr,
            startTime: '10:00',
            endTime: '11:30',
            danceTypeName: '普拉提',
            difficulty: 4,
            capacity: 12,
            bookedCount: 9,
            price: 138,
            description: '器械普拉提进阶课程',
            storeName: '宝安店',
            duration: 90
          }
        ];
      }
      
      // 返回分页格式
      let coursesPage = params && params.page ? params.page : 1;
      let coursesLimit = params && params.limit ? params.limit : 10;
      let coursesStart = (coursesPage - 1) * coursesLimit;
      let coursesEnd = coursesStart + coursesLimit;
      
      return {
        list: courses.slice(coursesStart, coursesEnd),
        total: courses.length,
        page: coursesPage,
        limit: coursesLimit,
        hasMore: coursesEnd < courses.length
      };
      
    case '/api/admin/teachers':
      console.log('API: 获取管理员导师列表')
      const adminTeachers = [
        {
          teacherId: 't1',
          name: 'BOA',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=200&h=200&fit=crop&crop=face',
          phone: '13800138001',
          danceTypes: ['jazz', 'kpop'],
          stores: ['nanshan', 'futian'],
          introduction: '专业爵士舞和韩舞导师，擅长基础教学和编舞创作',
          experience: 5,
          rating: 4.8,
          classCount: 156,
          status: 'active',
          createTime: '2023-01-15T10:00:00Z',
          updateTime: '2023-10-18T15:30:00Z'
        },
        {
          teacherId: 't2',
          name: 'QURY',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          phone: '13800138002',
          danceTypes: ['hiphop'],
          stores: ['futian'],
          introduction: '资深街舞导师，擅长各种街舞风格和Freestyle',
          experience: 8,
          rating: 4.7,
          classCount: 203,
          status: 'active',
          createTime: '2023-02-20T14:30:00Z',
          updateTime: '2023-10-16T09:15:00Z'
        },
        {
          teacherId: 't3',
          name: 'LISA',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
          phone: '13800138003',
          danceTypes: ['kpop', 'waacking'],
          stores: ['nanshan', 'baoan'],
          introduction: '韩舞和Waacking专业导师，女团风格教学专家',
          experience: 6,
          rating: 4.9,
          classCount: 178,
          status: 'active',
          createTime: '2023-03-10T11:20:00Z',
          updateTime: '2023-10-17T16:45:00Z'
        },
        {
          teacherId: 't4',
          name: 'MIKE',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
          phone: '13800138004',
          danceTypes: ['jazz', 'hiphop'],
          stores: ['baoan'],
          introduction: '爵士舞和街舞融合创新导师，擅长多元化风格教学',
          experience: 7,
          rating: 4.6,
          classCount: 142,
          status: 'inactive',
          createTime: '2023-04-05T16:40:00Z',
          updateTime: '2023-10-15T12:20:00Z'
        }
      ];
      
      // 根据参数筛选
      let filteredAdminTeachers = adminTeachers;
      if (params) {
        if (params.storeId && params.storeId !== 'all') {
          filteredAdminTeachers = filteredAdminTeachers.filter(teacher => 
            teacher.stores.includes(params.storeId)
          );
        }
        
        if (params.status && params.status !== 'all') {
          filteredAdminTeachers = filteredAdminTeachers.filter(teacher => 
            teacher.status === params.status
          );
        }
        
        if (params.keyword) {
          const keyword = params.keyword.toLowerCase();
          filteredAdminTeachers = filteredAdminTeachers.filter(teacher => 
            teacher.name.toLowerCase().includes(keyword) ||
            teacher.phone.includes(keyword)
          );
        }
      }
      
      // 分页处理
      const adminPage = params && params.page ? params.page : 1;
      const adminLimit = params && params.limit ? params.limit : 10;
      const adminStart = (adminPage - 1) * adminLimit;
      const adminEnd = adminStart + adminLimit;
      
      console.log('API: 返回管理员导师列表:', filteredAdminTeachers.slice(adminStart, adminEnd))
      return {
        list: filteredAdminTeachers.slice(adminStart, adminEnd),
        total: filteredAdminTeachers.length,
        page: adminPage,
        limit: adminLimit,
        hasMore: adminEnd < filteredAdminTeachers.length
      };
      
    case '/api/admin/teacher/t1':
    case '/api/admin/teacher/t2':
    case '/api/admin/teacher/t3':
    case '/api/admin/teacher/t4':
      const adminTeacherId = url.split('/')[4];
      const adminTeacherDetails = {
        't1': {
          teacherId: 't1',
          name: 'BOA',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=200&h=200&fit=crop&crop=face',
          phone: '13800138001',
          danceTypes: ['jazz', 'kpop'],
          stores: ['nanshan', 'futian'],
          introduction: '专业爵士舞和韩舞导师，擅长基础教学和编舞创作。拥有丰富的教学经验，曾获得多项舞蹈比赛奖项。',
          experience: 5,
          rating: 4.8,
          classCount: 156,
          status: 'active',
          createTime: '2023-01-15T10:00:00Z',
          updateTime: '2023-10-18T15:30:00Z'
        },
        't2': {
          teacherId: 't2',
          name: 'QURY',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          phone: '13800138002',
          danceTypes: ['hiphop'],
          stores: ['futian'],
          introduction: '资深街舞导师，擅长各种街舞风格和Freestyle。多年教学经验，能够因材施教。',
          experience: 8,
          rating: 4.7,
          classCount: 203,
          status: 'active',
          createTime: '2023-02-20T14:30:00Z',
          updateTime: '2023-10-16T09:15:00Z'
        },
        't3': {
          teacherId: 't3',
          name: 'LISA',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
          phone: '13800138003',
          danceTypes: ['kpop', 'waacking'],
          stores: ['nanshan', 'baoan'],
          introduction: '韩舞和Waacking专业导师，女团风格教学专家。擅长学员舞台表现力培养。',
          experience: 6,
          rating: 4.9,
          classCount: 178,
          status: 'active',
          createTime: '2023-03-10T11:20:00Z',
          updateTime: '2023-10-17T16:45:00Z'
        },
        't4': {
          teacherId: 't4',
          name: 'MIKE',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
          phone: '13800138004',
          danceTypes: ['jazz', 'hiphop'],
          stores: ['baoan'],
          introduction: '爵士舞和街舞融合创新导师，擅长多元化风格教学。注重学员基本功训练。',
          experience: 7,
          rating: 4.6,
          classCount: 142,
          status: 'inactive',
          createTime: '2023-04-05T16:40:00Z',
          updateTime: '2023-10-15T12:20:00Z'
        }
      };
      
      return adminTeacherDetails[adminTeacherId] || null;
      
    case '/api/admin/teacher':
      // 创建导师
      const newTeacherData = {
        ...params,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        classCount: 0
      };
      
      // 处理头像存储到云数据库
      if (newTeacherData.avatar && newTeacherData.avatar.type === 'image') {
        // 云数据库自动处理图片存储
        newTeacherData.avatar = `https://cloud.tencent.com/images/teacher_${Date.now()}.jpg`;
      }
      
      const newTeacher = {
        teacherId: 't' + Date.now(),
        ...newTeacherData
      };
      
      return {
        success: true,
        teacher: newTeacher,
        message: '导师创建成功'
      };
      
    case '/api/admin/teacher/t1/update':
    case '/api/admin/teacher/t2/update':
    case '/api/admin/teacher/t3/update':
    case '/api/admin/teacher/t4/update':
    case '/api/admin/teacher/t5/update':
      // 更新导师
      const teacherIdToUpdate = url.split('/')[4];
      const updatedTeacherData = {
        ...params,
        updateTime: new Date().toISOString()
      };
      
      // 处理头像存储到云数据库
      if (updatedTeacherData.avatar && updatedTeacherData.avatar.type === 'image') {
        // 云数据库自动处理图片存储
        updatedTeacherData.avatar = `https://cloud.tencent.com/images/teacher_${teacherIdToUpdate}_${Date.now()}.jpg`;
      }
      
      return {
        success: true,
        message: '导师信息更新成功',
        teacher: {
          teacherId: teacherIdToUpdate,
          ...updatedTeacherData
        }
      };
      
    case '/api/admin/teacher/t1/delete':
    case '/api/admin/teacher/t2/delete':
    case '/api/admin/teacher/t3/delete':
    case '/api/admin/teacher/t4/delete':
    case '/api/admin/teacher/t5/delete':
      // 删除导师
      return {
        success: true,
        message: '导师删除成功'
      };
      
    case '/api/admin/teacher/t1/status':
    case '/api/admin/teacher/t2/status':
    case '/api/admin/teacher/t3/status':
    case '/api/admin/teacher/t4/status':
    case '/api/admin/teacher/t5/status':
      // 更新导师状态
      return {
        success: true,
        message: params.status === 'active' ? '导师已启用' : '导师已禁用',
        status: params.status
      };
      
    case '/api/admin/courses':
    case '/api/courses':
      var today = new Date().toISOString().split('T')[0];
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var tomorrowStr = tomorrow.toISOString().split('T')[0];
      var dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      var dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];
      
      var courses = [
        // 今天课程
        {
          id: 1,
          name: '瑜伽基础班',
          date: today,
          startTime: '09:00',
          endTime: '10:00',
          teacherId: '1',
          teacherName: '张教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 1,
          storeName: '南山店',
          capacity: 20,
          bookedCount: 12,
          price: 88,
          description: '适合初学者的瑜伽课程',
          danceTypeName: '瑜伽',
          difficulty: 1
        },
        {
          id: 2,
          name: '力量训练',
          date: today,
          startTime: '14:00',
          endTime: '15:30',
          teacherId: '2',
          teacherName: '李教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 1,
          storeName: '南山店',
          capacity: 15,
          bookedCount: 8,
          price: 128,
          description: '增强肌肉力量，塑造完美身材',
          danceTypeName: '健身',
          difficulty: 3
        },
        {
          id: 3,
          name: '游泳课',
          date: today,
          startTime: '16:00',
          endTime: '17:00',
          teacherId: '3',
          teacherName: '王教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 2,
          storeName: '福田店',
          capacity: 10,
          bookedCount: 7,
          price: 158,
          description: '学习正确的游泳技巧',
          danceTypeName: '游泳',
          difficulty: 2
        },
        {
          id: 4,
          name: '爵士舞入门',
          date: today,
          startTime: '10:00',
          endTime: '11:30',
          teacherId: '4',
          teacherName: '刘教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 1,
          storeName: '南山店',
          capacity: 25,
          bookedCount: 18,
          price: 98,
          description: '学习基础爵士舞步',
          danceTypeName: '爵士舞',
          difficulty: 2
        },
        {
          id: 5,
          name: '拳击训练',
          date: today,
          startTime: '19:00',
          endTime: '20:30',
          teacherId: '5',
          teacherName: '陈教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 2,
          storeName: '福田店',
          capacity: 12,
          bookedCount: 10,
          price: 138,
          description: '专业拳击技巧训练',
          danceTypeName: '拳击',
          difficulty: 4
        },
        {
          id: 6,
          name: '普拉提核心',
          date: today,
          startTime: '18:00',
          endTime: '19:00',
          teacherId: '6',
          teacherName: '赵教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 1,
          storeName: '南山店',
          capacity: 15,
          bookedCount: 9,
          price: 108,
          description: '强化核心肌群训练',
          danceTypeName: '普拉提',
          difficulty: 3
        },
        // 明天课程
        {
          id: 7,
          name: '流瑜伽进阶',
          date: tomorrowStr,
          startTime: '09:00',
          endTime: '10:30',
          teacherId: '1',
          teacherName: '张教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 2,
          storeName: '福田店',
          capacity: 18,
          bookedCount: 14,
          price: 108,
          description: '流瑜伽进阶课程，适合有一定基础的学员',
          danceTypeName: '瑜伽',
          difficulty: 3
        },
        {
          id: 8,
          name: 'HIIT燃脂',
          date: tomorrowStr,
          startTime: '07:00',
          endTime: '08:00',
          teacherId: '2',
          teacherName: '李教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 1,
          storeName: '南山店',
          capacity: 20,
          bookedCount: 19,
          price: 98,
          description: '高强度间歇训练，快速燃烧脂肪',
          danceTypeName: '健身',
          difficulty: 4
        },
        {
          id: 9,
          name: '自由泳技巧',
          date: tomorrowStr,
          startTime: '15:00',
          endTime: '16:30',
          teacherId: '3',
          teacherName: '王教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 3,
          storeName: '宝安店',
          capacity: 8,
          bookedCount: 5,
          price: 168,
          description: '提升自由泳速度和技巧',
          danceTypeName: '游泳',
          difficulty: 3
        },
        {
          id: 10,
          name: '韩舞女团',
          date: tomorrowStr,
          startTime: '19:30',
          endTime: '21:00',
          teacherId: '4',
          teacherName: '刘教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 2,
          storeName: '福田店',
          capacity: 30,
          bookedCount: 25,
          price: 118,
          description: '学习韩流女团舞蹈，提升舞台表现力',
          danceTypeName: '韩舞',
          difficulty: 3
        },
        {
          id: 11,
          name: '拳击实战',
          date: tomorrowStr,
          startTime: '20:00',
          endTime: '21:30',
          teacherId: '5',
          teacherName: '陈教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 3,
          storeName: '宝安店',
          capacity: 10,
          bookedCount: 8,
          price: 148,
          description: '拳击实战技巧训练，包含对练环节',
          danceTypeName: '拳击',
          difficulty: 5
        },
        {
          id: 12,
          name: '器械普拉提',
          date: tomorrowStr,
          startTime: '10:30',
          endTime: '12:00',
          teacherId: '6',
          teacherName: '赵教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 2,
          storeName: '福田店',
          capacity: 12,
          bookedCount: 10,
          price: 138,
          description: '使用专业普拉提器械进行训练',
          danceTypeName: '普拉提',
          difficulty: 3
        },
        // 后天课程
        {
          id: 13,
          name: '阴瑜伽放松',
          date: dayAfterTomorrowStr,
          startTime: '20:00',
          endTime: '21:00',
          teacherId: '1',
          teacherName: '张教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 3,
          storeName: '宝安店',
          capacity: 15,
          bookedCount: 8,
          price: 88,
          description: '舒缓身心，改善睡眠质量',
          danceTypeName: '瑜伽',
          difficulty: 1
        },
        {
          id: 14,
          name: '功能性训练',
          date: dayAfterTomorrowStr,
          startTime: '18:30',
          endTime: '20:00',
          teacherId: '2',
          teacherName: '李教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 2,
          storeName: '福田店',
          capacity: 16,
          bookedCount: 12,
          price: 118,
          description: '提升日常生活中的身体功能',
          danceTypeName: '健身',
          difficulty: 3
        },
        {
          id: 15,
          name: '蝶泳入门',
          date: dayAfterTomorrowStr,
          startTime: '14:00',
          endTime: '15:30',
          teacherId: '3',
          teacherName: '王教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 1,
          storeName: '南山店',
          capacity: 6,
          bookedCount: 3,
          price: 188,
          description: '学习蝶泳基础技巧',
          danceTypeName: '游泳',
          difficulty: 4
        },
        {
          id: 16,
          name: '街舞基础',
          date: dayAfterTomorrowStr,
          startTime: '16:00',
          endTime: '17:30',
          teacherId: '4',
          teacherName: '刘教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 3,
          storeName: '宝安店',
          capacity: 20,
          bookedCount: 15,
          price: 108,
          description: '学习街舞基础动作和节奏感',
          danceTypeName: '街舞',
          difficulty: 2
        },
        {
          id: 17,
          name: '女子拳击',
          date: dayAfterTomorrowStr,
          startTime: '19:00',
          endTime: '20:30',
          teacherId: '5',
          teacherName: '陈教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 1,
          storeName: '南山店',
          capacity: 15,
          bookedCount: 12,
          price: 128,
          description: '专为女性设计的拳击课程',
          danceTypeName: '拳击',
          difficulty: 3
        },
        {
          id: 18,
          name: '孕产普拉提',
          date: dayAfterTomorrowStr,
          startTime: '11:00',
          endTime: '12:30',
          teacherId: '6',
          teacherName: '赵教练',
          teacherAvatar: '/images/joy.jpg',
          storeId: 3,
          storeName: '宝安店',
          capacity: 10,
          bookedCount: 7,
          price: 128,
          description: '适合孕期和产后恢复的普拉提课程',
          danceTypeName: '普拉提',
          difficulty: 2
        }
      ];
      
      // 返回分页格式
      let teacherPage = params.page || 1;
      let teacherLimit = params.limit || 10;
      let teacherStart = (teacherPage - 1) * teacherLimit;
      let teacherEnd = teacherStart + teacherLimit;
      
      return {
        list: courses.slice(teacherStart, teacherEnd),
        total: courses.length,
        page: teacherPage,
        limit: teacherLimit,
        hasMore: teacherEnd < courses.length
      };
      
    case '/api/courses/1':
      console.log('API: 获取课程详情，ID: 1')
      const course1 = {
        courseId: '1',
        name: '瑜伽基础班',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        teacherId: '1',
        teacherName: '张教练',
        teacherAvatar: '/images/joy.jpg',
        storeId: 1,
        storeName: '南山店',
        capacity: 20,
        bookedCount: 12,
        price: 88,
        description: '适合初学者的瑜伽课程，通过基础体式练习，帮助您放松身心，提升柔韧性。',
        danceTypeName: '瑜伽',
        difficulty: 1,
        consumeType: 'class_card',
        coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop'
      };
      console.log('API: 返回课程详情:', course1)
      return course1;
      
    case '/api/courses/2':
      console.log('API: 获取课程详情，ID: 2')
      const course2 = {
        courseId: '2',
        name: '力量训练',
        date: new Date().toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '15:30',
        teacherId: '2',
        teacherName: '李教练',
        teacherAvatar: '/images/joy.jpg',
        storeId: 1,
        storeName: '南山店',
        capacity: 15,
        bookedCount: 8,
        price: 128,
        description: '增强肌肉力量，塑造完美身材。适合有一定基础的学员。',
        danceTypeName: '健身',
        difficulty: 3,
        consumeType: 'class_card',
        coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
      };
      console.log('API: 返回课程详情:', course2)
      return course2;
      
    case '/api/courses/3':
      console.log('API: 获取课程详情，ID: 3')
      const course3 = {
        courseId: '3',
        name: '游泳课',
        date: new Date().toISOString().split('T')[0],
        startTime: '16:00',
        endTime: '17:00',
        teacherId: '3',
        teacherName: '王教练',
        teacherAvatar: '/images/joy.jpg',
        storeId: 2,
        storeName: '福田店',
        capacity: 10,
        bookedCount: 7,
        price: 158,
        description: '学习正确的游泳技巧，提升水性，享受水中运动的乐趣。',
        danceTypeName: '游泳',
        difficulty: 2,
        consumeType: 'class_card',
        coverImage: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop'
      };
      console.log('API: 返回课程详情:', course3)
      return course3;
      
    case '/api/courses/1/book':
    case '/api/courses/2/book':
    case '/api/courses/3/book':
    case '/api/courses/4/book':
    case '/api/courses/5/book':
    case '/api/courses/6/book':
      var courseId = url.split('/')[3];
      var bookingId = 'booking_' + Date.now();
      return {
        bookingId: bookingId,
        courseId: courseId,
        status: 'booked',
        bookingTime: new Date().toISOString()
      };

    case '/api/bookings/cancel':
    case '/api/bookings/*/cancel':
      // 模拟取消预约
      return {
        success: true,
        message: '预约已取消'
      };

    case '/api/bookings/checkin':
    case '/api/bookings/*/checkin':
      // 模拟签到
      return {
        success: true,
        message: '签到成功',
        checkInTime: new Date().toISOString()
      };

    case '/api/user/bookings':
      var today = new Date().toISOString().split('T')[0];
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var tomorrowStr = tomorrow.toISOString().split('T')[0];
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      var yesterdayStr = yesterday.toISOString().split('T')[0];
      var dayBeforeYesterday = new Date();
      dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
      var dayBeforeYesterdayStr = dayBeforeYesterday.toISOString().split('T')[0];
      var dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      var dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];
      
      var allBookings = [
        // 已完成的课程
        {
          bookingId: 'b1',
          courseId: 'c1',
          courseName: '瑜伽基础班',
          danceTypeName: '瑜伽',
          teacherName: '张教练',
          teacherAvatar: '/images/joy.jpg',
          storeName: '南山店',
          date: dayBeforeYesterdayStr,
          startTime: '09:00',
          endTime: '10:00',
          status: 'completed',
          price: 88,
          bookedAt: dayBeforeYesterdayStr + ' 08:30:00',
          checkInTime: dayBeforeYesterdayStr + ' 08:55:00',
          rating: 5,
          comment: '课程很棒，教练很专业！'
        },
        {
          bookingId: 'b2',
          courseId: 'c2',
          courseName: '力量训练',
          danceTypeName: '健身',
          teacherName: '李教练',
          teacherAvatar: '/images/joy.jpg',
          storeName: '南山店',
          date: yesterdayStr,
          startTime: '14:00',
          endTime: '15:30',
          status: 'completed',
          price: 128,
          bookedAt: yesterdayStr + ' 13:00:00',
          checkInTime: yesterdayStr + ' 13:50:00',
          rating: 4,
          comment: '训练强度适中，效果不错'
        },
        {
          bookingId: 'b3',
          courseId: 'c3',
          courseName: '游泳课',
          danceTypeName: '游泳',
          teacherName: '王教练',
          teacherAvatar: '/images/joy.jpg',
          storeName: '福田店',
          date: dayBeforeYesterdayStr,
          startTime: '16:00',
          endTime: '17:00',
          status: 'completed',
          price: 158,
          bookedAt: dayBeforeYesterdayStr + ' 15:30:00',
          checkInTime: dayBeforeYesterdayStr + ' 15:45:00',
          rating: 5,
          comment: '教练很有耐心，学到了很多技巧'
        },
        // 已取消的课程
        {
          bookingId: 'b4',
          courseId: 'c4',
          courseName: '爵士舞入门',
          danceTypeName: '爵士舞',
          teacherName: '刘教练',
          teacherAvatar: '/images/joy.jpg',
          storeName: '南山店',
          date: yesterdayStr,
          startTime: '10:00',
          endTime: '11:30',
          status: 'cancelled',
          price: 98,
          bookedAt: dayBeforeYesterdayStr + ' 20:00:00',
          cancelledAt: yesterdayStr + ' 08:00:00',
          cancelReason: '临时有事，无法参加'
        },
        // 已预约的课程
        {
          bookingId: 'b5',
          courseId: 'c5',
          courseName: '拳击训练',
          danceTypeName: '拳击',
          teacherName: '陈教练',
          teacherAvatar: '/images/joy.jpg',
          storeName: '福田店',
          date: today,
          startTime: '19:00',
          endTime: '20:30',
          status: 'booked',
          price: 138,
          bookedAt: yesterdayStr + ' 18:30:00'
        },
        {
          bookingId: 'b6',
          courseId: 'c6',
          courseName: '普拉提核心',
          danceTypeName: '普拉提',
          teacherName: '赵教练',
          teacherAvatar: '/images/joy.jpg',
          storeName: '南山店',
          date: today,
          startTime: '18:00',
          endTime: '19:00',
          status: 'booked',
          price: 108,
          bookedAt: today + ' 07:00:00'
        },
        {
          bookingId: 'b7',
          courseId: 'c7',
          courseName: '流瑜伽进阶',
          danceTypeName: '瑜伽',
          teacherName: '张教练',
          teacherAvatar: '/images/joy.jpg',
          storeName: '福田店',
          date: tomorrowStr,
          startTime: '09:00',
          endTime: '10:30',
          status: 'booked',
          price: 108,
          bookedAt: today + ' 12:00:00'
        },
        {
          bookingId: 'b8',
          courseId: 'c8',
          courseName: '韩舞女团',
          danceTypeName: '韩舞',
          teacherName: '刘教练',
          teacherAvatar: '/images/joy.jpg',
          storeName: '福田店',
          date: tomorrowStr,
          startTime: '19:30',
          endTime: '21:00',
          status: 'booked',
          price: 118,
          bookedAt: yesterdayStr + ' 21:00:00'
        },
        {
          bookingId: 'b9',
          courseId: 'c9',
          courseName: '自由泳技巧',
          danceTypeName: '游泳',
          teacherName: '王教练',
          teacherAvatar: '/images/joy.jpg',
          storeName: '宝安店',
          date: dayAfterTomorrowStr,
          startTime: '15:00',
          endTime: '16:30',
          status: 'booked',
          price: 168,
          bookedAt: today + ' 15:00:00'
        },
        {
          bookingId: 'b10',
          courseId: 'c10',
          courseName: '阴瑜伽放松',
          danceTypeName: '瑜伽',
          teacherName: '张教练',
          teacherAvatar: '/images/joy.jpg',
          storeName: '宝安店',
          date: dayAfterTomorrowStr,
          startTime: '20:00',
          endTime: '21:00',
          status: 'booked',
          price: 88,
          bookedAt: today + ' 09:30:00'
        }
      ];
      
      // 根据参数筛选
      var filteredBookings = allBookings;
      if (params && params.status && params.status !== 'all') {
        filteredBookings = allBookings.filter(function(booking) {
          return booking.status === params.status;
        });
      }
      
      // 分页处理
      let bookingPage = params && params.page ? params.page : 1;
      let bookingLimit = params && params.limit ? params.limit : 10;
      let bookingStart = (bookingPage - 1) * bookingLimit;
      let bookingEnd = bookingStart + bookingLimit;
      
      return {
        list: filteredBookings.slice(bookingStart, bookingEnd),
        total: filteredBookings.length,
        page: bookingPage,
        limit: bookingLimit,
        hasMore: bookingEnd < filteredBookings.length
      };
      
    default:
      return { success: true, data: {} };
  }
}

/**
 * 用户API
 */
var userApi = {
  // 微信登录
  wxLogin: function(code, userInfo) {
    return post('/auth/wx-login', { code: code, userInfo: userInfo });
  },
  getUserInfo: function() {
    return get('/api/user/info');
  },
  updateUserInfo: function(data) {
    return post('/api/user/info', data);
  },
  getUserBookings: function(page, limit, status) {
    if (page === void 0) { page = 1; }
    if (limit === void 0) { limit = 10; }
    return get('/api/user/bookings', { page: page, limit: limit, status: status });
  },
  getUserCourseCards: function() {
    return get('/api/user/course-cards');
  },
  generateEntranceCode: function() {
    return post('/api/user/entrance-code');
  },
  logout: function() {
    return post('/api/user/logout');
  }
};

/**
 * 课程API
 */
var courseApi = {
  getCourses: function(params) {
    return get('/api/courses', params);
  },
  getCourseList: function(params) {
    return get('/api/courses', params);
  },
  getCourseDetail: function(id) {
    return get('/api/courses/' + id);
  },
  bookCourse: function(courseId) {
    return post('/api/courses/' + courseId + '/book');
  },
  cancelBooking: function(bookingId) {
    return post('/api/bookings/' + bookingId + '/cancel');
  },
  checkIn: function(bookingId) {
    return post('/api/bookings/' + bookingId + '/checkin');
  },
  getUserCourses: function(page, limit) {
    if (page === void 0) { page = 1; }
    if (limit === void 0) { limit = 10; }
    return get('/api/user/courses', { page: page, limit: limit });
  },
  getMyBookings: function(params) {
    return get('/api/user/bookings', params);
  }
};

/**
 * 门店API
 */
var storeApi = {
  getStores: function() {
    return get('/api/stores');
  },
  getStoreList: function() {
    return get('/api/stores');
  },
  getStoreDetail: function(id) {
    return get('/api/stores/' + id);
  }
};

/**
 * 导师API
 */
var teacherApi = {
  getTeachers: function(params) {
    return get('/api/teachers', params);
  },
  getTeacherList: function(params) {
    return get('/api/teachers', params);
  },
  getTeacherDetail: function(id) {
    return get('/api/teachers/' + id);
  },
  getTeacherCourses: function(teacherId, params) {
    return get('/api/teachers/' + teacherId + '/courses', params);
  }
};

/**
 * 导师管理API
 */
var teacherManageApi = {
  // 获取导师列表（管理员）
  getTeacherList: function(params) {
    return get('/api/admin/teachers', params);
  },
  
  // 获取导师详情（管理员）
  getTeacherDetail: function(teacherId) {
    return get('/api/admin/teacher/' + teacherId);
  },
  
  // 创建导师
  createTeacher: function(teacherData) {
    return post('/api/admin/teacher', teacherData);
  },
  
  // 更新导师信息
  updateTeacher: function(teacherId, teacherData) {
    return post('/api/admin/teacher/' + teacherId + '/update', teacherData);
  },
  
  // 删除导师
  deleteTeacher: function(teacherId) {
    return post('/api/admin/teacher/' + teacherId + '/delete');
  },
  
  // 更新导师状态
  updateTeacherStatus: function(teacherId, status) {
    return post('/api/admin/teacher/' + teacherId + '/status', { status: status });
  },
  
  // 批量导入导师
  importTeachers: function(teachersData) {
    return post('/api/admin/teachers/import', { teachers: teachersData });
  },
  
  // 获取导师统计数据
  getTeacherStats: function(params) {
    return get('/api/admin/teacher/stats', params);
  }
};

/**
 * 管理员API
 */
var adminApi = {
  adminLogin: function(phone, code) {
    return post('/api/admin/login', { phone: phone, code: code });
  },
  getAdminInfo: function() {
    return get('/api/admin/info');
  },
  getCourseList: function(params) {
    return get('/api/admin/courses', params);
  },
  getStatistics: function(params) {
    return get('/api/admin/statistics', params);
  },
  getSystemConfig: function() {
    return get('/api/admin/system-config');
  },
  updateSystemConfig: function(config) {
    return post('/api/admin/system-config', config);
  }
};

/**
 * 预约API
 */
var bookingApi = {
  getBookings: function(params) {
    return get('/api/bookings', params);
  },
  getBookingDetail: function(id) {
    return get('/api/bookings/' + id);
  },
  updateBookingStatus: function(id, status) {
    return post('/api/bookings/' + id + '/status', { status: status });
  },
  getBookingStats: function() {
    return get('/api/bookings/stats');
  }
};

// 导出API
module.exports = {
  get: get,
  post: post,
  userApi: userApi,
  courseApi: courseApi,
  storeApi: storeApi,
  teacherApi: teacherApi,
  teacherManageApi: teacherManageApi,
  adminApi: adminApi,
  bookingApi: bookingApi
};