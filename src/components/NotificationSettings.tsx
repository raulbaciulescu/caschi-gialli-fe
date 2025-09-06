import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/notification.service';
import { userService } from '../services/user.service';
import { useApi } from '../hooks/useApi';
import { NotificationPreferences } from '../types/api';
import { 
  Bell, 
  Mail, 
  Briefcase, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Settings,
  Volume2,
  VolumeX,
  Trash2,
  Shield
} from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    newServiceRequests: true,
    messageNotifications: true,
    jobUpdates: true,
    marketingEmails: false
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const getPreferencesApi = useApi(notificationService.getNotificationPreferences);
  const updatePreferencesApi = useApi(notificationService.updateNotificationPreferences);
  const deleteAccountApi = useApi(userService.deleteAccount);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await getPreferencesApi.execute();
      setPreferences(response.preferences);
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
      // Keep default preferences if loading fails
    }
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updatePreferencesApi.execute(preferences);
      // Success feedback will be shown via the API response
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      alert(t('profile.typeDeleteToConfirm'));
      return;
    }

    try {
      await deleteAccountApi.execute();
      alert(t('profile.accountDeleted'));
      navigate('/');
      // The logout will be handled automatically by the service
      window.location.reload(); // Force reload to clear all state
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert(t('profile.deleteAccountError'));
    }
  };

  return (
    <div className="space-y-8">
      {/* Email Notifications Section */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="h-6 w-6 mr-3 text-yellow-600" />
              {t('settings.notificationSettings')}
            </h3>
            <p className="text-gray-600 mt-1">
              {t('settings.manageEmailNotifications')}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {preferences.newServiceRequests ? (
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <Volume2 className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{t('settings.notificationsOn')}</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <VolumeX className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{t('settings.notificationsOff')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {getPreferencesApi.loading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 text-yellow-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">{t('settings.loadingPreferences')}</p>
          </div>
        )}

        {/* Error State */}
        {getPreferencesApi.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-600">{getPreferencesApi.error}</p>
            </div>
          </div>
        )}

        {/* Success State */}
        {updatePreferencesApi.data && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-600">{t('settings.preferencesUpdated')}</p>
            </div>
          </div>
        )}

        {/* New Service Requests Setting */}
        {!getPreferencesApi.loading && (
          <div className="bg-white border rounded-xl p-6 transition-all duration-200 border-yellow-200 bg-yellow-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {t('settings.newServiceRequests')}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {t('settings.newServiceRequestsDesc')}
                  </p>
                  
                  {/* Additional Details */}
                  <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
                    <h5 className="font-medium text-yellow-800 mb-2 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {t('settings.emailDetails')}
                    </h5>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• {t('settings.emailDetail1')}</li>
                      <li>• {t('settings.emailDetail2')}</li>
                      <li>• {t('settings.emailDetail3')}</li>
                      <li>• {t('settings.emailDetail4')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => handlePreferenceChange('newServiceRequests', !preferences.newServiceRequests)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer ${
                    preferences.newServiceRequests
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                      preferences.newServiceRequests ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        {!getPreferencesApi.loading && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={updatePreferencesApi.loading}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
            >
              {updatePreferencesApi.loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('settings.saving')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t('settings.savePreferences')}
                </>
              )}
            </button>
          </div>
        )}

        {/* Email Preview */}
        {preferences.newServiceRequests && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              {t('settings.emailPreview')}
            </h4>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="border-b border-gray-200 pb-3 mb-3">
                <p className="text-sm text-gray-600">
                  <strong>{t('settings.from')}:</strong> notifications@caschigialli.it
                </p>
                <p className="text-sm text-gray-600">
                  <strong>{t('settings.subject')}:</strong> 🔧 {t('settings.emailSubject')}
                </p>
              </div>
              
              <div className="space-y-3 text-sm">
                <p className="text-gray-800">
                  <strong>{t('settings.emailGreeting', { name: user?.name || 'Nome' })}!</strong>
                </p>
                
                <p className="text-gray-700">
                  {t('settings.emailBody')}
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p><strong>{t('settings.service')}:</strong> {t('settings.exampleService')}</p>
                  <p><strong>{t('settings.category')}:</strong> {t('categories.Plumbing')}</p>
                  <p><strong>{t('settings.location')}:</strong> {t('settings.exampleLocation')}</p>
                  <p><strong>{t('settings.description')}:</strong> {t('settings.exampleDescription')}</p>
                  <p><strong>{t('settings.client')}:</strong> {t('settings.exampleClient')}</p>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    {t('settings.viewOnPlatform')}
                  </button>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    {t('settings.contactClient')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone - Delete Account */}
      <div className="border-t border-gray-200 pt-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-red-800 mb-2">
                {t('settings.dangerZone')}
              </h4>
              <p className="text-red-700 text-sm mb-4">
                {t('settings.deleteAccountWarning')}
              </p>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('settings.deleteAccount')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('settings.confirmDeletion')}</h3>
                  <p className="text-sm text-red-600">{t('settings.permanentAction')}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800">
                    {t('settings.deleteAccountDetails')}
                  </p>
                </div>

                <p className="text-sm font-medium text-gray-900 mb-2">
                  {t('settings.confirmationRequired')}
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('settings.typeDelete')}
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="DELETE"
                    disabled={deleteAccountApi.loading}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  disabled={deleteAccountApi.loading}
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteAccountApi.loading || deleteConfirmText !== 'DELETE'}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                >
                  {deleteAccountApi.loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('settings.deleting')}
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('settings.deleteAccount')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;