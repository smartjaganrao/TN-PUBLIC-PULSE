/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';
import ForumPage from './pages/ForumPage';
import TopicDetailPage from './pages/TopicDetailPage';
import PulsePage from './pages/PulsePage';
import GamePage from './pages/GamePage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AffiliatePage from './pages/AffiliatePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="vote" element={<VotePage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="pulse" element={<PulsePage />} />
              <Route path="forum" element={<ForumPage />} />
              <Route path="forum/:id" element={<TopicDetailPage />} />
              <Route path="game" element={<GamePage />} />
              <Route path="blog" element={<BlogListPage />} />
              <Route path="blog/:slug" element={<BlogDetailPage />} />
              <Route path="shop" element={<AffiliatePage />} />
              <Route path="privacy" element={<PrivacyPolicyPage />} />
              <Route path="terms" element={<TermsOfServicePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </LanguageProvider>
    </HelmetProvider>
  );
}
