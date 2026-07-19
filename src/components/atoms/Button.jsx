export function Button({ label, onClick, variant = 'primary', disabled = false }) {
  const baseStyle = "px-4 py-2 text-sm font-medium tracking-wide rounded transition-all duration-200 focus:outline-none";
  const variants = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-300",
    secondary: "border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:text-neutral-300"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      {label}
    </button>
  );
}
