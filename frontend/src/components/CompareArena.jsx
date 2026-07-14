import React, { useState, useMemo } from 'react';
import { Shield, Sparkles, Scale, Info } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function CompareArena({ players }) {
  const [selectedIds, setSelectedIds] = useState([]);

  // Max 3 players comparison limit
  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      if (selectedIds.length >= 3) {
        alert('You can compare a maximum of 3 players at once in the Compare Arena.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedPlayers = useMemo(() => {
    return players.filter(p => selectedIds.includes(p._id || p.id));
  }, [players, selectedIds]);

  // Format bids helper
  const formatPrice = (val) => {
    if (!val) return '₹0';
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(0)} Lakh`;
  };

  // 1. Radar Chart Data Prep (Attribute scores mapping 0-100 for normalization)
  const radarData = useMemo(() => {
    if (selectedPlayers.length === 0) return [];

    const attributes = [
      { key: 'runs', label: 'Runs Metric', max: 1500 },
      { key: 'wickets', label: 'Wickets Metric', max: 80 },
      { key: 'strikeRate', label: 'Strike Rate', max: 180 },
      { key: 'economy', label: 'Economy Score', max: 12, invert: true },
      { key: 'average', label: 'Batting Avg', max: 60 }
    ];

    return attributes.map(attr => {
      const dataPoint = { subject: attr.label };
      selectedPlayers.forEach((p, idx) => {
        let rawVal = 0;
        if (attr.key === 'runs') rawVal = p.battingStats?.runs || 0;
        if (attr.key === 'wickets') rawVal = p.bowlingStats?.wickets || 0;
        if (attr.key === 'strikeRate') rawVal = parseFloat(p.battingStats?.strikeRate) || 0;
        if (attr.key === 'average') rawVal = parseFloat(p.battingStats?.average) || 0;
        if (attr.key === 'economy') rawVal = parseFloat(p.bowlingStats?.economy) || 0;

        // Scale value 0 to 100
        let score = 0;
        if (attr.invert) {
          score = rawVal > 0 ? Math.max(0, 100 - (rawVal / attr.max) * 100) : 0;
        } else {
          score = Math.min(100, (rawVal / attr.max) * 100);
        }

        dataPoint[p.name] = Math.round(score);
      });
      return dataPoint;
    });
  }, [selectedPlayers]);

  const chartColors = ['#D81B3A', '#D4AF37', '#4F9CF9'];

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-rcbTextPrimary flex items-center gap-2">
          <Scale className="text-rcbGold" size={26} />
          Compare Arena
        </h1>
        <p className="text-sm text-rcbTextSecondary">
          Select 2 or 3 cricketers below to generate comparative attribute radar wheels and head-to-head metrics.
        </p>
      </div>

      {/* Roster Quick Selector */}
      <section className="glass-panel p-5 rounded-2xl border border-rcbBorder/30 space-y-4">
        <h3 className="text-xs font-bold text-rcbGold uppercase tracking-wider">Select players for comparison ({selectedIds.length}/3 chosen)</h3>
        
        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-2">
          {players.map(p => {
            const isChosen = selectedIds.includes(p._id || p.id);
            return (
              <button 
                key={p._id || p.id}
                onClick={() => handleToggleSelect(p._id || p.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                  isChosen 
                    ? 'bg-rcbRed text-white border-rcbRed' 
                    : 'bg-rcbCharcoal border-rcbBorder text-rcbTextSecondary hover:text-white hover:border-rcbGold'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </section>

      {selectedPlayers.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-2xl border border-rcbBorder/30 flex flex-col justify-center items-center space-y-2">
          <Info size={32} className="text-rcbTextSecondary/40" />
          <h3 className="text-sm font-semibold text-rcbTextSecondary">No cricketers selected yet</h3>
          <p className="text-xs text-rcbTextSecondary/50">Pick up to 3 players from the quick selector above to load charts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Radar attribute Chart */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col space-y-4">
            <h3 className="text-base font-bold text-rcbTextPrimary tracking-wide flex items-center gap-2">
              <Sparkles className="text-rcbGold" size={16} />
              Attribute Radar Comparison (Normalized)
            </h3>
            
            <div className="h-80 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="subject" stroke="var(--text-muted)" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" />
                  {selectedPlayers.map((p, idx) => (
                    <Radar 
                      key={p.id}
                      name={p.name} 
                      dataKey={p.name} 
                      stroke={chartColors[idx]} 
                      fill={chartColors[idx]} 
                      fillOpacity={0.25} 
                    />
                  ))}
                  <Legend />
                  <Tooltip contentStyle={{ backgroundColor: '#1F232B', border: '1px solid rgba(255,255,255,0.08)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Comparative Table */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col space-y-4">
            <h3 className="text-base font-bold text-rcbTextPrimary tracking-wide">Head-to-Head Statistics</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-rcbBorder/30">
                    <th className="p-3 text-rcbTextSecondary">Metric / Bio</th>
                    {selectedPlayers.map((p, idx) => (
                      <th key={p.id} className="p-3" style={{ color: chartColors[idx] }}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-rcbBorder/20 font-stats">
                  <tr>
                    <td className="p-3 font-semibold text-rcbTextSecondary">Role</td>
                    {selectedPlayers.map(p => (
                      <td key={p.id} className="p-3 text-rcbTextPrimary">{p.role}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-rcbTextSecondary">Status</td>
                    {selectedPlayers.map(p => (
                      <td key={p.id} className="p-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                          p.status === 'Released' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-rcbTextSecondary">Nationality</td>
                    {selectedPlayers.map(p => (
                      <td key={p.id} className="p-3 text-rcbTextPrimary">{p.nationality}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-rcbTextSecondary">Matches</td>
                    {selectedPlayers.map(p => (
                      <td key={p.id} className="p-3 text-rcbTextPrimary">{p.battingStats?.matches || 0}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-rcbTextSecondary">Career Runs</td>
                    {selectedPlayers.map(p => (
                      <td key={p.id} className="p-3 font-bold text-rcbGold">{p.battingStats?.runs || 0}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-rcbTextSecondary">Batting Avg</td>
                    {selectedPlayers.map(p => (
                      <td key={p.id} className="p-3 text-rcbTextPrimary">{p.battingStats?.average || 'N/A'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-rcbTextSecondary">Batting S/R</td>
                    {selectedPlayers.map(p => (
                      <td key={p.id} className="p-3 text-rcbTextPrimary">{p.battingStats?.strikeRate || 'N/A'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-rcbTextSecondary">Wickets</td>
                    {selectedPlayers.map(p => (
                      <td key={p.id} className="p-3 font-bold text-rcbRed">{p.bowlingStats?.wickets || 0}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-rcbTextSecondary">Bowling Econ</td>
                    {selectedPlayers.map(p => (
                      <td key={p.id} className="p-3 text-rcbTextPrimary">{p.bowlingStats?.economy || 'N/A'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-rcbTextSecondary">Auction Cost</td>
                    {selectedPlayers.map(p => (
                      <td key={p.id} className="p-3 font-bold text-warningOrange">{formatPrice(p.auctionPrice)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
