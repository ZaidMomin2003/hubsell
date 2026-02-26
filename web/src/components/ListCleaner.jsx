import React, { useState, useRef } from 'react';
import { Trash2, FileSpreadsheet, Download, Upload, Filter, Mail, AlertCircle, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const ListCleaner = ({ onValidate }) => {
    const [fileName, setFileName] = useState('');
    const [processedData, setProcessedData] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleValidate = () => {
        if (processedData.length > 0) {
            const emails = [...new Set(processedData.map(row => row.Cleaned_Email))];
            if (onValidate) onValidate(emails);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setLoading(true);
        const reader = new FileReader();

        if (file.name.endsWith('.csv')) {
            reader.onload = (evt) => {
                const text = evt.target.result;
                Papa.parse(text, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => processMatrix(results.data)
                });
            };
            reader.readAsText(file);
        } else {
            reader.onload = (evt) => {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                processMatrix(json);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const processMatrix = (data) => {
        if (!data || data.length === 0) {
            setLoading(false);
            return;
        }

        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
        const newRows = [];
        let totalEmailsFound = 0;
        let originalRows = data.length;

        data.forEach((row) => {
            const rowEmails = [];

            // Extract all unique emails from every column in this row
            Object.values(row).forEach(val => {
                const strVal = String(val);
                const matches = strVal.match(emailRegex);
                if (matches) {
                    matches.forEach(m => {
                        const lowEmail = m.toLowerCase();
                        if (!rowEmails.includes(lowEmail)) {
                            rowEmails.push(lowEmail);
                        }
                    });
                }
            });

            if (rowEmails.length > 0) {
                rowEmails.forEach(email => {
                    totalEmailsFound++;
                    newRows.push({
                        'Cleaned_Email': email,
                        ...row
                    });
                });
            } else {
                // Optionally keep rows without emails? For now we'll skip as it's a "List Cleaner"
            }
        });

        setProcessedData(newRows);
        setStats({
            original: originalRows,
            cleaned: newRows.length,
            expanded: newRows.length - originalRows > 0 ? newRows.length - originalRows : 0
        });
        setLoading(false);
    };

    const downloadCSV = () => {
        const csv = Papa.unparse(processedData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `flattened_${fileName || 'list.csv'}`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const reset = () => {
        setFileName('');
        setProcessedData([]);
        setStats(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
            <div className="text-center">
                <h1 className="text-4xl font-black tracking-tight mb-3 italic">Deep List Flattening</h1>
                <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.3em]">Extract, Normalize, and Expand messy lead lists</p>
            </div>

            {!stats ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="max-w-3xl mx-auto h-[400px] bg-card glass border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                    />
                    <div className="p-6 bg-primary/10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                        <Upload className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black italic mb-2">Upload Messy List</h3>
                    <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest text-center px-20">
                        Drop your CSV or Excel file here. <br />
                        We'll auto-detect multiple email columns and flatten them into separate rows.
                    </p>
                    <div className="mt-8 flex gap-4">
                        <span className="px-4 py-2 bg-muted/50 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">CSV Support</span>
                        <span className="px-4 py-2 bg-muted/50 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">Excel (XLSX)</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard label="Input Rows" value={stats.original} color="text-primary" />
                        <StatCard label="Cleaned Rows" value={stats.cleaned} color="text-emerald-500" />
                        <StatCard label="Flattened Expansion" value={`+${stats.expanded}`} color="text-amber-500" />
                    </div>

                    <div className="bg-card glass border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[600px]">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <FileSpreadsheet className="w-5 h-5 text-primary" />
                                <span className="font-black italic text-sm">{fileName} <span className="text-muted-foreground font-normal ml-2">({processedData.length} records)</span></span>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={reset} className="p-2.5 text-muted-foreground hover:text-destructive transition-colors bg-muted/50 rounded-xl">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button onClick={downloadCSV} className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                                    <Download className="w-4 h-4" /> Download CSV
                                </button>
                                <button onClick={handleValidate} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20">
                                    <Zap className="w-4 h-4" /> Clean & Validate
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/50 border-b border-white/5">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary whitespace-nowrap">Cleaned Email</th>
                                        {Object.keys(processedData[0] || {}).filter(k => k !== 'Cleaned_Email').map(key => (
                                            <th key={key} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {processedData.slice(0, 50).map((row, idx) => (
                                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="font-mono text-xs font-bold text-emerald-500 whitespace-nowrap">{row.Cleaned_Email}</span>
                                                </div>
                                            </td>
                                            {Object.keys(row).filter(k => k !== 'Cleaned_Email').map(key => (
                                                <td key={key} className="px-6 py-4 text-xs font-medium text-muted-foreground truncate max-w-[200px] whitespace-nowrap">{String(row[key])}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {processedData.length > 50 && (
                            <div className="p-4 bg-muted/20 text-center border-t border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Showing first 50 records. Download to view the complete list.</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse text-primary">Parsing Data Matrix...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, color }) => (
    <div className="bg-card glass border border-white/10 p-8 rounded-[2rem] text-center shadow-xl">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-3 opacity-50">{label}</span>
        <span className={`text-3xl font-black italic ${color}`}>{value}</span>
    </div>
);

export default ListCleaner;
