import React from 'react';

interface Column<T> {
  label: string | React.ReactNode;
  render: (item: T) => React.ReactNode;
  handleClick?: (value: string) => void;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (item: T) => string | number;
  selectedIds?: string[];
  onSelectChange?: (ids: string[]) => void;
}

function Table<T>({ data, columns, getRowKey}: TableProps<T>) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-3">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                No data found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={getRowKey(item)}
                className="bg-white border-b hover:bg-gray-50"
              >
                {columns.map((col, colIdx) => (
                  <td
                    onClick={() => {
                      col.handleClick &&
                        col.handleClick(getRowKey(item).toString());
                    }}
                    key={colIdx}
                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  >
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


export default Table;
