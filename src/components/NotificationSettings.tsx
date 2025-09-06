import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { notificationService } from '../services/notification.service';
import { useApi } from '../hooks/useApi';
import { NotificationPreferences } from '../types/api';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Briefcase, 
  TrendingUp, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    newServiceRequests: true,
    messageNotifications: true,
    jobUpdates: true,
    marketingEmails: false
  });

  const getPreferencesApi = useApi(notificationService.getNotificationPreferences);
  const updatePreferencesApi = useApi(notificationService.updateNotificationPreferences);

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

  const notificationOptions = [
    {
      key: 'emailNotifications' as keyof NotificationPreferences,
      icon: Mail,
      title: 'Email Notifications',
      description: 'Receive email notifications for important updates',
      color: 'from-blue-500 to-blue-600',
      master: true
    },
    {
      key: 'newServiceRequests' as keyof NotificationPreferences,
      icon: Briefcase,
      title: 'New Service Requests',
      description: 'Get notified when new service requests are posted in your area',
      color: 'from-yellow-500 to-yellow-600',
      dependsOn: 'emailNotifications'
    },
    {
      key: 'messageNotifications' as keyof NotificationPreferences,
      icon: MessageSquare,
      title: 'Message Notifications',
      description: 'Receive email notifications for new chat messages',
      color: 'from-green-500 to-green-600',
      dependsOn: 'emailNotifications'
    },
    {
      key: 'jobUpdates' as keyof NotificationPreferences,
      icon: CheckCircle,
      title: 'Job Updates',
      description: 'Get notified about job status changes and completions',
      color: 'from-purple-500 to-purple-600',
      dependsOn: 'emailNotifications'
    },
    {
      key: 'marketingEmails' as keyof NotificationPreferences,
      icon: TrendingUp,
      title: 'Marketing & Tips',
      description: 'Receive tips, updates, and promotional content',
      color: 'from-pink-500 to-pink-600',
      dependsOn: 'emailNotifications'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings className="h-6 w-6 mr-3 text-yellow-600" />
            Notification Settings
          </h3>
          <p className="text-gray-600 mt-1">
            Manage how you receive notifications about new opportunities and messages
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {preferences.emailNotifications ? (
            <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <Volume2 className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Notifications On</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              <VolumeX className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Notifications Off</span>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {getPreferencesApi.loading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 text-yellow-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading notification preferences...</p>
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
            <p className="text-green-600">Notification preferences updated successfully!</p>
          </div>
        </div>
      )}

      {/* Notification Options */}
      {!getPreferencesApi.loading && (
        <div className="space-y-4">
          {notificationOptions.map((option) => {
            const isEnabled = preferences[option.key];
            const isDependentDisabled = option.dependsOn && !preferences[option.dependsOn];
            const isDisabled = isDependentDisabled;

            return (
              <div
                key={option.key}
                className={`bg-white border rounded-xl p-6 transition-all duration-200 ${
                  isEnabled && !isDisabled
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isDisabled ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center shadow-lg ${
                      isDisabled ? 'opacity-50' : ''
                    }`}>
                      <option.icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {option.title}
                        {option.master && (
                          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                            Master Setting
                          </span>
                        )}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {option.description}
                      </p>
                      
                      {isDependentDisabled && (
                        <p className="text-orange-600 text-xs mt-2 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Enable "Email Notifications" to use this feature
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handlePreferenceChange(option.key, !isEnabled)}
                      disabled={isDisabled}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                        isEnabled && !isDisabled
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                          : 'bg-gray-200'
                      } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                          isEnabled && !isDisabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Additional Info for Service Requests */}
                {option.key === 'newServiceRequests' && isEnabled && !isDisabled && (
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
                      <h5 className="font-medium text-yellow-800 mb-1 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Notification Details
                      </h5>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• You'll receive emails when new service requests are posted in your service area</li>
                        <li>• Emails include request details, location, and client contact information</li>
                        <li>• Only requests matching your selected service categories will be sent</li>
                        <li>• You can respond directly from the email or through the platform</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Save Button */}
      {!getPreferencesApi.loading && (
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={updatePreferencesApi.loading}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
          >
            {updatePreferencesApi.loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      )}

      {/* Email Preview */}
      {preferences.newServiceRequests && preferences.emailNotifications && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-600" />
            Email Preview - New Service Request
          </h4>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="border-b border-gray-200 pb-3 mb-3">
              <p className="text-sm text-gray-600">
                <strong>From:</strong> notifications@caschigialli.it
              </p>
              <p className="text-sm text-gray-600">
                <strong>Subject:</strong> 🔧 New Service Request in Your Area - Plumbing
              </p>
            </div>
            
            <div className="space-y-3 text-sm">
              <p className="text-gray-800">
                <strong>Ciao {user?.name}!</strong>
              </p>
              
              <p className="text-gray-700">
                A new service request has been posted in your service area:
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p><strong>Service:</strong> Fix leaky kitchen faucet</p>
                <p><strong>Category:</strong> Plumbing</p>
                <p><strong>Location:</strong> Via Roma 123, Roma (2.3 km from you)</p>
                <p><strong>Description:</strong> Kitchen faucet is leaking and needs immediate repair...</p>
                <p><strong>Client:</strong> Maria Rossi</p>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  View on Platform
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Contact Client
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