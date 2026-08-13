import React from 'react';
import { ResponsiveContainer, AreaChart as ReAreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AreaChart = ({ data, dataKey = 'value', xAxisKey = 'name', color = '#EF4444', height = 250 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ReAreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`colorGradient_${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} fillOpacity={1} fill={`url(#colorGradient_${dataKey})`} />
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
};
