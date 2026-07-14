import React, { useState, useMemo } from 'react';
import { Search, Heart, UserMinus, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PlayersHub({ players, favorites, onToggleFavorite, onSelectPlayer }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('price_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Format Price
  const formatPrice = (val) => {
    if (!val) return '₹0';
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(0)} Lakh`;
  };

  // Filter & Sort computation
  const filteredPlayers = useMemo(() => {
    let result = [...players];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term));
    }

    // Role filter
    if (roleFilter) {
      result = result.filter(p => p.role === roleFilter);
    }

    // Nationality filter
    if (nationalityFilter) {
      result = result.filter(p => p.nationality === nationalityFilter);
    }

    // Status filter (Playing or Released)
    if (statusFilter) {
      result = result.filter(p => p.status === statusFilter);
    }

    // Sorting (Active players first, then chosen criteria)
    result.sort((a, b) => {
      // Put Active (Playing) first, Released second
      if (a.status === 'Playing' && b.status === 'Released') return -1;
      if (a.status === 'Released' && b.status === 'Playing') return 1;

      if (sortBy === 'price_desc') {
        return (b.auctionPrice || 0) - (a.auctionPrice || 0);
      }
      if (sortBy === 'price_asc') {
        return (a.auctionPrice || 0) - (b.auctionPrice || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'age') {
        return (a.age || 0) - (b.age || 0);
      }
      if (sortBy === 'runs') {
        return (b.battingStats?.runs || 0) - (a.battingStats?.runs || 0);
      }
      if (sortBy === 'wickets') {
        return (b.bowlingStats?.wickets || 0) - (a.bowlingStats?.wickets || 0);
      }
      return 0;
    });

    return result;
  }, [players, searchTerm, roleFilter, nationalityFilter, statusFilter, sortBy]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, nationalityFilter, statusFilter, sortBy]);

  // Pagination helper
  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const paginatedPlayers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPlayers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPlayers, currentPage]);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-rcbTextPrimary flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="w-8 h-8">
            <polygon points="50,10 90,85 10,85" fill="#D81B3A" stroke="#D4AF37" strokeWidth="4" />
            <text x="50" y="68" fontSize="22" fontFamily="sans-serif" fontWeight="900" fill="#D4AF37" textAnchor="middle">RCB</text>
          </svg>
          RCB Players Hub
        </h1>
        <p className="text-sm text-rcbTextSecondary">
          Browse player stats, active contracts, and former legends who represented Royal Challengers Bengaluru.
        </p>
      </div>

      {/* Advanced Filters Panel */}
      <section className="glass-panel p-4 rounded-2xl border border-rcbBorder/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-rcbTextSecondary" />
            <input 
              type="text" 
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-rcbBorder/40 bg-rcbCharcoal text-rcbTextPrimary focus:border-rcbRed outline-none transition-all duration-200"
              placeholder="Search player name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role filter */}
          <select 
            className="w-full px-3 py-2 text-xs rounded-xl border border-rcbBorder/40 bg-rcbCharcoal text-rcbTextPrimary focus:border-rcbRed outline-none transition-all duration-200"
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="Batsman">Batsmen</option>
            <option value="Bowler">Bowlers</option>
            <option value="All-rounder">All-Rounders</option>
            <option value="Wicketkeeper">Wicketkeepers</option>
          </select>

          {/* Nationality filter */}
          <select 
            className="w-full px-3 py-2 text-xs rounded-xl border border-rcbBorder/40 bg-rcbCharcoal text-rcbTextPrimary focus:border-rcbRed outline-none transition-all duration-200"
            value={nationalityFilter} 
            onChange={e => setNationalityFilter(e.target.value)}
          >
            <option value="">All Nationalities</option>
            <option value="Indian">Indian Players</option>
            <option value="Overseas">Overseas Players</option>
          </select>

          {/* Active Status filter */}
          <select 
            className="w-full px-3 py-2 text-xs rounded-xl border border-rcbBorder/40 bg-rcbCharcoal text-rcbTextPrimary focus:border-rcbRed outline-none transition-all duration-200"
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Playing">Active Squad</option>
            <option value="Released">Former Players (Released/Retired)</option>
          </select>

          {/* Sorting */}
          <select 
            className="w-full px-3 py-2 text-xs rounded-xl border border-rcbBorder/40 bg-rcbCharcoal text-rcbTextPrimary focus:border-rcbRed outline-none transition-all duration-200"
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="price_desc">Price: High to Low</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="name">Name: A-Z</option>
            <option value="age">Age: Youngest</option>
            <option value="runs">Runs: High to Low</option>
            <option value="wickets">Wickets: High to Low</option>
          </select>

        </div>
      </section>

      {/* Players Catalog Grid */}
      {paginatedPlayers.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-rcbBorder/30">
          <h3 className="text-base font-bold text-rcbTextSecondary">No cricketers found matching search criteria</h3>
          <p className="text-xs text-rcbTextSecondary/50 mt-1">Try resetting filters or adjusting search text queries.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedPlayers.map(player => {
            const isFav = favorites.includes(player._id || player.id);
            const isReleased = player.status === 'Released';
            
            return (
              <div 
                key={player._id || player.id} 
                className="group relative bg-rcbCharcoal border border-rcbBorder/60 rounded-[18px] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-rcbRed hover:shadow-red-glow"
              >
                
                {/* Player Card Header (Avatar + Badges) */}
                <div className="relative h-56 bg-rcbBlack/40 flex items-center justify-center overflow-hidden">
                  <img 
                    src={player.image} 
                    alt={player.name} 
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = player.nationality === 'Indian' ? '/images/indian_face.png' : '/images/overseas_face1.png';
                    }}
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shadow-md ${
                      isReleased 
                        ? 'bg-red-900/80 text-red-300 border border-red-500/30' 
                        : 'bg-green-900/80 text-green-300 border border-green-500/30'
                    }`}>
                      {isReleased ? <UserMinus size={10} /> : <UserCheck size={10} />}
                      {isReleased ? 'Former' : 'Active'}
                    </span>
                  </div>

                  {/* Nationality Tag */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-rcbTextSecondary text-[9px] font-bold px-2 py-0.5 rounded-md border border-rcbBorder/20">
                    {player.nationality}
                  </div>

                  {/* Price overlay bottom left */}
                  <div className="absolute bottom-3 left-3 bg-rcbBlack/80 backdrop-blur-sm px-2.5 py-1 rounded-xl border border-rcbBorder/40">
                    <div className="text-[8px] text-rcbTextSecondary uppercase tracking-widest leading-none">Auction Bid</div>
                    <div className="text-xs font-stats font-extrabold text-rcbGold mt-0.5 leading-none">
                      {formatPrice(player.auctionPrice)}
                    </div>
                  </div>

                  {/* Favorite Toggle Icon */}
                  <button 
                    onClick={() => onToggleFavorite(player._id || player.id)}
                    className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-rcbRed/20 hover:border-rcbRed border border-rcbBorder/30 transition-all z-20 text-white"
                  >
                    <Heart size={14} fill={isFav ? '#D81B3A' : 'none'} color={isFav ? '#D81B3A' : '#ffffff'} />
                  </button>
                </div>

                {/* Player Card Body Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-rcbGold uppercase tracking-wider block">{player.role}</span>
                    <h3 className="text-base font-heading font-bold text-rcbTextPrimary group-hover:text-rcbRed transition-colors mt-0.5">{player.name}</h3>
                    <p className="text-[10px] text-rcbTextSecondary mt-1">Prev: {player.previousTeam || 'N/A'}</p>
                  </div>

                  {/* Core Statistics grid */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-rcbBlack/40 rounded-xl text-[10px] border border-rcbBorder/10 font-stats">
                    <div className="flex justify-between border-r border-rcbBorder/20 pr-2">
                      <span className="text-rcbTextSecondary">Runs</span>
                      <strong className="text-rcbTextPrimary">{player.battingStats?.runs || 0}</strong>
                    </div>
                    <div className="flex justify-between pl-2">
                      <span className="text-rcbTextSecondary">Wickets</span>
                      <strong className="text-rcbTextPrimary">{player.bowlingStats?.wickets || 0}</strong>
                    </div>
                    <div className="flex justify-between border-r border-rcbBorder/20 pr-2 border-t border-rcbBorder/10 pt-1">
                      <span className="text-rcbTextSecondary">S/R</span>
                      <strong className="text-rcbTextPrimary">{player.battingStats?.strikeRate || 'N/A'}</strong>
                    </div>
                    <div className="flex justify-between pl-2 border-t border-rcbBorder/10 pt-1">
                      <span className="text-rcbTextSecondary">Econ</span>
                      <strong className="text-rcbTextPrimary">{player.bowlingStats?.economy || 'N/A'}</strong>
                    </div>
                  </div>

                  {/* View details button */}
                  <button 
                    onClick={() => onSelectPlayer(player._id || player.id)}
                    className="w-full py-2 bg-rcbRed hover:bg-rcbRedHover text-white text-xs font-bold uppercase rounded-xl transition-all duration-200 tracking-wider flex items-center justify-center gap-1.5"
                  >
                    View Stats Profile &rarr;
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <section className="flex justify-center items-center space-x-2 pt-6">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="p-1.5 rounded-lg border border-rcbBorder/40 bg-rcbCharcoal text-rcbTextSecondary hover:text-white hover:border-rcbRed disabled:opacity-30 disabled:hover:border-rcbBorder/40 disabled:hover:text-rcbTextSecondary transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          
          <span className="text-xs font-stats text-rcbTextSecondary">
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="p-1.5 rounded-lg border border-rcbBorder/40 bg-rcbCharcoal text-rcbTextSecondary hover:text-white hover:border-rcbRed disabled:opacity-30 disabled:hover:border-rcbBorder/40 disabled:hover:text-rcbTextSecondary transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </section>
      )}

    </div>
  );
}
