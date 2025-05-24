import '../css/Footer.css'
import UploadButton from './UploadButton'

function Footer() {
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
            <UploadButton />
        </footer>
    )
}

export default Footer

