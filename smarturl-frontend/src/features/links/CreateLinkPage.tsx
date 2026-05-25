import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import { SpamWarning } from '../../components/SpamWarning';
import { SafetyResult } from '../../types';
import { Link2, Sparkles, ChevronLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const CreateLinkPage: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Safety checking states
  const [checkingSafety, setCheckingSafety] = useState(false);
  const [safetyResult, setSafetyResult] = useState<SafetyResult | null>(null);

  const checkSafety = async () => {
    if (!url || !url.startsWith('http')) {
      setError('Please provide a valid URL beginning with http:// or https://');
      return;
    }
    setError('');
    setCheckingSafety(true);
    setSafetyResult(null);
    try {
      const res = await api.post('/urls/check-safety', { originalUrl: url });
      setSafetyResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to scan URL safety');
    } finally {
      setCheckingSafety(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/urls', {
        originalUrl: url,
        customAlias: alias || undefined
      });
      navigate(`/dashboard/links/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Back button */}
      <Button variant="ghost" className="flex items-center space-x-2" onClick={() => navigate('/dashboard/links')}>
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Links</span>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form container */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center space-x-2">
                <Link2 className="h-5 w-5 text-primary" />
                <span>Shorten a URL</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-destructive/15 border border-destructive/30 rounded-md text-sm text-destructive">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Long URL</label>
                  <div className="flex space-x-2">
                    <Input
                      type="url"
                      required
                      placeholder="https://example.com/very/long/path/to/resource"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={checkSafety}
                      disabled={checkingSafety || !url}
                    >
                      {checkingSafety ? 'Scanning...' : 'Scan URL'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Custom Alias (Optional)</label>
                  <Input
                    type="text"
                    placeholder="my-custom-name"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                  />
                </div>

                {safetyResult && safetyResult.riskLevel === 'HIGH_RISK' && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-md text-xs text-rose-400">
                    ⚠️ WARNING: Our safety system classified this destination URL as High Risk. Shortening this URL may result in access blocks or security prompts.
                  </div>
                )}

                <Button type="submit" className="w-full flex items-center justify-center space-x-2" disabled={submitting}>
                  <Sparkles className="h-4 w-4" />
                  <span>{submitting ? 'Shortening...' : 'Generate Short URL'}</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Safety scanning feedback panel */}
        <div className="lg:col-span-2 space-y-6">
          {safetyResult ? (
            <SpamWarning safetyResult={safetyResult} />
          ) : (
            <Card className="h-full flex flex-col items-center justify-center p-6 text-center border-dashed border-2 min-h-60">
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-secondary rounded-full text-muted-foreground">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Safety Analysis</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1">
                    Input a long URL and click "Scan URL" to analyze the safety score and check for phishing/spam threats.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
