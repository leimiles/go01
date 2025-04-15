import '../css/Welcome.css'
import LinkArrow from './LinkArrow'

function Welcome() {
    return (
        <h1 className="rainbow-text">
            <span className="zh">你好!</span>
            <span className="en"> Sofunny 3D</span>
            <span><LinkArrow /></span>
        </h1>

    )
}

export default Welcome