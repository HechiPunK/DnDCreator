export default function CharacterList({ characters, loading }) {
  if (loading) {
    return <p className="text-slate-300">Cargando personajes...</p>;
  }

  if (!characters.length) {
    return <p className="text-slate-300">Todavía no hay personajes creados.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {characters.map((character) => (
        <article
          key={character.id}
          className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5 shadow-lg shadow-slate-950/20"
        >
          <div className="mb-4 border-b border-slate-700 pb-3">
            <h3 className="text-2xl font-bold text-amber-300">{character.name}</h3>
            <p className="text-sm text-slate-300">
              {character.race} · {character.class} · Nivel {character.level}
            </p>
          </div>

          <div className="space-y-2 text-sm text-slate-200">
            {Object.entries(character.attributes).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between rounded-md bg-slate-900/80 px-3 py-2">
                <span className="capitalize">{key}</span>
                <span className="font-semibold text-emerald-300">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-emerald-700 bg-emerald-900/20 p-3">
            <p className="mb-2 text-xs uppercase tracking-wide text-emerald-300">Modificadores</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-200">
              {Object.entries(character.modifiers).map(([key, value]) => (
                <div key={key} className="flex justify-between rounded bg-slate-900/70 px-2 py-1">
                  <span>{key}</span>
                  <span className="font-bold text-amber-300">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
