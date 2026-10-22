import React, { useCallback, useEffect, useState } from 'react';
import { PageRoute } from './types/photobooth';
import { getAllGalleryWorks } from './utils/storage';
import { ToastProvider } from './components/ToastProvider';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { PhotoboothStudio } from './components/PhotoboothStudio';
import { FrameGallery } from './components/FrameGallery';
import { PhotoGallery } from './components/PhotoGallery';
import { AboutPage } from './components/AboutPage';
import { WelcomeGate } from './components/WelcomeGate';
import { THEMES, ThemeId, loadStoredTheme, storeTheme } from './utils/themes';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [galleryCount, setGalleryCount] = useState<number>(0);
  const [storedTheme] = useState<ThemeId | null>(() => loadStoredTheme());
  const [themeId, setThemeId] = useState<ThemeId>(storedTheme ?? 'slay');
  const [selectedFrameId, setSelectedFrameId] = useState<string>(THEMES[themeId].defaultFrameId);
  const [showWelcome, setShowWelcome] = useState<boolean>(storedTheme === null);

  const changeTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    storeTheme(id);
    setSelectedFrameId(THEMES[id].defaultFrameId);
  }, []);

  const closeWelcome = useCallback(() => setShowWelcome(false), []);

  const refreshGalleryCount = useCallback(async () => {
    try {
      const works = await getAllGalleryWorks();
      setGalleryCount(works.length);
    } catch {
      // ignore if IndexedDB is blocked
    }
  }, []);

  useEffect(() => {
    refreshGalleryCount();
  }, [refreshGalleryCount]);

  const handleNavigate = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFrameAndOpenStudio = (frameId: string) => {
    setSelectedFrameId(frameId);
    handleNavigate('studio');
  };

  return (
    <ToastProvider>
      <div
        className={`app-shell theme-${themeId}`}
        style={THEMES[themeId].palette as React.CSSProperties}
      >
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          galleryCount={galleryCount}
          themeId={themeId}
          onChangeTheme={changeTheme}
        />

        <main className="main-content" id="main-content">
          {currentPage === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onSelectFrameAndStart={handleSelectFrameAndOpenStudio}
            />
          )}

          {currentPage === 'studio' && (
            <PhotoboothStudio
              initialFrameId={selectedFrameId}
              themeId={themeId}
              onGalleryUpdated={refreshGalleryCount}
            />
          )}

          {currentPage === 'frames' && (
            <div className="standalone-page-container">
              <FrameGallery
                themeId={themeId}
                selectedFrameId={selectedFrameId}
                onSelectFrame={(id) => setSelectedFrameId(id)}
                onUseInStudio={handleSelectFrameAndOpenStudio}
              />
            </div>
          )}

          {currentPage === 'gallery' && (
            <div className="standalone-page-container">
              <PhotoGallery
                onNavigate={handleNavigate}
                onGalleryCountChange={setGalleryCount}
              />
            </div>
          )}

          {currentPage === 'about' && (
            <div className="standalone-page-container">
              <AboutPage onNavigate={handleNavigate} />
            </div>
          )}
        </main>

        <Footer onNavigate={handleNavigate} />
      </div>
      {showWelcome && (
        <WelcomeGate
          currentTheme={storedTheme ? themeId : null}
          onChoose={(id) => {
            changeTheme(id);
            setShowWelcome(false);
            handleNavigate('studio');
          }}
          onClose={closeWelcome}
        />
      )}
    </ToastProvider>
  );
};

export default App;

