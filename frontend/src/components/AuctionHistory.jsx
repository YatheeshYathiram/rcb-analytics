import React, { useState, useMemo } from 'react';
import { ShoppingBag, Search, FileSpreadsheet, Download, RefreshCw } from 'lucide-react';

export default function AuctionHistory({ players, onSelectPlayerByName }) {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('');
  const [maxPrice, setMaxPrice] = useState(200000000); // Max 20 Cr

  // Format bids
  const formatPrice = (val) => {
    if (!val) return '₹0';
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(0)} Lakh`;
  };

  // Compile all historic transactions from player contract lists
  const auctionTransactions = useMemo(() => {
    const list = [];
    players.forEach(p => {
      if (p.auctionHistory) {
        p.auctionHistory.forEach(hist => {
          list.push({
            id: p._id || p.id,
            name: p.name,
            role: p.role,
            nationality: p.nationality,
            year: hist.year,
            basePrice: hist.basePrice,
            finalPrice: hist.finalPrice,
            boughtBy: hist.boughtBy,
            transactionType: hist.retainedOrAuction,
            previousFranchise: hist.previousFranchise || 'None'
          });
        });
      }
    });

    // Apply filters
    return list.filter(item => {
      const matchYear = selectedYear ? item.year.toString() === selectedYear : true;
      const matchRole = selectedRole ? item.role === selectedRole : true;
      const matchNat = selectedNationality ? item.nationality === selectedNationality : true;
      const matchPrice = item.finalPrice <= maxPrice;
      return matchYear && matchRole && matchNat && matchPrice;
    }).sort((a, b) => b.finalPrice - a.finalPrice);
  }, [players, selectedYear, selectedRole, selectedNationality, maxPrice]);

  // Export transactions list to CSV file
  const handleExportCSV = () => {
    const headers = ['Player', 'Year', 'Role', 'Nationality', 'Base Price', 'Final Bid', 'Type', 'Prev Franchise'];
    const csvRows = [headers.join(',')];

    auctionTransactions.forEach(item => {
      const row = [
        `"${item.name}"`,
        item.year,
        `"${item.role}"`,
        item.nationality,
        item.basePrice,
        item.finalPrice,
        `"${item.transactionType}"`,
        `"${item.previousFranchise}"`
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `RCB_Auction_Transactions_${new Date().getFullYear()}.csv`);
    a.click();
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-rcbTextPrimary flex items-center gap-2">
            <ShoppingBag className="text-warningOrange" size={26} />
            Auction History
          </h1>
          <p className="text-sm text-rcbTextSecondary">
            Review detailed financial records, franchise acquisition bids, and player transactions.
          </p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="self-start sm:self-center px-4 py-2 bg-successGreen hover:bg-green-600 text-white text-xs font-bold uppercase rounded-xl transition-all duration-200 flex items-center gap-1.5 tracking-wider"
        >
          <FileSpreadsheet size={16} />
          Export CSV Data
        </button>
      </div>

      {/* Filter and Range Controls panel */}
      <section className="glass-panel p-5 rounded-2xl border border-rcbBorder/30 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div>
            <label className="text-[10px] font-bold text-rcbTextSecondary uppercase tracking-wider block mb-2">Auction Year</label>
            <select 
              value={selectedYear} 
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-rcbBorder/40 bg-rcbCharcoal text-rcbTextPrimary focus:border-rcbRed outline-none"
            >
              <option value="">All Years</option>
              <option value="2026">2026 Season</option>
              <option value="2025">2025 Season</option>
              <option value="2024">2024 Season</option>
              <option value="2023">2023 Season</option>
              <option value="2022">2022 Season</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-rcbTextSecondary uppercase tracking-wider block mb-2">Player Role</label>
            <select 
              value={selectedRole} 
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-rcbBorder/40 bg-rcbCharcoal text-rcbTextPrimary focus:border-rcbRed outline-none"
            >
              <option value="">All Roles</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-rounder">All-Rounder</option>
              <option value="Wicketkeeper">Wicketkeeper</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-rcbTextSecondary uppercase tracking-wider block mb-2">Nationality</label>
            <select 
              value={selectedNationality} 
              onChange={e => setSelectedNationality(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-rcbBorder/40 bg-rcbCharcoal text-rcbTextPrimary focus:border-rcbRed outline-none"
            >
              <option value="">All Countries</option>
              <option value="Indian">Indian</option>
              <option value="Overseas">Overseas</option>
            </select>
          </div>

        </div>

        {/* Bidding Limit Slider */}
        <div className="space-y-2 border-t border-rcbBorder/20 pt-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-rcbTextSecondary">Maximum Auction Bid Limit</span>
            <strong className="text-warningOrange font-stats">{formatPrice(maxPrice)}</strong>
          </div>
          <input 
            type="range" 
            min="2000000" 
            max="200000000" 
            step="500000" 
            value={maxPrice}
            onChange={e => setMaxPrice(parseInt(e.target.value))}
            className="w-full accent-rcbRed bg-rcbBlack rounded-lg cursor-pointer h-1.5"
          />
        </div>
      </section>

      {/* Transactions Data List */}
      {auctionTransactions.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-rcbBorder/30">
          <h3 className="text-base font-bold text-rcbTextSecondary">No auction transactions match active filters</h3>
          <p className="text-xs text-rcbTextSecondary/50 mt-1">Try broadening price caps or selector filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-rcbBorder/30">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-rcbCharcoal/90 text-rcbTextSecondary font-bold border-b border-rcbBorder/30">
              <tr>
                <th className="p-4">Cricketer</th>
                <th className="p-4">Year</th>
                <th className="p-4">Role</th>
                <th className="p-4">Nationality</th>
                <th className="p-4">Previous Franchise</th>
                <th className="p-4">Base Bid</th>
                <th className="p-4">Final Cost</th>
                <th className="p-4">Transaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rcbBorder/20">
              {auctionTransactions.map((item, idx) => (
                <tr key={idx} className="hover:bg-rcbCharcoal/30">
                  <td className="p-4 font-bold text-rcbTextPrimary">
                    <button 
                      onClick={() => onSelectPlayerByName(item.name)}
                      className="hover:text-rcbRed transition-colors text-left"
                    >
                      {item.name}
                    </button>
                  </td>
                  <td className="p-4 font-stats">{item.year}</td>
                  <td className="p-4 text-rcbTextSecondary">{item.role}</td>
                  <td className="p-4 text-rcbTextSecondary">{item.nationality}</td>
                  <td className="p-4 text-rcbTextSecondary/70">{item.previousFranchise}</td>
                  <td className="p-4 font-stats text-rcbTextSecondary">{formatPrice(item.basePrice)}</td>
                  <td className="p-4 font-stats font-bold text-rcbGold">{formatPrice(item.finalPrice)}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      item.transactionType === 'Retained' 
                        ? 'bg-rcbGold/20 text-rcbGold' 
                        : 'bg-rcbRed/20 text-rcbRed'
                    }`}>
                      {item.transactionType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
