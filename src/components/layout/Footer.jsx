import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 mt-auto">
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-gradient-to-br from-red-600 to-rose-500 rounded-xl">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-black text-lg text-white">Red<span className="text-red-400">Connect</span></span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Bridging the gap between blood donors and emergency requests. Every drop saves a life.
          </p>
          <div className="flex gap-3 mt-5">
            {[Github, Twitter, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="p-2 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-all duration-200">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
          <ul className="space-y-2.5">
            {[
              { label: 'Emergency Requests', to: '/requests' },
              { label: 'Blood Banks Directory', to: '/blood-banks' },
              { label: 'Donation Camps', to: '/camps' },
              { label: 'Donor Leaderboard', to: '/rewards' },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-slate-400 hover:text-red-400 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Resources</h4>
          <ul className="space-y-2.5">
            {['About Us', 'Blog', 'FAQ', 'Privacy Policy', 'Terms of Service'].map((t) => (
              <li key={t}>
                <a href="#" className="text-sm text-slate-400 hover:text-red-400 transition-colors">{t}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact</h4>
          <ul className="space-y-3">
            {[
              { icon: Phone, text: '1-800-RED-HELP' },
              { icon: Mail, text: 'support@redconnect.org' },
              { icon: MapPin, text: 'Metropolis Health District' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-sm text-slate-400">
                <Icon className="w-4 h-4 text-red-400 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} RedConnect. All rights reserved. Made with ❤️ to save lives.</p>
        <p>Open Source | MIT License | v1.0.0</p>
      </div>
    </div>
  </footer>
);
