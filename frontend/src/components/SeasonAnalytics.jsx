import React, { useState } from 'react';
import { Calendar, Medal, Award, Users, AlignLeft } from 'lucide-react';

export default function SeasonAnalytics({ players, onSelectPlayerByName }) {
  const [selectedSeason, setSelectedSeason] = useState(2026);

  const seasonsList = [2026, 2025, 2024, 2023, 2022, 2021];

  // Static season analytical highlights
  const seasonHighlights = {
    2026: {
      points: 18,
      finalPosition: "1st (Champions) 🏆",
      topScorer: "Virat Kohli (640)",
      topWicketTaker: "Yash Dayal (21)",
      highestPartnership: "135 (Virat Kohli & Cameron Green vs GT)",
      mostSixes: "Virat Kohli (34)",
      mostBoundaries: "Rajat Patidar (48)",
      playingXI: ["Virat Kohli", "Phil Salt (WK)", "Rajat Patidar (C)", "Venkatesh Iyer", "Glenn Maxwell", "Cameron Green", "Krunal Pandya", "Bhuvneshwar Kumar", "Mohammed Siraj", "Yash Dayal", "Nuwan Thushara"]
    },
    2025: {
      points: 19,
      finalPosition: "1st (Champions) 🏆",
      topScorer: "Virat Kohli (510)",
      topWicketTaker: "Mohammed Siraj (14)",
      highestPartnership: "112 (Virat Kohli & Rajat Patidar vs KKR)",
      mostSixes: "Virat Kohli (22)",
      mostBoundaries: "Virat Kohli (45)",
      playingXI: ["Virat Kohli", "Faf du Plessis", "Rajat Patidar", "Glenn Maxwell", "Cameron Green", "Jitesh Sharma (WK)", "Swapnil Singh", "Wanindu Hasaranga", "Bhuvneshwar Kumar", "Mohammed Siraj", "Yash Dayal"]
    },
    2024: {
      points: 14,
      finalPosition: "4th (Playoffs - Eliminator)",
      topScorer: "Virat Kohli (741)",
      topWicketTaker: "Yash Dayal (15)",
      highestPartnership: "125 (Virat Kohli & Will Jacks vs GT)",
      mostSixes: "Virat Kohli (38)",
      mostBoundaries: "Virat Kohli (62)",
      playingXI: ["Virat Kohli", "Faf du Plessis", "Will Jacks", "Rajat Patidar", "Glenn Maxwell", "Cameron Green", "Dinesh Karthik (WK)", "Karn Sharma", "Mohammed Siraj", "Yash Dayal", "Lockie Ferguson"]
    },
    2023: {
      points: 14,
      finalPosition: "6th (Group Stage)",
      topScorer: "Faf du Plessis (730)",
      topWicketTaker: "Mohammed Siraj (19)",
      highestPartnership: "172 (Virat Kohli & Faf du Plessis vs SRH)",
      mostSixes: "Faf du Plessis (36)",
      mostBoundaries: "Virat Kohli (65)",
      playingXI: ["Virat Kohli", "Faf du Plessis", "Glenn Maxwell", "Mahipal Lomror", "Dinesh Karthik (WK)", "Anuj Rawat", "Wanindu Hasaranga", "Harshal Patel", "Karn Sharma", "Mohammed Siraj", "Josh Hazlewood"]
    },
    2022: {
      points: 18,
      finalPosition: "4th (Playoffs - Qualifier 2)",
      topScorer: "Faf du Plessis (468)",
      topWicketTaker: "Wanindu Hasaranga (26)",
      highestPartnership: "115 (Faf du Plessis & Virat Kohli vs SRH)",
      mostSixes: "Dinesh Karthik (22)",
      mostBoundaries: "Faf du Plessis (49)",
      playingXI: ["Virat Kohli", "Faf du Plessis", "Rajat Patidar", "Glenn Maxwell", "Mahipal Lomror", "Dinesh Karthik (WK)", "Shahbaz Ahmed", "Wanindu Hasaranga", "Harshal Patel", "Mohammed Siraj", "Josh Hazlewood"]
    },
    2021: {
      points: 18,
      finalPosition: "3rd (Playoffs - Eliminator)",
      topScorer: "Glenn Maxwell (513)",
      topWicketTaker: "Harshal Patel (32)",
      highestPartnership: "181* (Virat Kohli & Devdutt Padikkal vs RR)",
      mostSixes: "Glenn Maxwell (21)",
      mostBoundaries: "Devdutt Padikkal (44)",
      playingXI: ["Virat Kohli", "Devdutt Padikkal", "Glenn Maxwell", "AB de Villiers (WK)", "Shahbaz Ahmed", "Dan Christian", "Kyle Jamieson", "Harshal Patel", "Mohammed Siraj", "Yuzvendra Chahal", "George Garton"]
    }
  };

  const highlights = seasonHighlights[selectedSeason];

  // Filter players with recorded stats for this season
  const activeSquad = players.filter(p => 
    p.seasonStats && p.seasonStats.some(s => s.season === selectedSeason)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-rcbTextPrimary flex items-center gap-2">
          <Calendar className="text-rcbGold" size={26} />
          Season Analytics
        </h1>
        <p className="text-sm text-rcbTextSecondary font-normal">
          Historical overview of standing tables, team selections, and batsman/bowler roster results.
        </p>
      </div>

      {/* Season Selection Buttons */}
      <section className="flex flex-wrap gap-2.5 p-2 bg-rcbCharcoal/60 border border-rcbBorder/30 rounded-2xl">
        {seasonsList.map(year => (
          <button 
            key={year} 
            onClick={() => setSelectedSeason(year)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all duration-200 ${
              selectedSeason === year 
                ? 'bg-rcbRed text-white shadow-md' 
                : 'text-rcbTextSecondary hover:text-white hover:bg-rcbCharcoal'
            }`}
          >
            IPL {year}
          </button>
        ))}
      </section>

      {/* Overview Cards (Standings & Playing XI) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Summary Card details */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-rcbBorder/30 space-y-6">
          <h3 className="text-sm font-bold text-rcbGold uppercase tracking-widest flex items-center gap-2">
            <Medal size={16} />
            Season Summary & Records
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="border-b border-rcbBorder/10 pb-3">
              <span className="text-[10px] text-rcbTextSecondary uppercase tracking-wider block mb-1">Final Result</span>
              <strong className="text-base text-rcbGold">{highlights.finalPosition}</strong>
            </div>

            <div className="border-b border-rcbBorder/10 pb-3">
              <span className="text-[10px] text-rcbTextSecondary uppercase tracking-wider block mb-1">Points Standing</span>
              <strong className="text-base text-rcbTextPrimary">{highlights.points} Points</strong>
            </div>

            <div className="border-b border-rcbBorder/10 pb-3">
              <span className="text-[10px] text-rcbTextSecondary uppercase tracking-wider block mb-1">Highest Partnership</span>
              <strong className="text-xs text-rcbTextPrimary leading-tight block mt-1">{highlights.highestPartnership}</strong>
            </div>

            <div className="border-b border-rcbBorder/10 pb-3">
              <span className="text-[10px] text-rcbTextSecondary uppercase tracking-wider block mb-1">Top Run Scorer</span>
              <strong className="text-xs text-rcbTextPrimary leading-tight block mt-1">{highlights.topScorer}</strong>
            </div>

            <div className="border-b border-rcbBorder/10 pb-3">
              <span className="text-[10px] text-rcbTextSecondary uppercase tracking-wider block mb-1">Top Wicket Taker</span>
              <strong className="text-xs text-rcbTextPrimary leading-tight block mt-1">{highlights.topWicketTaker}</strong>
            </div>

            <div className="border-b border-rcbBorder/10 pb-3">
              <span className="text-[10px] text-rcbTextSecondary uppercase tracking-wider block mb-1">Most Boundaries</span>
              <strong className="text-xs text-rcbTextPrimary leading-tight block mt-1">{highlights.mostBoundaries} / {highlights.mostSixes} Sixes</strong>
            </div>
          </div>
        </div>

        {/* Right Side: Playing XI */}
        <div className="glass-panel p-6 rounded-2xl border border-rcbBorder/30 space-y-4">
          <h3 className="text-sm font-bold text-rcbRed uppercase tracking-widest flex items-center gap-2">
            <Award size={16} />
            Regular Playing XI
          </h3>
          
          <ol className="divide-y divide-rcbBorder/10 text-xs sm:text-sm font-semibold">
            {highlights.playingXI.map((name, index) => (
              <li key={index} className="py-2 flex items-center justify-between">
                <span className="text-rcbTextSecondary font-stats font-bold">{index + 1}.</span>
                <button 
                  onClick={() => onSelectPlayerByName(name)}
                  className="hover:text-rcbRed transition-colors font-heading tracking-wide text-right"
                >
                  {name}
                </button>
              </li>
            ))}
          </ol>
        </div>

      </section>

      {/* Roster Data Table */}
      <section className="space-y-4">
        <h3 className="text-xl font-heading font-extrabold text-rcbTextPrimary flex items-center gap-2">
          <Users className="text-rcbGold" size={22} />
          IPL {selectedSeason} Roster Squad ({activeSquad.length} Players)
        </h3>

        {activeSquad.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-rcbBorder/30">
            <p className="text-xs text-rcbTextSecondary">No player statistics found for the {selectedSeason} season.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-rcbBorder/30">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-rcbCharcoal/90 text-rcbTextSecondary font-bold border-b border-rcbBorder/30">
                <tr>
                  <th className="p-4">Player</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Matches</th>
                  <th className="p-4">Runs</th>
                  <th className="p-4">Wickets</th>
                  <th className="p-4">Batting S/R</th>
                  <th className="p-4">Economy</th>
                  <th className="p-4">POTM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rcbBorder/20">
                {activeSquad.map(player => {
                  const sStats = player.seasonStats.find(s => s.season === selectedSeason) || {};
                  const isReleased = player.status === 'Released';

                  return (
                    <tr key={player._id || player.id} className="hover:bg-rcbCharcoal/30">
                      <td className="p-4 font-bold text-rcbTextPrimary">
                        <button 
                          onClick={() => onSelectPlayerByName(player.name)}
                          className="hover:text-rcbRed transition-colors text-left"
                        >
                          {player.name}
                        </button>
                      </td>
                      <td className="p-4 text-rcbTextSecondary">{player.role}</td>
                      <td className="p-4 text-[10px]">
                        <span className={`inline-flex px-2 py-0.5 rounded font-extrabold uppercase ${
                          isReleased ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {isReleased ? 'Released' : 'Active'}
                        </span>
                      </td>
                      <td className="p-4 font-stats">{sStats.matches || 0}</td>
                      <td className="p-4 font-stats font-bold text-rcbGold">{sStats.runs || 0}</td>
                      <td className="p-4 font-stats font-bold text-rcbRed">{sStats.wickets || 0}</td>
                      <td className="p-4 font-stats text-rcbTextSecondary">{sStats.strikeRate || '-'}</td>
                      <td className="p-4 font-stats text-rcbTextSecondary">{sStats.economy || '-'}</td>
                      <td className="p-4 font-stats text-rcbGold">{sStats.potmAwards || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
