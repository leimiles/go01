import '../css/Footer.css'

function Footer() {
    const handleUpload = () => {
        // TODO: 实现上传功能
        console.log('Upload clicked')
    }

    return (
        <footer className="footer">
            <div className="footer-icons">
                <a href="https://kenney.nl/assets" target="_blank" rel="noopener noreferrer">
                    <img src="https://kenney.nl/favicon.ico" alt="kenney assets" className="footer-icon" />
                </a>
                <a href="https://assetstore.unity.com/" target="_blank" rel="noopener noreferrer">
                    <img src="https://assetstore.unity.com/favicon.ico" alt="unity assets store" className="footer-icon" />
                </a>
                <a href="https://sketchfab.com/" target="_blank" rel="noopener noreferrer">
                    <img src="https://sketchfab.com/favicon.ico" alt="sketch fab" className="footer-icon" />
                </a>
                <a href="https://www.fab.com/" target="_blank" rel="noopener noreferrer">
                    <img src="https://static.fab.com/static/builds/web/dist/frontend/assets/images/common/favicon/0474bf3a774e077cf48b0c755890d7ed-v1.svg" alt="unreal market place" className="footer-icon" />
                </a>
            </div>
            <button onClick={handleUpload} className="upload-button" title="上传资产">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L12 16M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 15V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </footer>
    )
}

export default Footer

