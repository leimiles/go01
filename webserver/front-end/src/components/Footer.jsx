import '../css/Footer.css'

function Footer() {
    return (
        <div className="container">
            <footer className="footer">
                <a href="https://kenney.nl/assets" target="_blank" rel="noopener noreferrer">
                    <img src="https://kenney.nl/favicon.ico" alt="Example 1" className="footer-icon" />
                </a>
                <a href="https://assetstore.unity.com/" target="_blank" rel="noopener noreferrer">
                    <img src="https://assetstore.unity.com/favicon.ico" alt="Example 2" className="footer-icon" />
                </a>
                <a href="https://sketchfab.com/" target="_blank" rel="noopener noreferrer">
                    <img src="https://sketchfab.com/favicon.ico" alt="Example 3" className="footer-icon" />
                </a>
            </footer>
        </div>
    )
}

export default Footer