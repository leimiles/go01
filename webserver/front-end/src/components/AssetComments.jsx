import { useState } from 'react'
import '../css/AssetComments.css'

export default function AssetComments({ assetId }) {
    // 用对象存储每个资产的留言列表
    const [commentsMap, setCommentsMap] = useState({})
    const [input, setInput] = useState('')

    const comments = commentsMap[assetId] || []

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!input.trim()) return
        setCommentsMap(prev => ({
            ...prev,
            [assetId]: [
                ...(prev[assetId] || []),
                { text: input.trim(), time: new Date().toLocaleString() }
            ]
        }))
        setInput('')
    }

    return (
        <div className="asset-comments">
            <div className="comment-list">
                {comments.length === 0 ? (
                    <div className="comment-empty">暂无留言</div>
                ) : (
                    comments.slice().reverse().map((c, i) => (
                        <div className="comment-item" key={i}>
                            <span className="comment-text">{c.text}</span>
                            <span className="comment-time">{c.time}</span>
                        </div>
                    ))
                )}
            </div>
            <form className="comment-form" onSubmit={handleSubmit}>
                <input
                    className="comment-input"
                    type="text"
                    placeholder="留下你的评价..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    maxLength={100}
                />
                <button className="comment-submit" type="submit">发送</button>
            </form>
        </div>
    )
} 