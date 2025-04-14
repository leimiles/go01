import './css/App.css'
import Footer from './components/Footer'
import Welcome from './components/Welcome'
import ModelViewer from './components/ModelViewer'

function App() {
  return (
    <div className="container">
      <ModelViewer />
      <Welcome />
      <Footer />
    </div>
  )
}

export default App
