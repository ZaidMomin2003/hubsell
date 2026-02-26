import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, Search, Info, CheckCircle2, XCircle, Type, Link, MessageSquare } from 'lucide-react';

const SpamAnalysis = () => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [score, setScore] = useState(0);
    const [findings, setFindings] = useState([]);
    const [triggers, setTriggers] = useState([]);

    const spamKeywords = [
        { word: 'urgent', weight: 10, category: 'Urgency' },
        { word: 'guaranteed', weight: 15, category: 'Manipulation' },
        { word: 'prize', weight: 20, category: 'Scam' },
        { word: 'win', weight: 15, category: 'Scam' },
        { word: 'loan', weight: 15, category: 'Finance' },
        { word: 'credit score', weight: 12, category: 'Finance' },
        { word: 'investment', weight: 10, category: 'Finance' },
        { word: 'cash', weight: 10, category: 'Finance' },
        { word: 'offer', weight: 5, category: 'Sales' },
        { word: 'free', weight: 8, category: 'Sales' },
        { word: 'bonus', weight: 10, category: 'Sales' },
        { word: 'no cost', weight: 12, category: 'Sales' },
        { word: 'click here', weight: 15, category: 'Link' },
        { word: 'act now', weight: 12, category: 'Urgency' },
        { word: 'exclusive', weight: 5, category: 'Sales' },
        { word: 'password', weight: 8, category: 'Security' },
        { word: 'verify', weight: 8, category: 'Security' },
        { word: 'account', weight: 5, category: 'Security' },
        { word: 'bank', weight: 10, category: 'Finance' },
        { word: 'bitcoin', weight: 15, category: 'Crypto' },
        { word: 'crypto', weight: 12, category: 'Crypto' },
    ];

    useEffect(() => {
        analyzeSpam();
    }, [subject, body]);

    const analyzeSpam = () => {
        let currentScore = 0;
        let currentFindings = [];
        let currentTriggers = [];
        const fullText = (subject + ' ' + body).toLowerCase();

        // Keyword Trigger Analysis
        spamKeywords.forEach(k => {
            const regex = new RegExp(`\\b${k.word}\\b`, 'gi');
            const count = (fullText.match(regex) || []).length;
            if (count > 0) {
                currentScore += k.weight * Math.min(count, 3);
                currentTriggers.push({
                    word: k.word,
                    count,
                    category: k.category,
                    risk: k.weight > 12 ? 'HIGH' : k.weight > 7 ? 'MED' : 'LOW'
                });
            }
        });

        // Formatting Issue Analysis
        if (body.length > 50) {
            const capsCount = (body.match(/[A-Z]/g) || []).length;
            if (capsCount / body.length > 0.3) {
                currentScore += 20;
                currentFindings.push({ type: 'Excessive ALL CAPS usage', risk: 'High' });
            }

            if ((body.match(/!/g) || []).length > 3) {
                currentScore += 10;
                currentFindings.push({ type: 'Excessive punctuation (!!!)', risk: 'Medium' });
            }

            if (body.match(/bit\.ly|t\.co|goo\.gl/i)) {
                currentScore += 15;
                currentFindings.push({ type: 'Shortened URL detected', risk: 'High' });
            }
        }

        // Final score capping at 100
        setScore(Math.min(currentScore, 100));
        setFindings(currentFindings);
        setTriggers(currentTriggers.sort((a, b) => b.count - a.count));
    };

    const getScoreVariant = () => {
        if (score < 30) return { color: 'text-emerald-500', bg: 'bg-emerald-500', label: 'Low Risk', border: 'border-emerald-500/20' };
        if (score < 60) return { color: 'text-amber-500', bg: 'bg-amber-500', label: 'Moderate Risk', border: 'border-amber-500/20' };
        return { color: 'text-rose-500', bg: 'bg-rose-500', label: 'High Risk', border: 'border-rose-500/20' };
    };

    const variant = getScoreVariant();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center">
                <h1 className="text-4xl font-black tracking-tight mb-3 italic">Cleanmails Spam Patrol</h1>
                <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.3em]">Advanced content diagnostics for outreach</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Editor Panel */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-card glass border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <AlertTriangle className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold italic">Spam Content Analysis</h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Weighted scoring and pattern recognition</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block py-1">Email Subject</label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 bg-muted/30 rounded-xl border border-white/5 focus:outline-none focus:border-primary/30 transition-all font-bold text-sm"
                                    placeholder="e.g., URGENT: Action required on your account"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block py-1">Email Body</label>
                                <textarea
                                    className="w-full h-[400px] px-6 py-6 bg-muted/30 rounded-2xl border border-white/5 focus:outline-none focus:border-primary/30 transition-all font-medium text-sm resize-none custom-scrollbar"
                                    placeholder="Paste your email copy here for deep analysis..."
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score Panel */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-card glass border border-white/10 p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">Spam Probability</span>

                        <div className="relative w-40 h-40 mb-8">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-muted/10"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * score) / 100}
                                    className={`${variant.color} transition-all duration-1000 ease-out`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black italic">{score}</span>
                                <span className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">/ 100</span>
                            </div>
                        </div>

                        <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/5 ${variant.bg} text-white mb-10`}>
                            {variant.label}
                        </span>

                        <div className="w-full space-y-6 text-left">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-2">Formatting Issues</h4>
                                {findings.length > 0 ? (
                                    findings.map((f, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs font-bold text-rose-400 group">
                                            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                            <span>{f.type} <span className="text-[9px] opacity-60">({f.risk} Risk)</span></span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>No formatting flags detected</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-2 pt-4">Keyword Triggers</h4>
                                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                    {triggers.length > 0 ? (
                                        triggers.map((t, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl border border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black italic uppercase tracking-tighter">{t.word}</span>
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-50">{t.category}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-mono px-2 py-0.5 bg-black/20 rounded-md">x{t.count}</span>
                                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${t.risk === 'HIGH' ? 'bg-rose-500/10 text-rose-500' :
                                                            t.risk === 'MED' ? 'bg-amber-500/10 text-amber-500' :
                                                                'bg-primary/10 text-primary'
                                                        }`}>{t.risk}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[10px] font-bold text-muted-foreground italic">No blacklisted keywords found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpamAnalysis;
