import { useNavigate } from 'react-router-dom'
import '../css/LinkArrow.css'

function LinkArrow() {
    const navigate = useNavigate()

    return (
        <span 
            className="svg-arrow-link" 
            onClick={() => navigate('/content')}
            title="点击进入内容页面"
        >
            <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFD700"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="arrow-icon"
            >
                <path d="M5 12h14"></path>
                <path d="M13 6l6 6-6 6"></path>
            </svg>
        </span>
    )
}

export default LinkArrow
