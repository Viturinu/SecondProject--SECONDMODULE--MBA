import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'

createRoot(document.getElementById('root')!).render( //'!' - non null assertion operator - é um operador que afirma que o element com rood no id existe, para que o jhavascript não fique acusando erro pela possibilidade de ele ser nulo - Não é uma boa prática, porém já veio deste jeito no vite
  <StrictMode>
    <App />
  </StrictMode>,
)
