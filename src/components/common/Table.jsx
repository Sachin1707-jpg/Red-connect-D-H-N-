import React from 'react';

export const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found.',
  className = '',
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {columns.map((col) => (
              <th key={col.key || col.header} className="px-5 py-3.5">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 bg-white dark:bg-slate-800 text-sm">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                {columns.map((_, cIdx) => (
                  <td key={cIdx} className="px-5 py-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr
                key={row.id || rIdx}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 text-slate-700 dark:text-slate-200">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
