import { useState, lazy, Suspense } from 'react'
import '../css/App.css'
import Footer from './Footer'
import Welcome from './Welcome'
import ApiTester from './ApiTester'
const ModelViewer = lazy(() => import('./ModelViewer'))

function App() {
  return (
    <div className="container">
      <Suspense fallback={<div>Loading...</div>}>
        <ModelViewer />
      </Suspense>
      <Welcome />
      <Footer />
      <ApiTester />
    </div>
  )
}

export default App