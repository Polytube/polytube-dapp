import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Flame, Trophy, Users, TrendingUp, Play, Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@tarobase/js-sdk';
import { AuthContextType } from '@/components/types';
import { useTarobaseData } from '@/hooks/use-tarobase-data';
import { subscribeManyMarkets, setMarketsBets, Address, Token, MarketsResponse, MarketsBetsResponse, subscribeManyMarketsBets } from '@/lib/tarobase';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ADMIN_ADDRESS, MIN_BET_LAMPORTS } from '@/lib/constants';

// Animation variants
const staggerContainer = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface PredictionMarket {
  id: string;
  question: string;
  category: string;
  yesOdds: number;
  noOdds: number;
  volume: string;
  endsAt: string;
  featured?: boolean;
}

interface WagerBattle {
  id: string;
  creator1: string;
  creator2: string;
  question: string;
  category: string;
  creator1Odds: number;
  creator2Odds: number;
  volume: string;
  endsAt: string;
  featured?: boolean;
}

export const HomePage: React.FC = () => {
  const { user, login } = useAuth() as AuthContextType;
  const [selectedTab, setSelectedTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMarket, setSelectedMarket] = useState<MarketsResponse | null>(null);
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [betPosition, setBetPosition] = useState<'yes' | 'no'>('yes');
  const [betAmount, setBetAmount] = useState<string>('');
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  // Fetch real markets from Tarobase
  const { data: realMarkets, loading: marketsLoading } = useTarobaseData<MarketsResponse[]>(
    subscribeManyMarkets,
    true,
    'status=active limit 200'
  );

  // Fetch user's bets
  const { data: userBets, loading: betsLoading } = useTarobaseData<MarketsBetsResponse[]>(
    subscribeManyMarketsBets,
    !!user,
    '*',
    `bettor=${user?.address || ''}`
  );

  // Convert real markets to display format
  const predictionMarkets: PredictionMarket[] = useMemo(() => {
    if (!realMarkets || realMarkets.length === 0) {
      // -- USING MOCK DATA -- (fallback when no real markets exist)
      return [
    // YouTuber Performance
    { id: '1', question: "Will MrBeast's next video reach 100M views within 7 days?", category: 'Performance', yesOdds: 72, noOdds: 28, volume: '1,250 SOL', endsAt: '7 days', featured: true },
    { id: '2', question: 'Will PewDiePie upload a new vlog this month?', category: 'Performance', yesOdds: 45, noOdds: 55, volume: '890 SOL', endsAt: '15 days', featured: true },
    { id: '3', question: "Will KSI's next video trend at #1 in the UK?", category: 'Performance', yesOdds: 68, noOdds: 32, volume: '1,100 SOL', endsAt: '10 days', featured: true },
    { id: '4', question: 'Will Logan Paul appear in a Sidemen video this month?', category: 'Collaborations', yesOdds: 35, noOdds: 65, volume: '750 SOL', endsAt: '12 days', featured: true },
    { id: '5', question: 'Will IShowSpeed hit 40M subscribers by end of the year?', category: 'Performance', yesOdds: 82, noOdds: 18, volume: '2,100 SOL', endsAt: '8 months', featured: true },
    { id: '6', question: 'Will Kai Cenat do another collab with MrBeast?', category: 'Collaborations', yesOdds: 76, noOdds: 24, volume: '1,450 SOL', endsAt: '3 months' },
    { id: '7', question: 'Will Dream post another Minecraft video in 2025?', category: 'Content', yesOdds: 58, noOdds: 42, volume: '920 SOL', endsAt: '11 months' },
    { id: '8', question: "Will Sidemen's next video get over 20M views?", category: 'Performance', yesOdds: 65, noOdds: 35, volume: '1,050 SOL', endsAt: '5 days' },
    { id: '9', question: 'Will Jidion return to YouTube full-time this year?', category: 'Content', yesOdds: 42, noOdds: 58, volume: '680 SOL', endsAt: '6 months' },
    { id: '10', question: 'Will A4 surpass MrBeast in subscribers before 2026?', category: 'Performance', yesOdds: 15, noOdds: 85, volume: '3,200 SOL', endsAt: '1 year' },
    { id: '11', question: 'Will YouTube Shorts surpass TikTok in daily views by 2026?', category: 'Platform', yesOdds: 38, noOdds: 62, volume: '2,800 SOL', endsAt: '1 year' },
    { id: '12', question: 'Will Marques Brownlee (MKBHD) review the iPhone 17 first?', category: 'Content', yesOdds: 55, noOdds: 45, volume: '980 SOL', endsAt: '9 months' },
    { id: '13', question: 'Will Niko Omilana upload a prank video this month?', category: 'Content', yesOdds: 70, noOdds: 30, volume: '650 SOL', endsAt: '18 days' },
    { id: '14', question: 'Will TommyInnit hit 15M subscribers before the end of 2025?', category: 'Performance', yesOdds: 62, noOdds: 38, volume: '890 SOL', endsAt: '10 months' },
    { id: '15', question: 'Will Ryan Trahan start another "1 penny challenge" this year?', category: 'Content', yesOdds: 48, noOdds: 52, volume: '720 SOL', endsAt: '7 months' },
    { id: '16', question: 'Will Dhar Mann Studios release a viral video over 30M views this month?', category: 'Performance', yesOdds: 52, noOdds: 48, volume: '580 SOL', endsAt: '20 days' },
    { id: '17', question: 'Will Airrack reach 20M subscribers before June 2026?', category: 'Performance', yesOdds: 71, noOdds: 29, volume: '1,320 SOL', endsAt: '1.5 years' },
    { id: '18', question: 'Will The Try Guys return to trending this year?', category: 'Performance', yesOdds: 44, noOdds: 56, volume: '490 SOL', endsAt: '8 months' },
    { id: '19', question: 'Will YouTube introduce a "dislike count" again?', category: 'Platform', yesOdds: 22, noOdds: 78, volume: '1,850 SOL', endsAt: '1 year' },
    { id: '20', question: 'Will Emma Chamberlain upload a new video this year?', category: 'Content', yesOdds: 68, noOdds: 32, volume: '620 SOL', endsAt: '9 months' },
    { id: '21', question: 'Will Dream SMP restart in 2025?', category: 'Content', yesOdds: 35, noOdds: 65, volume: '1,120 SOL', endsAt: '11 months' },
    { id: '22', question: 'Will YouTube remove ads for Premium users on TV soon?', category: 'Platform', yesOdds: 28, noOdds: 72, volume: '950 SOL', endsAt: '6 months' },
    { id: '23', question: 'Will MrBeast Gaming upload twice in the same week?', category: 'Content', yesOdds: 56, noOdds: 44, volume: '780 SOL', endsAt: '2 months' },
    { id: '24', question: 'Will Beta Squad hit 10M subscribers by next quarter?', category: 'Performance', yesOdds: 74, noOdds: 26, volume: '1,040 SOL', endsAt: '3 months' },
    { id: '25', question: 'Will Sidemen launch a second YouTube channel this year?', category: 'Content', yesOdds: 38, noOdds: 62, volume: '670 SOL', endsAt: '8 months' },
    { id: '26', question: 'Will YouTube Music surpass Spotify subscribers by 2026?', category: 'Platform', yesOdds: 18, noOdds: 82, volume: '2,200 SOL', endsAt: '1 year' },
    { id: '27', question: 'Will The Rock appear in a YouTube video this year?', category: 'Collaborations', yesOdds: 88, noOdds: 12, volume: '1,650 SOL', endsAt: '9 months' },
    { id: '28', question: "Will MrBeast's main channel hit 350M subscribers by 2026?", category: 'Performance', yesOdds: 65, noOdds: 35, volume: '2,450 SOL', endsAt: '1 year' },
    { id: '29', question: 'Will Niko Omilana run for mayor again and vlog it?', category: 'Content', yesOdds: 32, noOdds: 68, volume: '820 SOL', endsAt: '1.5 years' },
    { id: '30', question: "Will Airrack's next video cross 10M views in 48 hours?", category: 'Performance', yesOdds: 46, noOdds: 54, volume: '710 SOL', endsAt: '7 days' },
    { id: '31', question: 'Will YouTube introduce an AI editing tool for creators?', category: 'Platform', yesOdds: 72, noOdds: 28, volume: '1,580 SOL', endsAt: '1 year' },
    { id: '32', question: 'Will Speed and Kai collab in real life again this year?', category: 'Collaborations', yesOdds: 78, noOdds: 22, volume: '1,290 SOL', endsAt: '8 months' },
    { id: '33', question: 'Will Logan Paul post a new vlog this month?', category: 'Content', yesOdds: 52, noOdds: 48, volume: '630 SOL', endsAt: '22 days' },
    { id: '34', question: 'Will Jake Paul release a fight vlog before 2026?', category: 'Content', yesOdds: 82, noOdds: 18, volume: '1,420 SOL', endsAt: '1 year' },
    { id: '35', question: "Will KSI's next music video hit 20M views in a week?", category: 'Performance', yesOdds: 58, noOdds: 42, volume: '890 SOL', endsAt: '14 days' },
    { id: '36', question: "Will PewDiePie's next upload trend in the top 5 globally?", category: 'Performance', yesOdds: 62, noOdds: 38, volume: '1,050 SOL', endsAt: '1 month' },
    { id: '37', question: 'Will Sidemen Shorts hit 1B total views by December?', category: 'Performance', yesOdds: 68, noOdds: 32, volume: '970 SOL', endsAt: '10 months' },
    { id: '38', question: 'Will YouTube host another live creator awards event?', category: 'Platform', yesOdds: 55, noOdds: 45, volume: '840 SOL', endsAt: '1 year' },
    { id: '39', question: 'Will MrBeast upload a video featuring Elon Musk?', category: 'Collaborations', yesOdds: 42, noOdds: 58, volume: '2,100 SOL', endsAt: '1 year' },
    { id: '40', question: 'Will Casey Neistat upload a travel vlog soon?', category: 'Content', yesOdds: 64, noOdds: 36, volume: '720 SOL', endsAt: '3 months' },
    { id: '41', question: "Will MrBeast's next challenge video exceed 100 minutes?", category: 'Content', yesOdds: 28, noOdds: 72, volume: '950 SOL', endsAt: '2 months' },
    { id: '42', question: 'Will YouTube bring back the rewind in 2025?', category: 'Platform', yesOdds: 25, noOdds: 75, volume: '1,680 SOL', endsAt: '11 months' },
    { id: '43', question: "Will MrBeast's next video break his own record for views in 24 hours?", category: 'Performance', yesOdds: 48, noOdds: 52, volume: '1,890 SOL', endsAt: '1 month' },
    { id: '44', question: 'Will any YouTube video reach 1B views this year?', category: 'Performance', yesOdds: 92, noOdds: 8, volume: '2,340 SOL', endsAt: '11 months' },
    { id: '45', question: 'Will Shane Dawson upload a documentary before 2026?', category: 'Content', yesOdds: 38, noOdds: 62, volume: '810 SOL', endsAt: '1 year' },
    { id: '46', question: 'Will Mark Rober post a Christmas special again?', category: 'Content', yesOdds: 86, noOdds: 14, volume: '1,120 SOL', endsAt: '10 months' },
    { id: '47', question: 'Will Dude Perfect collaborate with MrBeast again?', category: 'Collaborations', yesOdds: 62, noOdds: 38, volume: '1,380 SOL', endsAt: '8 months' },
    { id: '48', question: 'Will Ryan Trahan start a world travel series?', category: 'Content', yesOdds: 52, noOdds: 48, volume: '690 SOL', endsAt: '6 months' },
    { id: '49', question: 'Will YouTube Shorts creators earn more than long-form creators by 2026?', category: 'Platform', yesOdds: 34, noOdds: 66, volume: '1,750 SOL', endsAt: '1 year' },
    { id: '50', question: 'Will Speed get banned from YouTube again this year?', category: 'Performance', yesOdds: 42, noOdds: 58, volume: '980 SOL', endsAt: '9 months' },
    { id: '51', question: 'Will MrBeast reach 300M subscribers before December 2025?', category: 'Performance', yesOdds: 58, noOdds: 42, volume: '2,680 SOL', endsAt: '10 months' },
    { id: '52', question: 'Will YouTube add a "Top Fan" badge in comments?', category: 'Platform', yesOdds: 48, noOdds: 52, volume: '870 SOL', endsAt: '1 year' },
    { id: '53', question: 'Will YouTube Premium price increase again this year?', category: 'Platform', yesOdds: 68, noOdds: 32, volume: '1,240 SOL', endsAt: '9 months' },
    { id: '54', question: 'Will MrBeast launch another global challenge?', category: 'Content', yesOdds: 74, noOdds: 26, volume: '1,550 SOL', endsAt: '6 months' },
    { id: '55', question: 'Will Airrack do another world record attempt?', category: 'Content', yesOdds: 66, noOdds: 34, volume: '920 SOL', endsAt: '5 months' },
    { id: '56', question: "Will Kai Cenat's next stream highlight hit #1 trending?", category: 'Performance', yesOdds: 72, noOdds: 28, volume: '1,180 SOL', endsAt: '1 month' },
    { id: '57', question: 'Will Beta Squad collab with Sidemen?', category: 'Collaborations', yesOdds: 78, noOdds: 22, volume: '1,420 SOL', endsAt: '4 months' },
    { id: '58', question: 'Will Dream appear in another IRL collab this year?', category: 'Collaborations', yesOdds: 56, noOdds: 44, volume: '1,050 SOL', endsAt: '8 months' },
    { id: '59', question: 'Will Niko Omilana prank the BBC again?', category: 'Content', yesOdds: 44, noOdds: 56, volume: '740 SOL', endsAt: '1 year' },
    { id: '60', question: 'Will YouTube allow monetization for 30-second Shorts?', category: 'Platform', yesOdds: 52, noOdds: 48, volume: '1,380 SOL', endsAt: '1 year' },
    { id: '61', question: 'Will MrBeast upload a video in a new language channel?', category: 'Content', yesOdds: 62, noOdds: 38, volume: '890 SOL', endsAt: '6 months' },
    { id: '62', question: 'Will YouTube add an in-app podcast feature?', category: 'Platform', yesOdds: 58, noOdds: 42, volume: '1,120 SOL', endsAt: '1 year' },
    { id: '63', question: 'Will PewDiePie reach 115M subscribers before 2026?', category: 'Performance', yesOdds: 48, noOdds: 52, volume: '1,650 SOL', endsAt: '1 year' },
    { id: '64', question: "Will Logan Paul's next vlog hit 10M views in a week?", category: 'Performance', yesOdds: 54, noOdds: 46, volume: '780 SOL', endsAt: '2 weeks' },
    { id: '65', question: 'Will Sidemen FC host another charity match next year?', category: 'Content', yesOdds: 82, noOdds: 18, volume: '1,480 SOL', endsAt: '1.5 years' },
    { id: '66', question: 'Will the Sidemen charity match reach over 40M views?', category: 'Performance', yesOdds: 76, noOdds: 24, volume: '1,320 SOL', endsAt: '1.5 years' },
    { id: '67', question: 'Will YouTube introduce "Super Comment" payments?', category: 'Platform', yesOdds: 42, noOdds: 58, volume: '960 SOL', endsAt: '1 year' },
    { id: '68', question: "Will MrBeast appear on Joe Rogan's podcast?", category: 'Collaborations', yesOdds: 64, noOdds: 36, volume: '2,180 SOL', endsAt: '1 year' },
    { id: '69', question: 'Will Ryan Trahan collab with Airrack again?', category: 'Collaborations', yesOdds: 72, noOdds: 28, volume: '850 SOL', endsAt: '6 months' },
    { id: '70', question: 'Will Casey Neistat make a film about NYC again?', category: 'Content', yesOdds: 58, noOdds: 42, volume: '720 SOL', endsAt: '1 year' },
    { id: '71', question: 'Will YouTube ban ad-blockers fully worldwide by 2026?', category: 'Platform', yesOdds: 46, noOdds: 54, volume: '1,890 SOL', endsAt: '1 year' },
    { id: '72', question: "Will MrBeast's team launch a new YouTube channel?", category: 'Content', yesOdds: 68, noOdds: 32, volume: '1,120 SOL', endsAt: '8 months' },
    { id: '73', question: 'Will Kai Cenat start a vlog channel?', category: 'Content', yesOdds: 52, noOdds: 48, volume: '980 SOL', endsAt: '1 year' },
    { id: '74', question: "Will IShowSpeed's next stream clip pass 30M views?", category: 'Performance', yesOdds: 74, noOdds: 26, volume: '1,250 SOL', endsAt: '1 month' },
    { id: '75', question: 'Will YouTube add a "view milestone badge" system?', category: 'Platform', yesOdds: 38, noOdds: 62, volume: '820 SOL', endsAt: '1 year' },
    { id: '76', question: 'Will MrBeast give away a private island again?', category: 'Content', yesOdds: 42, noOdds: 58, volume: '1,680 SOL', endsAt: '1 year' },
    { id: '77', question: 'Will any YouTuber hit 500M subscribers by 2027?', category: 'Performance', yesOdds: 28, noOdds: 72, volume: '3,120 SOL', endsAt: '2 years' },
    { id: '78', question: 'Will YouTube Shorts surpass long videos in revenue by 2026?', category: 'Platform', yesOdds: 32, noOdds: 68, volume: '1,950 SOL', endsAt: '1 year' },
    { id: '79', question: "Will Logan Paul's channel reach 30M subs before 2026?", category: 'Performance', yesOdds: 62, noOdds: 38, volume: '1,180 SOL', endsAt: '1 year' },
    { id: '80', question: 'Will Sidemen host a global tour event?', category: 'Content', yesOdds: 56, noOdds: 44, volume: '1,420 SOL', endsAt: '1.5 years' },
    { id: '81', question: 'Will Niko Omilana hit 10M subs before 2026?', category: 'Performance', yesOdds: 68, noOdds: 32, volume: '890 SOL', endsAt: '1 year' },
    { id: '82', question: 'Will MrBeast upload a "World\'s Largest Game Show" video?', category: 'Content', yesOdds: 58, noOdds: 42, volume: '1,520 SOL', endsAt: '8 months' },
    { id: '83', question: 'Will YouTube remove mid-roll ads soon?', category: 'Platform', yesOdds: 18, noOdds: 82, volume: '1,340 SOL', endsAt: '1 year' },
    { id: '84', question: 'Will Airrack host a creator tournament this year?', category: 'Content', yesOdds: 64, noOdds: 36, volume: '920 SOL', endsAt: '9 months' },
    { id: '85', question: 'Will PewDiePie return to daily uploads?', category: 'Content', yesOdds: 22, noOdds: 78, volume: '1,580 SOL', endsAt: '1 year' },
    { id: '86', question: 'Will MrBeast Burger relaunch on YouTube?', category: 'Content', yesOdds: 48, noOdds: 52, volume: '1,120 SOL', endsAt: '1 year' },
    { id: '87', question: 'Will YouTube introduce NFT-like creator items?', category: 'Platform', yesOdds: 28, noOdds: 72, volume: '1,750 SOL', endsAt: '1 year' },
    { id: '88', question: "Will Kai Cenat's next collab feature a rapper?", category: 'Collaborations', yesOdds: 78, noOdds: 22, volume: '1,080 SOL', endsAt: '4 months' },
    { id: '89', question: "Will Speed's next vlog include Ronaldo?", category: 'Collaborations', yesOdds: 52, noOdds: 48, volume: '1,650 SOL', endsAt: '6 months' },
    { id: '90', question: 'Will YouTube Shorts introduce a live reaction feature?', category: 'Platform', yesOdds: 44, noOdds: 56, volume: '980 SOL', endsAt: '1 year' },
    { id: '91', question: 'Will MrBeast do another "Last to Leave" video soon?', category: 'Content', yesOdds: 72, noOdds: 28, volume: '1,280 SOL', endsAt: '5 months' },
    { id: '92', question: 'Will Sidemen release a behind-the-scenes documentary?', category: 'Content', yesOdds: 62, noOdds: 38, volume: '1,140 SOL', endsAt: '1 year' },
    { id: '93', question: 'Will Beta Squad host a real-world game show?', category: 'Content', yesOdds: 58, noOdds: 42, volume: '890 SOL', endsAt: '8 months' },
    { id: '94', question: 'Will Dream team up with TommyInnit again?', category: 'Collaborations', yesOdds: 66, noOdds: 34, volume: '1,020 SOL', endsAt: '1 year' },
    { id: '95', question: 'Will MrBeast post a collab with a Bollywood star?', category: 'Collaborations', yesOdds: 32, noOdds: 68, volume: '1,450 SOL', endsAt: '1 year' },
    { id: '96', question: 'Will Airrack hit 25M subscribers by 2026?', category: 'Performance', yesOdds: 74, noOdds: 26, volume: '1,320 SOL', endsAt: '1 year' },
    { id: '97', question: 'Will YouTube launch a feature to watch Shorts offline?', category: 'Platform', yesOdds: 68, noOdds: 32, volume: '1,180 SOL', endsAt: '1 year' },
    { id: '98', question: 'Will Sidemen hit 30M subs before 2026?', category: 'Performance', yesOdds: 56, noOdds: 44, volume: '1,420 SOL', endsAt: '1 year' },
    { id: '99', question: 'Will YouTube creators get a "Creator of the Year" award?', category: 'Platform', yesOdds: 52, noOdds: 48, volume: '920 SOL', endsAt: '1 year' },
    { id: '100', question: 'Will MrBeast upload a video filmed in space?', category: 'Content', yesOdds: 12, noOdds: 88, volume: '2,890 SOL', endsAt: '2 years' }
      ];
    }

    // Convert real markets to display format
    return realMarkets.map(market => {
      const totalBets = market.totalYesBets + market.totalNoBets;
      const yesOdds = totalBets > 0 ? Math.round((market.totalYesBets / totalBets) * 100) : 50;
      const noOdds = 100 - yesOdds;
      const volumeSOL = (totalBets / 1e9).toFixed(2); // Convert lamports to SOL
      const daysUntil = Math.ceil((market.resolutionDate - Date.now() / 1000) / 86400);
      const endsAt = daysUntil > 365 ? `${Math.round(daysUntil / 365)} year${daysUntil > 730 ? 's' : ''}` : `${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;

      return {
        id: market.id,
        question: market.question,
        category: market.category || 'General',
        yesOdds,
        noOdds,
        volume: `${volumeSOL} SOL`,
        endsAt,
        featured: totalBets > 5e9 // Featured if > 5 SOL in volume
      };
    });
  }, [realMarkets]);

  const categories = ['all', 'Performance', 'Collaborations', 'Content', 'Platform'];

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'battles', label: 'Markets', icon: Flame },
    { id: 'wagers', label: 'Wagers', icon: TrendingUp },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
  ];

  // -- USING MOCK DATA --
  const wagerBattles: WagerBattle[] = [
    { id: 'w1', creator1: 'MrBeast', creator2: 'Airrack', question: 'Who will hit 25M views faster on their next video?', category: 'Views', creator1Odds: 72, creator2Odds: 28, volume: '2,450 SOL', endsAt: '5 days', featured: true },
    { id: 'w2', creator1: 'KSI', creator2: 'Logan Paul', question: 'Whose next video will trend higher?', category: 'Trending', creator1Odds: 58, creator2Odds: 42, volume: '1,980 SOL', endsAt: '7 days', featured: true },
    { id: 'w3', creator1: 'IShowSpeed', creator2: 'Kai Cenat', question: 'Whose next stream clip gets more views?', category: 'Views', creator1Odds: 65, creator2Odds: 35, volume: '1,750 SOL', endsAt: '3 days', featured: true },
    { id: 'w4', creator1: 'PewDiePie', creator2: 'T-Series', question: 'Who gains more subscribers this month?', category: 'Subscribers', creator1Odds: 45, creator2Odds: 55, volume: '3,200 SOL', endsAt: '20 days', featured: true },
    { id: 'w5', creator1: 'Sidemen', creator2: 'Beta Squad', question: 'Whose next challenge gets more views?', category: 'Views', creator1Odds: 62, creator2Odds: 38, volume: '1,620 SOL', endsAt: '10 days', featured: true },
    { id: 'w6', creator1: 'MrBeast', creator2: 'Ryan Trahan', question: 'Whose next video hits 10M views first?', category: 'Views', creator1Odds: 78, creator2Odds: 22, volume: '1,890 SOL', endsAt: '7 days' },
    { id: 'w7', creator1: 'Niko Omilana', creator2: 'Chunkz', question: 'Who gets more likes on their next video?', category: 'Engagement', creator1Odds: 52, creator2Odds: 48, volume: '820 SOL', endsAt: '5 days' },
    { id: 'w8', creator1: 'Airrack', creator2: 'Ryan Trahan', question: 'Who uploads next?', category: 'Content', creator1Odds: 48, creator2Odds: 52, volume: '650 SOL', endsAt: '3 days' },
    { id: 'w9', creator1: 'KSI', creator2: 'Jake Paul', question: 'Whose next video gets more dislikes?', category: 'Engagement', creator1Odds: 42, creator2Odds: 58, volume: '1,120 SOL', endsAt: '10 days' },
    { id: 'w10', creator1: 'Dream', creator2: 'TommyInnit', question: 'Who uploads first in October?', category: 'Content', creator1Odds: 55, creator2Odds: 45, volume: '890 SOL', endsAt: '30 days' },
    { id: 'w11', creator1: 'MrBeast Gaming', creator2: 'Dude Perfect', question: 'Whose next video trends first?', category: 'Trending', creator1Odds: 68, creator2Odds: 32, volume: '1,340 SOL', endsAt: '7 days' },
    { id: 'w12', creator1: 'Logan Paul', creator2: 'Jake Paul', question: 'Who reaches 30M subs first?', category: 'Subscribers', creator1Odds: 62, creator2Odds: 38, volume: '2,100 SOL', endsAt: '6 months' },
    { id: 'w13', creator1: 'Speed', creator2: 'Kai Cenat', question: 'Who goes viral next?', category: 'Trending', creator1Odds: 58, creator2Odds: 42, volume: '1,580 SOL', endsAt: '5 days' },
    { id: 'w14', creator1: 'MKBHD', creator2: 'Linus Tech Tips', question: 'Whose next tech review performs better?', category: 'Views', creator1Odds: 56, creator2Odds: 44, volume: '1,420 SOL', endsAt: '14 days' },
    { id: 'w15', creator1: 'MrBeast', creator2: 'PewDiePie', question: 'Who hits more total views this month?', category: 'Views', creator1Odds: 72, creator2Odds: 28, volume: '2,890 SOL', endsAt: '25 days' },
    { id: 'w16', creator1: 'Sidemen', creator2: 'MrBeast', question: 'Whose next video crosses 50M first?', category: 'Views', creator1Odds: 38, creator2Odds: 62, volume: '2,450 SOL', endsAt: '10 days' },
    { id: 'w17', creator1: 'Airrack', creator2: 'Beta Squad', question: 'Whose video trends longer?', category: 'Trending', creator1Odds: 45, creator2Odds: 55, volume: '920 SOL', endsAt: '7 days' },
    { id: 'w18', creator1: 'Niko Omilana', creator2: 'Speed', question: 'Who makes the funnier video next?', category: 'Engagement', creator1Odds: 52, creator2Odds: 48, volume: '780 SOL', endsAt: '5 days' },
    { id: 'w19', creator1: 'Kai Cenat', creator2: 'BruceDropEmOff', question: 'Who has a higher average viewers next stream?', category: 'Views', creator1Odds: 68, creator2Odds: 32, volume: '1,250 SOL', endsAt: '3 days' },
    { id: 'w20', creator1: 'KSI', creator2: 'Deji', question: 'Who uploads next?', category: 'Content', creator1Odds: 72, creator2Odds: 28, volume: '650 SOL', endsAt: '7 days' },
    { id: 'w21', creator1: 'Logan Paul', creator2: 'KSI', question: 'Whose next video gets more comments?', category: 'Engagement', creator1Odds: 48, creator2Odds: 52, volume: '1,180 SOL', endsAt: '10 days' },
    { id: 'w22', creator1: 'MrBeast', creator2: 'A4', question: 'Who hits 1B views on a single video first?', category: 'Views', creator1Odds: 82, creator2Odds: 18, volume: '3,450 SOL', endsAt: '3 months' },
    { id: 'w23', creator1: 'Ryan Trahan', creator2: 'Eric Decker', question: 'Who uploads a bigger challenge next?', category: 'Content', creator1Odds: 62, creator2Odds: 38, volume: '720 SOL', endsAt: '10 days' },
    { id: 'w24', creator1: 'PewDiePie', creator2: 'Jacksepticeye', question: 'Who gets more likes on next upload?', category: 'Engagement', creator1Odds: 58, creator2Odds: 42, volume: '1,340 SOL', endsAt: '7 days' },
    { id: 'w25', creator1: 'Sidemen', creator2: 'Dude Perfect', question: 'Who has more viral Shorts this month?', category: 'Views', creator1Odds: 65, creator2Odds: 35, volume: '1,120 SOL', endsAt: '25 days' },
    { id: 'w26', creator1: 'Niko', creator2: 'Beta Squad', question: 'Who gets higher engagement?', category: 'Engagement', creator1Odds: 52, creator2Odds: 48, volume: '890 SOL', endsAt: '14 days' },
    { id: 'w27', creator1: 'Dream', creator2: 'Technoblade tribute', question: 'Which gets more long-term views?', category: 'Views', creator1Odds: 45, creator2Odds: 55, volume: '1,580 SOL', endsAt: '6 months' },
    { id: 'w28', creator1: 'Airrack', creator2: 'Max Fosh', question: 'Whose prank video goes more viral?', category: 'Views', creator1Odds: 58, creator2Odds: 42, volume: '950 SOL', endsAt: '7 days' },
    { id: 'w29', creator1: 'Logan Paul', creator2: 'Jake Paul', question: 'Who appears first in trending next?', category: 'Trending', creator1Odds: 52, creator2Odds: 48, volume: '1,280 SOL', endsAt: '5 days' },
    { id: 'w30', creator1: 'MrBeast', creator2: 'Dude Perfect', question: 'Who wins a collab battle if they compete?', category: 'Engagement', creator1Odds: 68, creator2Odds: 32, volume: '1,920 SOL', endsAt: '30 days' },
    { id: 'w31', creator1: 'KSI', creator2: 'Niko Omilana', question: 'Who wins a prank challenge?', category: 'Engagement', creator1Odds: 55, creator2Odds: 45, volume: '820 SOL', endsAt: '14 days' },
    { id: 'w32', creator1: 'Kai Cenat', creator2: 'Speed', question: 'Who makes fans laugh more this week?', category: 'Engagement', creator1Odds: 58, creator2Odds: 42, volume: '1,180 SOL', endsAt: '7 days' },
    { id: 'w33', creator1: 'PewDiePie', creator2: 'Markiplier', question: 'Who uploads a gaming video next?', category: 'Content', creator1Odds: 48, creator2Odds: 52, volume: '920 SOL', endsAt: '10 days' },
    { id: 'w34', creator1: 'Ryan Trahan', creator2: 'Airrack', question: 'Who completes a challenge cheaper?', category: 'Content', creator1Odds: 62, creator2Odds: 38, volume: '780 SOL', endsAt: '14 days' },
    { id: 'w35', creator1: 'Sidemen', creator2: 'Beta Squad', question: 'Who drops the next banger first?', category: 'Content', creator1Odds: 58, creator2Odds: 42, volume: '1,420 SOL', endsAt: '7 days' },
    { id: 'w36', creator1: 'MrBeast', creator2: 'Airrack', question: 'Who gives away more money next?', category: 'Content', creator1Odds: 82, creator2Odds: 18, volume: '2,340 SOL', endsAt: '14 days' },
    { id: 'w37', creator1: 'KSI', creator2: 'Logan Paul', question: 'Who gets more Prime-related views next?', category: 'Views', creator1Odds: 52, creator2Odds: 48, volume: '1,580 SOL', endsAt: '10 days' },
    { id: 'w38', creator1: 'Speed', creator2: 'Adin Ross', question: 'Who gets higher concurrent viewers next stream?', category: 'Views', creator1Odds: 68, creator2Odds: 32, volume: '1,320 SOL', endsAt: '3 days' },
    { id: 'w39', creator1: 'Niko', creator2: 'Chunkz', question: 'Who uploads the funnier skit next?', category: 'Engagement', creator1Odds: 55, creator2Odds: 45, volume: '690 SOL', endsAt: '7 days' },
    { id: 'w40', creator1: 'Dream', creator2: 'TommyInnit', question: 'Who gets more average comments per video?', category: 'Engagement', creator1Odds: 52, creator2Odds: 48, volume: '850 SOL', endsAt: '30 days' },
    { id: 'w41', creator1: 'Beta Squad', creator2: 'Sidemen', question: 'Who wins in a football challenge?', category: 'Engagement', creator1Odds: 45, creator2Odds: 55, volume: '1,620 SOL', endsAt: '20 days' },
    { id: 'w42', creator1: 'MrBeast', creator2: 'PewDiePie', question: 'Who wins a "build something" challenge?', category: 'Engagement', creator1Odds: 62, creator2Odds: 38, volume: '1,950 SOL', endsAt: '30 days' },
    { id: 'w43', creator1: 'KSI', creator2: 'Jake Paul', question: "Who's video gets more dislikes next?", category: 'Engagement', creator1Odds: 42, creator2Odds: 58, volume: '1,120 SOL', endsAt: '10 days' },
    { id: 'w44', creator1: 'Airrack', creator2: 'Ryan Trahan', question: 'Who gets more sponsorships this month?', category: 'Content', creator1Odds: 55, creator2Odds: 45, volume: '720 SOL', endsAt: '25 days' },
    { id: 'w45', creator1: 'Sidemen', creator2: 'Dude Perfect', question: 'Who reaches 1B views first this year?', category: 'Views', creator1Odds: 58, creator2Odds: 42, volume: '2,180 SOL', endsAt: '10 months' },
    { id: 'w46', creator1: 'Niko', creator2: 'Speed', question: 'Who posts a viral short next?', category: 'Views', creator1Odds: 48, creator2Odds: 52, volume: '890 SOL', endsAt: '5 days' },
    { id: 'w47', creator1: 'Logan Paul', creator2: 'KSI', question: 'Who trends first this week?', category: 'Trending', creator1Odds: 52, creator2Odds: 48, volume: '1,420 SOL', endsAt: '7 days' },
    { id: 'w48', creator1: 'PewDiePie', creator2: 'MrBeast', question: 'Whose next thumbnail looks better (fan vote)?', category: 'Engagement', creator1Odds: 45, creator2Odds: 55, volume: '1,180 SOL', endsAt: '5 days' },
    { id: 'w49', creator1: 'Beta Squad', creator2: 'Sidemen', question: 'Whose next video is funnier?', category: 'Engagement', creator1Odds: 48, creator2Odds: 52, volume: '1,320 SOL', endsAt: '10 days' },
    { id: 'w50', creator1: 'Dream', creator2: 'TommyInnit', question: 'Who collabs first again?', category: 'Content', creator1Odds: 52, creator2Odds: 48, volume: '920 SOL', endsAt: '3 months' },
    { id: 'w51', creator1: 'Kai Cenat', creator2: 'Speed', question: 'Whose fans are louder at events?', category: 'Engagement', creator1Odds: 58, creator2Odds: 42, volume: '1,050 SOL', endsAt: '60 days' },
    { id: 'w52', creator1: 'MrBeast', creator2: 'Airrack', question: 'Who hits 200M subs first?', category: 'Subscribers', creator1Odds: 88, creator2Odds: 12, volume: '3,120 SOL', endsAt: '1 year' },
    { id: 'w53', creator1: 'KSI', creator2: 'Deji', question: 'Who wins a boxing vlog battle?', category: 'Engagement', creator1Odds: 72, creator2Odds: 28, volume: '1,480 SOL', endsAt: '30 days' },
    { id: 'w54', creator1: 'Ryan Trahan', creator2: 'Airrack', question: 'Who makes a better travel video?', category: 'Content', creator1Odds: 55, creator2Odds: 45, volume: '820 SOL', endsAt: '20 days' },
    { id: 'w55', creator1: 'Niko', creator2: 'Beta Squad', question: 'Who uploads first in November?', category: 'Content', creator1Odds: 52, creator2Odds: 48, volume: '690 SOL', endsAt: '45 days' },
    { id: 'w56', creator1: 'PewDiePie', creator2: 'Markiplier', question: 'Who hits 40M total views faster?', category: 'Views', creator1Odds: 62, creator2Odds: 38, volume: '1,580 SOL', endsAt: '30 days' },
    { id: 'w57', creator1: 'Sidemen', creator2: 'Dude Perfect', question: 'Whose next collab is bigger?', category: 'Content', creator1Odds: 58, creator2Odds: 42, volume: '1,420 SOL', endsAt: '2 months' },
    { id: 'w58', creator1: 'Logan Paul', creator2: 'Jake Paul', question: 'Who announces a new product first?', category: 'Content', creator1Odds: 55, creator2Odds: 45, volume: '1,280 SOL', endsAt: '14 days' },
    { id: 'w59', creator1: 'MrBeast', creator2: 'Ryan Trahan', question: 'Who trends longer globally?', category: 'Trending', creator1Odds: 72, creator2Odds: 28, volume: '1,920 SOL', endsAt: '30 days' },
    { id: 'w60', creator1: 'Kai Cenat', creator2: 'IShowSpeed', question: 'Whose clips go viral on Shorts first?', category: 'Views', creator1Odds: 52, creator2Odds: 48, volume: '1,180 SOL', endsAt: '7 days' },
    { id: 'w61', creator1: 'Airrack', creator2: 'Max Fosh', question: 'Who wins a "social experiment" battle?', category: 'Engagement', creator1Odds: 58, creator2Odds: 42, volume: '920 SOL', endsAt: '14 days' },
    { id: 'w62', creator1: 'Beta Squad', creator2: 'Sidemen', question: 'Whose charity video performs better?', category: 'Views', creator1Odds: 45, creator2Odds: 55, volume: '1,680 SOL', endsAt: '60 days' },
    { id: 'w63', creator1: 'KSI', creator2: 'Jake Paul', question: 'Who wins in public poll of "most entertaining"?', category: 'Engagement', creator1Odds: 52, creator2Odds: 48, volume: '1,420 SOL', endsAt: '7 days' },
    { id: 'w64', creator1: 'MrBeast', creator2: 'Airrack', question: 'Who uploads the longer video?', category: 'Content', creator1Odds: 68, creator2Odds: 32, volume: '1,120 SOL', endsAt: '10 days' },
    { id: 'w65', creator1: 'PewDiePie', creator2: 'MKBHD', question: 'Who hits more comments per minute?', category: 'Engagement', creator1Odds: 62, creator2Odds: 38, volume: '1,050 SOL', endsAt: '7 days' },
    { id: 'w66', creator1: 'Ryan Trahan', creator2: 'Airrack', question: "Who's thumbnail design gets more clicks?", category: 'Engagement', creator1Odds: 52, creator2Odds: 48, volume: '890 SOL', endsAt: '5 days' },
    { id: 'w67', creator1: 'Sidemen', creator2: 'Beta Squad', question: 'Who breaks a record next?', category: 'Content', creator1Odds: 55, creator2Odds: 45, volume: '1,320 SOL', endsAt: '30 days' },
    { id: 'w68', creator1: 'Dream', creator2: 'TommyInnit', question: 'Who uploads before November 1st?', category: 'Content', creator1Odds: 58, creator2Odds: 42, volume: '720 SOL', endsAt: '40 days' },
    { id: 'w69', creator1: 'Kai Cenat', creator2: 'Speed', question: 'Whose meme goes viral first?', category: 'Engagement', creator1Odds: 52, creator2Odds: 48, volume: '1,180 SOL', endsAt: '7 days' },
    { id: 'w70', creator1: 'Niko', creator2: 'Chunkz', question: "Who's prank gets more coverage?", category: 'Engagement', creator1Odds: 55, creator2Odds: 45, volume: '820 SOL', endsAt: '10 days' },
    { id: 'w71', creator1: 'MrBeast', creator2: 'PewDiePie', question: 'Who hits 20B total views first?', category: 'Views', creator1Odds: 72, creator2Odds: 28, volume: '2,890 SOL', endsAt: '6 months' },
    { id: 'w72', creator1: 'KSI', creator2: 'Jake Paul', question: 'Who uploads a music video next?', category: 'Content', creator1Odds: 58, creator2Odds: 42, volume: '1,280 SOL', endsAt: '14 days' },
    { id: 'w73', creator1: 'Sidemen', creator2: 'Dude Perfect', question: 'Who wins the next trick shot challenge?', category: 'Engagement', creator1Odds: 48, creator2Odds: 52, volume: '1,420 SOL', endsAt: '20 days' },
    { id: 'w74', creator1: 'Airrack', creator2: 'Ryan Trahan', question: 'Who trends higher in the U.S.?', category: 'Trending', creator1Odds: 52, creator2Odds: 48, volume: '920 SOL', endsAt: '7 days' },
    { id: 'w75', creator1: 'Speed', creator2: 'Kai Cenat', question: 'Who breaks a YouTube record first?', category: 'Content', creator1Odds: 55, creator2Odds: 45, volume: '1,680 SOL', endsAt: '60 days' },
    { id: 'w76', creator1: 'Logan Paul', creator2: 'KSI', question: 'Whose podcast hits more views next?', category: 'Views', creator1Odds: 52, creator2Odds: 48, volume: '1,320 SOL', endsAt: '7 days' },
    { id: 'w77', creator1: 'MrBeast', creator2: 'Airrack', question: 'Who gets more subscribers next month?', category: 'Subscribers', creator1Odds: 82, creator2Odds: 18, volume: '2,450 SOL', endsAt: '30 days' },
    { id: 'w78', creator1: 'Beta Squad', creator2: 'Sidemen', question: 'Who wins a cooking challenge?', category: 'Engagement', creator1Odds: 48, creator2Odds: 52, volume: '1,120 SOL', endsAt: '20 days' },
    { id: 'w79', creator1: 'PewDiePie', creator2: 'Markiplier', question: 'Who uploads a collab video first?', category: 'Content', creator1Odds: 45, creator2Odds: 55, volume: '1,050 SOL', endsAt: '3 months' },
    { id: 'w80', creator1: 'Niko', creator2: 'Chunkz', question: 'Who\'s thumbnail gets more clicks?', category: 'Engagement', creator1Odds: 52, creator2Odds: 48, volume: '780 SOL', endsAt: '7 days' },
    { id: 'w81', creator1: 'KSI', creator2: 'Jake Paul', question: 'Who gets more views on fight promo video?', category: 'Views', creator1Odds: 55, creator2Odds: 45, volume: '1,880 SOL', endsAt: '14 days' },
    { id: 'w82', creator1: 'MrBeast', creator2: 'Ryan Trahan', question: 'Who hits 10M likes faster?', category: 'Engagement', creator1Odds: 78, creator2Odds: 22, volume: '1,620 SOL', endsAt: '20 days' },
    { id: 'w83', creator1: 'Sidemen', creator2: 'Dude Perfect', question: 'Who wins a sports challenge?', category: 'Engagement', creator1Odds: 58, creator2Odds: 42, volume: '1,420 SOL', endsAt: '30 days' },
    { id: 'w84', creator1: 'Airrack', creator2: 'Beta Squad', question: 'Who posts first next week?', category: 'Content', creator1Odds: 52, creator2Odds: 48, volume: '690 SOL', endsAt: '7 days' },
    { id: 'w85', creator1: 'Kai Cenat', creator2: 'Speed', question: 'Who hits 1M likes first on Shorts?', category: 'Engagement', creator1Odds: 55, creator2Odds: 45, volume: '1,180 SOL', endsAt: '10 days' },
    { id: 'w86', creator1: 'Logan Paul', creator2: 'KSI', question: "Who's video gets more comments?", category: 'Engagement', creator1Odds: 48, creator2Odds: 52, volume: '1,280 SOL', endsAt: '7 days' },
    { id: 'w87', creator1: 'Dream', creator2: 'TommyInnit', question: 'Who trends in the UK first?', category: 'Trending', creator1Odds: 52, creator2Odds: 48, volume: '920 SOL', endsAt: '14 days' },
    { id: 'w88', creator1: 'MrBeast', creator2: 'Airrack', question: 'Who releases a collab next?', category: 'Content', creator1Odds: 68, creator2Odds: 32, volume: '1,520 SOL', endsAt: '30 days' },
    { id: 'w89', creator1: 'Sidemen', creator2: 'Beta Squad', question: 'Who gets more total views this month?', category: 'Views', creator1Odds: 62, creator2Odds: 38, volume: '1,820 SOL', endsAt: '25 days' },
    { id: 'w90', creator1: 'Niko', creator2: 'Chunkz', question: 'Who uploads the more viral prank?', category: 'Views', creator1Odds: 58, creator2Odds: 42, volume: '890 SOL', endsAt: '10 days' },
    { id: 'w91', creator1: 'PewDiePie', creator2: 'Markiplier', question: 'Who hits 50M total likes first?', category: 'Engagement', creator1Odds: 65, creator2Odds: 35, volume: '1,680 SOL', endsAt: '3 months' },
    { id: 'w92', creator1: 'KSI', creator2: 'Jake Paul', question: 'Who gets higher watch time next upload?', category: 'Views', creator1Odds: 52, creator2Odds: 48, volume: '1,420 SOL', endsAt: '10 days' },
    { id: 'w93', creator1: 'Ryan Trahan', creator2: 'Airrack', question: 'Who reaches trending faster?', category: 'Trending', creator1Odds: 55, creator2Odds: 45, volume: '820 SOL', endsAt: '7 days' },
    { id: 'w94', creator1: 'MrBeast', creator2: 'PewDiePie', question: "Who's audience engagement rate is higher?", category: 'Engagement', creator1Odds: 68, creator2Odds: 32, volume: '1,920 SOL', endsAt: '30 days' },
    { id: 'w95', creator1: 'Sidemen', creator2: 'Dude Perfect', question: 'Who wins the YouTube Creator Clash?', category: 'Engagement', creator1Odds: 58, creator2Odds: 42, volume: '2,180 SOL', endsAt: '60 days' },
    { id: 'w96', creator1: 'Dream', creator2: 'TommyInnit', question: 'Who uploads a reaction next?', category: 'Content', creator1Odds: 52, creator2Odds: 48, volume: '720 SOL', endsAt: '14 days' },
    { id: 'w97', creator1: 'Speed', creator2: 'Kai Cenat', question: 'Who gains more subscribers in 7 days?', category: 'Subscribers', creator1Odds: 55, creator2Odds: 45, volume: '1,420 SOL', endsAt: '7 days' },
    { id: 'w98', creator1: 'Niko', creator2: 'Beta Squad', question: 'Who wins a 24-hour challenge first?', category: 'Content', creator1Odds: 52, creator2Odds: 48, volume: '920 SOL', endsAt: '30 days' },
    { id: 'w99', creator1: 'Airrack', creator2: 'Ryan Trahan', question: 'Who hits 15M subs first?', category: 'Subscribers', creator1Odds: 58, creator2Odds: 42, volume: '1,280 SOL', endsAt: '6 months' },
    { id: 'w100', creator1: 'MrBeast', creator2: 'KSI', question: 'Who gets more likes on next upload?', category: 'Engagement', creator1Odds: 72, creator2Odds: 28, volume: '2,120 SOL', endsAt: '7 days' }
  ];

  const wagerCategories = ['all', 'Views', 'Subscribers', 'Trending', 'Engagement', 'Content'];
  const featuredWagers = wagerBattles.filter(w => w.featured);

  // Filter wagers based on category and search
  const filteredWagers = useMemo(() => {
    let filtered = wagerBattles;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(w => w.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(w => 
        w.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.creator1.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.creator2.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  // Filter markets based on category and search
  const filteredMarkets = useMemo(() => {
    let filtered = predictionMarkets;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(m => 
        m.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  const featuredMarkets = predictionMarkets.filter(m => m.featured);

  // Handle bet placement
  const handlePlaceBet = async () => {
    if (!user) {
      toast.error('Please connect your wallet first');
      await login();
      return;
    }

    if (!selectedMarket) return;

    const amountNum = parseFloat(betAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid bet amount');
      return;
    }

    const minBetSOL = parseFloat(MIN_BET_LAMPORTS) / 1e9;
    if (amountNum < minBetSOL) {
      toast.error(`Minimum bet is ${minBetSOL} SOL`);
      return;
    }

    setIsPlacingBet(true);

    try {
      const betId = `${selectedMarket.id}-${user.address}-${Date.now()}`;
      const success = await setMarketsBets(
        selectedMarket.id,
        betId,
        {
          bettor: Address.publicKey(user.address),
          position: betPosition,
          amount: Token.amount('SOL', amountNum),
          resolved: false
        }
      );

      if (success) {
        toast.success(`Bet placed successfully! ${amountNum} SOL on ${betPosition.toUpperCase()}`);
        setBetModalOpen(false);
        setBetAmount('');
        setSelectedMarket(null);
      } else {
        toast.error('Failed to place bet. Please try again.');
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      toast.error('Error placing bet. Please try again.');
    } finally {
      setIsPlacingBet(false);
    }
  };

  const openBetModal = (market: PredictionMarket, position: 'yes' | 'no') => {
    const realMarket = realMarkets?.find(m => m.id === market.id);
    if (realMarket) {
      setSelectedMarket(realMarket);
      setBetPosition(position);
      setBetModalOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar-background p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PolyTube
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Trade the Hype</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  selectedTab === tab.id
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {user && (
          <div className="mt-auto pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Connected</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {selectedTab === 'leaderboard' ? (
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="max-w-7xl mx-auto px-8 py-8"
          >
            {/* Leaderboard Hero Section */}
            <motion.div variants={cardVariant} className="mb-8">
              <h1 className="text-5xl font-bold mb-3">
                Top Bettors
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                See who's dominating the prediction markets
              </p>
            </motion.div>

            {/* Leaderboard Sections */}
            <div className="grid gap-8 md:grid-cols-3 mb-8">
              {/* Top Earners */}
              <motion.div variants={cardVariant}>
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <h3 className="text-lg font-bold">Top Earners</h3>
                    </div>
                    <div className="space-y-3">
                      {/* -- USING MOCK DATA -- */}
                      {[
                        { rank: 1, address: '7xK9LZaA7axCe8rHk3DYTdWU5wyHc1yCK4atDxyGz3pL2', profit: '+125.5 SOL' },
                        { rank: 2, address: 'BQm8FvRN2VxMbrEYZqG7mX3KpDLkNz4WfYc6HsJtUoPw', profit: '+98.2 SOL' },
                        { rank: 3, address: 'CxH5RJmP9wZyNvKpQ2DfLt8Xs3TcBgWaUoYj7VnMeRkS', profit: '+87.3 SOL' },
                        { rank: 4, address: 'DpL2KvTcM6YwRxNf9BsQaH4Zj8GeCnWbPmUo1XrVzFhJ', profit: '+65.8 SOL' },
                        { rank: 5, address: 'EkN7WzQpL3BvMxYtR6CsHaU9ZfGj2DwPoVn8XrKmTbFc', profit: '+54.1 SOL' },
                      ].map((user) => {
                        const truncatedAddress = `${user.address.slice(0, 4)}...${user.address.slice(-4)}`;
                        return (
                        <div key={user.rank} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" title={user.address}>
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${user.rank <= 3 ? 'bg-yellow-500/20' : 'bg-muted'} font-bold text-sm`}>
                            {user.rank}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm font-mono">{truncatedAddress}</p>
                            <p className="text-xs text-green-500">{user.profit}</p>
                          </div>
                        </div>
                      )})}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Most Active */}
              <motion.div variants={cardVariant}>
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <h3 className="text-lg font-bold">Most Active</h3>
                    </div>
                    <div className="space-y-3">
                      {/* -- USING MOCK DATA -- */}
                      {[
                        { rank: 1, address: 'FyJ8PxLcN5TwMvRq3HsKaU2ZdBmGj9CnYoWp7VrXzFeS', bets: '342 bets' },
                        { rank: 2, address: 'GzK9QwMrP4UxNyTs6JvLbV3AeFnHj2DpXoCq8WsYzGhT', bets: '289 bets' },
                        { rank: 3, address: 'HxL5RzNsQ6VyPwUt9KwMcW4BfGoIk3EqYpDr2XtAzJiU', bets: '267 bets' },
                        { rank: 4, address: 'JyM6SzPtR7WzQxVu2LxNdX5CgHpJl4FrZqEs3YuBzKjV', bets: '234 bets' },
                        { rank: 5, address: 'KzN7TxQuS8XxRyWv3MyPeY6DhIqKm5GsAqFt4ZvCzLkW', bets: '198 bets' },
                      ].map((user) => {
                        const truncatedAddress = `${user.address.slice(0, 4)}...${user.address.slice(-4)}`;
                        return (
                        <div key={user.rank} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" title={user.address}>
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${user.rank <= 3 ? 'bg-orange-500/20' : 'bg-muted'} font-bold text-sm`}>
                            {user.rank}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm font-mono">{truncatedAddress}</p>
                            <p className="text-xs text-muted-foreground">{user.bets}</p>
                          </div>
                        </div>
                      )})}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Best Win Rate */}
              <motion.div variants={cardVariant}>
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <h3 className="text-lg font-bold">Best Win Rate</h3>
                    </div>
                    <div className="space-y-3">
                      {/* -- USING MOCK DATA -- */}
                      {[
                        { rank: 1, address: 'LxP8UzRvT9YzSxXw4NyQfZ7EiJrLn6HtBrGu5AwDzMmX', winRate: '82.5%' },
                        { rank: 2, address: 'MxQ9VzSwU2ZzTyYx5PzRgA8FjKsMo7IuCsHv6BxEzNnY', winRate: '78.9%' },
                        { rank: 3, address: 'NxR2WzTxV3AzUzZy6QzShB9GkLtNp8JvDtIw7CyFzPoZ', winRate: '76.3%' },
                        { rank: 4, address: 'PxS3XzUyW4BzVzAz7RzTiC2HmMuPq9KwEuJx8DzGzQpA', winRate: '73.1%' },
                        { rank: 5, address: 'QxT4YzVzX5CzWzBz8SzUjD3InNvQr2LxFvKy9EzHzRqB', winRate: '71.8%' },
                      ].map((user) => {
                        const truncatedAddress = `${user.address.slice(0, 4)}...${user.address.slice(-4)}`;
                        return (
                        <div key={user.rank} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" title={user.address}>
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${user.rank <= 3 ? 'bg-green-500/20' : 'bg-muted'} font-bold text-sm`}>
                            {user.rank}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm font-mono">{truncatedAddress}</p>
                            <p className="text-xs text-green-500">{user.winRate}</p>
                          </div>
                        </div>
                      )})}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Full Leaderboard Table */}
            <motion.div variants={cardVariant}>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Complete Leaderboard</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-sm font-semibold">Rank</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold">Address</th>
                          <th className="text-right py-3 px-2 text-sm font-semibold">Total Bets</th>
                          <th className="text-right py-3 px-2 text-sm font-semibold">Win Rate</th>
                          <th className="text-right py-3 px-2 text-sm font-semibold">Profit/Loss</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* -- USING MOCK DATA -- */}
                        {[
                          { rank: 1, address: '7xK9LZaA7axCe8rHk3DYTdWU5wyHc1yCK4atDxyGz3pL2', totalBets: 156, winRate: 68.5, profit: '+125.5 SOL', isProfit: true },
                          { rank: 2, address: 'BQm8FvRN2VxMbrEYZqG7mX3KpDLkNz4WfYc6HsJtUoPw', totalBets: 203, winRate: 64.2, profit: '+98.2 SOL', isProfit: true },
                          { rank: 3, address: 'CxH5RJmP9wZyNvKpQ2DfLt8Xs3TcBgWaUoYj7VnMeRkS', totalBets: 178, winRate: 66.1, profit: '+87.3 SOL', isProfit: true },
                          { rank: 4, address: 'DpL2KvTcM6YwRxNf9BsQaH4Zj8GeCnWbPmUo1XrVzFhJ', totalBets: 145, winRate: 62.8, profit: '+65.8 SOL', isProfit: true },
                          { rank: 5, address: 'EkN7WzQpL3BvMxYtR6CsHaU9ZfGj2DwPoVn8XrKmTbFc', totalBets: 198, winRate: 58.9, profit: '+54.1 SOL', isProfit: true },
                          { rank: 6, address: 'FyJ8PxLcN5TwMvRq3HsKaU2ZdBmGj9CnYoWp7VrXzFeS', totalBets: 289, winRate: 55.2, profit: '+42.7 SOL', isProfit: true },
                          { rank: 7, address: 'GzK9QwMrP4UxNyTs6JvLbV3AeFnHj2DpXoCq8WsYzGhT', totalBets: 267, winRate: 53.8, profit: '+38.4 SOL', isProfit: true },
                          { rank: 8, address: 'HxL5RzNsQ6VyPwUt9KwMcW4BfGoIk3EqYpDr2XtAzJiU', totalBets: 89, winRate: 82.5, profit: '+35.9 SOL', isProfit: true },
                          { rank: 9, address: 'JyM6SzPtR7WzQxVu2LxNdX5CgHpJl4FrZqEs3YuBzKjV', totalBets: 124, winRate: 78.9, profit: '+32.6 SOL', isProfit: true },
                          { rank: 10, address: 'KzN7TxQuS8XxRyWv3MyPeY6DhIqKm5GsAqFt4ZvCzLkW', totalBets: 234, winRate: 51.3, profit: '+28.3 SOL', isProfit: true },
                        ].map((user) => {
                          const truncatedAddress = `${user.address.slice(0, 4)}...${user.address.slice(-4)}`;
                          return (
                          <tr key={user.rank} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer" title={user.address}>
                            <td className="py-3 px-2">
                              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${user.rank <= 3 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-muted'} font-bold text-sm`}>
                                {user.rank}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <span className="font-medium font-mono">{truncatedAddress}</span>
                            </td>
                            <td className="text-right py-3 px-2 text-muted-foreground">{user.totalBets}</td>
                            <td className="text-right py-3 px-2">
                              <span className={user.winRate >= 60 ? 'text-green-500' : 'text-muted-foreground'}>
                                {user.winRate.toFixed(1)}%
                              </span>
                            </td>
                            <td className={`text-right py-3 px-2 font-medium ${user.isProfit ? 'text-green-500' : 'text-red-500'}`}>
                              {user.profit}
                            </td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : selectedTab === 'wagers' ? (
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="max-w-7xl mx-auto px-8 py-8"
          >
            {/* Hero Section for Wagers */}
            <motion.div variants={cardVariant} className="mb-8">
              <h1 className="text-5xl font-bold mb-3">
                Creator Battles
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                Bet on head-to-head creator matchups
              </p>
              
              {/* Search Bar */}
              <div className="max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search battles or creators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card border-border"
                  />
                </div>
              </div>
            </motion.div>

            {/* Featured Battles Section */}
            <motion.div variants={cardVariant} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Flame className="h-6 w-6 text-accent" />
                  Featured Battles
                </h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featuredWagers.map((wager) => (
                  <Card 
                    key={wager.id} 
                    className="bg-card hover:shadow-xl hover:shadow-accent/10 transition-all cursor-pointer border border-border hover:border-accent/50"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary">
                            {wager.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{wager.endsAt}</span>
                        </div>
                        
                        {/* Creators vs Display */}
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <span className="text-sm font-bold text-primary">{wager.creator1}</span>
                          <span className="text-lg">🆚</span>
                          <span className="text-sm font-bold text-secondary">{wager.creator2}</span>
                        </div>
                        
                        <p className="text-xs text-center text-muted-foreground mb-4">
                          {wager.question}
                        </p>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <div className="flex-1 text-center">
                          <p className="text-xs text-muted-foreground mb-1">{wager.creator1}</p>
                          <p className="text-2xl font-bold text-primary">{wager.creator1Odds}%</p>
                        </div>
                        <div className="flex-1 text-center">
                          <p className="text-xs text-muted-foreground mb-1">{wager.creator2}</p>
                          <p className="text-2xl font-bold text-secondary">{wager.creator2Odds}%</p>
                        </div>
                      </div>

                      {/* Odds bar */}
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                          style={{ width: `${wager.creator1Odds}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {wager.volume}
                        </span>
                      </div>

                      <Button className="w-full" size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Place Wager
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* All Battles Section */}
            <motion.div variants={cardVariant}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  All Battles
                </h2>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Category:</span>
                </div>
              </div>
              
              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {wagerCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
              
              {/* Battle Count */}
              <p className="text-sm text-muted-foreground mb-4">
                Showing {filteredWagers.length} battle{filteredWagers.length !== 1 ? 's' : ''}
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredWagers.map((wager) => (
                  <Card 
                    key={wager.id} 
                    className="bg-card hover:shadow-xl hover:shadow-primary/10 transition-all cursor-pointer border border-border hover:border-primary/50"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent/20 text-accent">
                            {wager.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{wager.endsAt}</span>
                        </div>
                        
                        {/* Creators vs Display */}
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <span className="text-sm font-bold text-primary">{wager.creator1}</span>
                          <span className="text-lg">🆚</span>
                          <span className="text-sm font-bold text-secondary">{wager.creator2}</span>
                        </div>
                        
                        <p className="text-xs text-center text-muted-foreground mb-4">
                          {wager.question}
                        </p>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <div className="flex-1 text-center">
                          <p className="text-xs text-muted-foreground mb-1">{wager.creator1}</p>
                          <p className="text-2xl font-bold text-primary">{wager.creator1Odds}%</p>
                        </div>
                        <div className="flex-1 text-center">
                          <p className="text-xs text-muted-foreground mb-1">{wager.creator2}</p>
                          <p className="text-2xl font-bold text-secondary">{wager.creator2Odds}%</p>
                        </div>
                      </div>

                      {/* Odds bar */}
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                          style={{ width: `${wager.creator1Odds}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {wager.volume}
                        </span>
                      </div>

                      <Button className="w-full" size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Place Wager
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredWagers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No battles found matching your search.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : selectedTab === 'home' ? (
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="max-w-7xl mx-auto px-8 py-8"
          >
          {/* Hero Section */}
          <motion.div variants={cardVariant} className="mb-8">
            <h1 className="text-5xl font-bold mb-3">
              Trade the Hype
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Bet on your favorite YouTubers' success with prediction markets
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search predictions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
            </div>
          </motion.div>

          {/* Split Layout: Markets & Wagers Side by Side */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Markets Section */}
            <motion.div variants={cardVariant} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Flame className="h-6 w-6 text-accent" />
                  Featured Markets
                </h2>
              </div>
              
              <div className="space-y-4">
                {featuredMarkets.slice(0, 5).map((market) => (
                  <Card 
                    key={market.id} 
                    className="bg-card hover:shadow-xl hover:shadow-accent/10 transition-all cursor-pointer border border-border hover:border-accent/50"
                  >
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary">
                            {market.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{market.endsAt}</span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">
                          {market.question}
                        </p>
                      </div>

                      <div className="flex gap-2 mb-3">
                        <div className="flex-1 text-center">
                          <p className="text-xs text-muted-foreground mb-1">YES</p>
                          <p className="text-xl font-bold text-primary">{market.yesOdds}%</p>
                        </div>
                        <div className="flex-1 text-center">
                          <p className="text-xs text-muted-foreground mb-1">NO</p>
                          <p className="text-xl font-bold text-secondary">{market.noOdds}%</p>
                        </div>
                      </div>

                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                          style={{ width: `${market.yesOdds}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {market.volume}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90" 
                          size="sm"
                          onClick={() => openBetModal(market, 'yes')}
                          disabled={marketsLoading}
                        >
                          Bet YES
                        </Button>
                        <Button 
                          className="w-full bg-secondary hover:bg-secondary/90" 
                          size="sm"
                          onClick={() => openBetModal(market, 'no')}
                          disabled={marketsLoading}
                        >
                          Bet NO
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setSelectedTab('battles')}
              >
                View All Markets
              </Button>
            </motion.div>

            {/* Wagers Section */}
            <motion.div variants={cardVariant} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Featured Battles
                </h2>
              </div>
              
              <div className="space-y-4">
                {featuredWagers.slice(0, 5).map((wager) => (
                  <Card 
                    key={wager.id} 
                    className="bg-card hover:shadow-xl hover:shadow-accent/10 transition-all cursor-pointer border border-border hover:border-accent/50"
                  >
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary">
                            {wager.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{wager.endsAt}</span>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-sm font-bold text-primary">{wager.creator1}</span>
                          <span className="text-lg">🆚</span>
                          <span className="text-sm font-bold text-secondary">{wager.creator2}</span>
                        </div>
                        
                        <p className="text-xs text-center text-muted-foreground">
                          {wager.question}
                        </p>
                      </div>

                      <div className="flex gap-2 mb-3">
                        <div className="flex-1 text-center">
                          <p className="text-xs text-muted-foreground mb-1">{wager.creator1}</p>
                          <p className="text-xl font-bold text-primary">{wager.creator1Odds}%</p>
                        </div>
                        <div className="flex-1 text-center">
                          <p className="text-xs text-muted-foreground mb-1">{wager.creator2}</p>
                          <p className="text-xl font-bold text-secondary">{wager.creator2Odds}%</p>
                        </div>
                      </div>

                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                          style={{ width: `${wager.creator1Odds}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {wager.volume}
                        </span>
                      </div>

                      <Button className="w-full" size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Place Wager
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setSelectedTab('wagers')}
              >
                View All Battles
              </Button>
            </motion.div>
          </div>
          </motion.div>
        ) : selectedTab === 'battles' ? (
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="max-w-7xl mx-auto px-8 py-8"
          >
          {/* Hero Section */}
          <motion.div variants={cardVariant} className="mb-8">
            <h1 className="text-5xl font-bold mb-3">
              All Markets
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Browse all prediction markets
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search predictions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
            </div>
          </motion.div>


          {/* All Markets Section */}
          <motion.div variants={cardVariant}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                All Markets
              </h2>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Category:</span>
              </div>
            </div>
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
            
            {/* Market Count */}
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredMarkets.length} market{filteredMarkets.length !== 1 ? 's' : ''}
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMarkets.map((market) => (
                <Card 
                  key={market.id} 
                  className="bg-card hover:shadow-xl hover:shadow-primary/10 transition-all cursor-pointer border border-border hover:border-primary/50"
                >
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent/20 text-accent">
                          {market.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{market.endsAt}</span>
                      </div>
                      <p className="text-sm font-medium mb-4 leading-relaxed">
                        {market.question}
                      </p>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 text-center">
                        <p className="text-xs text-muted-foreground mb-1">YES</p>
                        <p className="text-2xl font-bold text-primary">{market.yesOdds}%</p>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="text-xs text-muted-foreground mb-1">NO</p>
                        <p className="text-2xl font-bold text-secondary">{market.noOdds}%</p>
                      </div>
                    </div>

                    {/* Odds bar */}
                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                        style={{ width: `${market.yesOdds}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {market.volume}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90" 
                        size="sm"
                        onClick={() => openBetModal(market, 'yes')}
                        disabled={marketsLoading}
                      >
                        Bet YES
                      </Button>
                      <Button 
                        className="w-full bg-secondary hover:bg-secondary/90" 
                        size="sm"
                        onClick={() => openBetModal(market, 'no')}
                        disabled={marketsLoading}
                      >
                        Bet NO
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredMarkets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No markets found matching your search.</p>
              </div>
            )}
          </motion.div>
          </motion.div>
        ) : (
          <div className="max-w-7xl mx-auto px-8 py-8">
            <p className="text-muted-foreground">Select a tab from the sidebar.</p>
          </div>
        )}
      </main>

      {/* Betting Modal */}
      <Dialog open={betModalOpen} onOpenChange={setBetModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Place Your Bet</DialogTitle>
            <DialogDescription>
              {selectedMarket?.question}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Position</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={betPosition === 'yes' ? 'default' : 'outline'}
                  onClick={() => setBetPosition('yes')}
                  className="w-full"
                >
                  YES
                </Button>
                <Button
                  variant={betPosition === 'no' ? 'default' : 'outline'}
                  onClick={() => setBetPosition('no')}
                  className="w-full"
                >
                  NO
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bet-amount">Amount (SOL)</Label>
              <Input
                id="bet-amount"
                type="number"
                placeholder="0.1"
                step="0.01"
                min="0.001"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Minimum: {parseFloat(MIN_BET_LAMPORTS) / 1e9} SOL
              </p>
            </div>

            {user && (
              <div className="text-sm text-muted-foreground">
                <p>Wallet: {user.address.slice(0, 4)}...{user.address.slice(-4)}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setBetModalOpen(false)}
              disabled={isPlacingBet}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handlePlaceBet}
              disabled={isPlacingBet || !betAmount}
            >
              {isPlacingBet ? 'Placing Bet...' : `Bet ${betAmount || '0'} SOL`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
