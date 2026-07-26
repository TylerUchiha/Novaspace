import React, { useState } from 'react';
import { ChevronLeft, Plus, Edit2, Trash2, Save, X, LifeBuoy } from 'lucide-react';

interface FAQ {
  q: string;
  a: string;
}

interface FAQManagementProps {
  faqs: FAQ[];
  setFaqs: (faqs: FAQ[]) => void;
  onBack: () => void;
}

const FAQManagement: React.FC<FAQManagementProps> = ({ faqs, setFaqs, onBack }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FAQ>({ q: '', a: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm(faqs[index]);
    setIsAdding(false);
  };

  const handleDelete = (index: number) => {
    const newFaqs = [...faqs];
    newFaqs.splice(index, 1);
    setFaqs(newFaqs);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleSave = () => {
    if (!editForm.q.trim() || !editForm.a.trim()) return;

    if (isAdding) {
      setFaqs([...faqs, editForm]);
      setIsAdding(false);
    } else if (editingIndex !== null) {
      const newFaqs = [...faqs];
      newFaqs[editingIndex] = editForm;
      setFaqs(newFaqs);
      setEditingIndex(null);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter']">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">FAQ Management</h1>
          </div>
          <button 
            onClick={() => {
              setIsAdding(true);
              setEditingIndex(null);
              setEditForm({ q: '', a: '' });
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add FAQ
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          {faqs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No FAQs available. Click 'Add FAQ' to create one.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6">
                  {editingIndex === index || (isAdding && editingIndex === null && index === faqs.length) ? null : (
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="font-black text-slate-900 text-lg mb-2">{faq.q}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => handleEdit(index)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit FAQ"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(index)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete FAQ"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {editingIndex === index && !isAdding && (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Question</label>
                        <input
                          type="text"
                          value={editForm.q}
                          onChange={(e) => setEditForm({ ...editForm, q: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                          placeholder="e.g. How do I book?"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Answer</label>
                        <textarea
                          value={editForm.a}
                          onChange={(e) => setEditForm({ ...editForm, a: e.target.value })}
                          rows={3}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all resize-none"
                          placeholder="Provide the answer here..."
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <button 
                          onClick={handleCancel}
                          className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors text-sm"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSave}
                          className="px-4 py-2 bg-rose-600 text-white font-bold hover:bg-rose-700 rounded-xl transition-colors text-sm flex items-center gap-2"
                        >
                          <Save size={16} />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {isAdding && (
          <div className="mt-6 bg-rose-50/50 rounded-[2rem] p-8 border-2 border-rose-100 shadow-sm">
            <h3 className="font-black text-rose-900 text-lg mb-6 flex items-center gap-2">
              <Plus size={20} className="text-rose-600" />
              Add New FAQ
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1 block">Question</label>
                <input
                  type="text"
                  value={editForm.q}
                  onChange={(e) => setEditForm({ ...editForm, q: e.target.value })}
                  className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  placeholder="e.g. How do I book?"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1 block">Answer</label>
                <textarea
                  value={editForm.a}
                  onChange={(e) => setEditForm({ ...editForm, a: e.target.value })}
                  rows={3}
                  className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all resize-none"
                  placeholder="Provide the answer here..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={handleCancel}
                  className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-rose-600 text-white font-bold hover:bg-rose-700 rounded-xl transition-colors text-sm flex items-center gap-2"
                >
                  <Save size={16} />
                  Save FAQ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQManagement;
