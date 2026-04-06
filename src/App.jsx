import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { Search, Heart, Car, MessageSquare, User, Star } from 'lucide-react';
import useIsDesktop from './hooks/useIsDesktop';
import AuthModal from './components/AuthModal';
import SearchTab from './pages/mobile/SearchTab';
import FavoritesTab from './pages/mobile/FavoritesTab';
import TripsTab from './pages/mobile/TripsTab';
import MessagesTab from './pages/mobile/MessagesTab';
import ProfileTab from './pages/mobile/ProfileTab';
import CarDetailPage from './pages/mobile/CarDetailPage';
import BookingFlow from './pages/mobile/BookingFlow';
import VerificationFlow from './pages/mobile/VerificationFlow';
import ListCarFlow from './pages/mobile/ListCarFlow';
import TripDetailPage from './pages/mobile/TripDetailPage';
import ChatScreen from './pages/mobile/ChatScreen';
import HostProfilePage from './pages/mobile/HostProfilePage';
import { HowItWorksPage, TrustSafetyPage, InsurancePage, CancellationPage, AboutPage, CareersPage, BlogPage } from './pages/mobile/ContentPages';
import Footer from './components/Footer';
import { useTheme } from './hooks/useTheme';
import './styles/global.css';

const TABS = [
  { id: 'search', label: 'Search', icon: Search },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'trips', label: 'Trips', icon: Car },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'profile', label: 'Profile', icon: User },
];

// Reusable sub-screen wrapper
function SubScreen({ title, onBack, children }) {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', paddingBottom: 40 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--glass)', backdropFilter: 'blur(24px)', borderBottom: '0.5px solid var(--border)' }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 600 }}>{title}</span>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  );
}

// Sub-screen content
import { ChevronLeft, CreditCard as CreditCardIcon, Bell, Shield, Trash2, Plus, ChevronRight } from 'lucide-react';

const PaymentMethodsContent = (
  <div>
    <div className="ios-group" style={{ marginBottom: 16 }}>
      <div className="ios-group-item" style={{ padding: '14px 16px' }}>
        <div style={{ width: 40, height: 28, background: 'var(--surface-3)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CreditCardIcon size={16} /></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 500 }}>•••• •••• •••• 4242</div><div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Visa · Exp 01/2029</div></div>
        <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, background: 'var(--success-bg)', padding: '2px 8px', borderRadius: 'var(--r-pill)' }}>Default</span>
      </div>
      <div className="ios-group-item" style={{ padding: '14px 16px' }}>
        <div style={{ width: 40, height: 28, background: 'var(--surface-3)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CreditCardIcon size={16} /></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 500 }}>•••• •••• •••• 8891</div><div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Mastercard · Exp 06/2027</div></div>
      </div>
    </div>
    <button className="btn-secondary" style={{ gap: 8 }}><Plus size={16} /> Add payment method</button>
    <div style={{ marginTop: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 8 }}>OTHER</div>
      <div className="ios-group">
        <div className="ios-group-item"><span style={{ fontSize: 16, marginRight: 4 }}>🍎</span><span style={{ flex: 1, fontSize: 15 }}>Apple Pay</span><span style={{ fontSize: 13, color: 'var(--success)' }}>Connected</span></div>
        <div className="ios-group-item"><span style={{ fontSize: 16, marginRight: 4 }}>🅿️</span><span style={{ flex: 1, fontSize: 15 }}>PayPal</span><span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Not connected</span><ChevronRight size={14} color="var(--text-tertiary)" /></div>
      </div>
    </div>
  </div>
);

const NotificationsContent = (
  <div>
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 8 }}>PUSH NOTIFICATIONS</div>
    <div className="ios-group" style={{ marginBottom: 20 }}>
      {['Booking updates', 'Messages', 'Trip reminders', 'Promotions & deals'].map((item, i) => (
        <div key={item} className="ios-group-item" style={{ padding: '14px 16px' }}>
          <span style={{ flex: 1, fontSize: 15 }}>{item}</span>
          <div style={{ width: 50, height: 30, borderRadius: 15, background: i < 3 ? 'var(--success)' : 'var(--surface-3)', padding: 2 }}>
            <div style={{ width: 26, height: 26, borderRadius: 13, background: '#fff', transform: i < 3 ? 'translateX(20px)' : 'translateX(0)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          </div>
        </div>
      ))}
    </div>
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 8 }}>EMAIL</div>
    <div className="ios-group">
      {['Booking confirmations', 'Receipts', 'Newsletter'].map((item, i) => (
        <div key={item} className="ios-group-item" style={{ padding: '14px 16px' }}>
          <span style={{ flex: 1, fontSize: 15 }}>{item}</span>
          <div style={{ width: 50, height: 30, borderRadius: 15, background: i < 2 ? 'var(--success)' : 'var(--surface-3)', padding: 2 }}>
            <div style={{ width: 26, height: 26, borderRadius: 13, background: '#fff', transform: i < 2 ? 'translateX(20px)' : 'translateX(0)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const HelpCenterContent = (
  <div>
    <div style={{ marginBottom: 20 }}>
      <input className="ios-input" placeholder="Search help articles..." style={{ marginBottom: 16 }} />
    </div>
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 8 }}>POPULAR TOPICS</div>
    <div className="ios-group" style={{ marginBottom: 20 }}>
      {['How to book a car', 'Cancellation & refund policy', 'Protection packages explained', 'Pick-up & return process', 'What if the car breaks down?', 'How to contact your host', 'ID verification help', 'Payment issues'].map(item => (
        <div key={item} className="ios-group-item" style={{ padding: '14px 16px' }}>
          <span style={{ flex: 1, fontSize: 15 }}>{item}</span>
          <ChevronRight size={14} color="var(--text-tertiary)" />
        </div>
      ))}
    </div>
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 8 }}>CONTACT</div>
    <div className="ios-group">
      <div className="ios-group-item" style={{ padding: '14px 16px' }}><span style={{ flex: 1, fontSize: 15 }}>Chat with support</span><span style={{ fontSize: 12, color: 'var(--success)' }}>Online</span></div>
      <div className="ios-group-item" style={{ padding: '14px 16px' }}><span style={{ flex: 1, fontSize: 15 }}>Call us</span><span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>1-866-RIDE</span></div>
      <div className="ios-group-item" style={{ padding: '14px 16px' }}><span style={{ flex: 1, fontSize: 15 }}>Email support</span><ChevronRight size={14} color="var(--text-tertiary)" /></div>
    </div>
  </div>
);

const TermsContent = (
  <div>
    <div className="ios-group" style={{ marginBottom: 20 }}>
      {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Rental Protection Package Terms', 'Vehicle Rental Agreement', 'Community Guidelines', 'Non-Discrimination Policy'].map(item => (
        <div key={item} className="ios-group-item" style={{ padding: '14px 16px' }}>
          <span style={{ flex: 1, fontSize: 15 }}>{item}</span>
          <ChevronRight size={14} color="var(--text-tertiary)" />
        </div>
      ))}
    </div>
    <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
      RIDE v1.0 · A vertical of Outdoorsy<br />© 2026 Ride, Inc. All rights reserved.
    </div>
  </div>
);

const EarningsContent = (
  <div>
    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
      <div style={{ flex: 1, background: 'var(--accent)', borderRadius: 'var(--r-md)', padding: 16 }}>
        <div style={{ fontSize: 12, color: 'rgba(10,10,10,0.6)' }}>Total earnings</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--bg)' }}>$30,740</div>
      </div>
      <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>This month</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>$3,690</div>
      </div>
    </div>
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 8 }}>RECENT PAYOUTS</div>
    <div className="ios-group">
      {[{ date: 'Mar 28', amount: '$1,240.00', status: 'Paid' }, { date: 'Mar 14', amount: '$890.00', status: 'Paid' }, { date: 'Feb 28', amount: '$1,560.00', status: 'Paid' }, { date: 'Feb 14', amount: '$920.00', status: 'Paid' }].map((p, i) => (
        <div key={i} className="ios-group-item" style={{ padding: '14px 16px' }}>
          <span style={{ flex: 1, fontSize: 15 }}>{p.date}</span>
          <span style={{ fontSize: 15, fontWeight: 600, marginRight: 8 }}>{p.amount}</span>
          <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, background: 'var(--success-bg)', padding: '2px 8px', borderRadius: 'var(--r-pill)' }}>{p.status}</span>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 8 }}>PAYOUT METHOD</div>
      <div className="ios-group">
        <div className="ios-group-item" style={{ padding: '14px 16px' }}>
          <span style={{ flex: 1, fontSize: 15 }}>Bank account ····6789</span>
          <span style={{ fontSize: 13, color: 'var(--success)' }}>Active</span>
        </div>
      </div>
    </div>
  </div>
);

const HostReviewsContent = (
  <div>
    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
      <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent-text)' }}>4.9</div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Average rating</div>
      </div>
      <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 700 }}>164</div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Total reviews</div>
      </div>
    </div>
    {[
      { name: 'Sarah M.', rating: 5, text: 'Incredible experience! Car was spotless and Jeff was super responsive.', date: 'Mar 20' },
      { name: 'David K.', rating: 5, text: 'Best rental experience ever. Will definitely book again.', date: 'Mar 15' },
      { name: 'Jennifer L.', rating: 4, text: 'Great car, easy pickup. Minor wait on return but overall excellent.', date: 'Mar 8' },
      { name: 'Michael R.', rating: 5, text: 'Professional fleet operator. Car was perfect for our trip.', date: 'Feb 28' },
    ].map((r, i) => (
      <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '14px 16px', marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</span>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{r.date}</span>
        </div>
        <div style={{ display: 'flex', gap: 1, marginBottom: 6 }}>
          {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={12} fill="currentColor" color="var(--accent)" />)}
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{r.text}</p>
      </div>
    ))}
  </div>
);

function AppShell() {
  useTheme();
  const [activeTab, setActiveTab] = useState('search');
  const [stack, setStack] = useState([]); // navigation stack for push/pop
  const [lastBooking, setLastBooking] = useState(null); // tracks the most recent booking
  const [favoriteIds, setFavoriteIds] = useState(new Set(['9', '12', '19', '22'])); // default saved cars
  const [conversations, setConversations] = useState([
    { id: 1, host: { name: 'Marcus J.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }, vehicle: '2024 Tesla Model Y', lastMessage: "Looking forward to your trip! I'll send the pickup address the day before.", time: '2h ago', unread: true, messages: [{ from: 'you', text: "Hi Marcus! I just booked your Tesla for next week. Any special instructions for pickup?", time: '3h ago' }, { from: 'host', text: "Hey! Great to hear. Pickup is at my driveway — super easy.", time: '2h ago' }, { from: 'host', text: "Looking forward to your trip! I'll send the pickup address the day before.", time: '2h ago' }] },
    { id: 2, host: { name: 'Sarah K.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' }, vehicle: '2025 Ford Mustang', lastMessage: 'Thanks for the great review! Hope to host you again.', time: '3d ago', unread: false, messages: [{ from: 'you', text: "Just returned the Mustang. Amazing car, thanks so much!", time: '3d ago' }, { from: 'host', text: "Thanks for the great review! Hope to host you again.", time: '3d ago' }] },
    { id: 3, host: { name: 'David R.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }, vehicle: '2024 Jeep Wrangler', lastMessage: 'The Wrangler is ready for Sedona! Full tank and top already off.', time: '1w ago', unread: false, messages: [{ from: 'you', text: "Hey David, do you recommend taking the Wrangler to Sedona?", time: '1w ago' }, { from: 'host', text: "Absolutely! It's perfect for it. The red rocks trails are incredible.", time: '1w ago' }, { from: 'host', text: "The Wrangler is ready for Sedona! Full tank and top already off.", time: '1w ago' }] },
  ]);
  const { isLoggedIn, openLogin, user, markVerified } = useAuth();
  const isDesktop = useIsDesktop();

  const toggleFavorite = (carId) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(carId)) next.delete(carId);
      else next.add(carId);
      return next;
    });
  };

  const addMessage = (convoId, message) => {
    setConversations(prev => {
      if (!prev) return prev; // handled in ChatScreen
      return prev.map(c => c.id === convoId ? { ...c, messages: [...c.messages, message], lastMessage: message.text, time: 'Just now' } : c);
    });
  };

  // Push a screen onto the stack (like iOS push navigation)
  const push = (screen, props = {}) => {
    setStack(prev => [...prev, { screen, props }]);
  };

  // Pop back
  const pop = () => {
    setStack(prev => prev.slice(0, -1));
  };

  // Pop to root (tab level)
  const popToRoot = () => {
    setStack([]);
  };

  const [tabKey, setTabKey] = useState(0);

  const switchTab = (tabId) => {
    if (tabId === activeTab && stack.length === 0) {
      // Tapping the same tab — reset it (close modals, scroll to top)
      setTabKey(k => k + 1);
      return;
    }
    setActiveTab(tabId);
    setStack([]);
    // Open login modal for protected tabs if not logged in
    if (tabId !== 'search' && tabId !== 'profile' && !isLoggedIn) {
      openLogin();
    }
  };

  // Render the top of the navigation stack, or the active tab
  const currentScreen = stack.length > 0 ? stack[stack.length - 1] : null;

  const renderContent = () => {
    if (currentScreen) {
      switch (currentScreen.screen) {
        case 'carDetail':
          return <CarDetailPage carId={currentScreen.props.carId} carData={currentScreen.props.carData} searchDates={currentScreen.props.searchDates} onBack={pop} onBook={(car, dates) => push('booking', { car, dates })} onViewHost={(host) => push('hostProfile', { host })} isFavorite={favoriteIds.has(currentScreen.props.carId)} onToggleFavorite={() => toggleFavorite(currentScreen.props.carId)} />;
        case 'booking':
          return <BookingFlow car={currentScreen.props.car} dates={currentScreen.props.dates} onBack={pop} onComplete={(bookingData) => {
            setLastBooking(bookingData);
            setActiveTab('trips');
            setStack([]);
          }} />;
        case 'verification':
          return <VerificationFlow onBack={pop} onComplete={() => { markVerified(); pop(); }} />;
        case 'listCar':
          return <ListCarFlow onBack={pop} onComplete={() => { popToRoot(); setActiveTab('profile'); }} />;
        case 'paymentMethods':
          return <SubScreen title="Payment methods" onBack={pop}>{PaymentMethodsContent}</SubScreen>;
        case 'notifications':
          return <SubScreen title="Notifications" onBack={pop}>{NotificationsContent}</SubScreen>;
        case 'helpCenter':
          return <SubScreen title="Help center" onBack={pop}>{HelpCenterContent}</SubScreen>;
        case 'termsPrivacy':
          return <SubScreen title="Terms & privacy" onBack={pop}>{TermsContent}</SubScreen>;
        case 'earnings':
          return <SubScreen title="Earnings" onBack={pop}>{EarningsContent}</SubScreen>;
        case 'hostReviews':
          return <SubScreen title="Reviews" onBack={pop}>{HostReviewsContent}</SubScreen>;
        case 'howItWorks':
          return <HowItWorksPage onBack={pop} />;
        case 'trustSafety':
          return <TrustSafetyPage onBack={pop} />;
        case 'insurance':
          return <InsurancePage onBack={pop} />;
        case 'cancellation':
          return <CancellationPage onBack={pop} />;
        case 'about':
          return <AboutPage onBack={pop} />;
        case 'careers':
          return <CareersPage onBack={pop} />;
        case 'blog':
          return <BlogPage onBack={pop} />;
        case 'chat':
          return <ChatScreen convo={currentScreen.props.convo} onBack={pop} onSendMessage={(convoId, msg) => {
            setConversations(prev => {
              // Update existing convo or add new one
              const exists = prev.find(c => c.id === convoId);
              if (exists) {
                return prev.map(c => c.id === convoId ? { ...c, messages: [...c.messages, msg], lastMessage: msg.text, time: 'Just now' } : c);
              } else {
                const convo = currentScreen.props.convo;
                return [{ ...convo, messages: [...convo.messages, msg], lastMessage: msg.text, time: 'Just now' }, ...prev];
              }
            });
          }} />;
        case 'hostProfile':
          return <HostProfilePage
            host={currentScreen.props.host}
            onBack={pop}
            onSelectCar={(id) => push('carDetail', { carId: id })}
            onMessage={() => {
              const h = currentScreen.props.host;
              push('chat', { convo: { id: Date.now(), host: h, vehicle: 'General inquiry', messages: [{ from: 'you', text: `Hi ${h.name}! I'm interested in renting one of your vehicles.`, time: 'Just now' }] } });
            }}
          />;
        case 'tripDetail':
          return <TripDetailPage
            trip={currentScreen.props.trip}
            onBack={pop}
            onVerify={() => push('verification')}
            onMessage={() => {
              const v = currentScreen.props.trip.vehicle;
              push('chat', { convo: { id: Date.now(), host: v.host, vehicle: `${v.year} ${v.make} ${v.model}`, messages: [{ from: 'you', text: `Hi! I have a question about my upcoming trip with your ${v.year} ${v.make} ${v.model}.`, time: 'Just now' }] } });
            }}
            onViewCar={() => push('carDetail', { carId: currentScreen.props.trip.vehicle.id })}
          />;
        default:
          return null;
      }
    }

    switch (activeTab) {
      case 'search': return <SearchTab key={tabKey} onSelectCar={(id, searchDates) => push('carDetail', { carId: id, searchDates, carData: searchDates?.car })} />;
      case 'favorites': return <FavoritesTab favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} onSelectCar={(id) => push('carDetail', { carId: id })} />;
      case 'trips': return <TripsTab lastBooking={lastBooking} onVerify={() => push('verification')} onSelectTrip={(trip) => push('tripDetail', { trip })} />;
      case 'messages': return <MessagesTab conversations={conversations} onOpenChat={(convo) => push('chat', { convo })} />;
      case 'profile': return <ProfileTab onListCar={() => push('listCar')} onVerify={() => push('verification')} onNavigate={(screen) => push(screen)} />;
      default: return null;
    }
  };

  const showTabBar = stack.length === 0;

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <AuthModal />

      {/* Desktop Top Navigation */}
      <nav className="desktop-nav">
        <div className="desktop-nav-logo">
          <div>
            <span className="text-gold">RIDE</span>
            <div style={{ fontSize: 9, color: 'var(--text-tertiary)', fontWeight: 400, letterSpacing: '0.04em', marginTop: -2 }}>
              powered by <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Outdoorsy</span>
            </div>
          </div>
        </div>
        <div className="desktop-nav-links">
          {TABS.map(tab => {
            const active = activeTab === tab.id && stack.length === 0;
            const Icon = tab.icon;
            const hasNotif = tab.id === 'messages' && isLoggedIn;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`desktop-nav-link ${active ? 'active' : ''}`}
              >
                <Icon size={18} fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 2.5 : 1.8} />
                {tab.label}
                {hasNotif && <span className="nav-badge" />}
              </button>
            );
          })}
        </div>
        <div className="desktop-nav-actions">
          {isLoggedIn && user ? (
            <button onClick={() => switchTab('profile')}>
              <img src={user.avatar} alt="" className="desktop-nav-avatar" />
            </button>
          ) : (
            <button className="desktop-nav-login" onClick={openLogin}>Log in</button>
          )}
        </div>
      </nav>

      {/* Content area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
          key={currentScreen ? `stack-${stack.length}` : activeTab}
          className={currentScreen ? 'page-enter' : ''}
        >
          {renderContent()}
          {/* Desktop footer — show on tab-level pages */}
          {isDesktop && showTabBar && <Footer
            onNavigate={(screen) => push(screen)}
            onSwitchTab={(tabId) => switchTab(tabId)}
            onSearchCity={(city) => { setActiveTab('search'); setStack([]); }}
          />}
          {/* Bottom spacer for tab bar — mobile only */}
          {showTabBar && !isDesktop && <div style={{ height: 'var(--tab-height)' }} />}
        </div>
      </div>

      {/* Bottom Tab Bar — mobile only */}
      {showTabBar && (
        <div className="mobile-tab-bar" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          height: 'var(--tab-height)',
          background: 'var(--glass)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderTop: '0.5px solid var(--border-light)',
          display: 'flex', alignItems: 'flex-start',
          paddingTop: 6,
          paddingBottom: 'env(safe-area-inset-bottom, 20px)',
          zIndex: 100,
        }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            const hasNotif = tab.id === 'messages' && isLoggedIn;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 2, padding: '4px 0',
                  color: active ? 'var(--accent)' : 'var(--text-tertiary)',
                  transition: 'color 0.15s',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Icon size={24} fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 2.5 : 1.8} />
                  {hasNotif && (
                    <div style={{
                      position: 'absolute', top: -2, right: -6,
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'var(--error)',
                    }} />
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: active ? 600 : 500 }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppShell />
      </BookingProvider>
    </AuthProvider>
  );
}
