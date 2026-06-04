'use client';

import { useState, useEffect } from 'react';
import { smsApi, membersApi } from '@/lib/api';

interface SmsBulkFormProps {
  onSuccess?: () => void;
}

type RecipientGroup = 'all' | 'active' | 'inactive' | 'frozen' | 'pending' | 'manual';

export default function SmsBulkForm({ onSuccess }: SmsBulkFormProps) {
  const [recipientGroup, setRecipientGroup] = useState<RecipientGroup>('manual');
  const [phones, setPhones] = useState('');
  const [message, setMessage] = useState('');
  const [campaign, setCampaign] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (recipientGroup === 'manual') { setPhones(''); setMemberCount(null); return; }
    const fetchMemberPhones = async () => {
      setIsLoadingMembers(true); setError(null);
      try {
        let allPhones: string[] = [];
        let page = 1; const limit = 100; let hasMore = true;
        while (hasMore) {
          const query: Record<string, unknown> = { page, limit };
          if (recipientGroup === 'active') query.status = 'active';
          else if (recipientGroup === 'inactive') query.status = 'inactive';
          else if (recipientGroup === 'frozen') query.status = 'frozen';
          else if (recipientGroup === 'pending') query.status = 'pending';
          const response = await membersApi.getAll(query);
          const validPhones = response.data.map((m) => m.phone).filter((p): p is string => Boolean(p && p.trim()));
          allPhones = [...allPhones, ...validPhones];
          hasMore = response.meta.page < response.meta.totalPages;
          page++;
        }
        if (recipientGroup === 'inactive') {
          let ePage = 1; let hasMoreE = true;
          while (hasMoreE) {
            try {
              const er = await membersApi.getAll({ page: ePage, limit, status: 'expired' });
              const ep = er.data.map((m) => m.phone).filter((p): p is string => Boolean(p && p.trim()));
              allPhones = [...allPhones, ...ep];
              hasMoreE = er.meta.page < er.meta.totalPages;
              ePage++;
              if (er.data.length === 0) hasMoreE = false;
            } catch { hasMoreE = false; }
          }
        }
        const unique = Array.from(new Set(allPhones));
        setPhones(unique.join('\n')); setMemberCount(unique.length);
      } catch { setError('Failed to load member phone numbers'); setPhones(''); setMemberCount(null); }
      finally { setIsLoadingMembers(false); }
    };
    fetchMemberPhones();
  }, [recipientGroup]);

  const parsePhones = (input: string) => input.split(/[,\n]/).map((p) => p.trim()).filter((p) => p.length > 0);
  const calculateSmsCount = (text: string) => text.length <= 160 ? 1 : Math.ceil(text.length / 153);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setSuccess(null);
    const phoneList = parsePhones(phones);
    if (phoneList.length === 0) { setError('Please enter at least one phone number'); return; }
    if (!message.trim()) { setError('Message is required'); return; }
    setIsSending(true);
    try {
      const result = await smsApi.sendBulk(phoneList, message.trim(), campaign.trim() || undefined);
      setSuccess(`Successfully sent SMS to ${result.count} recipient${result.count !== 1 ? 's' : ''}`);
      setPhones(''); setMessage(''); setCampaign(''); setRecipientGroup('manual');
      onSuccess?.();
    } catch (err) {
      let msg = 'Failed to send bulk SMS';
      if (err instanceof Error) msg = err.message;
      if (msg.includes('unverified contact') || msg.includes('verify')) {
        msg = 'One or more phone numbers are not verified. Please verify contacts in your SMS provider dashboard first.';
      }
      setError(msg);
    } finally { setIsSending(false); }
  };

  const phoneList = parsePhones(phones);
  const smsCount = calculateSmsCount(message);
  const totalSms = phoneList.length * smsCount;

  const groupBtnClass = (group: RecipientGroup) =>
    `px-4 py-3 rounded-lg border transition-colors text-sm font-medium ${
      recipientGroup === group
        ? 'bg-primary/20 border-primary text-primary'
        : 'bg-surface-dark-lighter border-surface-dark-lighter text-white/80 hover:border-primary/50'
    } disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <div className="bg-surface-dark rounded-xl border border-surface-dark-lighter p-6">
      <h3 className="text-white font-semibold text-lg mb-4">Send Bulk SMS</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-2">Select Recipients <span className="text-red-400">*</span></label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(['all', 'active', 'inactive', 'frozen', 'pending', 'manual'] as RecipientGroup[]).map((group) => (
              <button key={group} type="button" onClick={() => setRecipientGroup(group)} disabled={isLoadingMembers || isSending} className={groupBtnClass(group)}>
                {group === 'all' ? 'All Members' : group === 'inactive' ? 'Inactive + Expired' : group.charAt(0).toUpperCase() + group.slice(1) + (group !== 'manual' ? ' Only' : ' Entry')}
              </button>
            ))}
          </div>
          {isLoadingMembers && <p className="text-white/60 text-xs mt-2">Loading member phone numbers...</p>}
          {memberCount !== null && recipientGroup !== 'manual' && (
            <p className="text-white/60 text-xs mt-2">Found {memberCount} member{memberCount !== 1 ? 's' : ''} with phone numbers</p>
          )}
        </div>
        <div>
          <label className="block text-white/80 text-sm mb-2">
            Phone Numbers <span className="text-red-400">*</span>
            <span className="text-white/60 text-xs ml-2">{recipientGroup === 'manual' ? '(One per line or comma-separated)' : '(Auto-populated)'}</span>
          </label>
          <textarea value={phones} onChange={(e) => setPhones(e.target.value)} placeholder={recipientGroup === 'manual' ? '+251912345678\n+251987654321' : 'Phone numbers will be loaded automatically...'} required rows={6} className="w-full px-4 py-2 bg-surface-dark-lighter border border-surface-dark-lighter rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary resize-none font-mono text-sm" disabled={isSending || isLoadingMembers} />
          <div className="text-white/60 text-xs mt-1">{phoneList.length} recipient{phoneList.length !== 1 ? 's' : ''} found</div>
        </div>
        <div>
          <label className="block text-white/80 text-sm mb-2">Message <span className="text-red-400">*</span></label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter your message..." required rows={5} maxLength={1600} className="w-full px-4 py-2 bg-surface-dark-lighter border border-surface-dark-lighter rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary resize-none" disabled={isSending} />
          <div className="flex items-center justify-between mt-1">
            <div className="text-white/60 text-xs">{message.length} characters • {smsCount} SMS per recipient</div>
            <div className="text-white/60 text-xs">Total: ~{totalSms} SMS ({phoneList.length} × {smsCount})</div>
          </div>
        </div>
        <div>
          <label className="block text-white/80 text-sm mb-2">Campaign Name <span className="text-white/60 text-xs">(optional)</span></label>
          <input type="text" value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="e.g., Monthly Newsletter" className="w-full px-4 py-2 bg-surface-dark-lighter border border-surface-dark-lighter rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary" disabled={isSending} />
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>}
        {success && <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-emerald-400 text-sm">{success}</div>}
        <button type="submit" disabled={isSending || isLoadingMembers || phoneList.length === 0 || !message.trim()} className="w-full px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
          {isSending ? 'Sending...' : isLoadingMembers ? 'Loading...' : `Send to ${phoneList.length} Recipient${phoneList.length !== 1 ? 's' : ''}`}
        </button>
      </form>
    </div>
  );
}
