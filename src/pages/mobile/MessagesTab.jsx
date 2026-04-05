import { MessageSquare } from 'lucide-react';

export default function MessagesTab({ conversations, onOpenChat }) {
  return (
    <div style={{ minHeight: '100%' }}>
      <div style={{
        padding: '16px 16px 12px',
        background: 'rgba(22,22,22,0.85)',
        backdropFilter: 'blur(24px)',
      }}>
        <h1 className="text-large-title">Messages</h1>
      </div>

      <div style={{ padding: '0 16px' }}>
        {conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <MessageSquare size={48} color="var(--text-tertiary)" style={{ marginBottom: 16 }} />
            <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 6 }}>No messages</div>
            <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Messages with hosts will appear here</div>
          </div>
        ) : (
          <div className="ios-group" style={{ marginTop: 8 }}>
            {conversations.map(convo => (
              <button key={convo.id} className="ios-group-item" onClick={() => onOpenChat(convo)} style={{ padding: '14px 16px' }}>
                <div style={{ position: 'relative' }}>
                  <img src={convo.host.avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                  {convo.unread && (
                    <div style={{
                      position: 'absolute', top: 0, right: 0,
                      width: 10, height: 10, borderRadius: '50%',
                      background: 'var(--accent)', border: '2px solid var(--surface)',
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontWeight: convo.unread ? 600 : 400, fontSize: 16 }}>{convo.host.name}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{convo.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 2 }}>{convo.vehicle}</div>
                  <div style={{
                    fontSize: 14, color: convo.unread ? 'var(--text)' : 'var(--text-tertiary)',
                    fontWeight: convo.unread ? 500 : 400,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{convo.lastMessage}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
