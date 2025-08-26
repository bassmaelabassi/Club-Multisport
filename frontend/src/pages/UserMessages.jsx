import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { contactService } from '../services/contactService';
import { Mail, CheckCircle, Clock } from 'lucide-react';

const UserMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const location = useLocation();
  const justSent = useMemo(() => new URLSearchParams(location.search).get('success') === '1', [location.search]);
  const newContact = location.state && location.state.newContact ? location.state.newContact : null;

  const load = async () => {
    try {
      const data = await contactService.getMyMessages();
      let list = Array.isArray(data) ? data : [];
      if (newContact) {
        const exists = list.some((m) => String(m._id) === String(newContact._id));
        if (!exists) {
          list = [newContact, ...list];
        }
      }
      setMessages(list);
    } catch (e) {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!justSent) return;
    setRefreshing(true);
    const t = setTimeout(async () => {
      await load();
      setRefreshing(false);
    }, 900);
    return () => clearTimeout(t);
  }, [justSent]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#003c3c] flex items-center justify-center">
        <div className="text-center text-white">Chargement de vos messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003c3c]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Mes messages</h1>
        {messages.length === 0 ? (
          <div className="bg-white/10 border border-white/20 rounded-xl p-8 text-center text-white">
            <Mail className="w-8 h-8 mx-auto mb-2" />
            {refreshing ? 'Actualisation…' : 'Aucun message pour le moment.'}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m._id} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{m.subject}</div>
                  <div className="text-xs text-white/70 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(m.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <p className="text-white/90 mb-3">{m.message}</p>
                {m.adminReply ? (
                  <div className="bg-green-500/10 border-l-4 border-green-400 p-3 rounded-r">
                    <div className="flex items-center gap-2 text-green-300 font-medium mb-1">
                      <CheckCircle className="w-4 h-4" /> Réponse reçue
                    </div>
                    <div className="text-white/90">{m.adminReply}</div>
                    {m.repliedAt && (
                      <div className="text-xs text-white/70 mt-1">Le {new Date(m.repliedAt).toLocaleDateString('fr-FR')}</div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-white/70">En attente de réponse...</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMessages;
