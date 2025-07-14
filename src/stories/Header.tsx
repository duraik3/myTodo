import React from 'react';

import { Button } from './Button';
import './header.css';

type User = {
  name: string;
};

export interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
}

export const Header = ({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) => (
  <header>
    <div className="storybook-header">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))' }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="#6a6a6a"></rect>
          <line x1="9" y1="9" x2="15" y2="9" stroke="#8a8a8a"></line>
          <line x1="9" y1="13" x2="15" y2="13" stroke="#8a8a8a"></line>
          <line x1="9" y1="17" x2="15" y2="17" stroke="#8a8a8a"></line>
        </svg>
        <h1>myTodo</h1>
      </div>
      <div>
        {user ? (
          <>
            <span className="welcome">
              Welcome, <b>{user.name}</b>!
            </span>
            <Button size="small" onClick={onLogout} label="Log out" />
          </>
        ) : (
          <>
            <Button size="small" onClick={onLogin} label="Log in" />
            <Button primary size="small" onClick={onCreateAccount} label="Sign up" />
          </>
        )}
      </div>
    </div>
  </header>
);
