import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, Search, Info, CheckCircle2, XCircle, Type, Link, MessageSquare } from 'lucide-react';

const SpamAnalysis = () => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [score, setScore] = useState(0);
    const [findings, setFindings] = useState([]);
    const [triggers, setTriggers] = useState([]);

    const spamKeywords = [
        { word: '0%', weight: 12, category: 'Finance' },
        { word: '0% risk', weight: 15, category: 'Manipulation' },
        { word: '777', weight: 20, category: 'Scam' },
        { word: '99%', weight: 10, category: 'Manipulation' },
        { word: '99.9%', weight: 10, category: 'Manipulation' },
        { word: '100%', weight: 12, category: 'Manipulation' },
        { word: '100% more', weight: 12, category: 'Manipulation' },
        { word: '#1', weight: 10, category: 'Sales' },
        { word: '$$$', weight: 20, category: 'Finance' },
        { word: '100% free', weight: 15, category: 'Sales' },
        { word: '100% satisfied', weight: 12, category: 'Manipulation' },
        { word: '4u', weight: 10, category: 'Slang' },
        { word: '50% off', weight: 12, category: 'Sales' },
        { word: 'accept credit cards', weight: 15, category: 'Finance' },
        { word: 'acceptance', weight: 5, category: 'General' },
        { word: 'access', weight: 5, category: 'General' },
        { word: 'access now', weight: 12, category: 'Urgency' },
        { word: 'access for free', weight: 15, category: 'Sales' },
        { word: 'accordingly', weight: 5, category: 'General' },
        { word: 'act now', weight: 15, category: 'Urgency' },
        { word: 'act immediately', weight: 15, category: 'Urgency' },
        { word: 'action', weight: 5, category: 'General' },
        { word: 'action required', weight: 15, category: 'Urgency' },
        { word: 'ad', weight: 8, category: 'Sales' },
        { word: 'additional income', weight: 15, category: 'Finance' },
        { word: 'addresses on cd', weight: 15, category: 'Scam' },
        { word: 'affordable', weight: 10, category: 'Sales' },
        { word: 'affordable deal', weight: 12, category: 'Sales' },
        { word: 'all natural', weight: 10, category: 'Manipulation' },
        { word: 'all new', weight: 10, category: 'Sales' },
        { word: 'amazed', weight: 8, category: 'Manipulation' },
        { word: 'amazing', weight: 8, category: 'Manipulation' },
        { word: 'amazing offer', weight: 12, category: 'Sales' },
        { word: 'amazing stuff', weight: 10, category: 'Manipulation' },
        { word: 'apply here', weight: 10, category: 'Urgency' },
        { word: 'apply now', weight: 12, category: 'Urgency' },
        { word: 'apply online', weight: 10, category: 'Urgency' },
        { word: 'as seen on', weight: 12, category: 'Manipulation' },
        { word: 'at no cost', weight: 15, category: 'Sales' },
        { word: 'auto email removal', weight: 15, category: 'Spam' },
        { word: 'avoid', weight: 8, category: 'Urgency' },
        { word: 'avoid bankruptcy', weight: 15, category: 'Finance' },
        { word: 'bargain', weight: 12, category: 'Sales' },
        { word: 'be amazed', weight: 10, category: 'Manipulation' },
        { word: 'be surprised', weight: 10, category: 'Manipulation' },
        { word: 'be your own boss', weight: 15, category: 'Finance' },
        { word: 'believe me', weight: 12, category: 'Manipulation' },
        { word: 'being a member', weight: 8, category: 'General' },
        { word: 'beneficiary', weight: 15, category: 'Finance' },
        { word: 'best bargain', weight: 12, category: 'Sales' },
        { word: 'best deal', weight: 12, category: 'Sales' },
        { word: 'best price', weight: 12, category: 'Sales' },
        { word: 'best offer', weight: 12, category: 'Sales' },
        { word: 'beverage', weight: 5, category: 'General' },
        { word: 'big bucks', weight: 15, category: 'Finance' },
        { word: 'bill 1618', weight: 20, category: 'Spam' },
        { word: 'billing', weight: 10, category: 'Finance' },
        { word: 'billing address', weight: 10, category: 'Finance' },
        { word: 'billionaire', weight: 15, category: 'Finance' },
        { word: 'billion', weight: 10, category: 'Finance' },
        { word: 'billion dollars', weight: 15, category: 'Finance' },
        { word: 'bonus', weight: 12, category: 'Sales' },
        { word: 'boss', weight: 10, category: 'Finance' },
        { word: 'brand new pager', weight: 15, category: 'Scam' },
        { word: 'bulk email', weight: 20, category: 'Spam' },
        { word: 'buy', weight: 8, category: 'Sales' },
        { word: 'buy now', weight: 12, category: 'Urgency' },
        { word: 'buy direct', weight: 10, category: 'Sales' },
        { word: 'buying judgments', weight: 15, category: 'Finance' },
        { word: 'cable converter', weight: 15, category: 'Scam' },
        { word: 'call', weight: 5, category: 'General' },
        { word: 'call free', weight: 12, category: 'Sales' },
        { word: 'call me', weight: 10, category: 'Urgency' },
        { word: 'call now', weight: 12, category: 'Urgency' },
        { word: 'calling creditors', weight: 15, category: 'Finance' },
        { word: 'can’t live without', weight: 12, category: 'Manipulation' },
        { word: 'cancel', weight: 10, category: 'Urgency' },
        { word: 'cancel at any time', weight: 10, category: 'Manipulation' },
        { word: 'cancel now', weight: 12, category: 'Urgency' },
        { word: 'cancelation required', weight: 12, category: 'Urgency' },
        { word: 'cannot be combined', weight: 10, category: 'Sales' },
        { word: 'cards accepted', weight: 12, category: 'Finance' },
        { word: 'cash', weight: 15, category: 'Finance' },
        { word: 'cash out', weight: 15, category: 'Finance' },
        { word: 'cash bonus', weight: 15, category: 'Finance' },
        { word: 'cashcashcash', weight: 20, category: 'Finance' },
        { word: 'casino', weight: 20, category: 'Scam' },
        { word: 'celebrity', weight: 10, category: 'Manipulation' },
        { word: 'cell phone cancer', weight: 15, category: 'Scam' },
        { word: 'scam', weight: 20, category: 'Scam' },
        { word: 'cents on the dollar', weight: 15, category: 'Finance' },
        { word: 'certified', weight: 10, category: 'Manipulation' },
        { word: 'chance', weight: 8, category: 'Manipulation' },
        { word: 'cheap', weight: 15, category: 'Sales' },
        { word: 'check', weight: 10, category: 'Finance' },
        { word: 'check or money order', weight: 15, category: 'Finance' },
        { word: 'claims', weight: 10, category: 'Manipulation' },
        { word: 'claim now', weight: 15, category: 'Urgency' },
        { word: 'claim your discount', weight: 15, category: 'Sales' },
        { word: 'claims not to be selling', weight: 12, category: 'Manipulation' },
        { word: 'compliance', weight: 10, category: 'General' },
        { word: 'legal', weight: 10, category: 'General' },
        { word: 'clearance', weight: 12, category: 'Sales' },
        { word: 'click', weight: 10, category: 'Urgency' },
        { word: 'click below', weight: 12, category: 'Urgency' },
        { word: 'click here', weight: 15, category: 'Urgency' },
        { word: 'click now', weight: 15, category: 'Urgency' },
        { word: 'click to get', weight: 12, category: 'Urgency' },
        { word: 'click to remove', weight: 15, category: 'Urgency' },
        { word: 'collect', weight: 10, category: 'Finance' },
        { word: 'collect child support', weight: 15, category: 'Finance' },
        { word: 'compare', weight: 8, category: 'Sales' },
        { word: 'compare now', weight: 12, category: 'Urgency' },
        { word: 'compare online', weight: 10, category: 'Sales' },
        { word: 'compare rates', weight: 12, category: 'Finance' },
        { word: 'compete for your business', weight: 12, category: 'Manipulation' },
        { word: 'confidentially', weight: 10, category: 'Manipulation' },
        { word: 'congratulations', weight: 15, category: 'Scam' },
        { word: 'consolidate debt', weight: 15, category: 'Finance' },
        { word: 'consolidate your debt', weight: 15, category: 'Finance' },
        { word: 'copy accurately', weight: 10, category: 'General' },
        { word: 'copy dvds', weight: 15, category: 'Scam' },
        { word: 'costs', weight: 8, category: 'Finance' },
        { word: 'credit', weight: 12, category: 'Finance' },
        { word: 'credit bureaus', weight: 15, category: 'Finance' },
        { word: 'credit card offers', weight: 15, category: 'Finance' },
        { word: 'cures', weight: 15, category: 'Scam' },
        { word: 'cures baldness', weight: 15, category: 'Scam' },
        { word: 'deal', weight: 10, category: 'Sales' },
        { word: 'dear friend', weight: 12, category: 'Manipulation' },
        { word: 'debt', weight: 12, category: 'Finance' },
        { word: 'diagnostics', weight: 8, category: 'General' },
        { word: 'dig up dirt', weight: 15, category: 'Scam' },
        { word: 'direct email', weight: 15, category: 'Spam' },
        { word: 'direct marketing', weight: 15, category: 'Sales' },
        { word: 'discount', weight: 12, category: 'Sales' },
        { word: 'do it now', weight: 15, category: 'Urgency' },
        { word: 'do it today', weight: 15, category: 'Urgency' },
        { word: 'don’t delete', weight: 15, category: 'Urgency' },
        { word: 'don’t hesitate', weight: 12, category: 'Urgency' },
        { word: 'dormant', weight: 12, category: 'Scam' },
        { word: 'double your', weight: 15, category: 'Manipulation' },
        { word: 'double your cash', weight: 15, category: 'Finance' },
        { word: 'double your income', weight: 15, category: 'Finance' },
        { word: 'double your wealth', weight: 15, category: 'Finance' },
        { word: 'free', weight: 10, category: 'Sales' },
        { word: 'fantastic', weight: 10, category: 'Manipulation' },
        { word: 'fantastic deal', weight: 12, category: 'Sales' },
        { word: 'fantastic offer', weight: 12, category: 'Sales' },
        { word: 'fast cash', weight: 15, category: 'Finance' },
        { word: 'fast viagra delivery', weight: 20, category: 'Scam' },
        { word: 'financial freedom', weight: 15, category: 'Finance' },
        { word: 'financially independent', weight: 15, category: 'Finance' },
        { word: 'for free', weight: 15, category: 'Sales' },
        { word: 'for instant access', weight: 12, category: 'Urgency' },
        { word: 'form', weight: 8, category: 'General' },
        { word: 'free access', weight: 15, category: 'Sales' },
        { word: 'free bonus', weight: 15, category: 'Sales' },
        { word: 'free cell phone', weight: 15, category: 'Sales' },
        { word: 'free consultation', weight: 15, category: 'Sales' },
        { word: 'free dvd', weight: 15, category: 'Sales' },
        { word: 'free gift', weight: 15, category: 'Sales' },
        { word: 'free grant money', weight: 15, category: 'Finance' },
        { word: 'free hosting', weight: 15, category: 'Sales' },
        { word: 'free info', weight: 12, category: 'Sales' },
        { word: 'free information', weight: 12, category: 'Sales' },
        { word: 'free installation', weight: 12, category: 'Sales' },
        { word: 'free instant', weight: 15, category: 'Urgency' },
        { word: 'free investment', weight: 15, category: 'Finance' },
        { word: 'free iphone', weight: 15, category: 'Scam' },
        { word: 'free leads', weight: 15, category: 'Sales' },
        { word: 'free macbook', weight: 15, category: 'Scam' },
        { word: 'free membership', weight: 15, category: 'Sales' },
        { word: 'free money', weight: 15, category: 'Finance' },
        { word: 'free offer', weight: 15, category: 'Sales' },
        { word: 'free preview', weight: 12, category: 'Sales' },
        { word: 'free priority mail', weight: 12, category: 'Urgency' },
        { word: 'free quote', weight: 12, category: 'Sales' },
        { word: 'free sample', weight: 15, category: 'Sales' },
        { word: 'free trial', weight: 15, category: 'Sales' },
        { word: 'free website', weight: 12, category: 'Sales' },
        { word: 'freedom', weight: 10, category: 'Finance' },
        { word: 'friend', weight: 8, category: 'General' },
        { word: 'full refund', weight: 15, category: 'Finance' },
        { word: 'earn', weight: 12, category: 'Finance' },
        { word: 'earn extra cash', weight: 15, category: 'Finance' },
        { word: 'earn money', weight: 15, category: 'Finance' },
        { word: 'earn monthly', weight: 15, category: 'Finance' },
        { word: 'earn from home', weight: 15, category: 'Finance' },
        { word: 'easy terms', weight: 12, category: 'Finance' },
        { word: 'eliminate bad credit', weight: 15, category: 'Finance' },
        { word: 'eliminate debt', weight: 15, category: 'Finance' },
        { word: 'email extractor', weight: 15, category: 'Spam' },
        { word: 'email harvest', weight: 15, category: 'Spam' },
        { word: 'email marketing', weight: 12, category: 'Sales' },
        { word: 'exclusive deal', weight: 15, category: 'Sales' },
        { word: 'expect to earn', weight: 15, category: 'Finance' },
        { word: 'expire', weight: 12, category: 'Urgency' },
        { word: 'explode your business', weight: 15, category: 'Manipulation' },
        { word: 'extra cash', weight: 15, category: 'Finance' },
        { word: 'extra income', weight: 15, category: 'Finance' },
        { word: 'hello', weight: 5, category: 'General' },
        { word: 'hidden assets', weight: 15, category: 'Finance' },
        { word: 'hidden charges', weight: 15, category: 'Finance' },
        { word: 'hidden fees', weight: 15, category: 'Finance' },
        { word: 'high score', weight: 10, category: 'General' },
        { word: 'home based business', weight: 15, category: 'Finance' },
        { word: 'huge discount', weight: 15, category: 'Sales' },
        { word: 'hurry up', weight: 15, category: 'Urgency' },
        { word: 'income', weight: 12, category: 'Finance' },
        { word: 'increase sales', weight: 12, category: 'Sales' },
        { word: 'increase traffic', weight: 12, category: 'Sales' },
        { word: 'incredible deal', weight: 15, category: 'Sales' },
        { word: 'instant earnings', weight: 15, category: 'Finance' },
        { word: 'instant income', weight: 15, category: 'Finance' },
        { word: 'insurance', weight: 10, category: 'Finance' },
        { word: 'internet marketing', weight: 12, category: 'Sales' },
        { word: 'investment', weight: 12, category: 'Finance' },
        { word: 'get started now', weight: 15, category: 'Urgency' },
        { word: 'gift certificate', weight: 12, category: 'Sales' },
        { word: 'guarantee', weight: 12, category: 'Manipulation' },
        { word: 'guaranteed', weight: 12, category: 'Manipulation' },
        { word: 'guaranteed income', weight: 15, category: 'Finance' },
        { word: 'join millions', weight: 15, category: 'Manipulation' },
        { word: 'junk', weight: 15, category: 'Spam' },
        { word: 'legal notice', weight: 12, category: 'Manipulation' },
        { word: 'life insurance', weight: 12, category: 'Finance' },
        { word: 'lifetime access', weight: 15, category: 'Sales' },
        { word: 'lifetime deal', weight: 15, category: 'Sales' },
        { word: 'limited offer', weight: 15, category: 'Urgency' },
        { word: 'limited time', weight: 15, category: 'Urgency' },
        { word: 'loan', weight: 15, category: 'Finance' },
        { word: 'lose weight', weight: 15, category: 'Scam' },
        { word: 'lowest price', weight: 12, category: 'Sales' },
        { word: 'luxury', weight: 12, category: 'Sales' },
        { word: 'make money', weight: 15, category: 'Finance' },
        { word: 'marketing solutions', weight: 12, category: 'Sales' },
        { word: 'mass email', weight: 15, category: 'Spam' },
        { word: 'meet singles', weight: 15, category: 'Scam' },
        { word: 'member stuff', weight: 12, category: 'General' },
        { word: 'million dollars', weight: 15, category: 'Finance' },
        { word: 'miracle', weight: 15, category: 'Scam' },
        { word: 'mlm', weight: 20, category: 'Scam' },
        { word: 'money back', weight: 15, category: 'Finance' },
        { word: 'money making', weight: 15, category: 'Finance' },
        { word: 'mortgage', weight: 12, category: 'Finance' },
        { word: 'no cost', weight: 15, category: 'Sales' },
        { word: 'no credit check', weight: 15, category: 'Finance' },
        { word: 'no experience', weight: 12, category: 'Finance' },
        { word: 'no fees', weight: 12, category: 'Finance' },
        { word: 'no gimmick', weight: 12, category: 'Manipulation' },
        { word: 'no hidden costs', weight: 15, category: 'Finance' },
        { word: 'no investment', weight: 15, category: 'Finance' },
        { word: 'no obligation', weight: 12, category: 'Manipulation' },
        { word: 'no purchase necessary', weight: 12, category: 'Manipulation' },
        { word: 'no questions asked', weight: 12, category: 'Manipulation' },
        { word: 'no strings attached', weight: 15, category: 'Manipulation' },
        { word: 'not scam', weight: 15, category: 'Manipulation' },
        { word: 'not spam', weight: 15, category: 'Manipulation' },
        { word: 'now only', weight: 12, category: 'Sales' },
        { word: 'number 1', weight: 12, category: 'Sales' },
        { word: 'online biz opportunity', weight: 15, category: 'Finance' },
        { word: 'online degree', weight: 12, category: 'Scam' },
        { word: 'only $', weight: 12, category: 'Sales' },
        { word: 'opportunity', weight: 8, category: 'General' },
        { word: 'order now', weight: 15, category: 'Urgency' },
        { word: 'passwords', weight: 15, category: 'Security' },
        { word: 'performance', weight: 8, category: 'General' },
        { word: 'please read', weight: 10, category: 'Urgency' },
        { word: 'potential earnings', weight: 15, category: 'Finance' },
        { word: 'pre-approved', weight: 15, category: 'Finance' },
        { word: 'priority mail', weight: 12, category: 'Urgency' },
        { word: 'prize', weight: 15, category: 'Scam' },
        { word: 'profits', weight: 12, category: 'Finance' },
        { word: 'promise you', weight: 12, category: 'Manipulation' },
        { word: 'pure profits', weight: 15, category: 'Finance' },
        { word: 'real thing', weight: 10, category: 'Manipulation' },
        { word: 'refinance', weight: 12, category: 'Finance' },
        { word: 'refund', weight: 12, category: 'Finance' },
        { word: 'removal instructions', weight: 15, category: 'Spam' },
        { word: 'remove', weight: 10, category: 'Urgency' },
        { word: 'request now', weight: 12, category: 'Urgency' },
        { word: 'risk free', weight: 15, category: 'Manipulation' },
        { word: 'rolex', weight: 15, category: 'Scam' },
        { word: 'sale', weight: 10, category: 'Sales' },
        { word: 'satisfaction guaranteed', weight: 15, category: 'Manipulation' },
        { word: 'save money', weight: 12, category: 'Finance' },
        { word: 'search engine listings', weight: 12, category: 'Sales' },
        { word: 'serious cash', weight: 15, category: 'Finance' },
        { word: 'sign up free', weight: 15, category: 'Sales' },
        { word: 'solution', weight: 8, category: 'General' },
        { word: 'spam', weight: 20, category: 'Spam' },
        { word: 'special offer', weight: 12, category: 'Sales' },
        { word: 'stock alert', weight: 15, category: 'Finance' },
        { word: 'stop calling me', weight: 15, category: 'Spam' },
        { word: 'stop emailing me', weight: 15, category: 'Spam' },
        { word: 'subscribe now', weight: 12, category: 'Urgency' },
        { word: 'success', weight: 8, category: 'General' },
        { word: 'take action now', weight: 15, category: 'Urgency' },
        { word: 'terms and conditions', weight: 10, category: 'Manipulation' },
        { word: 'this isn’t a scam', weight: 15, category: 'Manipulation' },
        { word: 'this isn’t spam', weight: 15, category: 'Manipulation' },
        { word: 'trial', weight: 12, category: 'Sales' },
        { word: 'undisclosed recipient', weight: 15, category: 'Spam' },
        { word: 'unlimited', weight: 12, category: 'Manipulation' },
        { word: 'unsolicited', weight: 15, category: 'Spam' },
        { word: 'unsubscribe', weight: 15, category: 'Spam' },
        { word: 'urgent', weight: 15, category: 'Urgency' },
        { word: 'us dollars', weight: 12, category: 'Finance' },
        { word: 'vacation offers', weight: 15, category: 'Scam' },
        { word: 'viagra', weight: 20, category: 'Scam' },
        { word: 'vip', weight: 15, category: 'Manipulation' },
        { word: 'visit our website', weight: 12, category: 'Sales' },
        { word: 'warranty expired', weight: 15, category: 'Scam' },
        { word: 'we hate spam', weight: 15, category: 'Manipulation' },
        { word: 'weight loss', weight: 15, category: 'Scam' },
        { word: 'while supplies last', weight: 15, category: 'Urgency' },
        { word: 'win', weight: 15, category: 'Scam' },
        { word: 'winner', weight: 20, category: 'Scam' },
        { word: 'work from home', weight: 15, category: 'Finance' },
        { word: 'zero risk', weight: 15, category: 'Manipulation' },
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
