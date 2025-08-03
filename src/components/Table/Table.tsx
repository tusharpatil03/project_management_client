import React from 'react';

interface Column<T> {
  label: string | React.ReactNode;
  render: (item: T) => React.ReactNode;
  handleClick?: (item: T) => void;
  sortable?: boolean;
  sortKey?: keyof T;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (item: T) => string | number;
  selectedIds?: (string | number)[];
  onSelectChange?: (ids: (string | number)[]) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (item: T) => string;
  onRowClick?: (item: T) => void;
  sortBy?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
}

const Table = <T,>({ 
  data, 
  columns, 
  getRowKey,
  selectedIds = [],
  onSelectChange,
  loading = false,
  emptyMessage = "No data found.",
  className = "",
  rowClassName,
  onRowClick,
  sortBy,
  sortDirection,
  onSort
}: TableProps<T>) => {
  const hasSelection = onSelectChange && selectedIds;
  
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectChange) return;
    
    if (checked) {
      const allIds = data.map(item => getRowKey(item));
      onSelectChange(allIds);
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    if (!onSelectChange) return;
    
    if (checked) {
      onSelectChange([...selectedIds, id]);
    } else {
      onSelectChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !column.sortKey || !onSort) return;
    
    const newDirection = sortBy === column.sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column.sortKey, newDirection);
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable || sortBy !== column.sortKey) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const isAllSelected = hasSelection && data.length > 0 && 
    data.every(item => selectedIds.includes(getRowKey(item)));

  const isIndeterminate = hasSelection && selectedIds.length > 0 && !isAllSelected;

  if (loading) {
    return (
      <div className={`relative overflow-x-auto shadow-md sm:rounded-lg ${className}`}>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-x-auto shadow-md sm:rounded-lg ${className}`}>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {hasSelection && (
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isIndeterminate || false;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`px-6 py-3 ${col.headerClassName || ''} ${
                  col.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                }`}
                onClick={() => handleSort(col)}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && (
                    <span className="text-gray-400">
                      {getSortIcon(col) || '↕'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length + (hasSelection ? 1 : 0)} 
                className="px-6 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const rowKey = getRowKey(item);
              const isSelected = selectedIds.includes(rowKey);
              const baseRowClass = "bg-white border-b hover:bg-gray-50 transition-colors";
              const customRowClass = rowClassName ? rowClassName(item) : "";
              const selectedClass = isSelected ? "bg-blue-50" : "";
              const clickableClass = onRowClick ? "cursor-pointer" : "";
              
              return (
                <tr 
                  key={rowKey} 
                  className={`${baseRowClass} ${selectedClass} ${clickableClass} ${customRowClass}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {hasSelection && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(rowKey, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-6 py-4 ${col.className || ''} ${
                        col.handleClick ? 'cursor-pointer' : ''
                      }`}
                    >
                      <div
                        onClick={(e) => {
                          if (col.handleClick) {
                            e.stopPropagation();
                            col.handleClick(item);
                          }
                        }}
                        className={col.handleClick ? 'hover:text-blue-600 transition-colors' : ''}
                      >
                        {col.render(item)}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;