import { useEffect, useState } from 'react';
import api from './api';
import CharacterForm from './components/CharacterForm';
import CharacterList from './components/CharacterList';

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const response = await api.get('/characters');
      setCharacters(response.data);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleCharacterCreated = async (formData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        race: formData.race,
        class: formData.class,
        level: formData.level,
        attributes: formData.attributes,
      };

      await api.post('/characters', payload);
      await fetchCharacters();
    } catch (error) {
      console.error('Error creating character:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Dungeons & Dragons</p>
          <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">Character Creator</h1>
        </header>

        <main className="grid gap-8 lg:grid-cols-[1.05fr_1.45fr]">
          <CharacterForm onCharacterCreated={handleCharacterCreated} isLoading={isSubmitting} />
          <section className="rounded-2xl border border-slate-700 bg-slate-800/70 p-6 shadow-xl shadow-slate-950/20">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Personajes</h2>
              <button
                type="button"
                onClick={fetchCharacters}
                className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:border-amber-400 hover:text-amber-300"
              >
                Refrescar
              </button>
            </div>
            <CharacterList characters={characters} loading={loading} />
          </section>
        </main>
      </div>
    </div>
  );
}
