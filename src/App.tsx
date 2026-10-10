/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header, ActiveTab } from './components/navbar/Header';
import { ChatPage } from './components/chat/ChatPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { QuizArenaPage } from './components/quiz/QuizArenaPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SettingsPage } from './components/settings/SettingsPage';
import { CreateQuizDialog } from './components/quiz/CreateQuizDialog';
import { QuizPlayerModal } from './components/quiz/QuizPlayerModal';
import { AuthModal } from './components/auth/AuthModal';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';
import { QuizData } from './types';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const { activeQuizModal, setActiveQuizModal } = useApp();

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0F19] text-slate-100 antialiased selection:bg-violet-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewQuiz={() => setIsCreateQuizOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Tab View */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <ChatPage
            onOpenNewQuiz={() => setIsCreateQuizOpen(true)}
            onLaunchFullQuiz={(quiz: QuizData) => setActiveQuizModal(quiz)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage onOpenNewQuiz={() => setIsCreateQuizOpen(true)} />
        )}

        {activeTab === 'quizzes' && (
          <QuizArenaPage
            onOpenCreateDialog={() => setIsCreateQuizOpen(true)}
            onLaunchQuiz={(quiz: QuizData) => setActiveQuizModal(quiz)}
          />
        )}

        {activeTab === 'admin' && <AdminDashboard />}

        {activeTab === 'settings' && <SettingsPage />}
      </main>

      {/* Global Modals */}
      <CreateQuizDialog
        isOpen={isCreateQuizOpen}
        onClose={() => setIsCreateQuizOpen(false)}
      />

      <QuizPlayerModal
        quiz={activeQuizModal}
        onClose={() => setActiveQuizModal(null)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* PWA In-App Install Prompt Banner */}
      <PWAInstallBanner />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
