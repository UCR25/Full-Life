import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./calender.css";

import { useEffect, useState } from 'react';

export default function CalendarHeader({
  onNavClick,
  onTodayClick,
  onDateChange$, // Observable emitting new date
  getMonth,
  getYear,
  i18n,
}) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    // Subscribe to date change events
    const subscription = onDateChange$.subscribe((date) => {
      const month = getMonth(date);
      const year = getYear(date);
      setLabel(`${i18n["month-" + month]} ${year}`);
    });

    return () => subscription.unsubscribe(); // Clean up
  }, [onDateChange$, getMonth, getYear, i18n]);

  const handleClick = (e) => {
    const { tagName, parentElement } = e.target;

    if (tagName === 'BUTTON') {
      parentElement.tagName === 'NAV'
        ? onNavClick(e.target)
        : onTodayClick();
    }
  };

  return (
    <div id="calendar">
      <header className="main" onClick={handleClick}>
        <a className="logo">📅</a>
        <button>Today</button>

        <nav>
          <button data-dir="prev">←</button>
          <button data-dir="next">→</button>
        </nav>

        <h2>{label}</h2>
      </header>
    </div>
  );
}
