'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { mockSources } from '@/lib/mockData';
import { Plus, Database, Globe, Tag } from 'lucide-react';

type Source = {
  id: string;
  name: string;
  country: string;
  category: string;
  enabled: boolean;
};

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>(mockSources);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    country: 'FR',
    category: 'Généraliste',
  });

  const toggleSource = (id: string) => {
    setSources(prev =>
      prev.map(source =>
        source.id === id ? { ...source, enabled: !source.enabled } : source
      )
    );
  };

  const addSource = () => {
    if (!newSource.name) return;

    const source: Source = {
      id: Date.now().toString(),
      name: newSource.name,
      country: newSource.country,
      category: newSource.category,
      enabled: true,
    };

    setSources(prev => [...prev, source]);
    setNewSource({ name: '', country: 'FR', category: 'Généraliste' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sources</h1>
          <p className="text-gray-400">
            Gérez les sources d'information pour votre veille économique
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter une source
        </button>
      </div>

      {/* Add Source Form */}
      {showAddModal && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Nouvelle source</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom de la source
              </label>
              <input
                type="text"
                value={newSource.name}
                onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                placeholder="Ex: Le Figaro"
                className="w-full px-4 py-2 input-dark rounded-lg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pays
                </label>
                <select
                  value={newSource.country}
                  onChange={(e) => setNewSource({ ...newSource, country: e.target.value })}
                  className="w-full px-4 py-2 input-dark rounded-lg"
                >
                  <option value="FR">France</option>
                  <option value="EU">Union Européenne</option>
                  <option value="US">États-Unis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Catégorie
                </label>
                <select
                  value={newSource.category}
                  onChange={(e) => setNewSource({ ...newSource, category: e.target.value })}
                  className="w-full px-4 py-2 input-dark rounded-lg"
                >
                  <option value="Généraliste">Généraliste</option>
                  <option value="Finance">Finance</option>
                  <option value="Économie">Économie</option>
                  <option value="Statistiques">Statistiques</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={addSource} className="btn-primary">
                Ajouter
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Sources List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Database className="w-4 h-4" />
          <span>{sources.length} sources configurées</span>
          <span>•</span>
          <span>{sources.filter(s => s.enabled).length} actives</span>
        </div>

        <div className="grid gap-4">
          {sources.map((source) => (
            <Card key={source.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Source Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {source.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Globe className="w-4 h-4" />
                        <span>{source.country}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Tag className="w-4 h-4" />
                        <span>{source.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge variant={source.enabled ? 'primary' : 'default'}>
                    {source.enabled ? 'Activée' : 'Désactivée'}
                  </Badge>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleSource(source.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    source.enabled ? 'bg-sky-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      source.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="glass-card rounded-lg p-4">
        <p className="text-sm text-gray-400 text-center">
          ℹ️ Les modifications sont mockées et ne seront pas persistées (mode démo)
        </p>
      </div>
    </div>
  );
}
