import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Download, Eye, Search, Filter } from 'lucide-react';
import { Button } from './Button';
import { SearchBar } from '../ui/SearchBar';

export const DataTable = ({ columns, data, onBulkDelete, isLoading }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) setSelectedRows([]);
    else setSelectedRows(data.map((_, i) => i));
  };

  const toggleSelectRow = (idx) => {
    if (selectedRows.includes(idx)) setSelectedRows(selectedRows.filter((i) => i !== idx));
    else setSelectedRows([...selectedRows, idx]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden space-y-3 p-4">
      {/* Bulk actions bar */}
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-xs text-red-700 dark:text-red-300 font-bold">
          <span>{selectedRows.length} item(s) selected</span>
          <Button variant="danger" size="sm" onClick={() => onBulkDelete && onBulkDelete(selectedRows)}>
            Delete Selected
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-semibold uppercase">
              <th className="p-3 w-10">
                <input type="checkbox" checked={selectedRows.length === data.length && data.length > 0} onChange={toggleSelectAll} className="rounded border-slate-300 text-primary" />
              </th>
              {columns.map((col) => (
                <th key={col.key} className="p-3 cursor-pointer select-none" onClick={() => setSortCol(col.key)}>
                  <div className="flex items-center gap-1">
                    {col.header}
                    {sortCol === col.key && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {data.map((row, idx) => (
              <tr key={idx} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${selectedRows.includes(idx) ? 'bg-red-50/50 dark:bg-red-950/20' : ''}`}>
                <td className="p-3">
                  <input type="checkbox" checked={selectedRows.includes(idx)} onChange={() => toggleSelectRow(idx)} className="rounded border-slate-300 text-primary" />
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="p-3">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
