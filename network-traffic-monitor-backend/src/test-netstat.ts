import { exec } from 'child_process';
import { promisify } from 'util';

// 将 exec 转换为 Promise 版本
const execPromise = promisify(exec);

/**
 * 从 netstat -e 命令获取数据包信息
 * @param output 命令输出
 * @returns 接收和发送的数据包数量
 */
function getPacketsFromNetstat(output: string): { rx: number, tx: number } {
  try {
    const lines = output.split('\n');
    
    let rxPackets = 0;
    let txPackets = 0;
    
    console.log('原始输出行数:', lines.length);
    
    // 打印所有行，用于调试
    lines.forEach((line, index) => {
      console.log(`行 ${index + 1}: "${line}"`);
    });
    
    // 查找包含数字的行
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      console.log(`检查行: "${trimmedLine}"`);
      
      // 检查是否包含数字
      if (/\d+/.test(trimmedLine)) {
        console.log(`行包含数字`);
        
        const numbers = trimmedLine.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
          console.log(`提取到的数字: ${numbers.join(', ')}`);
          
          // 单播数据包行
          if (trimmedLine.includes('单播') || trimmedLine.includes('Unicast')) {
            const rx = parseInt(numbers[numbers.length - 2].replace(/,/g, ''), 10);
            const tx = parseInt(numbers[numbers.length - 1].replace(/,/g, ''), 10);
            rxPackets += rx;
            txPackets += tx;
            console.log(`解析单播数据包: rx=${rx}, tx=${tx}, 累计: rxPackets=${rxPackets}, txPackets=${txPackets}`);
          }
          // 非单播数据包行
          else if (trimmedLine.includes('非单播') || trimmedLine.includes('Non-unicast')) {
            const rx = parseInt(numbers[numbers.length - 2].replace(/,/g, ''), 10);
            const tx = parseInt(numbers[numbers.length - 1].replace(/,/g, ''), 10);
            rxPackets += rx;
            txPackets += tx;
            console.log(`解析非单播数据包: rx=${rx}, tx=${tx}, 累计: rxPackets=${rxPackets}, txPackets=${txPackets}`);
          }
        }
      }
    }
    
    console.log(`最终数据包数量: rx=${rxPackets}, tx=${txPackets}`);
    return { rx: rxPackets, tx: txPackets };
  } catch (error) {
    console.error('解析失败:', error);
    return { rx: 0, tx: 0 };
  }
}

async function main() {
  try {
    console.log('执行 netstat -e 命令...');
    // 使用 encoding 参数解决中文乱码问题
    const { stdout } = await execPromise('netstat -e', { encoding: 'utf8' });
    
    console.log('\n原始 netstat -e 输出:');
    console.log('-------------------');
    console.log(stdout);
    console.log('-------------------\n');
    
    console.log('开始解析输出...');
    const packetsInfo = getPacketsFromNetstat(stdout);
    
    console.log('\n最终解析结果:');
    console.log(JSON.stringify(packetsInfo, null, 2));
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 执行测试
main(); 