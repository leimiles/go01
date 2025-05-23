import { useState } from 'react'
import '../css/UploadButton.css'

function UploadButton() {
    const [selectedPath, setSelectedPath] = useState('')

    const handleUpload = () => {
        // 创建一个新的 input 元素
        const input = document.createElement('input')
        input.type = 'file'
        input.setAttribute('webkitdirectory', '')
        input.setAttribute('directory', '')
        input.setAttribute('multiple', '')
        
        // 监听选择事件
        input.onchange = (event) => {
            const files = event.target.files
            if (files && files.length > 0) {
                // 获取第一个文件的路径，并提取目录名
                const fullPath = files[0].webkitRelativePath
                const directoryName = fullPath.split('/')[0]
                console.log('Selected directory:', directoryName)
                setSelectedPath(directoryName)
            }
        }
        
        // 触发点击
        input.click()
    }

    return (
        <button onClick={handleUpload} className="upload-button" title="上传资产">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L12 16M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
    )
}

export default UploadButton 