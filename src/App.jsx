import { lazy, Suspense } from 'react';
import './App.css'

const Calculator = lazy(() => import('./components/Calculator'));

function App() {
  return <>

    <div className="mb-3">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Home Loan Calculator</span>
        </div>
      </nav>
    </div>

    <Suspense fallback={<></>}>
      <Calculator />
    </Suspense>

    <div className="alert alert-primary container fw-semibold text-center">
      <div className="mb-3">Made with ❤️ By Punit Soni</div>

      <div className="mb-2">Email - <a href="mailto:punit.soni33@gmail.com" target="_blank">punit.soni33@gmail.com</a></div>
      <div className="mb-2">Twitter - <a href="https://twitter.com/PunitSoniME" target="_blank">@PunitSoniME</a></div>
      <div className="mb-2">Linkedin - <a href="https://www.linkedin.com/in/PunitSoniME" target="_blank">PunitSoniME</a></div>

    </div>

  </>
}

export default App
