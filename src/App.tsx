import { AppProvider } from './app/lib/app-context'
import { useHashRoute } from './app/lib/router'
import { Toaster } from 'sonner'
import ChatPage from './app/pages/ChatPage'
import SpecimenPage from './app/pages/SpecimenPage'
import GalleryPage from './app/pages/GalleryPage'
import DevLauncherPage from './app/pages/DevLauncherPage'
import VoiceCapturePage from './app/pages/VoiceCapturePage'
import NoticePage from './app/pages/NoticePage'
import HistoryPage from './app/pages/HistoryPage'
import SavedPage from './app/pages/SavedPage'
import ProfilePage from './app/pages/ProfilePage'

function Routes() {
  const { path } = useHashRoute()
  switch (path) {
    case '/specimen':
      return <SpecimenPage />
    case '/gallery':
      return <GalleryPage />
    case '/dev':
      return <DevLauncherPage />
    case '/voice':
      return <VoiceCapturePage />
    case '/notice':
      return <NoticePage />
    case '/history':
      return <HistoryPage />
    case '/saved':
      return <SavedPage />
    case '/profile':
      return <ProfilePage />
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
