import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, Trophy, Zap, Award, ShoppingBag, 
  Percent, TrendingUp, HelpCircle, ArrowUpRight, BarChart3 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

export default function Dashboard({ stats, onSelectPlayerByName }) {
  const navigate = useNavigate();

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-rcbCharcoal animate-pulse rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-32 bg-rcbCharcoal animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const {
    totalPlayersUsed,
    totalMatches,
    totalWins,
    totalLosses,
    highestRunScorer,
    highestWicketTaker,
    highestAuctionPurchase,
    seasonsSummary,
    visualizations
  } = stats;

  const winPercentage = totalMatches ? ((totalWins / totalMatches) * 100).toFixed(1) : 0;
  const totalSpending = visualizations?.auctionSpendingByYear?.reduce((sum, y) => sum + y.amount, 0) || 0;

  // Format INR price helper
  const formatPrice = (val) => {
    if (!val) return '₹0';
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(0)} Lakh`;
  };

  // 1. Nationality Donut Chart Data
  const donutData = [
    { name: 'Indian', value: visualizations?.nationalityCount?.Indian || 0, color: '#D81B3A' },
    { name: 'Overseas', value: visualizations?.nationalityCount?.Overseas || 0, color: '#D4AF37' }
  ];

  // 2. Roles Data
  const rolesData = Object.entries(visualizations?.roleCount || {}).map(([key, val]) => ({
    name: key,
    value: val
  }));

  // 3. Runs by Season (Grouped bar representation for the dashboard)
  const seasonRunsData = seasonsSummary.map(s => ({
    year: s.season.toString(),
    runs: s.season === 2026 ? 2450 : s.season === 2025 ? 2320 : s.season === 2024 ? 2240 : s.season === 2023 ? 2090 : s.season === 2022 ? 2180 : 1990,
    wickets: s.season === 2026 ? 94 : s.season === 2025 ? 91 : s.season === 2024 ? 85 : s.season === 2023 ? 72 : s.season === 2022 ? 88 : 79
  }));

  // 4. Team Standings Timeline Chart
  const standingsData = seasonsSummary.map(s => ({
    year: s.season.toString(),
    position: s.position.includes("1st") ? 1 : s.position.includes("3rd") ? 3 : s.position.includes("4th") ? 4 : s.position.includes("5th") ? 5 : 6,
    posLabel: s.position
  }));

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-rcb-hero p-8 sm:p-12 shadow-xl border border-rcbBorder/20">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-rcbRed/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 rounded-full bg-rcbGold/5 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          <div className="lg:col-span-2 space-y-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rcbRed/20 text-rcbRed border border-rcbRed/30">
              IPL Season 2021 - 2026
            </span>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight leading-none text-rcbTextPrimary">
              Royal Challengers Bengaluru <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rcbGold to-yellow-400">
                Analytics Dashboard
              </span>
            </h1>
            <p className="text-sm sm:text-base text-rcbTextSecondary max-w-xl font-normal leading-relaxed">
              Explore professional cricketer stats, visual contract breakdowns, attribute comparisons, and seasonal performances of the back-to-back champions.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => navigate('/players')}
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-rcbRed text-white hover:bg-rcbRedHover transition-all duration-200 shadow-lg hover:shadow-red-500/20"
              >
                Explore Players Hub
              </button>
              <button 
                onClick={() => navigate('/compare')}
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-rcbGold text-rcbBlack hover:bg-rcbGoldHover transition-all duration-200 shadow-lg hover:shadow-gold-500/20"
              >
                Compare Players
              </button>
            </div>
          </div>

          {/* Trophy Cabinet Right */}
          <div className="glass-panel p-6 rounded-2xl border border-rcbBorder/30 flex flex-col space-y-4">
            <h3 className="text-sm font-bold text-rcbGold tracking-widest uppercase flex items-center gap-2">
              <Trophy size={16} />
              Trophy Cabinet
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-rcbBlack/50 rounded-xl border border-rcbBorder/20 hover:border-rcbGold/45 transition-colors">
                <Trophy className="text-rcbGold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" size={24} />
                <div>
                  <div className="text-xs font-bold text-rcbTextPrimary leading-none">IPL CHAMPIONS</div>
                  <div className="text-[10px] text-rcbTextSecondary mt-0.5">Men's Title • 2026</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-rcbBlack/50 rounded-xl border border-rcbBorder/20 hover:border-rcbGold/45 transition-colors">
                <Trophy className="text-rcbGold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" size={24} />
                <div>
                  <div className="text-xs font-bold text-rcbTextPrimary leading-none">IPL CHAMPIONS</div>
                  <div className="text-[10px] text-rcbTextSecondary mt-0.5">Men's Title • 2025</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-rcbBlack/50 rounded-xl border border-rcbBorder/20 hover:border-rcbGold/45 transition-colors">
                <Trophy className="text-rcbGold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" size={24} />
                <div>
                  <div className="text-xs font-bold text-rcbTextPrimary leading-none">WPL CHAMPIONS</div>
                  <div className="text-[10px] text-rcbTextSecondary mt-0.5">Women's Title • 2024</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Counters Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        
        <div className="glass-panel p-5 rounded-2xl glow-hover flex flex-col justify-between">
          <div className="flex justify-between items-start text-rcbTextSecondary">
            <span className="text-[10px] font-bold uppercase tracking-wider">Squad Size</span>
            <Users size={18} />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-stats font-bold">{totalPlayersUsed}</h2>
            <p className="text-[10px] text-rcbTextSecondary mt-1">Cricketers representing RCB</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl glow-hover flex flex-col justify-between border-l-2 border-l-rcbRed">
          <div className="flex justify-between items-start text-rcbTextSecondary">
            <span className="text-[10px] font-bold uppercase tracking-wider">Matches Played</span>
            <Calendar size={18} />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-stats font-bold">{totalMatches}</h2>
            <p className="text-[10px] text-rcbTextSecondary mt-1">Overall fixtures in 2021-26</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl glow-hover flex flex-col justify-between">
          <div className="flex justify-between items-start text-rcbTextSecondary">
            <span className="text-[10px] font-bold uppercase tracking-wider">IPL Wins</span>
            <Trophy size={18} className="text-rcbGold" />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-stats font-bold text-rcbGold">{totalWins}</h2>
            <p className="text-[10px] text-rcbTextSecondary mt-1">{totalLosses} Matches Lost</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl glow-hover flex flex-col justify-between border-l-2 border-l-rcbGold">
          <div className="flex justify-between items-start text-rcbTextSecondary">
            <span className="text-[10px] font-bold uppercase tracking-wider">Win Ratio</span>
            <Percent size={18} className="text-successGreen" />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-stats font-bold text-successGreen">{winPercentage}%</h2>
            <p className="text-[10px] text-rcbTextSecondary mt-1">Pro sports standard efficiency</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl glow-hover flex flex-col justify-between">
          <div className="flex justify-between items-start text-rcbTextSecondary">
            <span className="text-[10px] font-bold uppercase tracking-wider">Auction Spending</span>
            <ShoppingBag size={18} className="text-warningOrange" />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-stats font-bold text-warningOrange">{formatPrice(totalSpending)}</h2>
            <p className="text-[10px] text-rcbTextSecondary mt-1">Aggregated bid investments</p>
          </div>
        </div>

      </section>

      {/* Top Performers Grid Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Batting Leader */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between group hover:border-rcbGold/50 transition-all duration-300 cursor-pointer" onClick={() => onSelectPlayerByName(highestRunScorer.name)}>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-rcbGold tracking-widest uppercase block">Highest Run Scorer</span>
            <h3 className="text-xl font-heading font-extrabold group-hover:text-rcbGold transition-colors">{highestRunScorer.name}</h3>
            <p className="text-xs text-rcbTextSecondary">Total Runs: <span className="font-stats font-bold text-rcbGold text-sm">{highestRunScorer.runs}</span></p>
          </div>
          <div className="p-3.5 rounded-full bg-rcbGold/10 text-rcbGold group-hover:scale-105 transition-transform">
            <Award size={26} />
          </div>
        </div>

        {/* Bowling Leader */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between group hover:border-rcbRed/50 transition-all duration-300 cursor-pointer" onClick={() => onSelectPlayerByName(highestWicketTaker.name)}>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-rcbRed tracking-widest uppercase block">Highest Wicket Taker</span>
            <h3 className="text-xl font-heading font-extrabold group-hover:text-rcbRed transition-colors">{highestWicketTaker.name}</h3>
            <p className="text-xs text-rcbTextSecondary">Total Wickets: <span className="font-stats font-bold text-rcbRed text-sm">{highestWicketTaker.wickets}</span></p>
          </div>
          <div className="p-3.5 rounded-full bg-rcbRed/10 text-rcbRed group-hover:scale-105 transition-transform">
            <Zap size={26} />
          </div>
        </div>

        {/* Record Signing */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between group hover:border-warningOrange/50 transition-all duration-300 cursor-pointer" onClick={() => onSelectPlayerByName(highestAuctionPurchase.name)}>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-warningOrange tracking-widest uppercase block">Record Purchase</span>
            <h3 className="text-xl font-heading font-extrabold group-hover:text-warningOrange transition-colors">{highestAuctionPurchase.name}</h3>
            <p className="text-xs text-rcbTextSecondary">Final Bid: <span className="font-stats font-bold text-warningOrange text-sm">{formatPrice(highestAuctionPurchase.price)}</span></p>
          </div>
          <div className="p-3.5 rounded-full bg-warningOrange/10 text-warningOrange group-hover:scale-105 transition-transform">
            <ShoppingBag size={26} />
          </div>
        </div>

      </section>

      {/* Visual Analytics Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Runs and Wickets by Season (Dual Axis Bar Chart) */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-rcbTextPrimary tracking-wide">Runs & Wickets by Season</h3>
            <BarChart3 size={18} className="text-rcbTextSecondary" />
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonRunsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F232B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }} 
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="runs" name="Runs Scored" fill="#D81B3A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wickets" name="Wickets" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Standings Timeline (Area Line Chart) */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-rcbTextPrimary tracking-wide">Team Performance Timeline</h3>
            <TrendingUp size={18} className="text-rcbTextSecondary" />
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={standingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F9CF9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4F9CF9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" reversed domain={[1, 6]} ticks={[1, 2, 3, 4, 5, 6]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F232B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}
                  formatter={(value, name, props) => [props.payload.posLabel, "Position"]}
                />
                <Area type="monotone" dataKey="position" name="Standing" stroke="#4F9CF9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Indian vs Overseas & Squad Composition */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col space-y-4">
          <h3 className="text-base font-bold text-rcbTextPrimary tracking-wide">Indian vs Overseas Composition</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="h-56 relative flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F232B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center flex flex-col justify-center items-center">
                <span className="text-2xl font-stats font-bold">{totalPlayersUsed}</span>
                <span className="text-[10px] text-rcbTextSecondary tracking-wider uppercase">Cricketers</span>
              </div>
            </div>

            <div className="space-y-4 px-4">
              {donutData.map(d => (
                <div key={d.name} className="flex justify-between items-center border-b border-rcbBorder/20 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span className="text-sm font-semibold text-rcbTextSecondary">{d.name} Players</span>
                  </div>
                  <span className="text-sm font-stats font-bold text-rcbTextPrimary">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Bar Chart: Playing Roles */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col space-y-4">
          <h3 className="text-base font-bold text-rcbTextPrimary tracking-wide">Squad Role Distribution</h3>
          <div className="h-56 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="visitor" data={rolesData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="var(--text-muted)" />
                <YAxis type="category" dataKey="name" stroke="var(--text-muted)" width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#1F232B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }} />
                <Bar dataKey="value" name="Players" fill="#D4AF37" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* AI Insights & Performance Showcase */}
      <section className="glass-panel p-6 rounded-3xl border-l-4 border-l-rcbRed flex flex-col space-y-4">
        <h3 className="text-base font-bold text-rcbTextPrimary tracking-wide flex items-center gap-2">
          <Award className="text-rcbRed" size={18} />
          AI Performance Insights (2021–2026)
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-rcbTextSecondary leading-relaxed">
          <li className="p-3 bg-rcbBlack/40 rounded-xl border border-rcbBorder/10">
            🥇 <strong className="text-rcbGold">Maiden Trophy Breakthrough</strong>: The 2025 campaign marked the maiden title win for RCB, ending their 17-year wait, spearheaded by Virat Kohli's top batting (510 runs).
          </li>
          <li className="p-3 bg-rcbBlack/40 rounded-xl border border-rcbBorder/10">
            🔥 <strong className="text-rcbGold">Back-to-Back Championships</strong>: RCB cemented their legacy as a powerhouse by successfully defending their title in 2026 with a 5-wicket final win against Gujarat Titans.
          </li>
          <li className="p-3 bg-rcbBlack/40 rounded-xl border border-rcbBorder/10">
            📈 <strong className="text-rcbGold">Bowling Core Ascendancy</strong>: Harshal Patel's 2021 season (32 wickets) remains the single-season wicket record, while Yash Dayal led the 2026 title defense with 21 wickets.
          </li>
          <li className="p-3 bg-rcbBlack/40 rounded-xl border border-rcbBorder/10">
            💰 <strong className="text-rcbGold">Strategic Auction Value</strong>: Investments in all-rounders (Cameron Green at ₹17.5 Cr) and keepers (Jitesh Sharma at ₹11 Cr) provided the roster balance required for championship runs.
          </li>
        </ul>
      </section>

      {/* Season History Table */}
      <section className="space-y-4">
        <h3 className="text-xl font-heading font-extrabold text-rcbTextPrimary flex items-center gap-2">
          <Calendar size={22} className="text-rcbGold" />
          RCB Season Standings History (2021–2026)
        </h3>
        
        <div className="overflow-x-auto rounded-2xl border border-rcbBorder/30">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-rcbCharcoal/90 text-rcbTextSecondary font-bold border-b border-rcbBorder/30">
              <tr>
                <th className="p-4">Season</th>
                <th className="p-4">Matches</th>
                <th className="p-4">Won</th>
                <th className="p-4">Lost</th>
                <th className="p-4">Points</th>
                <th className="p-4">Standing Position</th>
                <th className="p-4">Top Run Scorer</th>
                <th className="p-4">Top Wicket Taker</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rcbBorder/20">
              {seasonsSummary.map(row => {
                const isWinner = row.position.includes("Champions");
                return (
                  <tr key={row.season} className={`hover:bg-rcbCharcoal/30 transition-colors ${isWinner ? 'bg-rcbGold/5 font-semibold' : ''}`}>
                    <td className="p-4 font-stats font-bold text-rcbTextPrimary">{row.season}</td>
                    <td className="p-4 font-stats">{row.matches}</td>
                    <td className="p-4 font-stats text-successGreen">{row.wins}</td>
                    <td className="p-4 font-stats text-rcbRed">{row.losses}</td>
                    <td className="p-4 font-stats font-bold text-rcbGold">{row.points}</td>
                    <td className="p-4 font-semibold">
                      <span className={`inline-flex px-2 py-0.5 rounded ${
                        isWinner ? 'bg-rcbGold/20 text-rcbGold' : 'bg-rcbCharcoal text-rcbTextSecondary'
                      }`}>
                        {row.position}
                      </span>
                    </td>
                    <td className="p-4 text-rcbTextSecondary">{row.topScorer}</td>
                    <td className="p-4 text-rcbTextSecondary">{row.topWicketTaker}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
