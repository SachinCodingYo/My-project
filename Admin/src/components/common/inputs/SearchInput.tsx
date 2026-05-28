type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const SearchInput = ({ value, onChange, placeholder = "Search..." }: Props) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
    />
  );
};

export default SearchInput;