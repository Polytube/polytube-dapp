import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@tarobase/js-sdk';
import { AuthContextType, AdminPageProps } from '@/components/types';
import { useTarobaseData } from '@/hooks/use-tarobase-data';
import { subscribeManyMarkets, setMarkets, updateMarkets, MarketsResponse, Time } from '@/lib/tarobase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react';

export const AdminPage: React.FC<AdminPageProps> = ({ adminAddresses }) => {
  const { user } = useAuth() as AuthContextType;
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('Performance');
  const [daysUntilResolution, setDaysUntilResolution] = useState('7');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no' | 'cancelled'>('yes');
  const [isResolving, setIsResolving] = useState(false);

  // Fetch all markets (active and resolved)
  const { data: allMarkets, loading: marketsLoading } = useTarobaseData<MarketsResponse[]>(
    subscribeManyMarkets,
    true,
    'limit 100'
  );

  // Check if current user is an admin
  const isAdmin = adminAddresses.includes(user?.address || "");

  // If not an admin, don't show the page content
  if (!isAdmin) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20">
        <div className="container mx-auto px-4">
          <p className="text-xl text-muted-foreground mb-12">You don't have permission to view this page</p>
        </div>
      </motion.div>
    );
  }

  const handleCreateMarket = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    const days = parseInt(daysUntilResolution);
    if (isNaN(days) || days <= 0) {
      toast.error('Please enter a valid number of days');
      return;
    }

    setIsCreating(true);

    try {
      const marketId = `market-${Date.now()}`;
      const resolutionDate = Math.floor(Date.now() / 1000) + (days * 86400); // Convert days to seconds

      const success = await setMarkets(marketId, {
        question: question.trim(),
        category: category,
        resolutionDate: resolutionDate,
        status: 'active',
        outcome: 'pending',
        totalYesBets: 0,
        totalNoBets: 0
      });

      if (success) {
        toast.success('Market created successfully!');
        setQuestion('');
        setDaysUntilResolution('7');
      } else {
        toast.error('Failed to create market');
      }
    } catch (error) {
      console.error('Error creating market:', error);
      toast.error('Error creating market');
    } finally {
      setIsCreating(false);
    }
  };

  const handleResolveMarket = async () => {
    if (!selectedMarketId) {
      toast.error('Please select a market');
      return;
    }

    setIsResolving(true);

    try {
      const success = await updateMarkets(selectedMarketId, {
        status: 'resolved',
        outcome: selectedOutcome
      });

      if (success) {
        toast.success(`Market resolved as ${selectedOutcome.toUpperCase()}!`);
        setSelectedMarketId(null);
      } else {
        toast.error('Failed to resolve market');
      }
    } catch (error) {
      console.error('Error resolving market:', error);
      toast.error('Error resolving market');
    } finally {
      setIsResolving(false);
    }
  };

  const activeMarkets = allMarkets?.filter(m => m.status === 'active') || [];
  const resolvedMarkets = allMarkets?.filter(m => m.status === 'resolved') || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage prediction markets</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Create Market Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Market
              </CardTitle>
              <CardDescription>Add a new prediction question</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  placeholder="Will MrBeast hit 300M subscribers by end of year?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Performance">Performance</SelectItem>
                    <SelectItem value="Collaborations">Collaborations</SelectItem>
                    <SelectItem value="Content">Content</SelectItem>
                    <SelectItem value="Platform">Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="days">Days Until Resolution</Label>
                <Input
                  id="days"
                  type="number"
                  min="1"
                  value={daysUntilResolution}
                  onChange={(e) => setDaysUntilResolution(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleCreateMarket} 
                className="w-full"
                disabled={isCreating || !question.trim()}
              >
                {isCreating ? 'Creating...' : 'Create Market'}
              </Button>
            </CardContent>
          </Card>

          {/* Resolve Market Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Resolve Market
              </CardTitle>
              <CardDescription>Set the outcome for an active market</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="market-select">Select Market</Label>
                <Select value={selectedMarketId || ''} onValueChange={setSelectedMarketId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a market..." />
                  </SelectTrigger>
                  <SelectContent>
                    {activeMarkets.map(market => (
                      <SelectItem key={market.id} value={market.id}>
                        {market.question.slice(0, 60)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Outcome</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedOutcome === 'yes' ? 'default' : 'outline'}
                    onClick={() => setSelectedOutcome('yes')}
                    className="w-full"
                  >
                    YES
                  </Button>
                  <Button
                    variant={selectedOutcome === 'no' ? 'default' : 'outline'}
                    onClick={() => setSelectedOutcome('no')}
                    className="w-full"
                  >
                    NO
                  </Button>
                  <Button
                    variant={selectedOutcome === 'cancelled' ? 'default' : 'outline'}
                    onClick={() => setSelectedOutcome('cancelled')}
                    className="w-full"
                  >
                    CANCEL
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleResolveMarket} 
                className="w-full"
                disabled={isResolving || !selectedMarketId}
              >
                {isResolving ? 'Resolving...' : 'Resolve Market'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Markets Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Markets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Active Markets ({activeMarkets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activeMarkets.map(market => {
                  const totalBets = market.totalYesBets + market.totalNoBets;
                  const volumeSOL = (totalBets / 1e9).toFixed(2);
                  return (
                    <div key={market.id} className="p-3 border rounded-lg">
                      <p className="text-sm font-medium mb-1">{market.question}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{market.category}</span>
                        <span>{volumeSOL} SOL</span>
                      </div>
                    </div>
                  );
                })}
                {activeMarkets.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No active markets</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resolved Markets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Resolved Markets ({resolvedMarkets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {resolvedMarkets.map(market => {
                  const totalBets = market.totalYesBets + market.totalNoBets;
                  const volumeSOL = (totalBets / 1e9).toFixed(2);
                  return (
                    <div key={market.id} className="p-3 border rounded-lg">
                      <p className="text-sm font-medium mb-1">{market.question}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{market.category}</span>
                        <span className="font-semibold text-foreground">{market.outcome.toUpperCase()}</span>
                      </div>
                    </div>
                  );
                })}
                {resolvedMarkets.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No resolved markets</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPage;