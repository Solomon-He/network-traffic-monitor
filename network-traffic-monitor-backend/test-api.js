const http = require('http');

// 测试 API 的函数
function testApi(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    console.log(`\n===== 测试 ${method} ${path} =====`);
    console.log('请求中...');

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log(`状态码: ${res.statusCode}`);
        try {
          if (responseData) {
            const jsonData = JSON.parse(responseData);
            console.log('响应数据:', JSON.stringify(jsonData, null, 2));
            resolve(jsonData);
          } else {
            console.log('响应数据为空');
            resolve(null);
          }
        } catch (e) {
          console.log('响应数据 (非JSON):', responseData);
          resolve(responseData);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`请求错误: ${error.message}`);
      console.error('请确保服务器正在运行，并且端口 3000 可访问');
      reject(error);
    });

    // 设置超时
    req.setTimeout(5000, () => {
      req.destroy();
      console.error('请求超时');
      reject(new Error('请求超时'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// 运行测试
async function runTests() {
  try {
    console.log('开始测试网络流量监测工具 API...');
    console.log('确保服务器正在运行，并监听端口 3000');

    try {
      // 测试根路由
      await testApi('/');
    } catch (error) {
      console.error('无法连接到服务器，请确保服务器正在运行');
      return;
    }

    try {
      // 测试获取网络接口列表
      const interfaces = await testApi('/api/network/interfaces');
      
      // 如果成功获取到接口列表，使用第一个接口进行后续测试
      let testInterface = 'eth0';
      if (interfaces && interfaces.length > 0) {
        testInterface = interfaces[0].name;
        console.log(`\n使用接口 ${testInterface} 进行后续测试`);
      }

      // 测试获取网络流量统计
      await testApi('/api/network/stats');

      // 测试设置告警阈值
      const threshold = {
        interface: testInterface,
        rx_speed_threshold: 1000000, // 1MB/s
        tx_speed_threshold: 1000000, // 1MB/s
        enabled: true
      };
      await testApi('/api/alert/thresholds', 'POST', threshold);

      // 测试获取所有告警阈值
      await testApi('/api/alert/thresholds');

      // 测试获取特定接口的告警阈值
      await testApi(`/api/alert/thresholds/${testInterface}`);

      // 测试获取所有告警
      await testApi('/api/alert/alerts');

      // 测试获取历史网络流量统计数据
      await testApi(`/api/network/stats/history?interface=${testInterface}&duration=60`);

      // 测试获取历史网络流量速率数据
      await testApi(`/api/network/speed/history?interface=${testInterface}&duration=60`);

      console.log('\n所有测试完成!');
    } catch (error) {
      console.error('测试过程中出错:', error);
    }
  } catch (error) {
    console.error('测试脚本执行错误:', error);
  }
}

// 运行测试
runTests(); 