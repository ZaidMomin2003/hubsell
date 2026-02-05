import React, { useState } from 'react';
import {
    Code, Terminal, Copy, Check, Zap, Server
} from 'lucide-react';

const Docs = () => {
    const [copied, setCopied] = useState(null);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-12">
            <header className="space-y-4">
                <h1 className="text-3xl font-bold text-slate-900 leading-tight">Technical Documentation</h1>
                <p className="text-slate-500 text-lg">Verification engine API and integration guide.</p>
            </header>

            <div className="card space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-wider">
                    <Server className="w-4 h-4" />
                    Base Endpoint
                </div>
                <div className="text-2xl font-mono text-slate-900 border-b border-slate-100 pb-4">
                    http://localhost:8080/v1
                </div>
                <p className="text-slate-500 text-sm italic">Include 'Bearer API_KEY' in Authorization header if enabled.</p>
            </div>

            <section className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-600" />
                    Single Email Verification
                </h2>
                <div className="bg-slate-900 rounded p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">cURL / POST</span>
                        <button onClick={() => copyToClipboard(`curl -X POST http://localhost:8080/v1/verify -d '{"email": "test@test.com", "level": 2}'`, 'curl')} className="text-slate-400 hover:text-white transition-colors">
                            {copied === 'curl' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <pre className="text-indigo-100 text-sm font-mono overflow-x-auto">
                        {`curl -X POST http://localhost:8080/v1/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "level": 2
  }'`}
                    </pre>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-600" />
                    Batch Processing
                </h2>
                <div className="bg-slate-900 rounded p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Node.js</span>
                        <button onClick={() => copyToClipboard(`await axios.post('http://localhost:8080/v1/bulk', { emails, level: 2 });`, 'node')} className="text-slate-400 hover:text-white transition-colors">
                            {copied === 'node' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <pre className="text-indigo-100 text-sm font-mono overflow-x-auto">
                        {`const { data } = await axios.post('http://localhost:8080/v1/bulk', {
  emails: ["test1@gmail.com", "test2@gmail.com"],
  level: 2
});

console.log('Task ID:', data.id);`}
                    </pre>
                </div>
            </section>

            <footer className="text-slate-400 text-sm italic">
                Note: Bulk verification uses parallel worker pools for high-volume cleaning.
            </footer>
        </div>
    );
};

export default Docs;
