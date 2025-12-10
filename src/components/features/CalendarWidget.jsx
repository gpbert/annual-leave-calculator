import React, { useState, useRef, useEffect } from 'react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    eachDayOfInterval, isSameMonth, isSameDay, isToday,
    startOfWeek, endOfWeek, getYear, parseISO, isSaturday, isSunday
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHolidays } from '../../hooks/useHolidays';

export function CalendarWidget({ entries, selectedDates = [], onSelectDates, onAction }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = getYear(currentDate);
    const { isHoliday } = useHolidays(year);



    // Calculate calendar grid
    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }), // Monday start
        end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const getEntry = (day) => entries.find(e => isSameDay(parseISO(e.date), day));

    const handleDayClick = (day) => {
        if (isSaturday(day) || isSunday(day) || isHoliday(day)) return;

        // Toggle selection
        const isSelected = selectedDates.some(dStr => isSameDay(parseISO(dStr), day));
        let newSelection;

        if (isSelected) {
            newSelection = selectedDates.filter(dStr => !isSameDay(parseISO(dStr), day));
        } else {
            newSelection = [...selectedDates, day.toISOString()]; // Append to end so it becomes "last"
        }

        onSelectDates && onSelectDates(newSelection);
    };

    return (
        <div className="calendar-container relative">
            <div className="calendar-header">
                <h2 className="text-xl font-bold capitalize">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex-row gap-sm">
                    <button onClick={prevMonth} className="icon-btn"><ChevronLeft size={20} /></button>
                    <button onClick={nextMonth} className="icon-btn"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="week-grid">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <div key={d} className="day-header">{d}</div>
                ))}
            </div>

            <div className="days-grid">
                {days.map((day) => {
                    const entry = getEntry(day);
                    const holidayInfo = isHoliday(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isWeekend = isSaturday(day) || isSunday(day);
                    const isSelected = selectedDates.some(d => isSameDay(parseISO(d), day));

                    let cellClass = "day-cell";
                    if (!isCurrentMonth) cellClass += " other-month";
                    if (isToday(day)) cellClass += " today";
                    if (isWeekend) cellClass += " disabled";

                    if (holidayInfo) cellClass += " cell-holiday";
                    if (entry?.type === 'ferie') cellClass += " cell-ferie";
                    if (entry?.type === 'permessi') cellClass += " cell-permessi";

                    if (isSelected) cellClass += " selected";

                    return (
                        <div
                            key={day.toISOString()}
                            data-date={day.toISOString()}
                            className={cellClass}
                            onClick={() => handleDayClick(day)}
                        >
                            <span className="day-number">
                                {format(day, 'd')}
                            </span>

                            <div className="day-content">
                                {holidayInfo && (
                                    <span className="event-label label-holiday truncate">{holidayInfo[0]?.name}</span>
                                )}
                                {entry && !holidayInfo && (
                                    <span className={`event-label ${entry.type === 'ferie' ? 'label-ferie' : 'label-permessi'}`}>
                                        {entry.amount}h
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
