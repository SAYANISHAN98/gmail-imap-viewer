import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';

function EmailItem({ email }) {
  const [expanded, setExpanded] = useState(false);

  // Parse sender string if it's "Name <email@example.com>"
  const parseSender = (senderString) => {
    if (!senderString) return { name: 'Unknown', email: '' };
    const match = senderString.match(/^(.*?)(?:<(.+)>)?$/);
    const name = match && match[1] ? match[1].trim().replace(/"/g, '') : senderString;
    const emailAddr = match && match[2] ? match[2].trim() : '';
    return { name: name || emailAddr.split('@')[0], email: emailAddr };
  };

  const senderInfo = parseSender(email.sender);
  const formattedDate = email.date ? format(parseISO(email.date), 'MMM d, yyyy h:mm a') : 'Unknown Date';

  return (
    <li className="transition duration-150 ease-in-out hover:bg-blue-50">
      <div 
        className="px-4 py-4 sm:px-6 cursor-pointer block"
        onClick={() => {
          const next = !expanded;
          setExpanded(next);
          if (next) {
            console.log('[EmailItem] expanded email data:', email);
            console.log('[EmailItem] snippet value:', email.snippet);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center truncate max-w-2xl">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {senderInfo.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4 truncate">
              <div className="flex flex-col sm:flex-row sm:items-baseline space-y-1 sm:space-y-0 sm:space-x-2">
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {senderInfo.name}
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline-block">
                  {senderInfo.email ? `<${senderInfo.email}>` : ''}
                </span>
              </div>
              <p className="text-sm text-gray-700 truncate font-medium mt-1">
                {email.subject || '(No Subject)'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-xs text-gray-500 whitespace-nowrap hidden md:flex">
              <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <time dateTime={email.date}>{formattedDate}</time>
            </div>
            <div className="text-gray-400">
               {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </div>
        </div>
        
        <div className={`mt-4 w-full bg-white rounded border border-gray-100 p-4 transition-all duration-300 ${expanded ? 'block shadow-inner' : 'hidden'}`}>
           {/* Detailed view metadata */}
           <div className="mb-4 text-sm pb-4 border-b border-gray-100 flex flex-col space-y-2">
             <div className="flex items-start">
               <span className="font-semibold text-gray-600 w-16">From:</span>
               <span className="text-gray-900">{email.sender}</span>
             </div>
             <div className="flex items-start">
               <span className="font-semibold text-gray-600 w-16">Date:</span>
               <span className="text-gray-900">{formattedDate}</span>
             </div>
             <div className="flex items-start">
               <span className="font-semibold text-gray-600 w-16">Subject:</span>
               <span className="text-gray-900 font-medium">{email.subject || '(No Subject)'}</span>
             </div>
           </div>
           
           {/* Email body: render URLs as clickable links */}
           <div className="text-sm text-gray-800 leading-relaxed font-sans">
              {email.snippet
                ? email.snippet.split(/(\s+)/).map((word, i) => {
                    if (/^https?:\/\/\S+$/.test(word)) {
                      const display = word.length > 50 ? word.substring(0, 47) + '...' : word;
                      return (
                        <a
                          key={i}
                          href={word}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-blue-500 hover:underline break-all"
                        >
                          {display}
                        </a>
                      );
                    }
                    return <span key={i}>{word}</span>;
                  })
                : <span className="italic text-gray-400">No text content available for this email.</span>
              }
           </div>
        </div>
      </div>
    </li>
  );
}

export default EmailItem;
