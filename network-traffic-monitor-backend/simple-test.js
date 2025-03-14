const http = require('http');

// 简单测试服务器是否运行
function testServer() {
  console.log('测试服务器是否运行...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log('服务器正在运行!');
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('响应数据:', data);
      console.log('测试完成');
    });
  });

  req.on('error', (e) => {
    console.error(`请求错误: ${e.message}`);
    console.error('服务器可能没有运行，或者端口 3000 不可访问');
    process.exit(1);
  });

  // 设置超时
  req.setTimeout(5000, () => {
    console.error('请求超时');
    process.exit(1);
  });

  req.end();
}

testServer(); 