import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { QUICK_HELPLINES } from '../utils/constants';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative animate-scale-up border-t-8 border-red-600 dark:border-red-500">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-red-50 dark:bg-red-950/20">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-500">
            <AlertTriangle className="h-7 w-7" />
            <h2 className="text-xl sm:text-2xl font-bold">Immediate Support Needed?</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-500 dark:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          <p className="text-gray-700 dark:text-gray-300 text-base mb-6 font-medium leading-relaxed">
            We noticed your story mentions signs of urgent distress. Your safety is our top priority. Please do not hesitate to reach out to these free, confidential, and 24/7 helplines right now.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUICK_HELPLINES.map((helpline, idx) => {
              const Icon = helpline.icon;
              return (
                <a
                  key={idx}
                  href={`tel:${helpline.number.split(' / ')[0]}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{helpline.title}</h3>
                    <p className="text-red-600 dark:text-red-400 font-extrabold text-lg tracking-wide my-0.5">{helpline.number}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{helpline.description}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            I understand, close
          </button>
        </div>
      </div>
    </div>
  );
}
