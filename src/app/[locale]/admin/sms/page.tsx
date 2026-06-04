'use client';

import { useState } from 'react';
import SmsSendModal from '../components/SmsSendModal';
import SmsBulkForm from '../components/SmsBulkForm';
import SmsBalanceCard from '../components/SmsBalanceCard';
import SmsHistoryTable from '../components/SmsHistoryTable';

type Tab = 'send' | 'bulk' | 'history';

export default function SmsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('send');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'send', label: 'Send SMS', icon: 'send' },
    { id: 'bulk', label: 'Bulk SMS', icon: 'campaign' },
    { id: 'history', label: 'History', icon: 'history' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-white text-2xl font-bold">SMS Management</h1>
        <p className="text-white/60 mt-1">Send messages, manage templates, and track SMS history</p>
      </div>

      <SmsBalanceCard />

      <div className="bg-surface-dark rounded-xl border border-surface-dark-lighter overflow-hidden">
        <div className="border-b border-surface-dark-lighter">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-white/60 hover:text-white hover:bg-surface-dark-lighter'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'send' && (
            <div>
              <button
                onClick={() => setIsSendModalOpen(true)}
                className="px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 font-medium flex items-center gap-2"
              >
                <span className="material-symbols-outlined">send</span>
                Send New SMS
              </button>
            </div>
          )}
          {activeTab === 'bulk' && <SmsBulkForm onSuccess={() => {}} />}
          {activeTab === 'history' && <SmsHistoryTable />}
        </div>
      </div>

      <SmsSendModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSuccess={() => {
          if (activeTab === 'history') window.location.reload();
        }}
      />
    </div>
  );
}
