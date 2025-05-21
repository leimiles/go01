import { useState, useEffect } from 'react'
import '../css/TagFilter.css'

function TagFilter({ selectedTags, onSelectTags }) {
    const [availableTags, setAvailableTags] = useState([])

    useEffect(() => {
        // TODO: 从后端获取标签数据
        const mockTags = [
            '动物', '人形', '熊', '猫', '机械', '机器人',
            '武器', '道具', '建筑', '动画', '可爱', '写实'
        ]
        setAvailableTags(mockTags)
    }, [])

    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            onSelectTags(selectedTags.filter(t => t !== tag))
        } else {
            onSelectTags([...selectedTags, tag])
        }
    }

    return (
        <div className="tag-filter">
            <h3>标签筛选</h3>
            <div className="tag-list">
                {availableTags.map(tag => (
                    <div
                        key={tag}
                        className={`tag-item ${selectedTags.includes(tag) ? 'selected' : ''}`}
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag.length > 4 ? tag.slice(0, 4) + '…' : tag}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TagFilter 