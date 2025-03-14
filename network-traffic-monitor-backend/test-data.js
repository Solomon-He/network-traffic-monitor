const si = require('systeminformation');

// 异步函数来获取并打印网络统计数据
async function printNetworkStats() {
    try {
        // 调用 networkStats 方法获取网络统计数据
        const networkStats = await si.networkStats();

        // 确保 networkStats 是数组
        const statsArray = Array.isArray(networkStats) ? networkStats : [networkStats];

        // 遍历每个网络接口的统计数据
        statsArray.forEach((stat) => {
            console.log('网络接口信息：');
            console.log(`  接口名称: ${stat.iface}`);
            console.log(`  接收字节数: ${stat.rx_bytes}`);
            console.log(`  发送字节数: ${stat.tx_bytes}`);
            console.log(`  接收数据包数: ${stat.rx_packets}`);
            console.log(`  发送数据包数: ${stat.tx_packets}`);
            console.log(`  接收错误数: ${stat.rx_errors}`);
            console.log(`  发送错误数: ${stat.tx_errors}`);
            console.log(`  接收丢弃数据包数: ${stat.rx_dropped}`);
            console.log(`  发送丢弃数据包数: ${stat.tx_dropped}`);
            console.log(`  操作状态: ${stat.operstate}`);
            console.log(`  双工模式: ${stat.duplex}`);
            console.log(`  连接速度 (Mbps): ${stat.speed}`);
            console.log('----------------------');
        });

        console.log(statsArray);
    } catch (error) {
        console.error('获取网络统计数据时出错:', error);
    }
}

// 调用函数
printNetworkStats();