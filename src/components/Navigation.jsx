import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlayCircle, BookHeart, LineChart } from 'lucide-react';
import './Navigation.css';

function Navigation() {
  const navItems = [
    { path: '/', icon: Home, label: '首頁' },
    { path: '/practice', icon: PlayCircle, label: '練習' },
    { path: '/journal', icon: BookHeart, label: '日誌' },
    { path: '/trends', icon: LineChart, label: '觀察' }
  ];

  return (
    <nav className="bottom-nav glass-effect">
      {navItems.map((item) => (
        <NavLink 
          key={item.path} 
          to={item.path}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <item.icon size={24} strokeWidth={2} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default Navigation;
