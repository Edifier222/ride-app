import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    host: { name: 'Marcus J.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    vehicle: '2024 Tesla Model Y',
    lastMessage: "Looking forward to your trip! I'll send the pickup address the day before.",
    time: '2h ago',
    unread: true,
    messages: [
      { from: 'you', text: "Hi Marcus! I just booked your Tesla for next week. Any special instructions for pickup?", time: '3h ago' },
      { from: 'host', text: "Hey! Great to hear. Pickup is at my driveway — super easy.", time: '2h ago' },
      { from: 'host', text: "Looking forward to your trip! I'll send the pickup address the day before.", time: '2h ago' },
    ],
  },
  {
    id: 2,
    host: { name: 'Sarah K.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
    vehicle: '2025 Ford Mustang',
    lastMessage: 'Thanks for the great review! Hope to host you again.',
    time: '3d ago',
    unread: false,
    messages: [
      { from: 'you', text: "Just returned the Mustang. Amazing car, thanks so much!", time: '3d ago' },
      { from: 'host', text: "Thanks for the great review! Hope to host you again.", time: '3d ago' },
    ],
  },
  {
    id: 3,
    host: { name: 'David R.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    vehicle: '2024 Jeep Wrangler',
    lastMessage: 'The Wrangler is ready for Sedona! Full tank and top already off.',
    time: '1w ago',
    unread: false,
    messages: [
      { from: 'you', text: "Hey David, do you recommend taking the Wrangler to Sedona?", time: '1w ago' },
      { from: 'host', text: "Absolutely! It's perfect for it. The red rocks trails are incredible.", time: '1w ago' },
      { from: 'host', text: "The Wrangler is ready for Sedona! Full tank and top already off.", time: '1w ago' },
    ],
  },
];

export default function MessagesTab({ onOpenChat }) {
  const [convos] = useState(MOCK_CONVERSATIONS);

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
        {convos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <MessageSquare size={48} color="var(--text-tertiary)" style={{ marginBottom: 16 }} />
            <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 6 }}>No messages</div>
            <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Messages with hosts will appear here</div>
          </div>
        ) : (
          <div className="ios-group" style={{ marginTop: 8 }}>
            {convos.map(convo => (
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
