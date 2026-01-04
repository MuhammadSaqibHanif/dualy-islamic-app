import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import { challengesAPI, languagesAPI } from '../services/api';
import ChallengeModal from '../components/ChallengeModal';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [challengesRes, languagesRes] = await Promise.all([
        challengesAPI.getAll({ page, limit: 10 }),
        languagesAPI.getAll(),
      ]);

      setChallenges(challengesRes.data.data.data);
      setMeta(challengesRes.data.data.meta);
      setLanguages(languagesRes.data.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;

    try {
      await challengesAPI.delete(id);
      loadData();
    } catch (error) {
      alert('Failed to delete challenge');
    }
  };

  const handleEdit = (challenge) => {
    setSelectedChallenge(challenge);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedChallenge(null);
    setModalOpen(true);
  };

  const handleSave = () => {
    setModalOpen(false);
    setSelectedChallenge(null);
    loadData();
  };

  const filteredChallenges = challenges.filter((challenge) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      challenge.arabic_text?.toLowerCase().includes(searchLower) ||
      challenge.transliteration?.toLowerCase().includes(searchLower) ||
      challenge.translations?.some((t) => t.title?.toLowerCase().includes(searchLower));

    const matchesType = !selectedType || challenge.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Challenges Management</h1>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add New Challenge</span>
        </button>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search challenges..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="singular">Singular</option>
            <option value="collaborative">Collaborative</option>
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
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Target
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Duration
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
                  {filteredChallenges.map((challenge) => {
                    const enTranslation = challenge.translations?.find(
                      (t) => t.language?.code === 'en'
                    );
                    return (
                      <tr key={challenge.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {enTranslation?.title || challenge.title_key}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {enTranslation?.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              challenge.type === 'collaborative'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {challenge.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              challenge.difficulty === 'easy'
                                ? 'bg-green-100 text-green-800'
                                : challenge.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {challenge.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {challenge.target_count?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {challenge.duration_days} days
                        </td>
                        <td className="px-6 py-4">
                          {challenge.is_active ? (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(challenge)}
                            className="inline-flex items-center text-primary-600 hover:text-primary-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(challenge.id)}
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
        <ChallengeModal
          challenge={selectedChallenge}
          languages={languages}
          onClose={() => {
            setModalOpen(false);
            setSelectedChallenge(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
