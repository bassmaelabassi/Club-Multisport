import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { contactService } from "../services/contactService";
import { Mail, Reply, Send, Clock, CheckCircle } from "lucide-react";

const CoachMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllMessages("onlyMine=true");
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      loadMessages();
    }
  }, [user?._id]);

  const handleReply = async (id) => {
    if (!replyText || !replyText.trim()) {
      alert("Veuillez saisir une réponse");
      return;
    }
    try {
      await contactService.replyToMessage(id, replyText.trim());
      setReplyText("");
      setSelectedMessage(null);
      await loadMessages();
      alert("Réponse envoyée avec succès");
    } catch (e) {
      alert("Erreur lors de l'envoi de la réponse");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#003c3c] flex items-center justify-center">
        <div className="text-center text-white">Chargement des messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003c3c]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Messages de mes activités</h1>
          <button onClick={loadMessages} className="px-4 py-2 bg-[#22b455] text-white rounded-xl">Rafraîchir</button>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white/10 border border-white/20 rounded-xl p-8 text-center text-white">
            <Mail className="w-8 h-8 mx-auto mb-2" />
            Aucun message lié à vos activités.
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl divide-y divide-white/10">
            {messages.map((m) => (
              <div key={m._id} className="p-4 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="font-semibold text-lg">{m.subject || "Message"}</div>
                      {m.activityId && (
                        <span className="text-xs bg-emerald-600/20 text-emerald-200 px-2 py-0.5 rounded-full">
                          Activité: {m.activityId?.name || "Associée"}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-white/70 mb-3 flex items-center gap-3">
                      <span>{m.name}</span>
                      <span>•</span>
                      <span>{m.email}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(m.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="text-white/90">{m.message}</div>

                    {m.adminReply && (
                      <div className="mt-3 bg-green-500/10 border-l-4 border-green-400 p-3 rounded-r">
                        <div className="flex items-center gap-2 text-green-300 font-medium mb-1">
                          <CheckCircle className="w-4 h-4" /> Réponse envoyée
                        </div>
                        <div className="text-white/90">{m.adminReply}</div>
                      </div>
                    )}
                  </div>
                  {!m.adminReply && (
                    <button onClick={() => setSelectedMessage(m)} className="p-2 text-sky-300 hover:bg-sky-500/10 rounded-lg">
                      <Reply className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
              <h3 className="text-xl font-bold mb-3">Répondre à {selectedMessage.name}</h3>
              <div className="mb-4 p-3 bg-slate-50 rounded border border-slate-200">
                <div className="text-sm text-slate-600 mb-1">Message original</div>
                <div className="text-slate-800">{selectedMessage.message}</div>
              </div>
              <textarea
                value={replyText}
                onChange={(e)=>setReplyText(e.target.value)}
                rows={6}
                className="w-full border rounded-xl p-3 mb-4"
                placeholder="Votre réponse"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={()=>{setSelectedMessage(null); setReplyText("");}} className="px-4 py-2 rounded-xl border">Annuler</button>
                <button onClick={()=>handleReply(selectedMessage._id)} className="px-4 py-2 rounded-xl bg-[#22b455] text-white inline-flex items-center gap-2">
                  <Send className="w-4 h-4" /> Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachMessages;


