import React, { useState } from 'react';
import { Mail, Copy, CheckCircle2, Trash2, ArrowRight, Zap, List } from 'lucide-react';

const EmailExtractor = ({ onValidate }) => {
    const [text, setText] = useState('');
    const [extractedEmails, setExtractedEmails] = useState([]);
    const [copied, setCopied] = useState(false);

    const handleExtract = () => {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const matches = text.match(emailRegex) || [];
        const uniqueEmails = [...new Set(matches)];
        setExtractedEmails(uniqueEmails);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(extractedEmails.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setText('');
        setExtractedEmails([]);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center">
                <h1 className="text-4xl font-black tracking-tight mb-3 italic">Email Extractor</h1>
                <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.3em]">Harvest emails from any text block</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="bg-card glass border border-white/10 rounded-[2rem] p-8 shadow-2xl flex flex-col h-[600px]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold italic">Raw Text Input</h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Paste any text containing emails</p>
                            </div>
                        </div>
                        <button onClick={handleClear} className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Clear All">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                    <textarea
                        className="flex-1 w-full p-6 bg-muted/30 rounded-2xl border border-white/5 focus:outline-none focus:border-primary/30 transition-all font-medium text-sm resize-none"
                        placeholder="Paste your content here... (e.g. email threads, web scrapes, documents)"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <button
                        onClick={handleExtract}
                        disabled={!text.trim()}
                        className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-2xl font-black italic tracking-tight flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                    >
                        Extract Emails
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Results Panel */}
                <div className="bg-card glass border border-white/10 rounded-[2rem] p-8 shadow-2xl flex flex-col h-[600px]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <List className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold italic">Extracted List</h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{extractedEmails.length} unique emails found</p>
                            </div>
                        </div>
                        {extractedEmails.length > 0 && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
                            >
                                {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copied' : 'Copy All'}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 w-full bg-muted/30 rounded-2xl border border-white/5 overflow-y-auto p-4 custom-scrollbar">
                        {extractedEmails.length > 0 ? (
                            <div className="space-y-2">
                                {extractedEmails.map((email, idx) => (
                                    <div key={idx} className="px-4 py-3 bg-card/50 rounded-xl border border-white/5 flex items-center gap-3 group hover:border-primary/20 transition-all">
                                        <Mail className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-sm font-bold font-mono truncate">{email}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
                                <Mail className="w-12 h-12 mb-4" />
                                <p className="text-xs font-bold uppercase tracking-widest">No emails extracted yet</p>
                            </div>
                        )}
                    </div>

                    {extractedEmails.length > 0 && (
                        <button
                            onClick={() => onValidate(extractedEmails)}
                            className="mt-6 w-full bg-foreground text-background dark:bg-white dark:text-black py-5 rounded-2xl font-black italic tracking-tight flex items-center justify-center gap-3 transition-all hover:opacity-90"
                        >
                            Validate This List
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailExtractor;
