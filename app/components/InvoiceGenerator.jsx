"use client";
import { useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { PlusCircle, Trash2, Eye, Edit3, Download, FileText } from "lucide-react";

export default function InvoiceGenerator() {
    const [view, setView] = useState("edit");
    const [client, setClient] = useState("");
    const [items, setItems] = useState([{ description: "", qty: "1", price: "" }]);

    const generateId = () => `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const [issueId] = useState(generateId());

    const getToday = () => new Date().toLocaleDateString('en-US', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    const [dates] = useState({ issued: getToday(), due: "" });

    const addItem = () => setItems([...items, { description: "", qty: "1", price: "" }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
    const updateItem = (i, key, value) => {
        const copy = [...items];
        copy[i][key] = value;
        setItems(copy);
    };

    const total = items.reduce((sum, i) => sum + (Number(i.qty || 0) * Number(i.price || 0)), 0);

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans text-slate-900">
            {/* Nav Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
                            <FileText size={18} className="text-white" />
                        </div>
                        <span className="font-bold tracking-tight text-slate-800">InvoicePro</span>
                    </div>

                    {/* Desktop Status */}
                    <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-slate-500">
                        <span>Draft: <span className="text-slate-900">{issueId}</span></span>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <span>Total: <span className="text-indigo-600 font-bold">${total.toFixed(2)}</span></span>
                    </div>

                    {/* Mobile Switcher */}
                    <div className="lg:hidden flex bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => setView("edit")} className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${view === 'edit' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>
                            <Edit3 size={14} /> Edit
                        </button>
                        <button onClick={() => setView("preview")} className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${view === 'preview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>
                            <Eye size={14} /> Preview
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-2 gap-12 mt-4">

                {/* FORM SIDE */}
                <div className={`space-y-8 ${view === 'preview' ? 'hidden lg:block' : 'block'}`}>

                    {/* Customer Info Card */}
                    <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Client Details</h2>
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-[11px] font-bold text-indigo-600 absolute -top-2 left-3 bg-white px-1">Customer Name</label>
                                <input
                                    placeholder="Enter client's full name"
                                    className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all font-medium text-slate-700"
                                    value={client}
                                    onChange={(e) => setClient(e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Line Items Card */}
                    <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Line Items</h2>
                            <span className="text-xs font-medium text-slate-400">{items.length} item(s)</span>
                        </div>

                        <div className="space-y-4">
                            {items.map((item, i) => (
                                <div key={i} className="group relative bg-slate-50/50 hover:bg-white hover:ring-1 hover:ring-slate-200 p-4 rounded-xl transition-all flex flex-col md:flex-row gap-4 items-start">
                                    <div className="flex-1 w-full">
                                        <input
                                            className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-300"
                                            placeholder="Item description..."
                                            value={item.description}
                                            onChange={(e) => updateItem(i, "description", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-10">
                                            <span className="bg-slate-50 px-2 text-[10px] font-bold text-slate-400 border-r border-slate-200 h-full flex items-center uppercase">Qty</span>
                                            <input
                                                type="number"
                                                className="w-12 text-center text-sm font-bold outline-none text-slate-700"
                                                value={item.qty}
                                                onChange={(e) => updateItem(i, "qty", e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-10">
                                            <span className="bg-slate-50 px-2 text-[10px] font-bold text-slate-400 border-r border-slate-200 h-full flex items-center uppercase">Price</span>
                                            <input
                                                type="number"
                                                className="w-20 text-center text-sm font-bold outline-none text-indigo-600"
                                                placeholder="0.00"
                                                value={item.price}
                                                onChange={(e) => updateItem(i, "price", e.target.value)}
                                            />
                                        </div>
                                        {items.length > 1 && (
                                            <button onClick={() => removeItem(i)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addItem}
                            className="w-full mt-6 py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 flex items-center justify-center gap-2 hover:bg-indigo-50/30 hover:border-indigo-200 hover:text-indigo-600 transition-all font-bold text-sm"
                        >
                            <PlusCircle size={18} /> Add New Service
                        </button>
                    </section>

                    {/* Download Bar */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Balance Due</p>
                            <h3 className="text-3xl font-black text-slate-800">${total.toFixed(2)}</h3>
                        </div>
                        <PDFDownloadLink
                            document={<InvoicePDF client={client} items={items} dates={dates} issue_id={issueId} />}
                            fileName={`invoice_${issueId}.pdf`}
                            className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-600 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                        >
                            {({ loading }) => (
                                <>
                                    <Download size={18} />
                                    {loading ? "Preparing PDF..." : "Generate Invoice"}
                                </>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>

                {/* PREVIEW SECTION (Desktop sticky) */}
                <div className={`lg:block h-150 lg:h-205 sticky top-24 ${view === 'edit' ? 'hidden' : 'block'}`}>
                    <div className="relative h-full bg-slate-900 rounded-xl p-4 shadow-2xl overflow-hidden ring-8 ring-slate-800/50">
                        {/* Browser Mockup Decoration */}
                        <div className="absolute top-0 left-0 right-0 h-8 flex items-center px-6 gap-1.5 z-10">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                        </div>
                        <div className="h-full bg-white rounded-xl overflow-hidden pt-4">
                            <PDFViewer width="100%" height="100%" showToolbar={false} className="border-none">
                                <InvoicePDF client={client} items={items} dates={dates} issue_id={issueId} />
                            </PDFViewer>
                        </div>
                    </div>
                    {/* Shadow Decor */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-indigo-500/10 blur-3xl -z-10 rounded-full"></div>
                </div>

            </main>
        </div>
    );
}