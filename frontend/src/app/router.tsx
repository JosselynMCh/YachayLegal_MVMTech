import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { AssistantPage } from '../pages/AssistantPage';
import { SourcesPage } from '../pages/SourcesPage';
import { AdminPage } from '../pages/AdminPage';
import type { QuechuaDialect } from '../types';

export const AppRouter: React.FC = () => {
  const [currentDialect, setCurrentDialect] = useState<QuechuaDialect>('quechua_chanka');
  const [primaryLang, setPrimaryLang] = useState<'qu' | 'es'>('qu');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              currentDialect={currentDialect}
              onSelectDialect={setCurrentDialect}
              primaryLang={primaryLang}
              onSelectPrimaryLang={setPrimaryLang}
            />
          }
        />
        <Route
          path="/assistant"
          element={
            <AssistantPage
              currentDialect={currentDialect}
              onSelectDialect={setCurrentDialect}
              primaryLang={primaryLang}
              onSelectPrimaryLang={setPrimaryLang}
            />
          }
        />
        <Route 
          path="/sources" 
          element={
            <SourcesPage 
              currentDialect={currentDialect}
              onSelectDialect={setCurrentDialect}
              primaryLang={primaryLang}
              onSelectPrimaryLang={setPrimaryLang}
            />
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminPage 
              currentDialect={currentDialect}
              onSelectDialect={setCurrentDialect}
              primaryLang={primaryLang}
              onSelectPrimaryLang={setPrimaryLang}
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};
