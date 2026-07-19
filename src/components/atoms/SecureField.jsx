export function SecureField({ label, value, onChange, placeholder = "Enter secure master key..." }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">{label}</label>}
      <input 
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-neutral-200 bg-neutral-50 text-neutral-900 text-sm font-mono rounded focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
      />
    </div>
  );
}
