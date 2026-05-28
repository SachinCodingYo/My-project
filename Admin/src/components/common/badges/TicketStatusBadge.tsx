type Props = {
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
};

const TicketStatusBadge = ({ status }: Props) => {
  const styles = {
    OPEN: "bg-yellow-500/10 text-yellow-400",
    IN_PROGRESS: "bg-blue-500/10 text-blue-400",
    CLOSED: "bg-gray-500/10 text-gray-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
};

export default TicketStatusBadge;