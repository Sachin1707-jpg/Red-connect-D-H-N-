import React from 'react';
import { Sun, Cloud, Thermometer } from 'lucide-react';
import { Card } from '../common/Card';

export const WeatherWidget = () => (
  <Card className="h-full bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase font-bold tracking-wider text-amber-100">Metropolis Sector 4</p>
        <p className="text-3xl font-black mt-1">28°C</p>
        <p className="text-xs text-amber-100 mt-0.5">Sunny · Ideal for Outdoor Camps</p>
      </div>
      <Sun className="w-12 h-12 text-amber-200 fill-amber-200 animate-spin-slow" />
    </div>
  </Card>
);
