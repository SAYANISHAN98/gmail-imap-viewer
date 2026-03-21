import React from 'react';
import EmailItem from './EmailItem';
import { Inbox } from 'lucide-react';

function EmailList({ emails, loading }) {
  if (loading) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-400">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
          <p>Loading your emails...</p>
        </div>
      </div>
    );
  }

  if (!emails || emails.length === 0) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 p-8 text-center space-y-4">
        <div className="bg-gray-100 rounded-full p-6">
           <Inbox className="h-12 w-12 text-gray-300" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900">No emails found</h3>
          <p className="text-sm">Try syncing your account or modifying your search.</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 w-full">
      {emails.map((email) => (
        <EmailItem key={email.id} email={email} />
      ))}
    </ul>
  );
}

export default EmailList;
