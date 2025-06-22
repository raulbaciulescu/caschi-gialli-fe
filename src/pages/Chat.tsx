import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare } from 'lucide-react';

const Chat: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access messages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-8rem)]">
          <div className="flex h-full">
            {/* Chat List */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Start by contacting a service provider or client
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;