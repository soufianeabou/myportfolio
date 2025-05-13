export function Button({ children, variant = "primary", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded ${variant === "outline" ? "border border-gray-500 text-gray-700" : "bg-blue-500 text-white"}`}
    >
      {children}
    </button>
  );
}
