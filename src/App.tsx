import React, { useCallback, useEffect, useState } from 'react';
import { PageRoute } from './types/photobooth';
import { DEFAULT_CUSTOMIZATION } from './utils/constants';
import { getAllGalleryWorks } from './utils/storage';
import { ToastProvider } from './components/ToastProvider';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { PhotoboothStudio } from './components/PhotoboothStudio';
import { FrameGallery } from './components/FrameGallery';
import { PhotoGallery } from './components/PhotoGallery';
import { AboutPage } from './components/AboutPage';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedFrameId, setSelectedFrameId] = useState<string>(DEFAULT_CUSTOMIZATION.frameId);
  const [galleryCount, setGalleryCount] = useState<number>(0);

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
      <div className="app-shell">
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          galleryCount={galleryCount}
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
              onGalleryUpdated={refreshGalleryCount}
            />
          )}

          {currentPage === 'frames' && (
            <div className="standalone-page-container">
              <FrameGallery
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
    </ToastProvider>
  );
};

export default App;

