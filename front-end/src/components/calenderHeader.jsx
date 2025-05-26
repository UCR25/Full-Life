import React, { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import "./calendarHeader.css";

export const onDateChange$ = new BehaviorSubject(new Date());

function getMonth(date)
{
    return date.getMonth();
}

function getYear(date)
{
    return date.getFullYear();
}

const i18n =
{
    "month-1": "January",
    "month-2": "February",
    "month-3": "March",
    "month-4": "April",
    "month-5": "May",
    "month-6": "June",
    "month-7": "July",
    "month-8": "August",
    "month-9": "September",
    "month-10": "October",
    "month-11": "November",
    "month-12": "December",
};

function onNavClick(button)
{
    const direction = button.dataset.dir;

    const currentDate = onDateChange$.value
    const newDate = new Date(currentDate);
    const nextMonth = 1;
    const prevMonth = -1;

    newDate.setMonth
    (
        currentDate.getMonth() + (direction === "next" ? nextMonth : prevMonth)
    );

    onDateChange$.next(newDate);
}

function onTodayClick()
{
    const today = new Date();
    onDateChange$.next(today);
}

export default function CalendarHeader() {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const subscription = onDateChange$.subscribe((date) => {
      const month = getMonth(date);
      const year = getYear(date);
      setLabel(`${i18n["month-" + (month + 1)]} ${year}`); // mapping months to numbers "month-1" = January
    });

    return () => subscription.unsubscribe(); 
  }, [onDateChange$, getMonth, getYear, i18n]);

  const handleClick = (e) => {
    const { tagName, parentElement } = e.target;

    if (tagName === 'BUTTON') 
    {
      parentElement.tagName === "NAV"
        ? onNavClick(e.target)
        : onTodayClick();
    }
  };

  return (
    <div className="calendarHeader">
      <header className="main" onClick={handleClick}>
        <a className="logo">📅</a>
        <button>Today</button>
        
        <h2>{label}</h2>
        <nav>
          <button data-dir="prev">←</button>
          <button data-dir="next">→</button>
        </nav>

        
      </header>
    </div>
  );
}
