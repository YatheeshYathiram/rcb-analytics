import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PlayersHub from './components/PlayersHub';
import PlayerProfile from './components/PlayerProfile';
import CompareArena from './components/CompareArena';
import AuctionHistory from './components/AuctionHistory';
import SeasonAnalytics from './components/SeasonAnalytics';
import AdminPanel from './components/AdminPanel';
import { Shield, Search, Moon, Sun, User, Menu, X } from 'lucide-react';

function AppContent() {
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbMode, setDbMode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch all players and dashboard statistics on mount
  const refreshData = async () => {
    setLoading(true);
    try {
      const playersRes = await fetch('/api/players');
      if (playersRes.ok) {
        const playersData = await playersRes.json();
        setPlayers(playersData);
      }

      const statsRes = await fetch('/api/players/stats/dashboard');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
        setDbMode(statsData.dbStatus?.mode || 'Offline');
      }
    } catch (error) {
      console.error('[App] Error syncing data with Express backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    const savedFavs = localStorage.getItem('rcb_analytics_favs');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  const handleToggleFavorite = (id) => {
    let next;
    if (favorites.includes(id)) {
      next = favorites.filter(fid => fid !== id);
    } else {
      next = [...favorites, id];
    }
    setFavorites(next);
    localStorage.setItem('rcb_analytics_favs', JSON.stringify(next));
  };

  const handleSelectByName = (name) => {
    const cleanName = name.split(' (')[0].trim().toLowerCase();
    const match = players.find(p => p.name.toLowerCase() === cleanName || p.name.toLowerCase().includes(cleanName));
    if (match) {
      setSelectedPlayerId(match._id || match.id);
    } else {
      alert(`Player "${name}" is not seeded in the database yet. You can add them in the Admin Panel!`);
    }
  };

  // Admin Actions
  const handleAddPlayer = async (newPlayer) => {
    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlayer)
      });
      if (res.ok) {
        await refreshData();
        alert('Player successfully added to squad!');
        return true;
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (e) {
      alert(`Connection Error: ${e.message}`);
    }
    return false;
  };

  const handleUpdatePlayer = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/players/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        await refreshData();
        alert('Player details updated successfully!');
        return true;
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (e) {
      alert(`Connection Error: ${e.message}`);
    }
    return false;
  };

  const handleDeletePlayer = async (id) => {
    try {
      const res = await fetch(`/api/players/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshData();
        alert('Player removed from squad roster.');
      } else {
        alert('Error deleting player.');
      }
    } catch (e) {
      alert(`Connection Error: ${e.message}`);
    }
  };

  const handleImportPlayers = async (playersArray, reset) => {
    try {
      const res = await fetch('/api/players/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ players: playersArray, reset })
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const selectedPlayer = players.find(p => p._id === selectedPlayerId || p.id === selectedPlayerId);

  // Search filter
  const filteredSearch = searchQuery.trim() === '' ? [] : players.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/players', label: 'Players' },
    { path: '/compare', label: 'Compare Arena' },
    { path: '/auction', label: 'Auction History' },
    { path: '/seasons', label: 'Season Analytics' },
    { path: '/admin', label: 'Admin Portal' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-rcbBlack text-rcbTextPrimary' : 'bg-gray-100 text-gray-900'}`}>
      
      {/* Sticky Navigation Bar */}
      <nav className={`sticky top-0 z-40 w-full transition-all duration-300 border-b border-rcbBorder/30 backdrop-blur-md ${darkMode ? 'bg-rcbBlack/90' : 'bg-white/90'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Left */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <svg viewBox="0 0 100 100" className="w-9 h-9 transition-transform group-hover:scale-105">
                  <polygon points="50,10 90,85 10,85" fill="#D81B3A" stroke="#D4AF37" strokeWidth="4" />
                  <text x="50" y="68" fontSize="22" fontFamily="'Poppins', sans-serif" fontWeight="900" fill="#D4AF37" textAnchor="middle">RCB</text>
                </svg>
                <span className="hidden md:block font-heading font-extrabold tracking-wide text-lg text-transparent bg-clip-text bg-gradient-to-r from-rcbTextPrimary to-rcbGold">
                  RCB PLAYER ANALYTICS
                </span>
              </Link>
            </div>

            {/* Desktop Center Navigation links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`px-3 py-2 rounded-md text-sm font-medium tracking-wide transition-colors duration-200 ${
                      isActive 
                        ? 'text-rcbRed border-b-2 border-rcbRed font-bold' 
                        : 'text-rcbTextSecondary hover:text-rcbGold'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Center Search Bar (centered absolute on large layout, inline otherwise) */}
            <div className="relative flex-1 max-w-xs mx-4 hidden sm:block">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-rcbTextSecondary/80" />
                <input 
                  type="text" 
                  className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-full border bg-rcbCharcoal/60 outline-none transition-all duration-300 ${
                    darkMode 
                      ? 'border-rcbBorder/40 text-rcbTextPrimary focus:border-rcbRed' 
                      : 'border-gray-300 text-gray-900 focus:border-rcbRed bg-gray-50'
                  }`}
                  placeholder="Quick search cricketer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                />
              </div>

              {/* Search dropdown suggestions */}
              {searchFocused && filteredSearch.length > 0 && (
                <div className="absolute top-11 left-0 w-full rounded-xl border border-rcbBorder/30 bg-rcbCharcoal shadow-lg overflow-hidden z-50 text-xs">
                  {filteredSearch.map(player => (
                    <button 
                      key={player._id || player.id}
                      onClick={() => {
                        setSelectedPlayerId(player._id || player.id);
                        setSearchQuery('');
                      }}
                      className="w-full px-4 py-2.5 text-left text-rcbTextPrimary hover:bg-rcbRed hover:text-white transition-colors duration-150 flex items-center justify-between"
                    >
                      <span className="font-semibold">{player.name}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        player.status === 'Released' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {player.status === 'Released' ? 'Released' : 'Active'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Icons: Theme Toggle, Profile, DB Pill, Mobile Menu Toggle */}
            <div className="flex items-center space-x-3">
              {/* DB Status Pill */}
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full border border-rcbBorder/30 bg-rcbCharcoal/40 text-[10px] font-bold">
                <span className={`w-1.5 h-1.5 rounded-full ${dbMode.includes('Mongo') ? 'bg-successGreen animate-pulse' : 'bg-warningOrange'}`}></span>
                <span className="text-rcbTextSecondary text-[9px]">DB: {dbMode.includes('Mongo') ? 'Cloud' : 'Local JSON'}</span>
              </div>

              {/* Dark/Light mode button */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1.5 rounded-lg border border-rcbBorder/30 hover:bg-rcbCharcoal/60 transition-colors ${darkMode ? 'text-rcbGold' : 'text-gray-600'}`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Admin profile shortcut button */}
              <button 
                onClick={() => navigate('/admin')}
                className="p-1.5 rounded-lg border border-rcbBorder/30 hover:bg-rcbCharcoal/60 transition-colors text-rcbTextSecondary"
              >
                <User size={18} />
              </button>

              {/* Mobile menu toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg border border-rcbBorder/30 text-rcbTextSecondary"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-2 pt-2 pb-4 space-y-1 bg-rcbBlack border-b border-rcbBorder/30">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-semibold transition-colors duration-150 ${
                    isActive ? 'text-white bg-rcbRed' : 'text-rcbTextSecondary hover:bg-rcbCharcoal'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Main Page Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-6">
            <div className="h-64 bg-rcbCharcoal animate-pulse rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-48 bg-rcbCharcoal animate-pulse rounded-2xl"></div>
              ))}
            </div>
          </div>
        ) : (
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  stats={stats} 
                  onSelectPlayerByName={handleSelectByName} 
                />
              } 
            />
            <Route 
              path="/players" 
              element={
                <PlayersHub 
                  players={players} 
                  favorites={favorites} 
                  onToggleFavorite={handleToggleFavorite} 
                  onSelectPlayer={setSelectedPlayerId} 
                />
              } 
            />
            <Route 
              path="/compare" 
              element={
                <CompareArena 
                  players={players} 
                />
              } 
            />
            <Route 
              path="/auction" 
              element={
                <AuctionHistory 
                  players={players} 
                  onSelectPlayerByName={handleSelectByName} 
                />
              } 
            />
            <Route 
              path="/seasons" 
              element={
                <SeasonAnalytics 
                  players={players} 
                  onSelectPlayerByName={handleSelectByName} 
                />
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminPanel 
                  players={players} 
                  onAddPlayer={handleAddPlayer} 
                  onUpdatePlayer={handleUpdatePlayer} 
                  onDeletePlayer={handleDeletePlayer} 
                  onImportPlayers={handleImportPlayers} 
                />
              } 
            />
          </Routes>
        )}
      </main>

      {/* Footer Branding */}
      <footer className={`border-t py-8 px-4 text-center text-xs tracking-wider border-rcbBorder/30 ${darkMode ? 'bg-rcbBlack text-rcbTextSecondary' : 'bg-gray-200 text-gray-600'}`}>
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between md:flex-row gap-4">
          <div className="flex items-center space-x-2 text-left">
            <svg viewBox="0 0 100 100" className="w-6 h-6">
              <polygon points="50,10 90,85 10,85" fill="#D81B3A" stroke="#D4AF37" strokeWidth="4" />
              <text x="50" y="68" fontSize="22" fontFamily="sans-serif" fontWeight="900" fill="#D4AF37" textAnchor="middle">RCB</text>
            </svg>
            <div>
              <h4 className="font-bold text-rcbTextPrimary text-sm">Royal Challengers Bengaluru</h4>
              <p className="text-[10px] text-rcbTextSecondary">Official Fan-Powered Analytics Suite</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p>© 2026 RCB Player Analytics Hub. Inspired by ESPN Cricinfo & Sofascore aesthetics.</p>
            <p className="text-[10px] text-rcbTextSecondary/60 mt-1">This site is an independent statistics resource and has no official affiliation with the IPL or RCB franchise.</p>
          </div>
        </div>
      </footer>

      {/* Detailed Player Profile Modal Overlay */}
      {selectedPlayerId && selectedPlayer && (
        <PlayerProfile 
          player={selectedPlayer} 
          isFavorite={favorites.includes(selectedPlayerId)} 
          onToggleFavorite={handleToggleFavorite} 
          onClose={() => setSelectedPlayerId(null)} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
