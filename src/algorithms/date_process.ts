export default function convertToDisplayFormat(isoString:string) {
    // 创建一个新的 Date 对象
    const date = new Date(isoString);
  
    // 获取各个组件（年、月、日、小时、分钟、秒）
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
  
    // 组合成所需的格式
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  