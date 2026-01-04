import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import { duasAPI, duaCategoriesAPI, languagesAPI } from '../services/api';
import DuaModal from '../components/DuaModal';

export default function Duas() {
  const [duas, setDuas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDua, setSelectedDua] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    loadData();
  }, [page, selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [duasRes, categoriesRes, languagesRes] = await Promise.all([
        duasAPI.getAll({
          page,
          limit: 10,
          category_id: selectedCategory || undefined,
        }),
        duaCategoriesAPI.getAll({ limit: 100 }),
        languagesAPI.getAll(),
      ]);

      setDuas(duasRes.data.data.data);
      setMeta(duasRes.data.data.meta);
      setCategories(categoriesRes.data.data);
      setLanguages(languagesRes.data.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this dua?')) return;

    try {
      await duasAPI.delete(id);
      loadData();
    } catch (error) {
      alert('Failed to delete dua');
    }
  };

  const handleEdit = (dua) => {
    setSelectedDua(dua);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedDua(null);
    setModalOpen(true);
  };

  const handleSave = () => {
    setModalOpen(false);
    setSelectedDua(null);
    loadData();
  };

  const filteredDuas = duas.filter((dua) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      dua.arabic_text?.toLowerCase().includes(searchLower) ||
      dua.transliteration?.toLowerCase().includes(searchLower) ||
      dua.translations?.some((t) => t.translation?.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Duas Management</h1>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add New Dua</span>
        </button>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search duas..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.translations?.[0]?.name || cat.name_key}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Arabic Text
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Transliteration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Translation (EN)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDuas.map((dua) => {
                    const enTranslation = dua.translations?.find((t) => t.language?.code === 'en');
                    return (
                      <tr key={dua.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-arabic text-gray-900 max-w-xs truncate">
                            {dua.arabic_text}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {dua.transliteration}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {enTranslation?.translation || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {dua.category?.translations?.[0]?.name || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {dua.is_featured && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              Featured
                            </span>
                          )}
                          {dua.is_active ? (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full ml-2">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full ml-2">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(dua)}
                            className="inline-flex items-center text-primary-600 hover:text-primary-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(dua.id)}
                            className="inline-flex items-center text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {meta.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === meta.totalPages}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <DuaModal
          dua={selectedDua}
          categories={categories}
          languages={languages}
          onClose={() => {
            setModalOpen(false);
            setSelectedDua(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
