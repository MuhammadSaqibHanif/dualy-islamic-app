import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { challengesAPI } from '../services/api';

export default function ChallengeModal({ challenge, languages, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title_key: '',
    type: 'singular',
    difficulty: 'easy',
    target_count: 100,
    duration_days: 7,
    arabic_text: '',
    transliteration: '',
    reward_points: 50,
    reward_assignment: 'on_challenge_complete',
    is_active: true,
    display_order: 1,
    translations: {},
  });

  useEffect(() => {
    if (challenge) {
      const translations = {};
      challenge.translations?.forEach((t) => {
        translations[t.language_id] = {
          title: t.title || '',
          description: t.description || '',
          dhikr_text_translation: t.dhikr_text_translation || '',
          benefits: t.benefits || '',
        };
      });

      setFormData({
        title_key: challenge.title_key || '',
        type: challenge.type || 'singular',
        difficulty: challenge.difficulty || 'easy',
        target_count: challenge.target_count || 100,
        duration_days: challenge.duration_days || 7,
        arabic_text: challenge.arabic_text || '',
        transliteration: challenge.transliteration || '',
        reward_points: challenge.reward_points || 50,
        reward_assignment: challenge.reward_assignment || 'on_challenge_complete',
        is_active: challenge.is_active ?? true,
        display_order: challenge.display_order || 1,
        translations,
      });
    } else {
      const translations = {};
      languages.forEach((lang) => {
        translations[lang.id] = {
          title: '',
          description: '',
          dhikr_text_translation: '',
          benefits: '',
        };
      });
      setFormData((prev) => ({ ...prev, translations }));
    }
  }, [challenge, languages]);

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
        target_count: parseInt(formData.target_count),
        duration_days: parseInt(formData.duration_days),
        reward_points: parseInt(formData.reward_points),
        display_order: parseInt(formData.display_order),
      };

      if (challenge) {
        await challengesAPI.update(challenge.id, payload);
      } else {
        await challengesAPI.create(payload);
      }

      onSave();
    } catch (error) {
      alert('Failed to save challenge: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {challenge ? 'Edit Challenge' : 'Create New Challenge'}
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
                    Title Key *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g., subhanallah_100"
                    value={formData.title_key}
                    onChange={(e) => setFormData({ ...formData, title_key: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    required
                    className="input-field"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="singular">Singular</option>
                    <option value="collaborative">Collaborative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty *
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Count *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="input-field"
                    value={formData.target_count}
                    onChange={(e) => setFormData({ ...formData, target_count: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="input-field"
                    value={formData.duration_days}
                    onChange={(e) =>
                      setFormData({ ...formData, duration_days: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reward Points *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="input-field"
                    value={formData.reward_points}
                    onChange={(e) =>
                      setFormData({ ...formData, reward_points: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reward Assignment *
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.reward_assignment}
                    onChange={(e) =>
                      setFormData({ ...formData, reward_assignment: e.target.value })
                    }
                  >
                    <option value="per_tap">Per Tap</option>
                    <option value="on_challenge_complete">On Challenge Complete</option>
                  </select>
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

                <div className="flex items-center">
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
                  onChange={(e) => setFormData({ ...formData, arabic_text: e.target.value })}
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
                          Title
                        </label>
                        <input
                          type="text"
                          dir={lang.direction}
                          className="input-field"
                          value={formData.translations[lang.id]?.title || ''}
                          onChange={(e) =>
                            handleTranslationChange(lang.id, 'title', e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          rows="2"
                          dir={lang.direction}
                          className="input-field"
                          value={formData.translations[lang.id]?.description || ''}
                          onChange={(e) =>
                            handleTranslationChange(lang.id, 'description', e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dhikr Text Translation
                        </label>
                        <input
                          type="text"
                          dir={lang.direction}
                          className="input-field"
                          value={formData.translations[lang.id]?.dhikr_text_translation || ''}
                          onChange={(e) =>
                            handleTranslationChange(
                              lang.id,
                              'dhikr_text_translation',
                              e.target.value
                            )
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
              {challenge ? 'Update Challenge' : 'Create Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
