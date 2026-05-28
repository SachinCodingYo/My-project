type Props = {
    headers: string[];
    children: React.ReactNode;
    isEmpty: boolean;
    emptyText: string;
};

const DataTable = ({ headers, children, isEmpty, emptyText }: Props) => {
    return (
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">

                <thead className="bg-[#020617] text-gray-400 uppercase text-xs">
                    <tr>
                        {headers.map((header, i) => (
                            <th key={i} className="px-6 py-4 text-left">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {isEmpty ? (
                        <tr>
                            <td
                                colSpan={headers.length}
                                className="text-center py-6 text-gray-400"
                            >
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        children
                    )}
                </tbody>

            </table>
        </div>
    );
};

export default DataTable;