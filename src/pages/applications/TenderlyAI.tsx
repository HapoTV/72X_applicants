import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Filter,
  Home,
  Moon,
  Search,
  Bookmark,
  TrendingUp,
  ArrowLeft,
  Check,
  Trash2,
  ExternalLink,
  Loader2,
} from 'lucide-react';

// Hooks
import { useTenders } from '../../hooks/tenderlyai';

// Components
import {
  OverviewTab,
  TenderListTab,
  SavedTendersTab,
} from '../../components/tenderlyai';

// Services
import notificationService, {
  type Notification,
} from '../../services/NotificationService';

// Types
import type {
  TenderSearchFilters,
  TenderStatus,
} from '../../interfaces/TenderlyAIData';

const SIGNUP_INDUSTRIES = [
  'Technology',
  'Finance & Banking',
  'Healthcare',
  'Retail & E-commerce',
  'Manufacturing',
  'Construction',
  'Education',
  'Hospitality & Tourism',
  'Transportation & Logistics',
  'Media & Entertainment',
  'Agriculture',
  'Real Estate',
  'Energy & Utilities',
  'Professional Services',
  'Non-profit',
  'Other',
];

const PROVINCES = [
  'All Provinces',
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

type TenderlyAITab = 'overview' | 'tenders' | 'saved';

const navItems: Array<{
  id: TenderlyAITab;
  label: string;
  icon: React.ElementType;
}> = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'tenders', label: 'Browse Tenders', icon: TrendingUp },
  { id: 'saved', label: 'Saved', icon: Bookmark },
];

export const TenderlyAI: React.FC = () => {
  const navigate = useNavigate();

  const {
  tenders,
  savedTenderIds,
  toggleSavedTender,
  getSavedTenders,
  getAllIndustries,
  loading,
  fetchTenders,
} = useTenders();

  // -----------------------------
  // State
  // -----------------------------

  const [activeTab, setActiveTab] =
    useState<TenderlyAITab>('overview');

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedIndustries, setSelectedIndustries] =
    useState<string[]>(() => {
      try {
        const raw = localStorage.getItem('user');
        const parsed = raw
          ? (JSON.parse(raw) as { industry?: string })
          : null;

        const industry = (parsed?.industry || '').trim();

        return [];
      } catch {
        return [];
      }
    });

  const [province, setProvince] =
    useState('All Provinces');

  const [status, setStatus] =
    useState<TenderStatus | 'ALL'>('ALL');

  const [filtersOpen, setFiltersOpen] =
    useState(true);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem('tenderlyai-theme') === 'dark'
    );
  });

  // -----------------------------
  // Notification State
  // -----------------------------

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [notificationsLoading, setNotificationsLoading] =
    useState(false);

  const [notificationsError, setNotificationsError] =
    useState<string | null>(null);

  const [markingAllRead, setMarkingAllRead] =
    useState(false);

  const [processingNotificationId, setProcessingNotificationId] =
    useState<string | null>(null);

  // -----------------------------
  // Industries
  // -----------------------------

  const industries = useMemo(() => {
    const fromTenders = getAllIndustries();

    const combined = [
      ...SIGNUP_INDUSTRIES,
      ...fromTenders,
    ];

    const unique = Array.from(
      new Set(
        combined
          .map((s) => s.trim())
          .filter(Boolean)
      )
    );

    const withoutOther = unique.filter(
      (s) => s.toLowerCase() !== 'other'
    );

    return [...withoutOther, 'Other'];
  }, [getAllIndustries]);

  // -----------------------------
  // Filters
  // -----------------------------

  const filters: TenderSearchFilters = useMemo(
    () => ({
      searchTerm,
      province:
        province !== 'All Provinces'
          ? province
          : undefined,
      industries:
  selectedIndustries.length > 0
    ? selectedIndustries
    : undefined,
      status:
        status !== 'ALL'
          ? status
          : undefined,
    }),
    [
      searchTerm,
      province,
      selectedIndustries,
      status,
    ]
  );
        useEffect(() => {
    void fetchTenders(filters);
  }, [filters, fetchTenders]);

  // -----------------------------
  // Load Notifications
  // -----------------------------

  const loadNotifications = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setNotificationsLoading(true);
    setNotificationsError(null);

    try {
      const [notificationList, count] =
        await Promise.all([
          notificationService.getUserNotifications(false),
          notificationService.getUnreadCount(),
        ]);

      setNotifications(notificationList);
      setUnreadCount(count);
    } catch (error) {
      console.error(
        'Failed to load notifications:',
        error
      );

      setNotificationsError(
        'Unable to load notifications.'
      );
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, []);

  // Refresh notifications when another part of the app
  // dispatches the notifications-updated event.
  useEffect(() => {
    const handleNotificationsUpdated = () => {
      void loadNotifications();
    };

    window.addEventListener(
      'notifications-updated',
      handleNotificationsUpdated
    );

    return () => {
      window.removeEventListener(
        'notifications-updated',
        handleNotificationsUpdated
      );
    };
  }, []);

  // -----------------------------
  // Handlers
  // -----------------------------

  const handleFilterChange = (
    newFilters: Partial<TenderSearchFilters>
  ) => {
    if ('searchTerm' in newFilters) {
      setSearchTerm(newFilters.searchTerm || '');
    }
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const handleSaveTender = (tenderId: string) => {
    toggleSavedTender(tenderId);
  };

  const handleRemoveSavedTender = (tenderId: string) => {
    toggleSavedTender(tenderId);
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;

    setIsDarkMode(newMode);

    localStorage.setItem(
      'tenderlyai-theme',
      newMode ? 'dark' : 'light'
    );
  };

  // -----------------------------
  // Notification Handlers
  // -----------------------------

  const handleNotificationClick = async (
    notification: Notification
  ) => {
    if (processingNotificationId) {
      return;
    }

    try {
      // Mark unread notification as read.
      if (!notification.read) {
        setProcessingNotificationId(
          notification.id
        );

        await notificationService.markAsRead([
          notification.id,
        ]);

        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  read: true,
                  readAt:
                    new Date().toISOString(),
                }
              : item
          )
        );

        setUnreadCount((prev) =>
          Math.max(0, prev - 1)
        );
      }

      // Open the notification action if one exists.
      if (notification.actionUrl) {
        const actionUrl =
          notification.actionUrl.trim();

        if (actionUrl.startsWith('http://') ||
            actionUrl.startsWith('https://')) {
          window.open(
            actionUrl,
            '_blank',
            'noopener,noreferrer'
          );
        } else if (actionUrl.startsWith('/')) {
          navigate(actionUrl);
        }
      }
    } catch (error) {
      console.error(
        'Failed to mark notification as read:',
        error
      );
    } finally {
      setProcessingNotificationId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || markingAllRead) {
      return;
    }

    setMarkingAllRead(true);

    try {
      await notificationService.markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
          readAt:
            notification.readAt ||
            new Date().toISOString(),
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error
      );
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleDeleteNotification = async (
    notificationId: string
  ) => {
    if (processingNotificationId) {
      return;
    }

    const notification =
      notifications.find(
        (item) => item.id === notificationId
      );

    setProcessingNotificationId(
      notificationId
    );

    try {
      await notificationService.deleteNotification(
        notificationId
      );

      setNotifications((prev) =>
        prev.filter(
          (item) => item.id !== notificationId
        )
      );

      if (notification && !notification.read) {
        setUnreadCount((prev) =>
          Math.max(0, prev - 1)
        );
      }
    } catch (error) {
      console.error(
        'Failed to delete notification:',
        error
      );
    } finally {
      setProcessingNotificationId(null);
    }
  };

  const formatNotificationTime = (
    timestamp: string
  ) => {
    if (!timestamp) {
      return '';
    }

    return notificationService.formatTimestamp(
      timestamp
    );
  };

  // -----------------------------
  // Render active tab
  // -----------------------------

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            tenders={tenders}
            savedTenderIds={savedTenderIds}
            isDarkMode={isDarkMode}
          />
        );

      case 'tenders':
        return (
          <TenderListTab
            tenders={tenders}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSave={handleSaveTender}
            savedIds={savedTenderIds}
            loading={loading}
            isDarkMode={isDarkMode}
          />
        );

      case 'saved':
        return (
          <SavedTendersTab
            tenders={getSavedTenders()}
            onRemove={handleRemoveSavedTender}
            loading={loading}
            isDarkMode={isDarkMode}
          />
        );

      default:
        return null;
    }
  };

  // -----------------------------
  // Theme classes
  // -----------------------------

  const pageClass = isDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gray-50 text-gray-900';

  const cardClass = isDarkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const headingClass = isDarkMode
    ? 'text-white'
    : 'text-gray-900';

  const bodyTextClass = isDarkMode
    ? 'text-gray-300'
    : 'text-gray-700';

  const mutedTextClass = isDarkMode
    ? 'text-gray-400'
    : 'text-gray-600';

  const inputClass = isDarkMode
    ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500'
    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400';

  // -----------------------------
  // Page
  // -----------------------------

  return (
    <div
      className={`min-h-screen space-y-6 animate-fade-in p-4 rounded-xl transition-colors duration-200 ${pageClass}`}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Back button */}
            <button
              type="button"
              onClick={() =>
                navigate('/dashboard/overview')
              }
              className={`inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 hover:text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Main Dashboard
            </button>

            {/* Title */}
            <div className="flex items-center gap-2 sm:ml-4">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                72X
              </div>

              <h1
                className={`text-2xl font-bold ${headingClass}`}
              >
                TenderlyAI
              </h1>
            </div>
          </div>

          <p
            className={`mt-2 ${mutedTextClass}`}
          >
            Discover and manage government tenders and
            business opportunities.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search
            className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
              isDarkMode
                ? 'text-gray-500'
                : 'text-gray-400'
            }`}
          />

          <input
            type="text"
            placeholder="Search tenders..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className={`w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${inputClass}`}
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setFiltersOpen(!filtersOpen)
            }
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-colors ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'hover:bg-gray-100'
            }`}
            aria-label={
              isDarkMode
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            title={
              isDarkMode
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
          >
            <Moon
              className={`w-5 h-5 ${
                isDarkMode
                  ? 'text-yellow-300'
                  : 'text-gray-600'
              }`}
            />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setNotificationsOpen(
                  !notificationsOpen
                )
              }
              className={`relative p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-800'
                  : 'hover:bg-gray-100'
              }`}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell
                className={`w-5 h-5 ${
                  isDarkMode
                    ? 'text-gray-300'
                    : 'text-gray-600'
                }`}
              />

              {/* Unread notification badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {unreadCount > 99
                    ? '99+'
                    : unreadCount}
                </span>
              )}
            </button>

            {/* Notification panel */}
            {notificationsOpen && (
              <div
                className={`absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-lg border shadow-xl overflow-hidden ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                {/* Panel header */}
                <div
                  className={`flex items-center justify-between px-4 py-3 border-b ${
                    isDarkMode
                      ? 'border-gray-700'
                      : 'border-gray-200'
                  }`}
                >
                  <div>
                    <h3
                      className={`font-semibold ${headingClass}`}
                    >
                      Notifications
                    </h3>

                    {unreadCount > 0 && (
                      <p
                        className={`text-xs mt-0.5 ${mutedTextClass}`}
                      >
                        {unreadCount} unread
                      </p>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      disabled={markingAllRead}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        markingAllRead
                          ? 'opacity-50 cursor-not-allowed'
                          : isDarkMode
                          ? 'text-primary-400 hover:text-primary-300'
                          : 'text-primary-600 hover:text-primary-700'
                      }`}
                    >
                      {markingAllRead ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}

                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Panel content */}
                <div className="max-h-[420px] overflow-y-auto">
                  {notificationsLoading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <Loader2
                        className={`w-6 h-6 animate-spin ${
                          isDarkMode
                            ? 'text-primary-400'
                            : 'text-primary-500'
                        }`}
                      />

                      <p
                        className={`mt-2 text-sm ${mutedTextClass}`}
                      >
                        Loading notifications...
                      </p>
                    </div>
                  ) : notificationsError ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-red-500">
                        {notificationsError}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          void loadNotifications()
                        }
                        className={`mt-3 text-sm font-medium ${
                          isDarkMode
                            ? 'text-primary-400 hover:text-primary-300'
                            : 'text-primary-600 hover:text-primary-700'
                        }`}
                      >
                        Try again
                      </button>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <Bell
                        className={`w-8 h-8 mx-auto ${
                          isDarkMode
                            ? 'text-gray-600'
                            : 'text-gray-300'
                        }`}
                      />

                      <p
                        className={`mt-2 text-sm font-medium ${headingClass}`}
                      >
                        No notifications
                      </p>

                      <p
                        className={`mt-1 text-xs ${mutedTextClass}`}
                      >
                        You don't have any notifications yet.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {notifications.map(
                        (notification) => {
                          const isProcessing =
                            processingNotificationId ===
                            notification.id;

                          const typeClass =
                            isDarkMode
                              ? 'bg-gray-700/60'
                              : 'bg-gray-50';

                          return (
                            <div
                              key={notification.id}
                              className={`group relative border-b last:border-b-0 ${
                                isDarkMode
                                  ? 'border-gray-700'
                                  : 'border-gray-200'
                              } ${
                                notification.read
                                  ? ''
                                  : isDarkMode
                                  ? 'bg-primary-500/5'
                                  : 'bg-primary-50/40'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  void handleNotificationClick(
                                    notification
                                  )
                                }
                                disabled={isProcessing}
                                className={`w-full text-left px-4 py-3 pr-12 transition-colors ${
                                  isDarkMode
                                    ? 'hover:bg-gray-700'
                                    : 'hover:bg-gray-50'
                                } ${
                                  isProcessing
                                    ? 'opacity-60 cursor-wait'
                                    : ''
                                }`}
                              >
                                <div className="flex gap-3">
                                  {/* Notification type icon */}
                                  <div
                                    className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${typeClass}`}
                                  >
                                    {notificationService.getTypeIcon(
                                      notification.type
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-start gap-2">
                                      <p
                                        className={`text-sm ${
                                          notification.read
                                            ? mutedTextClass
                                            : `font-semibold ${headingClass}`
                                        }`}
                                      >
                                        {notification.title ||
                                          'Notification'}
                                      </p>

                                      {!notification.read && (
                                        <span className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-primary-500" />
                                      )}
                                    </div>

                                    <p
                                      className={`mt-1 text-xs leading-5 ${mutedTextClass}`}
                                    >
                                      {notification.message}
                                    </p>

                                    <div className="flex items-center gap-2 mt-2">
                                      <span
                                        className={`text-[11px] ${mutedTextClass}`}
                                      >
                                        {formatNotificationTime(
                                          notification.timestamp ||
                                            notification.createdAt
                                        )}
                                      </span>

                                      {notification.actionUrl && (
                                        <span
                                          className={`inline-flex items-center gap-1 text-[11px] ${
                                            isDarkMode
                                              ? 'text-primary-400'
                                              : 'text-primary-600'
                                          }`}
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          View
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() =>
                                  void handleDeleteNotification(
                                    notification.id
                                  )
                                }
                                disabled={isProcessing}
                                aria-label="Delete notification"
                                title="Delete notification"
                                className={`absolute right-3 top-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                                  isDarkMode
                                    ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
                                } ${
                                  isProcessing
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                                }`}
                              >
                                {isProcessing ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {filtersOpen && (
        <div
          className={`${cardClass} rounded-lg border shadow-sm p-4 transition-colors`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Industries */}
            <div>
              <label
                className={`block text-xs font-semibold mb-2 ${bodyTextClass}`}
              >
                Industries
              </label>

              <div className="max-h-48 overflow-auto space-y-2 pr-1">
                {industries.map((industry) => (
                  <label
                    key={industry}
                    className={`flex items-center gap-2 text-sm cursor-pointer ${
                      isDarkMode
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIndustries.includes(
                        industry
                      )}
                      onChange={() =>
                        toggleIndustry(industry)
                      }
                      className="rounded border-gray-300"
                    />

                    <span>{industry}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Province */}
            <div>
              <label
                className={`block text-xs font-semibold mb-2 ${bodyTextClass}`}
              >
                Province
              </label>

              <select
                value={province}
                onChange={(e) =>
                  setProvince(e.target.value)
                }
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${inputClass}`}
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                className={`block text-xs font-semibold mb-2 ${bodyTextClass}`}
              >
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as
                      | TenderStatus
                      | 'ALL'
                  )
                }
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${inputClass}`}
              >
                <option value="ALL">
                  All Statuses
                </option>

                <option value="OPEN">
                  Open
                </option>

                <option value="EXPIRED">
                  Expired
                </option>
              </select>
            </div>

            {/* Reset */}
            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedIndustries([]);
                  setProvince('All Provinces');
                  setStatus('ALL');
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'text-primary-400 border-primary-500/40 hover:bg-primary-500/10'
                    : 'text-primary-600 border-primary-200 hover:bg-primary-50'
                }`}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div
        className={`${cardClass} rounded-xl shadow-sm border p-2 transition-colors`}
      >
        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setActiveTab(item.id)
                }
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-sm'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {renderTab()}
    </div>
  );
};

export default TenderlyAI;
