import { useState } from 'react';

const initialForm = {
  name: '',
  race: '',
  class: '',
  level: 1,
  attributes: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
};

const attributeLabels = {
  strength: 'Fuerza',
  dexterity: 'Destreza',
  constitution: 'Constitución',
  intelligence: 'Inteligencia',
  wisdom: 'Sabiduría',
  charisma: 'Carisma',
};

export default function CharacterForm({ onCharacterCreated, isLoading }) {
  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith('attributes.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [key]: Number(value),
        },
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === 'level' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCharacterCreated(form);
    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-xl shadow-slate-950/30">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none ring-0 transition focus:border-amber-400"
            placeholder="Ej. Aria the Brave"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Raza</label>
          <input
            type="text"
            name="race"
            value={form.race}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none transition focus:border-amber-400"
            placeholder="Humano"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Clase</label>
          <input
            type="text"
            name="class"
            value={form.class}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none transition focus:border-amber-400"
            placeholder="Guerrero"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Nivel</label>
          <input
            type="number"
            name="level"
            min="1"
            max="20"
            value={form.level}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none transition focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-amber-300">Atributos</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(attributeLabels).map(([key, label]) => (
            <div key={key}>
              <label className="mb-2 block text-sm font-medium text-slate-200">{label}</label>
              <input
                type="number"
                name={`attributes.${key}`}
                min="8"
                max="20"
                value={form.attributes[key]}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none transition focus:border-amber-400"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-500"
      >
        {isLoading ? 'Guardando...' : 'Crear personaje'}
      </button>
    </form>
  );
}
