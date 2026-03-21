import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import SearchBar from '../components/SearchBar';
import EmailList from '../components/EmailList';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import { LogOut, RefreshCw, Mail, User } from 'lucide-react';

function Dashboard({ onLogout }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Read user email from JWT stored in localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email || '');
      }
    } catch (e) { }
  }, []);

  const fetchEmails = useCallback(async (currentPage, query) => {
    setLoading(true);
    try {
      const response = await api.get('/emails', {
        params: { page: currentPage, limit: 10, search: query }
      });
      setEmails(response.data.emails);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (err) {
      console.error('Error fetching emails:', err);
      setNotification({ message: 'Failed to fetch emails. Please try again.', type: 'error' });
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchEmails(page, searchQuery);
  }, [page, fetchEmails, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(1);
  };

  const syncEmails = async () => {
    setSyncing(true);
    setNotification({ message: '', type: 'success' });
    try {
      const res = await api.post('/emails/sync');
      setNotification({ message: res.data.message || 'Sync complete.', type: 'success' });
      fetchEmails(1, searchQuery);
    } catch (err) {
      console.error('Error syncing emails:', err);
      setNotification({ message: 'Failed to sync emails. Please try again.', type: 'error' });
    } finally {
      setSyncing(false);
    }
  };

  // Load More: append next 100 emails using raw offset = current list length
  const loadMore = async () => {
    try {
      const response = await api.get('/emails', {
        params: { offset: emails.length, limit: 100 }
      });
      const newEmails = response.data.emails;
      setEmails(prev => [...prev, ...newEmails]);
      setTotalItems(response.data.totalItems);
      setTotalPages(response.data.totalPages);
      // Update page to reflect approximate position
      setPage(Math.ceil((emails.length + newEmails.length) / 10));
    } catch (err) {
      setNotification({ message: 'Failed to load more emails.', type: 'error' });
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">IMAP Viewer</h1>
              {userEmail && (
                <div className="flex items-center text-xs text-gray-500 mt-0.5 space-x-1">
                  <User className="h-3 w-3" />
                  <span>{userEmail}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={syncEmails}
              disabled={syncing}
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-blue-600 focus:outline-none transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync'}</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Inbox</h2>
              {!loading && (
                <p className="text-xs text-gray-400 mt-0.5">{totalItems} emails {searchQuery && `matching "${searchQuery}"`}</p>
              )}
            </div>
            <div className="w-full sm:w-96">
              <SearchBar onSearch={handleSearch} onClear={handleClearSearch} initialQuery={searchQuery} />
            </div>
          </div>

          <EmailList emails={emails} loading={loading} />

          {/* Load More button - only on last page, not during search */}
          {!loading && !searchQuery && page === totalPages && totalPages > 1 && (
            <div className="flex justify-center py-4 border-t border-gray-100">
              <button
                onClick={loadMore}
                className="px-6 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition-colors"
              >
                Load More
              </button>
            </div>
          )}

          <div className="border-t border-gray-200 bg-gray-50">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              disabled={loading}
            />
          </div>
        </div>
      </main>
    </div>

      {/* Slide-in Toast for system notifications */}
      <Toast
        message={notification.message}
        type={notification.type}
        duration={5000}
        onClose={() => setNotification({ ...notification, message: '' })}
      />
    </>
  );
}

export default Dashboard;
