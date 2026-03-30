import React, { useEffect, useState } from 'react';
import { Send, Search, Plus, X, Loader2, Trash2, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useClientStore } from '../store/useClientStore';
import Sidebar from './ui/Sidebar';
import Header from './ui/Header';
import { FaRupeeSign } from "react-icons/fa";

const ClientAdmin = () => {
  const { clients, fetchClients, processInvoice, addClient } = useClientStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [selectedClient, setSelectedClient] = useState(null);
  const [gstNumber, setGstNumber] = useState(''); // New state for GST field

  const [currency, setCurrency] = useState({ code: 'INR', symbol: '₹' });
  const [invoiceItems, setInvoiceItems] = useState([
    { service: 'Web Development', phase: 'Phase 1', quantity: 1, price: 21000 }
  ]);

  const currencies = [
    { code: 'INR', symbol: '₹' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' }
  ];

  const [newClient, setNewClient] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const safeClients = Array.isArray(clients) ? clients : [];

  const filteredClients = safeClients.filter(c =>
    (c?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Dashboard Stats ---
  const totalClients = safeClients.length;
  const totalRevenue = safeClients.reduce((acc, client) => {
    const clientTotal = client.invoices?.reduce((s, i) => s + Number(i.amount), 0) || 0;
    return acc + clientTotal;
  }, 0);
  const activeProjects = safeClients.filter(c => (c.invoices?.length || 0) > 0).length;

  // --- Calculations ---
  const subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const grandTotal = subtotal + cgst + sgst;

  const handleAddClient = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addClient(newClient);
      alert("Naya Client Add Ho Gaya!");
      setIsClientModalOpen(false);
      setNewClient({ name: '', email: '' });
      fetchClients();
    } catch (err) {
      alert("Error: Client add nahi ho paya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!selectedClient) return;
    setIsSubmitting(true);
    try {
      await processInvoice(selectedClient.id, {
        items: invoiceItems,
        total: subtotal,
        currencySymbol: currency.symbol,
        gstNumber: gstNumber, // Passing the new GST number here
        cgst,
        sgst,
        grandTotal
      });
      alert("Invoice Sent Successfully!");
      setIsInvoiceModalOpen(false);
      setGstNumber(''); // Reset GST after success
    } catch (err) {
      alert("Failed to send invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceItems];
    newItems[index][field] = value;
    setInvoiceItems(newItems);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 lg:ml-64 mt-16 overflow-y-auto p-6 lg:p-10">

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6  border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="bg-orange-50 p-4 rounded-2xl "><Users size={24} /></div>
              <div>
                <p className="text-sm text-gray-500 font-bold">Total Clients</p>
                <h3 className="text-2xl font-black">{totalClients}</h3>
              </div>
            </div>
            <div className="bg-white p-6  border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="bg-green-50 p-4 rounded-2xl text-green-600"><FaRupeeSign size={24} /></div>
              <div>
                <p className="text-sm text-gray-500 font-bold">Total Revenue</p>
                <h3 className="text-2xl font-black">₹{totalRevenue.toLocaleString()}</h3>
              </div>
            </div>
            <div className="bg-white p-6  border border-gray-100  flex items-center gap-5">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><TrendingUp size={24} /></div>
              <div>
                <p className="text-sm text-gray-500 font-bold">Active Clients</p>
                <h3 className="text-2xl font-black">{activeProjects}</h3>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border-none shadow-sm outline-none  transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsClientModalOpen(true)}
              className="w-full md:w-auto bg-blue-800 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition "
            >
              <Plus size={20} /> Add New Client
            </button>
          </div>

          {/* Table */}
          <div className="bg-white  border border-gray-100  overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Client</th>
                  <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Revenue</th>
                  <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-orange-50/20 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500 group-hover:bg-blue-800 group-hover:text-white transition-all">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{client.name}</p>
                          <p className="text-xs text-gray-400">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-bold text-gray-700">${(client.invoices?.reduce((s, i) => s + Number(i.amount), 0) || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => { setSelectedClient(client); setIsInvoiceModalOpen(true); }}
                        className="p-3 text-black  hover:bg-gray-100 rounded-xl border  transition-all"
                      >
                        <Send size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add Client Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md p-10  shadow-2xl relative">
            {/* CROSS ICON ADDED TOP RIGHT */}
            <button onClick={() => setIsClientModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            <h3 className="text-2xl font-black mb-6">Create New Client</h3>
            <form onSubmit={handleAddClient} className="space-y-5">
              <input
                type="text" required placeholder="Client Name"
                className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none "
                value={newClient.name}
                onChange={e => setNewClient({ ...newClient, name: e.target.value })}
              />
              <input
                type="email" required placeholder="Email Address"
                className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none"
                value={newClient.email}
               onChange={e => setNewClient({ ...newClient, email: e.target.value })}
              />
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-800 text-white py-4  font-bold ">
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Save Client"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl p-10  flex flex-col max-h-[90vh] relative">
            
            {/* CROSS ICON ADDED TOP RIGHT */}
            <button onClick={() => setIsInvoiceModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full z-10"><X size={24} /></button>

            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-3xl font-black tracking-tight">Create Invoice</h3>
                <p className="text-gray-400 text-sm">Fill in the service details and phase info</p>
              </div>

              <div className="flex items-center gap-4 mr-12">
                {/* GST NUMBER INPUT FIELD ADDED HERE */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">GST Number</label>
                  <input
                    type="text"
                    placeholder="Enter GST"
                    className="bg-gray-100 border-none rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                  />
                </div>

                {/* Currency Selector */}
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                  <span className="text-xs font-bold text-gray-500 pl-2">Currency:</span>
                  <select
                    value={currency.code}
                    onChange={(e) => setCurrency(currencies.find(c => c.code === e.target.value))}
                    className="bg-transparent border-none font-bold text-blue-800 outline-none cursor-pointer"
                  >
                    {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {invoiceItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <div className="col-span-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Service</label>
                    <input
                      type="text" value={item.service}
                      onChange={(e) => updateItem(index, 'service', e.target.value)}
                      className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Description / Phase</label>
                    <input
                      type="text" placeholder="e.g. Phase 3 or Backend" value={item.phase}
                      onChange={(e) => updateItem(index, 'phase', e.target.value)}
                      className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold outline-none"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Qty</label>
                    <input
                      type="number" value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold outline-none text-center"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Price ({currency.symbol})</label>
                    <input
                      type="number" value={item.price}
                      onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                      className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold outline-none"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button onClick={() => setInvoiceItems(invoiceItems.filter((_, i) => i !== index))} className="p-3 text-blue-800 hover:text-blue-700 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => setInvoiceItems([...invoiceItems, { service: '', phase: '', quantity: 1, price: 0 }])} className="text-blue-800 font-black text-xs flex items-center gap-2 hover:scale-105 transition-transform">
                <Plus size={16} /> ADD ANOTHER SERVICE
              </button>
            </div>

            {/* GST Summary */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">

              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold text-gray-700">{currency.symbol}{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm font-medium text-gray-400">
                <span>CGST (9%)</span>
                <span>{currency.symbol}{cgst.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm font-medium text-gray-400">
                <span>SGST (9%)</span>
                <span>{currency.symbol}{sgst.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Grand Total</p>
                  <h2 className="text-4xl font-black text-blue-900">
                    <span className="text-xl mr-1 opacity-70">{currency.code}</span>
                    {currency.symbol}{grandTotal.toLocaleString()}
                  </h2>
                </div>

                <button
                  disabled={isSubmitting}
                  onClick={handleCreateInvoice}
                  className="bg-black text-white px-10 py-4  font-bold flex items-center gap-3 hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Invoice</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAdmin;