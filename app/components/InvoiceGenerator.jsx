"use client";
import { useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { PlusCircle, X, Eye, Edit3 } from "lucide-react";

export default function InvoiceGenerator() {
    const [view, setView] = useState("edit"); // 'edit' or 'preview' for mobile
    const [client, setClient] = useState("");
    const [items, setItems] = useState([{ description: "", qty: "1", price: "" }]);

    const generateId = () => `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const [issueId] = useState(generateId());

    const getToday = () => new Date().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    const [dates] = useState({ issued: getToday(), due: "" });

    const addItem = () => setItems([...items, { description: "", qty: "1", price: "" }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    const updateItem = (i, key, value) => {
        const copy = [...items];
        copy[i][key] = value; // Keep as string to allow free typing/deleting
        setItems(copy);
    };

    const total = items.reduce((sum, i) => sum + (Number(i.qty || 0) * Number(i.price || 0)), 0);

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#1a1a1a]">
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden flex border-b bg-white sticky top-0 z-10">
                <button
                    onClick={() => setView("edit")}
                    className={`flex-1 py-4 flex justify-center items-center gap-2 font-bold text-sm ${view === 'edit' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
                >
                    <Edit3 size={18} /> Edit
                </button>
                <button
                    onClick={() => setView("preview")}
                    className={`flex-1 py-4 flex justify-center items-center gap-2 font-bold text-sm ${view === 'preview' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
                >
                    <Eye size={18} /> Preview
                </button>
            </div>

            <div className="max-w-6xl mx-auto p-4 md:p-8 grid lg:grid-cols-2 gap-10">

                {/* EDIT SECTION */}
                <div className={`space-y-6 ${view === 'preview' ? 'hidden lg:block' : 'block'}`}>
                    <h1 className="text-2xl font-bold hidden lg:block">New Invoice</h1>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Issue ID</label>
                            <p className="font-mono font-bold text-blue-600">{issueId}</p>
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Date Issued</label>
                            <p className="text-sm font-medium">{dates.issued}</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Customer Name</label>
                        <input
                            placeholder="John Doe"
                            className="w-full outline-none text-lg font-semibold"
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] uppercase text-gray-400 font-bold ml-1">Services</label>
                        {items.map((item, i) => (
                            <div key={i} className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 space-y-3 md:space-y-0 md:flex md:gap-3 md:items-center">
                                <input
                                    className="w-full md:flex-1 outline-none text-sm bg-gray-50 md:bg-transparent p-2 md:p-0 rounded"
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => updateItem(i, "description", e.target.value)}
                                />
                                <div className="flex gap-2 items-center justify-between md:justify-end">
                                    <div className="flex items-center gap-2 border rounded-lg px-2 py-1 md:border-none">
                                        <span className="text-[10px] text-gray-400 md:hidden font-bold">QTY</span>
                                        <input
                                            type="number"
                                            className="w-12 text-center outline-none text-sm font-medium"
                                            value={item.qty}
                                            onChange={(e) => updateItem(i, "qty", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 border rounded-lg px-2 py-1 md:border-l md:border-r-0 md:rounded-none">
                                        <span className="text-gray-400 text-sm">$</span>
                                        <input
                                            type="number"
                                            className="w-20 text-right outline-none text-sm font-bold"
                                            placeholder="0.00"
                                            value={item.price}
                                            onChange={(e) => updateItem(i, "price", e.target.value)}
                                        />
                                    </div>
                                    {items.length > 1 && (
                                        <button onClick={() => removeItem(i)} className="p-2 text-red-300 hover:text-red-500"><X size={20} /></button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button onClick={addItem} className="w-full bg-white py-4 rounded-xl border border-dashed border-gray-300 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition">
                            <PlusCircle size={18} /> <span className="text-sm font-bold">Add Item</span>
                        </button>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center border border-gray-100">
                        <span className="font-bold text-gray-400 text-xs">TOTAL</span>
                        <span className="text-2xl font-black">${total.toFixed(2)}</span>
                    </div>

                    <PDFDownloadLink
                        document={<InvoicePDF client={client} items={items} dates={dates} issue_id={issueId} />}
                        fileName={`invoice_${issueId}.pdf`}
                        className="block text-center w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                    >
                        {({ loading }) => (loading ? "Generating..." : "Download PDF")}
                    </PDFDownloadLink>
                </div>

                {/* PREVIEW SECTION */}
                <div className={`lg:block h-[70vh] lg:h-[85vh] sticky top-24 ${view === 'edit' ? 'hidden' : 'block'}`}>
                    <div className="h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                        <PDFViewer width="100%" height="100%" showToolbar={false} className="border-none">
                            <InvoicePDF client={client} items={items} dates={dates} issue_id={issueId} />
                        </PDFViewer>
                    </div>
                </div>

            </div>
        </div>
    );
}