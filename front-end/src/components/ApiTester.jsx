import { api } from '../services/api'
import '../css/ApiTester.css'

const ApiTester = () => {
  const testApi = async () => {
    try {
      await api.ping()
    } catch (error) {
      // 忽略错误显示
    }
  }

  return (
    <button 
      onClick={testApi}
      className="api-tester-button"
    >
      测试 API
    </button>
  )
}

export default ApiTester 