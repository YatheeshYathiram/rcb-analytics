import express from 'express';
import { PlayerDb, getDbStatus } from '../db.js';

const router = express.Router();

// 1. GET /api/players/stats/dashboard
// Fetch summarized statistics across all seasons for the home page
router.get('/stats/dashboard', async (req, res) => {
  try {
    const players = await PlayerDb.find({});
    
    // Total stats calculated dynamically
    const totalPlayersUsed = players.length;
    
    // Hardcoded historical season summary for RCB (2021-2026)
    const seasonsSummary = [
      { season: 2021, matches: 15, wins: 9, losses: 6, points: 18, position: "3rd (Playoffs)", topScorer: "Glenn Maxwell (513)", topWicketTaker: "Harshal Patel (32)" },
      { season: 2022, matches: 16, wins: 9, losses: 7, points: 18, position: "4th (Playoffs)", topScorer: "Faf du Plessis (468)", topWicketTaker: "Wanindu Hasaranga (26)" },
      { season: 2023, matches: 14, wins: 7, losses: 7, points: 14, position: "6th", topScorer: "Faf du Plessis (730)", topWicketTaker: "Mohammed Siraj (19)" },
      { season: 2024, matches: 15, wins: 8, losses: 7, points: 14, position: "4th (Playoffs)", topScorer: "Virat Kohli (741)", topWicketTaker: "Harshal Patel (24)" },
      { season: 2025, matches: 17, wins: 12, losses: 4, points: 19, position: "1st (Champions) 🏆", topScorer: "Virat Kohli (510)", topWicketTaker: "Mohammed Siraj (14)" },
      { season: 2026, matches: 15, wins: 10, losses: 5, points: 18, position: "1st (Champions) 🏆", topScorer: "Virat Kohli (640)", topWicketTaker: "Yash Dayal (21)" }
    ];

    const totalMatches = seasonsSummary.reduce((sum, s) => sum + s.matches, 0);
    const totalWins = seasonsSummary.reduce((sum, s) => sum + s.wins, 0);
    const totalLosses = seasonsSummary.reduce((sum, s) => sum + s.losses, 0);

    // Find highest run scorer overall in our dataset
    let highestRunScorer = { name: "N/A", runs: 0 };
    let highestWicketTaker = { name: "N/A", wickets: 0 };
    let highestAuctionPurchase = { name: "N/A", price: 0 };

    players.forEach(p => {
      // Overall Batting Runs
      const totalRuns = p.battingStats?.runs || 0;
      if (totalRuns > highestRunScorer.runs) {
        highestRunScorer = { name: p.name, runs: totalRuns };
      }

      // Overall Bowling Wickets
      const totalWkts = p.bowlingStats?.wickets || 0;
      if (totalWkts > highestWicketTaker.wickets) {
        highestWicketTaker = { name: p.name, wickets: totalWkts };
      }

      // Max auction/retention price
      const price = p.auctionPrice || 0;
      if (price > highestAuctionPurchase.price) {
        highestAuctionPurchase = { name: p.name, price: price };
      }
    });

    // Breakdown for charts: Auction Spending by Year (2021-2025)
    // Indian vs Overseas count
    const nationalityCount = { Indian: 0, Overseas: 0 };
    // Role breakdown
    const roleCount = { Batsman: 0, Bowler: 0, "All-rounder": 0, Wicketkeeper: 0 };
    
    players.forEach(p => {
      if (nationalityCount[p.nationality] !== undefined) {
        nationalityCount[p.nationality]++;
      }
      if (roleCount[p.role] !== undefined) {
        roleCount[p.role]++;
      }
    });

    res.json({
      dbStatus: getDbStatus(),
      totalPlayersUsed,
      totalMatches,
      totalWins,
      totalLosses,
      highestRunScorer,
      highestWicketTaker,
      highestAuctionPurchase,
      seasonsSummary,
      visualizations: {
        nationalityCount,
        roleCount,
        auctionSpendingByYear: [
          { year: 2021, amount: 252500000 }, // siraj, maxwell, kohli etc
          { year: 2022, amount: 450000000 }, // du plessis, maxwell, siraj, dinesh, harshal, hasaranga, patidar
          { year: 2023, amount: 0 }, // small retentions
          { year: 2024, amount: 225000000 }, // green, dayal
          { year: 2025, amount: 510000000 }, // kohli, siraj, patidar, dayal retentions
          { year: 2026, amount: 0 } // minor buys / retainers
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /api/players/stats/seasons
// Fetch squad, standings, top performers, partnerships, etc. for a specific season
router.get('/stats/seasons', async (req, res) => {
  try {
    const players = await PlayerDb.find({});
    
    // Historical stats per season
    const seasonData = {
      2021: {
        points: 18,
        finalPosition: "3rd (Playoffs)",
        teamPoints: 18,
        topRunScorer: "Glenn Maxwell (513)",
        topWicketTaker: "Harshal Patel (32)",
        highestPartnership: "181* (Virat Kohli & Devdutt Padikkal vs RR)",
        mostSixes: "Glenn Maxwell (21)",
        mostBoundaries: "Devdutt Padikkal (44)",
      },
      2022: {
        points: 18,
        finalPosition: "4th (Playoffs)",
        teamPoints: 18,
        topRunScorer: "Faf du Plessis (468)",
        topWicketTaker: "Wanindu Hasaranga (26)",
        highestPartnership: "115 (Faf du Plessis & Virat Kohli vs SRH)",
        mostSixes: "Dinesh Karthik (22)",
        mostBoundaries: "Faf du Plessis (49)",
      },
      2023: {
        points: 14,
        finalPosition: "6th",
        teamPoints: 14,
        topRunScorer: "Faf du Plessis (730)",
        topWicketTaker: "Mohammed Siraj (19)",
        highestPartnership: "172 (Virat Kohli & Faf du Plessis vs SRH)",
        mostSixes: "Faf du Plessis (36)",
        mostBoundaries: "Virat Kohli (65)",
      },
      2024: {
        points: 14,
        finalPosition: "4th (Playoffs)",
        teamPoints: 14,
        topRunScorer: "Virat Kohli (741)",
        topWicketTaker: "Yash Dayal (15)",
        highestPartnership: "125 (Virat Kohli & Will Jacks vs GT)",
        mostSixes: "Virat Kohli (38)",
        mostBoundaries: "Virat Kohli (62)",
      },
      2025: {
        points: 19,
        finalPosition: "1st (Champions) 🏆",
        teamPoints: 19,
        topRunScorer: "Virat Kohli (510)",
        topWicketTaker: "Mohammed Siraj (14)",
        highestPartnership: "112 (Virat Kohli & Rajat Patidar vs KKR)",
        mostSixes: "Virat Kohli (22)",
        mostBoundaries: "Virat Kohli (45)",
      },
      2026: {
        points: 18,
        finalPosition: "1st (Champions) 🏆",
        teamPoints: 18,
        topRunScorer: "Virat Kohli (640)",
        topWicketTaker: "Yash Dayal (21)",
        highestPartnership: "135 (Virat Kohli & Cameron Green vs GT)",
        mostSixes: "Virat Kohli (34)",
        mostBoundaries: "Rajat Patidar (48)",
      }
    };

    res.json(seasonData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. GET /api/players/compare
// Compare two or three players side-by-side
router.get('/compare', async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ error: "Please provide player IDs to compare (e.g. ?ids=virat_kohli,faf_du_plessis)" });
    }
    const idList = ids.split(',');
    const comparisonList = [];

    for (const id of idList) {
      const player = await PlayerDb.findById(id);
      if (player) {
        comparisonList.push(player);
      }
    }

    res.json(comparisonList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. GET /api/players/auction
// Fetch auction purchases with filtering
router.get('/auction', async (req, res) => {
  try {
    const players = await PlayerDb.find({});
    let auctionList = [];

    players.forEach(p => {
      if (p.auctionHistory && p.auctionHistory.length > 0) {
        p.auctionHistory.forEach(item => {
          auctionList.push({
            year: item.year,
            playerName: p.name,
            playerId: p._id || p.id,
            nationality: p.nationality,
            role: p.role,
            previousFranchise: item.previousFranchise || 'N/A',
            basePrice: item.basePrice || 0,
            finalPrice: item.finalPrice || 0,
            boughtBy: item.boughtBy || 'RCB',
            retainedOrAuction: item.retainedOrAuction || 'Auction Purchase'
          });
        });
      }
    });

    // Apply filters
    const { year, role, nationality, minPrice, maxPrice } = req.query;
    
    if (year) {
      auctionList = auctionList.filter(item => item.year === parseInt(year));
    }
    if (role) {
      auctionList = auctionList.filter(item => item.role.toLowerCase() === role.toLowerCase());
    }
    if (nationality) {
      auctionList = auctionList.filter(item => item.nationality.toLowerCase() === nationality.toLowerCase());
    }
    if (minPrice) {
      auctionList = auctionList.filter(item => item.finalPrice >= parseInt(minPrice));
    }
    if (maxPrice) {
      auctionList = auctionList.filter(item => item.finalPrice <= parseInt(maxPrice));
    }

    // Sort by Year desc, Price desc
    auctionList.sort((a, b) => b.year - a.year || b.finalPrice - a.finalPrice);

    res.json(auctionList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. GET /api/players
// Fetch all players with optional search & filters
router.get('/', async (req, res) => {
  try {
    const { name, role, nationality, minPrice, maxPrice, status, season } = req.query;
    let filter = {};

    if (name) {
      filter.name = name; // Will be handled inside PlayerDb.find
    }
    if (role) {
      filter.role = role;
    }
    if (nationality) {
      filter.nationality = nationality;
    }
    if (status) {
      filter.status = status;
    }

    let players = await PlayerDb.find(filter);

    // Apply price filtering (since custom PlayerDb doesn't parse complex range query directly)
    if (minPrice) {
      players = players.filter(p => p.auctionPrice >= parseInt(minPrice));
    }
    if (maxPrice) {
      players = players.filter(p => p.auctionPrice <= parseInt(maxPrice));
    }

    // Season-wise filtering (has stats for this season)
    if (season) {
      const targetSeason = parseInt(season);
      players = players.filter(p => p.seasonStats && p.seasonStats.some(s => s.season === targetSeason));
    }

    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. GET /api/players/:id
router.get('/:id', async (req, res) => {
  try {
    const player = await PlayerDb.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. POST /api/players (Admin: Add player)
router.post('/', async (req, res) => {
  try {
    const player = await PlayerDb.create(req.body);
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 8. PUT /api/players/:id (Admin: Update player)
router.put('/:id', async (req, res) => {
  try {
    const updatedPlayer = await PlayerDb.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedPlayer) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 9. DELETE /api/players/:id (Admin: Delete player)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await PlayerDb.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json({ message: "Player deleted successfully", player: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. POST /api/players/import (Admin: Import CSV/JSON)
router.post('/import', async (req, res) => {
  try {
    const { players, reset } = req.body;
    if (!players || !Array.isArray(players)) {
      return res.status(400).json({ error: "Invalid data format. Expected 'players' array." });
    }

    let result;
    if (reset) {
      result = await PlayerDb.resetData(players);
    } else {
      result = await PlayerDb.insertMany(players);
    }

    res.json({
      message: `Successfully imported ${result.length} players.`,
      count: result.length
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
