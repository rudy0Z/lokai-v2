import { AppProvider } from './app/lib/app-context'
import { useHashRoute } from './app/lib/router'
import { Toaster } from 'sonner'
import ChatPage from './app/pages/ChatPage'
import SpecimenPage from './app/pages/SpecimenPage'
import GalleryPage from './app/pages/GalleryPage'
import DevLauncherPage from './app/pages/DevLauncherPage'

function Routes() {
  const { path } = useHashRoute()
  switch (path) {
    case '/specimen':
      return <SpecimenPage />
    case '/gallery':
      return <GalleryPage />
    case '/dev':
      return <DevLauncherPage />
    default:
      return <ChatPage />
  }
}

export default function App() {
  return (
    <AppProvider>
      <Routes />
      <Toaster position="top-center" duration={2600} />
    </AppProvider>
  )
}
