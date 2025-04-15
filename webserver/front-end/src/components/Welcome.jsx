import '../css/Welcome.css'
import LinkArrow from './LinkArrow'

function Welcome() {
    return (
        <h1 class="rainbow-text">
            <span class="zh">你好!</span>
            <span class="en"> Sofunny 3D</span>
            <span><LinkArrow /></span>
        </h1>

    )
}

export default Welcome