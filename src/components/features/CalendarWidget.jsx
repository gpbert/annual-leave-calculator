import React, { useState, useRef, useEffect } from 'react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    eachDayOfInterval, isSameMonth, isSameDay, isToday,
    startOfWeek, endOfWeek, getYear, parseISO, isSaturday, isSunday
} from 'date-fns';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar } from 'lucide-react';
import { useHolidays } from '../../hooks/useHolidays';
import { useSettings } from '../../hooks/useSettings';

export function CalendarWidget({ entries, selectedDates = [], onSelectDates, getForecast, stats }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tooltipPosition, setTooltipPosition] = useState(null);
    const gridRef = useRef(null);
    const year = getYear(currentDate);
    const { isHoliday } = useHolidays(year);
    const { t } = useSettings();

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const getEntry = (day) => entries.find(e => isSameDay(parseISO(e.date), day));

    // Get forecast for the last selected date
    const lastSelectedDate = selectedDates.length > 0
        ? parseISO(selectedDates[selectedDates.length - 1])
        : null;
    const forecast = lastSelectedDate && getForecast ? getForecast(lastSelectedDate) : null;

    // Update tooltip position when selection changes
    useEffect(() => {
        if (selectedDates.length > 0 && gridRef.current) {
            const lastDateStr = selectedDates[selectedDates.length - 1];
            const cellElement = gridRef.current.querySelector(`[data-date="${lastDateStr}"]`);
            if (cellElement) {
                const gridRect = gridRef.current.getBoundingClientRect();
                const cellRect = cellElement.getBoundingClientRect();
                setTooltipPosition({
                    top: cellRect.bottom - gridRect.top + 8,
                    left: cellRect.left - gridRect.left + (cellRect.width / 2)
                });
            }
        } else {
            setTooltipPosition(null);
        }
    }, [selectedDates]);

    const handleDayClick = (day) => {
        if (isSaturday(day) || isSunday(day) || isHoliday(day)) return;
        const isSelected = selectedDates.some(dStr => isSameDay(parseISO(dStr), day));
        let newSelection;
        if (isSelected) {
            newSelection = selectedDates.filter(dStr => !isSameDay(parseISO(dStr), day));
        } else {
            newSelection = [...selectedDates, day.toISOString()];
        }
        onSelectDates && onSelectDates(newSelection);
    };

    return (
        <div className="calendar-container">
            {/* Header Bar */}
            <div className="header-bar">
                <div className="header-left">
                    <div className="brand">
                        <div className="brand-icon">
                            <Calendar size={18} color="white" />
                        </div>
                        <span className="brand-text">{t('appName')}</span>
                    </div>

                    <button className="year-selector">
                        {year} <ChevronDown size={16} />
                    </button>

                    <div className="month-nav">
                        <button onClick={prevMonth} className="month-nav-btn">
                            <ChevronLeft size={18} />
                        </button>
                        <span className="month-title">{format(currentDate, 'MMMM')}</span>
                        <button onClick={nextMonth} className="month-nav-btn">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="header-stats">
                    <div className="header-stat">
                        <div className="header-stat-label">{t('remaining')}</div>
                        <div className="header-stat-value green">{stats?.remaining || '0'} {t('days')}</div>
                    </div>
                    <div className="header-stat">
                        <div className="header-stat-label">{t('used')}</div>
                        <div className="header-stat-value black">{stats?.used || '0'} {t('days')}</div>
                    </div>
                    <div className="header-stat">
                        <div className="header-stat-label">{t('upcoming')}</div>
                        <div className="header-stat-value black">{stats?.upcoming || '0'} {t('days')}</div>
                    </div>
                </div>
            </div>

            {/* Week Headers */}
            <div className="week-grid">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                    <div key={d} className="day-header">{d}</div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="days-grid" ref={gridRef} style={{ position: 'relative' }}>
                {days.map((day) => {
                    const entry = getEntry(day);
                    const holidayInfo = isHoliday(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isWeekend = isSaturday(day) || isSunday(day);
                    const isSelected = selectedDates.some(d => isSameDay(parseISO(d), day));
                    const isTodayDay = isToday(day);

                    let cellClass = "day-cell";
                    if (!isCurrentMonth) cellClass += " other-month";
                    if (isWeekend) cellClass += " weekend";
                    if (isSelected) cellClass += " selected";
                    if (isTodayDay) cellClass += " today";

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
                                    <div className="event-pill holiday">
                                        {holidayInfo[0]?.name}
                                    </div>
                                )}
                                {entry && !holidayInfo && (
                                    <div className={`event-pill ${entry.type}`}>
                                        {entry.type === 'ferie' ? t('eventFerie') : t('eventPermessi')} {entry.amount}h
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Tooltip */}
                {tooltipPosition && forecast && (
                    <div
                        className="forecast-tooltip"
                        style={{
                            position: 'absolute',
                            top: tooltipPosition.top,
                            left: tooltipPosition.left,
                            transform: 'translateX(-50%)',
                            zIndex: 100
                        }}
                    >
                        <div className="tooltip-arrow"></div>
                        <div className="tooltip-content">
                            <div className="tooltip-title">
                                {t('balanceOn')} {lastSelectedDate ? format(lastSelectedDate, 'MMM d, yyyy') : ''}
                            </div>
                            <div className="tooltip-row">
                                <span className="tooltip-label">{t('projectedFerie')}</span>
                                <span className="tooltip-value green">{forecast.ferie}h</span>
                            </div>
                            <div className="tooltip-row">
                                <span className="tooltip-label">{t('projectedRol')}</span>
                                <span className="tooltip-value blue">{forecast.permessi}h</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="calendar-legend">
                <div className="legend-item">
                    <div className="legend-dot green"></div>
                    <span>{t('legendAnnualLeave')}</span>
                </div>
                <div className="legend-item">
                    <div className="legend-dot blue"></div>
                    <span>{t('legendRol')}</span>
                </div>
                <div className="legend-item">
                    <div className="legend-dot grey"></div>
                    <span>{t('legendPublicHoliday')}</span>
                </div>
                <div className="legend-item">
                    <div className="legend-dot weekend"></div>
                    <span>{t('legendWeekend')}</span>
                </div>
            </div>
        </div>
    );
}
