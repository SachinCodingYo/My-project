type Props = {
  isActive?: boolean;
};

const StatusBadge = ({ isActive }: Props) => {
  return isActive ? (
    <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs">
      Active
    </span>
  ) : (
    <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs">
      Inactive
    </span>
  );
};

export default StatusBadge;