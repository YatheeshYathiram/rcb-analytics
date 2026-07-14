import mongoose from 'mongoose';

const SeasonStatsSchema = new mongoose.Schema({
  season: { type: Number, required: true },
  matches: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  strikeRate: { type: Number, default: 0 },
  economy: { type: Number, default: 0 },
  average: { type: Number, default: 0 },
  catches: { type: Number, default: 0 },
  potmAwards: { type: Number, default: 0 }
});

const AuctionHistorySchema = new mongoose.Schema({
  year: { type: Number, required: true },
  basePrice: { type: Number, default: 0 }, // in INR
  finalPrice: { type: Number, default: 0 }, // in INR
  boughtBy: { type: String, default: 'RCB' },
  retainedOrAuction: { type: String, enum: ['Retained', 'Auction Purchase'], default: 'Auction Purchase' },
  previousFranchise: { type: String, default: 'N/A' }
});

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  nationality: { type: String, enum: ['Indian', 'Overseas'], required: true },
  role: { type: String, enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'], required: true },
  battingStyle: { type: String, default: 'Right-hand bat' },
  bowlingStyle: { type: String, default: 'N/A' },
  jerseyNumber: { type: Number, default: null },
  age: { type: Number, default: null },
  previousTeam: { type: String, default: 'N/A' },
  currentTeam: { type: String, default: 'Royal Challengers Bengaluru' },
  auctionPrice: { type: Number, default: 0 }, // in INR
  basePrice: { type: Number, default: 0 }, // in INR
  purchaseYear: { type: Number, default: 2025 },
  retained: { type: Boolean, default: false },
  status: { type: String, enum: ['Playing', 'Released'], default: 'Playing' },
  
  generalInfo: {
    fullName: { type: String, default: '' },
    dob: { type: String, default: '' },
    height: { type: String, default: '' },
    role: { type: String, default: '' }
  },
  
  battingStats: {
    matches: { type: Number, default: 0 },
    innings: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    highestScore: { type: String, default: '0' },
    average: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 },
    fifties: { type: Number, default: 0 },
    hundreds: { type: Number, default: 0 },
    boundaries: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 },
    ducks: { type: Number, default: 0 },
    notOuts: { type: Number, default: 0 }
  },
  
  bowlingStats: {
    overs: { type: Number, default: 0 },
    maidens: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    economy: { type: Number, default: 0 },
    average: { type: Number, default: 0 },
    bestBowling: { type: String, default: '0/0' },
    strikeRate: { type: Number, default: 0 },
    fourWickets: { type: Number, default: 0 },
    fiveWickets: { type: Number, default: 0 }
  },
  
  fieldingStats: {
    catches: { type: Number, default: 0 },
    runOuts: { type: Number, default: 0 },
    stumpings: { type: Number, default: 0 }
  },
  
  seasonStats: [SeasonStatsSchema],
  auctionHistory: [AuctionHistorySchema]
}, { timestamps: true });

// Check if model already compiled to prevent HMR errors in dev
const Player = mongoose.models.Player || mongoose.model('Player', PlayerSchema);

export default Player;
