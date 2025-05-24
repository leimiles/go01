// API 基础 URL
const API_BASE_URL = '/api';

// API 请求函数
export const api = {
  // 测试 API
  ping: async () => {
    const response = await fetch(`${API_BASE_URL}/ping`);
    console.log('hello');
    return response.json();
  },
  
  // 这里可以添加更多 API 请求
  // 例如：
  // getUser: async (id) => {
  //   const response = await fetch(`${API_BASE_URL}/user/${id}`);
  //   return response.json();
  // },
}; 