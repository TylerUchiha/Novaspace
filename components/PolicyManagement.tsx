import React, { useState } from 'react';
import { ChevronLeft, Plus, Edit2, Trash2, Save, X, Shield, Scale } from 'lucide-react';

export interface PolicySection {
  title: string;
  content: string;
}

interface PolicyManagementProps {
  title: string;
  icon: 'privacy' | 'terms';
  sections: PolicySection[];
  setSections: (sections: PolicySection[]) => void;
  onBack: () => void;
}

const PolicyManagement: React.FC<PolicyManagementProps> = ({ title, icon, sections, setSections, onBack }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<PolicySection>({ title: '', content: '' });
  const [isAdding, setIsAdding] = useState(false);

  const IconComponent = icon === 'privacy' ? Shield : Scale;
  
  const themeClasses = {
    privacy: {
      buttonBg: 'bg-blue-600',
      buttonHover: 'hover:bg-blue-700',
      text: 'text-blue-600',
      textHover: 'hover:text-blue-600',
      bgLight: 'hover:bg-blue-50',
      ring: 'focus:ring-blue-500',
      panelBg: 'bg-blue-50/50',
      panelBorder: 'border-blue-100',
      panelTextDark: 'text-blue-900',
      panelTextLight: 'text-blue-400',
      inputBorder: 'border-blue-200'
    },
    terms: {
      buttonBg: 'bg-indigo-600',
      buttonHover: 'hover:bg-indigo-700',
      text: 'text-indigo-600',
      textHover: 'hover:text-indigo-600',
      bgLight: 'hover:bg-indigo-50',
      ring: 'focus:ring-indigo-500',
      panelBg: 'bg-indigo-50/50',
      panelBorder: 'border-indigo-100',
      panelTextDark: 'text-indigo-900',
      panelTextLight: 'text-indigo-400',
      inputBorder: 'border-indigo-200'
    }
  };

  const theme = themeClasses[icon];

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm(sections[index]);
    setIsAdding(false);
  };

  const handleDelete = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleSave = () => {
    if (!editForm.title.trim() || !editForm.content.trim()) return;

    if (isAdding) {
      setSections([...sections, editForm]);
      setIsAdding(false);
    } else if (editingIndex !== null) {
      const newSections = [...sections];
      newSections[editingIndex] = editForm;
      setSections(newSections);
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
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{title} Management</h1>
          </div>
          <button 
            onClick={() => {
              setIsAdding(true);
              setEditingIndex(null);
              setEditForm({ title: '', content: '' });
            }}
            className={`${theme.buttonBg} ${theme.buttonHover} text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm`}
          >
            <Plus size={16} />
            Add Section
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          {sections.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No sections available. Click 'Add Section' to create one.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sections.map((section, index) => (
                <div key={index} className="p-6">
                  {editingIndex === index || (isAdding && editingIndex === null && index === sections.length) ? null : (
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="font-black text-slate-900 text-lg mb-2">{section.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{section.content}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => handleEdit(index)}
                          className={`p-2 ${theme.text} ${theme.bgLight} rounded-lg transition-colors`}
                          title="Edit Section"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(index)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Section"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {editingIndex === index && !isAdding && (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Title</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 ${theme.ring} transition-all`}
                          placeholder="e.g. Data Collection"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Content</label>
                        <textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                          rows={6}
                          className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 ${theme.ring} transition-all resize-none`}
                          placeholder="Provide the content here..."
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
                          className={`px-4 py-2 ${theme.buttonBg} text-white font-bold ${theme.buttonHover} rounded-xl transition-colors text-sm flex items-center gap-2`}
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
          <div className={`mt-6 ${theme.panelBg} rounded-[2rem] p-8 border-2 ${theme.panelBorder} shadow-sm`}>
            <h3 className={`font-black ${theme.panelTextDark} text-lg mb-6 flex items-center gap-2`}>
              <Plus size={20} className={theme.text} />
              Add New Section
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`text-[10px] font-black ${theme.panelTextLight} uppercase tracking-widest mb-1 block`}>Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className={`w-full bg-white border ${theme.inputBorder} rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 ${theme.ring} transition-all`}
                  placeholder="e.g. Data Collection"
                />
              </div>
              <div>
                <label className={`text-[10px] font-black ${theme.panelTextLight} uppercase tracking-widest mb-1 block`}>Content</label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  rows={6}
                  className={`w-full bg-white border ${theme.inputBorder} rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 ${theme.ring} transition-all resize-none`}
                  placeholder="Provide the content here..."
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
                  className={`px-4 py-2 ${theme.buttonBg} text-white font-bold ${theme.buttonHover} rounded-xl transition-colors text-sm flex items-center gap-2`}
                >
                  <Save size={16} />
                  Save Section
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyManagement;
