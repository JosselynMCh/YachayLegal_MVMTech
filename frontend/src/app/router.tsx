import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { AssistantPage } from '../pages/AssistantPage';
import { SourcesPage } from '../pages/SourcesPage';
import { AdminPage } from '../pages/AdminPage';
import type { QuechuaDialect } from '../types';
import { getSavedLang, getSavedDialect, changeLang, saveDialect } from '../i18n/i18n';

export const AppRouter: React.FC = () => {
  // Restaurar idioma y dialecto guardados en localStorage
  const [currentDialect, setCurrentDialect] = useState<QuechuaDialect>(
    getSavedDialect() as QuechuaDialect
  );
  const [primaryLang, setPrimaryLang] = useState<'qu' | 'es'>(getSavedLang());

  // Al cambiar idioma: actualizar i18n + persistir en localStorage
  const handleSelectPrimaryLang = (lang: 'qu' | 'es') => {
    setPrimaryLang(lang);
    changeLang(lang);
  };

  // Al cambiar dialecto: persistir en localStorage
  const handleSelectDialect = (d: QuechuaDialect) => {
    setCurrentDialect(d);
    saveDialect(d);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              currentDialect={currentDialect}
              onSelectDialect={handleSelectDialect}
              primaryLang={primaryLang}
              onSelectPrimaryLang={handleSelectPrimaryLang}
            />
          }
        />
        <Route
          path="/assistant"
          element={
            <AssistantPage
              currentDialect={currentDialect}
              onSelectDialect={handleSelectDialect}
              primaryLang={primaryLang}
              onSelectPrimaryLang={handleSelectPrimaryLang}
            />
          }
        />
        <Route
          path="/sources"
          element={
            <SourcesPage
              currentDialect={currentDialect}
              onSelectDialect={handleSelectDialect}
              primaryLang={primaryLang}
              onSelectPrimaryLang={handleSelectPrimaryLang}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminPage
              currentDialect={currentDialect}
              onSelectDialect={handleSelectDialect}
              primaryLang={primaryLang}
              onSelectPrimaryLang={handleSelectPrimaryLang}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
