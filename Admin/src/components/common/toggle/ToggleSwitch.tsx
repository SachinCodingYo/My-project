type Props = {
  checked?: boolean;
  onChange: () => void;
};

const ToggleSwitch = ({ checked = false, onChange }: Props) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />

      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-indigo-600 transition-colors duration-300"></div>

      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
    </label>
  );
};

export default ToggleSwitch;