import React, { useState } from 'react';
import { Shield, Plus, Upload, Trash2, FileEdit, Download, Save, X } from 'lucide-react';

export default function AdminPanel({ 
  players, 
  onAddPlayer, 
  onUpdatePlayer, 
  onDeletePlayer, 
  onImportPlayers 
}) {
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [bulkData, setBulkData] = useState('');
  const [bulkReset, setBulkReset] = useState(false);

  // Form Fields State
  const initialFormState = {
    id: '',
    name: '',
    role: 'Batsman',
    nationality: 'Indian',
    status: 'Playing',
    jerseyNumber: '',
    age: '',
    previousTeam: '',
    currentTeam: 'Royal Challengers Bengaluru',
    auctionPrice: 20000000,
    basePrice: 20000000,
    purchaseYear: 2026,
    retained: false,
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    image: '/images/indian_face.png',
    generalInfo: { fullName: '', dob: '', height: '', role: '' },
    battingStats: { matches: 0, innings: 0, runs: 0, highestScore: '0', average: 0, strikeRate: 0, fifties: 0, hundreds: 0, boundaries: 0, sixes: 0 },
    bowlingStats: { overs: 0, maidens: 0, wickets: 0, economy: 0, average: 0, bestBowling: 'N/A', strikeRate: 0 }
  };

  const [formData, setFormData] = useState(initialFormState);

  // Price conversion
  const formatPrice = (val) => {
    if (!val) return '₹0';
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(0)} Lakh`;
  };

  // Submit handlers
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.name) {
      alert('Please fill out unique Player ID and Name.');
      return;
    }
    // Clean inputs
    const pData = {
      ...formData,
      image: formData.nationality === 'Indian' ? '/images/indian_face.png' : '/images/overseas_face1.png',
      generalInfo: {
        fullName: formData.name,
        dob: 'Jan 01, 1995',
        height: '1.80 m',
        role: formData.role
      },
      auctionHistory: [
        {
          year: formData.purchaseYear,
          basePrice: formData.basePrice,
          finalPrice: formData.auctionPrice,
          boughtBy: 'RCB',
          retainedOrAuction: formData.retained ? 'Retained' : 'Auction Purchase',
          previousFranchise: formData.previousTeam || 'None'
        }
      ],
      seasonStats: [
        {
          season: formData.purchaseYear,
          matches: formData.battingStats.matches,
          runs: formData.battingStats.runs,
          wickets: formData.bowlingStats.wickets,
          strikeRate: formData.battingStats.strikeRate,
          economy: formData.bowlingStats.economy,
          average: formData.battingStats.average
        }
      ]
    };

    const success = await onAddPlayer(pData);
    if (success) {
      setShowAddModal(false);
      setFormData(initialFormState);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const success = await onUpdatePlayer(editingPlayer._id || editingPlayer.id, editingPlayer);
    if (success) {
      setEditingPlayer(null);
    }
  };

  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(bulkData);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const success = await onImportPlayers(arr, bulkReset);
      if (success) {
        alert('Bulk squad details imported successfully!');
        setBulkData('');
      } else {
        alert('Failed to import players.');
      }
    } catch (e) {
      alert(`Invalid JSON: ${e.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-rcbTextPrimary flex items-center gap-2">
            <Shield className="text-rcbRed" size={26} />
            Admin Control Center
          </h1>
          <p className="text-sm text-rcbTextSecondary font-normal">
            Manage player rosters, edit contract valuations, adjust playing statuses, and import bulk datasets.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-center px-4 py-2 bg-rcbRed hover:bg-rcbRedHover text-white text-xs font-bold uppercase rounded-xl transition-all duration-200 flex items-center gap-1.5 tracking-wider"
        >
          <Plus size={16} />
          Add New Cricketer
        </button>
      </div>

      {/* Roster list Management Table */}
      <section className="glass-panel p-5 rounded-2xl border border-rcbBorder/30 space-y-4">
        <h3 className="text-sm font-bold text-rcbGold uppercase tracking-wide">Active Roster & Player Statuses ({players.length} Total)</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-rcbCharcoal/90 text-rcbTextSecondary font-bold border-b border-rcbBorder/30">
              <tr>
                <th className="p-4">Cricketer</th>
                <th className="p-4">Role</th>
                <th className="p-4">Nationality</th>
                <th className="p-4">Squad Status</th>
                <th className="p-4">Current Value</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rcbBorder/20">
              {players.map(player => (
                <tr key={player._id || player.id} className="hover:bg-rcbCharcoal/30">
                  <td className="p-4 font-bold text-rcbTextPrimary">{player.name}</td>
                  <td className="p-4 text-rcbTextSecondary">{player.role}</td>
                  <td className="p-4 text-rcbTextSecondary">{player.nationality}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      player.status === 'Released' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {player.status === 'Released' ? 'Released' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4 font-stats font-bold text-rcbGold">{formatPrice(player.auctionPrice)}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => setEditingPlayer(player)}
                        className="p-1 text-rcbGold hover:bg-rcbGold/10 rounded transition-colors"
                      >
                        <FileEdit size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${player.name} from the database?`)) {
                            onDeletePlayer(player._id || player.id);
                          }
                        }}
                        className="p-1 text-rcbRed hover:bg-rcbRed/10 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bulk Import Panel */}
      <section className="glass-panel p-5 rounded-2xl border border-rcbBorder/30 space-y-4">
        <h3 className="text-sm font-bold text-rcbTextPrimary uppercase tracking-wide flex items-center gap-1.5">
          <Upload size={16} className="text-rcbRed" />
          Bulk JSON Database Seeding
        </h3>
        <p className="text-xs text-rcbTextSecondary leading-relaxed">
          Paste an array of player profile JSON objects below. Toggle reset cache to drop existing records and load fresh seeds.
        </p>

        <textarea 
          className="w-full h-32 p-3 font-stats text-xs rounded-xl border border-rcbBorder/40 bg-rcbBlack text-rcbTextPrimary focus:border-rcbRed outline-none"
          placeholder="[ { 'id': 'virat_kohli', 'name': 'Virat Kohli', ... } ]"
          value={bulkData}
          onChange={e => setBulkData(e.target.value)}
        />

        <div className="flex justify-between items-center flex-wrap gap-4 pt-2">
          <label className="flex items-center space-x-2 text-xs font-semibold text-rcbTextSecondary">
            <input 
              type="checkbox" 
              checked={bulkReset}
              onChange={e => setBulkReset(e.target.checked)}
              className="rounded accent-rcbRed bg-rcbBlack"
            />
            <span>Erase existing database and re-seed from scratch</span>
          </label>
          <button 
            onClick={handleBulkImport}
            className="px-4 py-2 bg-rcbRed hover:bg-rcbRedHover text-white text-xs font-bold uppercase rounded-xl transition-all tracking-wider"
          >
            Import JSON Array
          </button>
        </div>
      </section>

      {/* ADD SQUAD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-rcbBlack/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-rcbCharcoal border border-rcbBorder rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-rcbTextPrimary">Add New Roster Player</h3>
              <button onClick={() => setShowAddModal(false)} className="text-rcbTextSecondary hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs text-rcbTextSecondary">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-bold">Player ID (unique, e.g. josh_hazlewood)</label>
                  <input 
                    type="text" 
                    value={formData.id} 
                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary focus:border-rcbRed"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold">Cricketer Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary focus:border-rcbRed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 font-bold">Playing Role</label>
                  <select 
                    value={formData.role} 
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary"
                  >
                    <option value="Batsman">Batsman</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-rounder">All-rounder</option>
                    <option value="Wicketkeeper">Wicketkeeper</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-bold">Nationality</label>
                  <select 
                    value={formData.nationality} 
                    onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary"
                  >
                    <option value="Indian">Indian</option>
                    <option value="Overseas">Overseas</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-bold">Squad Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary"
                  >
                    <option value="Playing">Active</option>
                    <option value="Released">Released</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-bold">Auction Price (in INR)</label>
                  <input 
                    type="number" 
                    value={formData.auctionPrice} 
                    onChange={e => setFormData({ ...formData, auctionPrice: parseInt(e.target.value) })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold">Previous Franchise</label>
                  <input 
                    type="text" 
                    value={formData.previousTeam} 
                    onChange={e => setFormData({ ...formData, previousTeam: e.target.value })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-rcbBorder rounded text-rcbTextSecondary hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rcbRed text-white rounded font-bold hover:bg-rcbRedHover">Add Player</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 bg-rcbBlack/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-rcbCharcoal border border-rcbBorder rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-rcbTextPrimary">Edit Profile: {editingPlayer.name}</h3>
              <button onClick={() => setEditingPlayer(null)} className="text-rcbTextSecondary hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs text-rcbTextSecondary">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-bold">Cricketer Name</label>
                  <input 
                    type="text" 
                    value={editingPlayer.name} 
                    onChange={e => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary focus:border-rcbRed"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold">Age</label>
                  <input 
                    type="number" 
                    value={editingPlayer.age || ''} 
                    onChange={e => setEditingPlayer({ ...editingPlayer, age: parseInt(e.target.value) })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary focus:border-rcbRed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 font-bold">Playing Role</label>
                  <select 
                    value={editingPlayer.role} 
                    onChange={e => setEditingPlayer({ ...editingPlayer, role: e.target.value })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary"
                  >
                    <option value="Batsman">Batsman</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-rounder">All-rounder</option>
                    <option value="Wicketkeeper">Wicketkeeper</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-bold">Nationality</label>
                  <select 
                    value={editingPlayer.nationality} 
                    onChange={e => setEditingPlayer({ ...editingPlayer, nationality: e.target.value })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary"
                  >
                    <option value="Indian">Indian</option>
                    <option value="Overseas">Overseas</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-bold">Squad Status</label>
                  <select 
                    value={editingPlayer.status} 
                    onChange={e => setEditingPlayer({ ...editingPlayer, status: e.target.value })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary"
                  >
                    <option value="Playing">Active</option>
                    <option value="Released">Released</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-bold">Current Contract Cost</label>
                  <input 
                    type="number" 
                    value={editingPlayer.auctionPrice} 
                    onChange={e => setEditingPlayer({ ...editingPlayer, auctionPrice: parseInt(e.target.value) })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold">Jersey Number</label>
                  <input 
                    type="number" 
                    value={editingPlayer.jerseyNumber || ''} 
                    onChange={e => setEditingPlayer({ ...editingPlayer, jerseyNumber: parseInt(e.target.value) })}
                    className="w-full p-2 bg-rcbBlack rounded border border-rcbBorder outline-none text-rcbTextPrimary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setEditingPlayer(null)} className="px-4 py-2 border border-rcbBorder rounded text-rcbTextSecondary hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rcbRed text-white rounded font-bold hover:bg-rcbRedHover flex items-center gap-1">
                  <Save size={14} /> Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
