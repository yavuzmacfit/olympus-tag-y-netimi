/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  Settings, 
  ChevronDown, 
  Filter, 
  MoreHorizontal,
  ArrowUpDown,
  X,
  Tag as TagIcon
} from 'lucide-react';

// Mock data based on the user's image and JSON
const initialLeads = [
  {
    id: '1630531',
    name: 'Yavuz',
    surname: 'Zendesk-Test',
    phone: '(+90) 5530009975',
    email: 'yavuz@example.com',
    salesRep: 'System',
    createdAt: '04.03.2026',
    updatedAt: '',
    consent: '—',
    source: 'Zendesk',
    status: 'Aktif',
    campaign: '',
    taskDate: '',
    tags: [
      { key: 'category', value: 'üyelik-talebi' },
      { key: 'ticket-owner', value: 'yavuz.karavelioglu' }
    ]
  },
  {
    id: '1630532',
    name: 'Ahmet',
    surname: 'Yılmaz',
    phone: '(+90) 5420001122',
    email: 'ahmet@example.com',
    salesRep: 'Ayşe Kaya',
    createdAt: '03.03.2026',
    updatedAt: '04.03.2026',
    consent: 'Evet',
    source: 'Instagram',
    status: 'Beklemede',
    campaign: 'Bahar Kampanyası',
    taskDate: '05.03.2026',
    tags: [
      { key: 'ad-group', value: 'fitness-lovers' },
      { key: 'region', value: 'istanbul' }
    ]
  },
  {
    id: '1630533',
    name: 'Merve',
    surname: 'Demir',
    phone: '(+90) 5331112233',
    email: 'merve@example.com',
    salesRep: 'Mehmet Can',
    createdAt: '02.03.2026',
    updatedAt: '',
    consent: 'Hayır',
    source: 'Zendesk',
    status: 'İptal',
    campaign: '',
    taskDate: '',
    tags: [
      { key: 'category', value: 'şikayet' },
      { key: 'priority', value: 'high' }
    ]
  }
];

// Mapping of sources to their available tag keys and values
const tagMapping: Record<string, Record<string, string[]>> = {
  'Zendesk': {
    'category': ['üyelik-talebi', 'şikayet', 'bilgi-alma', 'iptal-talebi', 'teknik-destek', 'odeme-sorunu'],
    'ticket-owner': ['yavuz.karavelioglu', 'admin', 'destek-ekibi', 'ayse.yilmaz', 'mehmet.demir', 'canan.kaya'],
    'priority': ['low', 'medium', 'high', 'urgent'],
    'status': ['open', 'pending', 'resolved', 'closed'],
    'department': ['sales', 'support', 'billing', 'marketing']
  },
  'Instagram': {
    'ad-group': ['fitness-lovers', 'yoga-community', 'crossfit-istanbul', 'healthy-eating', 'weight-loss', 'muscle-gain'],
    'region': ['istanbul', 'ankara', 'izmir', 'antalya', 'bursa', 'adana'],
    'content-type': ['video', 'image', 'carousel', 'story', 'reels'],
    'influencer': ['fitness_guru', 'healthy_life', 'gym_rat_99']
  },
  'Facebook': {
    'campaign-id': ['fb-001', 'fb-002', 'fb-003', 'fb-004', 'fb-005'],
    'placement': ['feed', 'stories', 'marketplace', 'right-column'],
    'audience': ['lookalike-1%', 'retargeting-7d', 'interest-gym']
  }
};

const SearchableDropdown = ({ 
  label, 
  placeholder, 
  options = [], 
  value, 
  onChange,
  disabled = false
}: { 
  label: string, 
  placeholder: string, 
  options?: string[],
  value?: string,
  onChange?: (val: string) => void,
  disabled?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col gap-1 relative ${disabled ? 'opacity-50' : ''}`} ref={dropdownRef}>
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-10 px-3 py-2 text-sm bg-white border ${isOpen ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-300'} rounded flex items-center justify-between cursor-pointer transition-all ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-64 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input 
                autoFocus
                type="text"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div 
                  key={opt}
                  onClick={() => {
                    onChange?.(opt);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors ${value === opt ? 'bg-emerald-50 text-emerald-700 font-medium' : ''}`}
                >
                  {opt}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-xs text-center text-gray-400 italic">
                Sonuç bulunamadı
              </div>
            )}
          </div>
          {value && (
            <div 
              onClick={() => {
                onChange?.('');
                setIsOpen(false);
                setSearchQuery('');
              }}
              className="p-2 text-center text-xs text-red-500 hover:bg-red-50 cursor-pointer border-t border-gray-100 font-medium"
            >
              Seçimi Temizle
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FilterDropdown = ({ 
  label, 
  placeholder, 
  options = [], 
  value, 
  onChange,
  disabled = false
}: { 
  label: string, 
  placeholder: string, 
  options?: string[],
  value?: string,
  onChange?: (val: string) => void,
  disabled?: boolean
}) => (
  <div className={`flex flex-col gap-1 ${disabled ? 'opacity-50' : ''}`}>
    <label className="text-xs font-medium text-gray-500">{label}</label>
    <div className="relative">
      <select 
        disabled={disabled}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-10 px-3 py-2 text-sm bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const DateInput = ({ label, placeholder }: { label: string, placeholder: string }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-500">{label}</label>
    <div className="relative">
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full h-10 px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const getTagColor = (key: string) => {
  const colorMap: Record<string, { bg: string, text: string, border: string }> = {
    'category': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-100' },
    'ticket-owner': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    'priority': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
    'ad-group': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100' },
    'region': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    'content-type': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
    'campaign-id': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
    'placement': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' },
    'status': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
    'department': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-100' },
    'influencer': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100' },
    'audience': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-100' },
  };

  return colorMap[key] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
};

export default function App() {
  const [leads] = useState(initialLeads);
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedTagKey, setSelectedTagKey] = useState('');
  const [selectedTagValue, setSelectedTagValue] = useState('');

  // Derived options for tag filters
  const availableKeys = useMemo(() => {
    if (!selectedSource || !tagMapping[selectedSource]) return [];
    return Object.keys(tagMapping[selectedSource]);
  }, [selectedSource]);

  const availableValues = useMemo(() => {
    if (!selectedSource || !selectedTagKey || !tagMapping[selectedSource]?.[selectedTagKey]) return [];
    return tagMapping[selectedSource][selectedTagKey];
  }, [selectedSource, selectedTagKey]);

  // Filtered leads logic
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const sourceMatch = !selectedSource || lead.source === selectedSource;
      const tagMatch = (!selectedTagKey || !selectedTagValue) || 
        lead.tags.some(t => t.key === selectedTagKey && t.value === selectedTagValue);
      return sourceMatch && tagMatch;
    });
  }, [leads, selectedSource, selectedTagKey, selectedTagValue]);

  const handleSourceChange = (val: string) => {
    setSelectedSource(val);
    setSelectedTagKey('');
    setSelectedTagValue('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold text-gray-700 uppercase tracking-wide">Aday Üye Listesi</h1>
        <button className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded flex items-center gap-2 transition-colors">
          <Filter className="w-4 h-4" />
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-4 mb-6">
          <FilterDropdown label="Statü" placeholder="Seçiniz" />
          
          {/* Source Filter */}
          <SearchableDropdown 
            label="Kaynak" 
            placeholder="Seçiniz" 
            options={Object.keys(tagMapping)}
            value={selectedSource}
            onChange={handleSourceChange}
          />

          {/* Dynamic Tag Key Filter */}
          <SearchableDropdown 
            label="Tag Anahtarı (Key)" 
            placeholder="Key Seçiniz" 
            options={availableKeys}
            value={selectedTagKey}
            onChange={(val) => { setSelectedTagKey(val); setSelectedTagValue(''); }}
            disabled={!selectedSource}
          />

          {/* Dynamic Tag Value Filter */}
          <SearchableDropdown 
            label="Tag Değeri (Value)" 
            placeholder="Value Seçiniz" 
            options={availableValues}
            value={selectedTagValue}
            onChange={setSelectedTagValue}
            disabled={!selectedTagKey}
          />

          <FilterDropdown label="Etkinlik" placeholder="Seçiniz" />
          <FilterDropdown label="Satış Temsilcisi" placeholder="Seçiniz" />
          <FilterDropdown label="Görev" placeholder="Seçiniz" />
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Tarih</label>
            <div className="relative">
              <div className="w-full h-10 px-3 py-2 text-xs bg-white border border-gray-300 rounded flex items-center justify-between">
                <span className="truncate">Oluşturma/Güncelleme</span>
                <div className="flex items-center gap-1">
                  <X className="w-3 h-3 text-gray-400 cursor-pointer" />
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <DateInput label="Başlangıç" placeholder="dd.mm.yyyy" />
          <DateInput label="Bitiş" placeholder="dd.mm.yyyy" />
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded font-medium transition-colors flex items-center gap-2">
              Aday Üye Ekle
            </button>
            <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 p-2 rounded transition-colors">
              <Calendar className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-grow"></div>

          <div className="flex items-center gap-4">
            <button className="bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded text-sm font-medium transition-colors">
              Toplu Güncelle
            </button>

            <div className="flex items-center border border-gray-300 rounded h-10 overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-r border-gray-300 text-sm flex items-center gap-2">
                90 <X className="w-3 h-3 text-gray-400" /> <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                defaultValue="(553) 000 99 75"
                className="px-3 py-2 text-sm w-40 focus:outline-none"
              />
            </div>

            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 rounded font-medium transition-colors">
              Ara
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Arama yap..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded text-sm w-64 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    ID <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefon</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kaynak</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <TagIcon className="w-3 h-3" /> Detaylar (Tags)
                  </div>
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statü</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Satış Temsilcisi</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Oluşturma</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  <button className="bg-sky-500 text-white p-1 rounded">
                    <Settings className="w-4 h-4" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm">
                  <td className="p-4">
                    <input type="checkbox" className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
                  </td>
                  <td className="p-4 font-medium text-gray-700">{lead.id}</td>
                  <td className="p-4">
                    <div className="font-medium">{lead.name} {lead.surname}</div>
                    <div className="text-xs text-gray-400">{lead.email}</div>
                  </td>
                  <td className="p-4">{lead.phone}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{lead.source}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.map((tag, idx) => {
                        const colors = getTagColor(tag.key);
                        return (
                          <div 
                            key={idx} 
                            className={`flex items-center ${colors.bg} ${colors.text} border ${colors.border} px-2 py-0.5 rounded-full text-[10px] font-medium`}
                            title={`${tag.key}: ${tag.value}`}
                          >
                            <span className="opacity-60 mr-1">{tag.key}:</span>
                            {tag.value}
                          </div>
                        );
                      })}
                      {lead.tags.length === 0 && <span className="text-gray-300">—</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`font-medium ${
                      lead.status === 'Aktif' ? 'text-emerald-600' : 
                      lead.status === 'Beklemede' ? 'text-orange-500' : 'text-red-500'
                    }`}>{lead.status}</span>
                  </td>
                  <td className="p-4">{lead.salesRep}</td>
                  <td className="p-4">{lead.createdAt}</td>
                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-400 italic">
                    Sonuç bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
