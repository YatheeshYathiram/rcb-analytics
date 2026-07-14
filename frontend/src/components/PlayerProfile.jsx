import React, { useState } from 'react';
import { X, Heart, Share2, Download, Award, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function PlayerProfile({ player, isFavorite, onToggleFavorite, onClose }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'contracts'

  if (!player) return null;

  const isReleased = player.status === 'Released';

  const formatPrice = (val) => {
    if (!val) return '₹0';
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(0)} Lakh`;
  };

  const handleShare = () => {
    const url = `${window.location.origin}/?player=${player._id || player.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      const printContent = `
        RCB Player Analytics Profile: ${player.name}
        Status: ${player.status}
        Role: ${player.role} (${player.nationality})
        Auction Price: ${formatPrice(player.auctionPrice)}
        Career Runs: ${player.battingStats?.runs || 0}
        Career Wickets: ${player.bowlingStats?.wickets || 0}
      `;
      alert(`Successfully downloaded PDF for ${player.name}!\n\nSummary:\n${printContent}`);
    }, 1500);
  };

  // Prepare trends chart data
  const trendData = player.seasonStats?.map(s => ({
    season: s.season.toString(),
    runs: s.runs || 0,
    wickets: s.wickets || 0,
    strikeRate: s.strikeRate || 0,
    economy: s.economy || 0
  })) || [];

  const hasBatting = player.battingStats && player.battingStats.matches > 0;
  const hasBowling = player.bowlingStats && player.bowlingStats.overs > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-rcbBlack/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-4xl rounded-2xl bg-rcbCharcoal border border-rcbBorder shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" 
        onClick={e => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-rcbBlack/40 text-rcbTextSecondary hover:text-white border border-rcbBorder/30 transition-all z-20"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Header Section (Image & Summary Details) */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start border-b border-rcbBorder/20 pb-6">
            
            {/* Player Avatar */}
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-rcbBorder/50 bg-rcbBlack/40 flex-shrink-0">
              <img 
                src={player.image} 
                alt={player.name} 
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = player.nationality === 'Indian' ? '/images/indian_face.png' : '/images/overseas_face1.png';
                }}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4 text-center md:text-left w-full">
              
              {/* Badges row */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  isReleased 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}>
                  {isReleased ? 'Released / Former' : 'Active Squad Roster'}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-rcbBlack/40 text-rcbTextSecondary text-[10px] font-bold uppercase">{player.nationality}</span>
                <span className="px-2.5 py-0.5 rounded bg-rcbBlack/40 text-rcbTextSecondary text-[10px] font-bold uppercase">{player.role}</span>
                {player.jerseyNumber && (
                  <span className="px-2.5 py-0.5 rounded bg-rcbRed/15 text-rcbRed text-[10px] font-bold">Jersey #{player.jerseyNumber}</span>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-rcbTextPrimary leading-none">{player.name}</h1>
                <p className="text-xs sm:text-sm text-rcbTextSecondary mt-2">
                  {player.generalInfo?.fullName || player.name} • {player.battingStyle} • {player.bowlingStyle !== 'N/A' ? player.bowlingStyle : 'No Bowling'}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                <button 
                  onClick={() => onToggleFavorite(player._id || player.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isFavorite 
                      ? 'border-rcbRed/50 bg-rcbRed/10 text-rcbRed' 
                      : 'border-rcbBorder bg-rcbCharcoal/60 text-rcbTextSecondary hover:text-rcbRed'
                  }`}
                >
                  <Heart size={14} fill={isFavorite ? '#D81B3A' : 'none'} />
                  {isFavorite ? 'My Favorite' : 'Add Favorite'}
                </button>
                <button 
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-xl border border-rcbBorder bg-rcbCharcoal/60 text-xs font-bold text-rcbTextSecondary hover:text-rcbGold hover:border-rcbGold/50 transition-all flex items-center gap-1.5"
                >
                  <Share2 size={14} />
                  {copied ? 'Link Copied!' : 'Share Profile'}
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="px-3 py-1.5 rounded-xl bg-rcbGold hover:bg-rcbGoldHover text-rcbBlack text-xs font-bold uppercase transition-all flex items-center gap-1.5"
                >
                  <Download size={14} />
                  {downloading ? 'Seeding...' : 'Download PDF'}
                </button>
              </div>

            </div>
          </div>

          {/* Quick Demographics Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-rcbBlack/30 border border-rcbBorder/10 text-xs">
            <div>
              <span className="text-rcbTextSecondary block">Born</span>
              <strong className="text-rcbTextPrimary">{player.generalInfo?.dob || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-rcbTextSecondary block">Age</span>
              <strong className="text-rcbTextPrimary">{player.age ? `${player.age} Years` : 'N/A'}</strong>
            </div>
            <div>
              <span className="text-rcbTextSecondary block">Height</span>
              <strong className="text-rcbTextPrimary">{player.generalInfo?.height || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-rcbTextSecondary block">Auction Bid</span>
              <strong className="text-rcbGold">{formatPrice(player.auctionPrice)}</strong>
            </div>
          </div>

          {/* Tab Selector Links */}
          <div className="flex border-b border-rcbBorder/30">
            <button 
              onClick={() => setActiveTab('stats')}
              className={`pb-2.5 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'stats' 
                  ? 'border-rcbRed text-rcbRed' 
                  : 'border-transparent text-rcbTextSecondary hover:text-rcbGold'
              }`}
            >
              Career & Season Stats
            </button>
            <button 
              onClick={() => setActiveTab('contracts')}
              className={`pb-2.5 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'contracts' 
                  ? 'border-rcbRed text-rcbRed' 
                  : 'border-transparent text-rcbTextSecondary hover:text-rcbGold'
              }`}
            >
              Contract History
            </button>
          </div>

          {/* TAB 1: Stats Content */}
          {activeTab === 'stats' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Stats aggregates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Batting details */}
                {hasBatting && (
                  <div className="glass-panel p-5 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-rcbGold uppercase tracking-wider flex items-center gap-1.5">
                      <Award size={16} /> Batting & Fielding Summary
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-rcbTextSecondary block">Matches</span>
                        <strong className="text-sm font-stats">{player.battingStats.matches}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">Runs</span>
                        <strong className="text-sm font-stats text-rcbGold">{player.battingStats.runs}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">High Score</span>
                        <strong className="text-sm font-stats">{player.battingStats.highestScore}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">Average</span>
                        <strong className="text-sm font-stats">{player.battingStats.average || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">Strike Rate</span>
                        <strong className="text-sm font-stats">{player.battingStats.strikeRate}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">100s / 50s</span>
                        <strong className="text-sm font-stats">{player.battingStats.hundreds} / {player.battingStats.fifties}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">4s / 6s</span>
                        <strong className="text-sm font-stats">{player.battingStats.boundaries || 0} / {player.battingStats.sixes || 0}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">Catches</span>
                        <strong className="text-sm font-stats">{player.fieldingStats?.catches || 0}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">Stumpings</span>
                        <strong className="text-sm font-stats">{player.fieldingStats?.stumpings || 0}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bowling summary details */}
                {hasBowling && (
                  <div className="glass-panel p-5 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-rcbRed uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp size={16} /> Bowling Summary
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-rcbTextSecondary block">Overs</span>
                        <strong className="text-sm font-stats">{player.bowlingStats.overs}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">Wickets</span>
                        <strong className="text-sm font-stats text-rcbRed">{player.bowlingStats.wickets}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">Economy</span>
                        <strong className="text-sm font-stats">{player.bowlingStats.economy}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">Best Bowling</span>
                        <strong className="text-sm font-stats">{player.bowlingStats.bestBowling}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">Average</span>
                        <strong className="text-sm font-stats">{player.bowlingStats.average || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">Strike Rate</span>
                        <strong className="text-sm font-stats">{player.bowlingStats.strikeRate || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-rcbTextSecondary block">Maidens</span>
                        <strong className="text-sm font-stats">{player.bowlingStats.maidens || 0}</strong>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Season Stats Breakdown Table */}
              {player.seasonStats && player.seasonStats.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-rcbTextPrimary tracking-wide">Season Breakdown (2021–2026)</h3>
                  <div className="overflow-x-auto rounded-xl border border-rcbBorder/30">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-rcbCharcoal/90 text-rcbTextSecondary font-bold border-b border-rcbBorder/30">
                        <tr>
                          <th className="p-3">Season</th>
                          <th className="p-3">Matches</th>
                          <th className="p-3">Runs</th>
                          <th className="p-3">Wickets</th>
                          <th className="p-3">Strike Rate</th>
                          <th className="p-3">Economy</th>
                          <th className="p-3">Average</th>
                          <th className="p-3">Catches</th>
                          <th className="p-3">POTM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rcbBorder/20">
                        {player.seasonStats.map(s => (
                          <tr key={s.season} className="hover:bg-rcbCharcoal/30">
                            <td className="p-3 font-stats font-bold text-rcbTextPrimary">{s.season}</td>
                            <td className="p-3 font-stats">{s.matches}</td>
                            <td className="p-3 font-stats font-semibold text-rcbGold">{s.runs || 0}</td>
                            <td className="p-3 font-stats font-semibold text-rcbRed">{s.wickets || 0}</td>
                            <td className="p-3 font-stats">{s.strikeRate || 'N/A'}</td>
                            <td className="p-3 font-stats">{s.economy || 'N/A'}</td>
                            <td className="p-3 font-stats">{s.average || 'N/A'}</td>
                            <td className="p-3 font-stats">{s.catches || 0}</td>
                            <td className="p-3 font-stats text-rcbGold">{s.potmAwards || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recharts Performance Trends */}
              {trendData.length > 1 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-rcbTextPrimary tracking-wide">Performance Trend Graph</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Runs Trend */}
                    {trendData.some(t => t.runs > 0) && (
                      <div className="glass-panel p-4 rounded-xl flex flex-col space-y-2">
                        <span className="text-[10px] font-bold text-rcbGold uppercase tracking-wider">Runs Scored Trend</span>
                        <div className="h-44 text-[10px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="season" stroke="var(--text-muted)" />
                              <YAxis stroke="var(--text-muted)" />
                              <Tooltip contentStyle={{ backgroundColor: '#1F232B', border: '1px solid rgba(255,255,255,0.08)' }} />
                              <Area type="monotone" dataKey="runs" name="Runs" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorRuns)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Wickets Trend */}
                    {trendData.some(t => t.wickets > 0) && (
                      <div className="glass-panel p-4 rounded-xl flex flex-col space-y-2">
                        <span className="text-[10px] font-bold text-rcbRed uppercase tracking-wider">Wickets Taken Trend</span>
                        <div className="h-44 text-[10px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorWickets" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#D81B3A" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#D81B3A" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="season" stroke="var(--text-muted)" />
                              <YAxis stroke="var(--text-muted)" />
                              <Tooltip contentStyle={{ backgroundColor: '#1F232B', border: '1px solid rgba(255,255,255,0.08)' }} />
                              <Area type="monotone" dataKey="wickets" name="Wickets" stroke="#D81B3A" strokeWidth={2} fillOpacity={1} fill="url(#colorWickets)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: Contracts Content */}
          {activeTab === 'contracts' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-rcbTextPrimary tracking-wide">Contract history</h3>
              {player.auctionHistory && player.auctionHistory.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-rcbBorder/30">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-rcbCharcoal/90 text-rcbTextSecondary font-bold border-b border-rcbBorder/30">
                      <tr>
                        <th className="p-3">Year</th>
                        <th className="p-3">Previous Team</th>
                        <th className="p-3">Base Price</th>
                        <th className="p-3">Final Contract Bid</th>
                        <th className="p-3">Transaction Mode</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rcbBorder/20">
                      {player.auctionHistory.map((item, idx) => (
                        <tr key={idx} className="hover:bg-rcbCharcoal/30">
                          <td className="p-3 font-stats font-bold text-rcbTextPrimary">{item.year}</td>
                          <td className="p-3 text-rcbTextSecondary">{item.previousFranchise || 'None'}</td>
                          <td className="p-3 font-stats">{formatPrice(item.basePrice)}</td>
                          <td className="p-3 font-stats font-bold text-rcbGold">{formatPrice(item.finalPrice)}</td>
                          <td className="p-3">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              item.retainedOrAuction === 'Retained' 
                                ? 'bg-rcbGold/20 text-rcbGold' 
                                : 'bg-rcbRed/20 text-rcbRed'
                            }`}>
                              {item.retainedOrAuction}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-rcbBlack/30 text-center rounded-xl text-rcbTextSecondary border border-rcbBorder/10">
                  No historical auction history seeded in database for {player.name}.
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
