import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send } from 'lucide-react';

export default function ChatScreen({ convo, onBack, onSendMessage }) {
  const [messages, setMessages] = useState(convo.messages);
  const [newMsg, setNewMsg] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const send = () => {
    if (!newMsg.trim()) return;
    const msg = { from: 'you', text: newMsg.trim(), time: 'Just now' };
    setMessages(prev => [...prev, msg]);
    if (onSendMessage) onSendMessage(convo.id, msg);
    setNewMsg('');
  };

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
        background: 'rgba(22,22,22,0.92)', backdropFilter: 'blur(24px)',
        borderBottom: '0.5px solid var(--border)',
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><ChevronLeft size={20} /></button>
        <img src={convo.host.avatar} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{convo.host.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{convo.vehicle}</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ alignSelf: msg.from === 'you' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            <div style={{
              background: msg.from === 'you' ? 'var(--accent)' : 'var(--surface)',
              color: msg.from === 'you' ? 'var(--bg)' : 'var(--text)',
              padding: '10px 14px', borderRadius: 18,
              borderBottomRightRadius: msg.from === 'you' ? 4 : 18,
              borderBottomLeftRadius: msg.from === 'you' ? 18 : 4,
              fontSize: 15, lineHeight: 1.4,
              border: msg.from === 'you' ? 'none' : '1px solid var(--border)',
            }}>
              {msg.text}
            </div>
            <div style={{
              fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3,
              textAlign: msg.from === 'you' ? 'right' : 'left', padding: '0 4px',
            }}>{msg.time}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 16px', paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 20px))',
        background: 'var(--surface)', borderTop: '0.5px solid var(--border)',
        display: 'flex', gap: 10, alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        <input
          className="ios-input"
          placeholder="Message..."
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          style={{ flex: 1, borderRadius: 22, padding: '11px 18px' }}
        />
        <button
          onClick={send}
          disabled={!newMsg.trim()}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: newMsg.trim() ? 'var(--accent)' : 'var(--surface-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background 0.15s',
          }}
        >
          <Send size={17} color={newMsg.trim() ? 'var(--bg)' : 'var(--text-tertiary)'} />
        </button>
      </div>
    </div>
  );
}
