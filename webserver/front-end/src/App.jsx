import { useState, lazy, Suspense } from 'react'
import './css/App.css'
import Footer from './components/Footer'
import Welcome from './components/Welcome'
const ModelViewer = lazy(() => import('./components/ModelViewer'))

function App() {
  return (
    <div className="container">
      <Suspense fallback={<div>Loading...</div>}>
        <ModelViewer />
      </Suspense>
      <Welcome />
      <Footer />
    </div>
  )
}

export default App