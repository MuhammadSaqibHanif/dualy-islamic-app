import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { duasAPI } from '../services/api';

export default function DuaModal({ dua, categories, languages, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category_id: '',
    arabic_text: '',
    transliteration: '',
    recitation_count: 1,
    is_active: true,
    is_featured: false,
    display_order: 1,
    translations: {},
  });

  useEffect(() => {
    if (dua) {
      const translations = {};
      dua.translations?.forEach((t) => {
        translations[t.language_id] = {
          translation: t.translation || '',
          benefits: t.benefits || '',
        };
      });

      setFormData({
        category_id: dua.category_id || '',
        arabic_text: dua.arabic_text || '',
        transliteration: dua.transliteration || '',
        recitation_count: dua.recitation_count || 1,
        is_active: dua.is_active ?? true,
        is_featured: dua.is_featured ?? false,
        display_order: dua.display_order || 1,
        translations,
      });
    } else {
      const translations = {};
      languages.forEach((lang) => {
        translations[lang.id] = { translation: '', benefits: '' };
      });
      setFormData((prev) => ({ ...prev, translations }));
    }
  }, [dua, languages]);

  const handleTranslationChange = (langId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [langId]: {
          ...prev.translations[langId],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        recitation_count: parseInt(formData.recitation_count),
        display_order: parseInt(formData.display_order),
      };

      if (dua) {
        await duasAPI.update(dua.id, payload);
      } else {
        await duasAPI.create(payload);
      }

      onSave();
    } catch (error) {
      alert('Failed to save dua: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {dua ? 'Edit Dua' : 'Create New Dua'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.translations?.[0]?.name || cat.name_key}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recitation Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input-field"
                    value={formData.recitation_count}
                    onChange={(e) =>
                      setFormData({ ...formData, recitation_count: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input-field"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded text-primary-600"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded text-primary-600"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({ ...formData, is_featured: e.target.checked })
                      }
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arabic Text *
                </label>
                <textarea
                  required
                  rows="3"
                  dir="rtl"
                  className="input-field font-arabic text-xl"
                  value={formData.arabic_text}
                  onChange={(e) =>
                    setFormData({ ...formData, arabic_text: e.target.value })
                  }
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transliteration *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.transliteration}
                  onChange={(e) =>
                    setFormData({ ...formData, transliteration: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Translations</h3>
              <div className="space-y-6">
                {languages.map((lang) => (
                  <div key={lang.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      {lang.name} ({lang.native_name})
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Translation
                        </label>
                        <textarea
                          rows="2"
                          dir={lang.direction}
                          className="input-field"
                          value={formData.translations[lang.id]?.translation || ''}
                          onChange={(e) =>
                            handleTranslationChange(lang.id, 'translation', e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Benefits
                        </label>
                        <input
                          type="text"
                          dir={lang.direction}
                          className="input-field"
                          value={formData.translations[lang.id]?.benefits || ''}
                          onChange={(e) =>
                            handleTranslationChange(lang.id, 'benefits', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {dua ? 'Update Dua' : 'Create Dua'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
