import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { appStore } from './app/store'
import { Toaster } from './components/ui/sonner'
import { useLoadUserQuery } from './features/api/authApi'
import HomePageSkeleton from './components/HomePageSkeleton'
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    if (confirm("New update available. Reload?")) {
      window.location.reload();
    }
  },
});

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return (<>
    {isLoading ? <h1><HomePageSkeleton /></h1> : <>{children}</>}
  </>)
}

createRoot(document.getElementById('root')).render(

  <Provider store={appStore}>
    <Custom>
      <App />
    </Custom>
    <Toaster />
  </Provider>

)
