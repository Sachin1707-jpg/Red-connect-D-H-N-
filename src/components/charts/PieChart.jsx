import React from 'react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#6366F1', '#8B5CF6', '#EC4899', '#3B82F6', '#14B8A6'];

export const PieChart = ({ data, dataKey = 'value', nameKey = 'name', height = 250, innerRadius = 0 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RePieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={85}
            paddingAngle={3}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};
