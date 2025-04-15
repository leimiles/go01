import { Link } from 'react-router-dom'
import '../css/LinkArrow.css'

export default function LinkArrow({ to = "/content", title = "Goto" }) {
    return (
        <Link to={to} className="svg-arrow-link" title={title}>
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
        </Link>
    )
}
