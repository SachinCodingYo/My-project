type Props<T> = {
    data: T[];
    emptyText: string;
    renderItem: (item: T) => React.ReactNode;
};

const MobileList = <T,>({ data, emptyText, renderItem }: Props<T>) => {
    return (
        <div className="md:hidden space-y-4">
            {data.length === 0 ? (
                <p className="text-center text-gray-400 py-6">{emptyText}</p>
            ) : (
                data.map((item, index) => (
                    <div key={index}>{renderItem(item)}</div>
                ))
            )}
        </div>
    );
};

export default MobileList;