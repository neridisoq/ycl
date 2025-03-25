import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [today, setToday] = useState("");
    const [meal, setMeal] = useState("");
    const [cal, setCal] = useState("");
    const [mealType, setMealType] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isCurrentDay, setIsCurrentDay] = useState(true);

    // Check system preference for dark mode and update when it changes
    useEffect(() => {
        // Set initial value based on system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
        setDarkMode(prefersDark.matches);

        // Add listener for system theme changes
        const mediaQueryListener = (e) => {
            setDarkMode(e.matches);
        };

        prefersDark.addEventListener("change", mediaQueryListener);

        // Update HTML class for background color when scrolling
        if (prefersDark.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Clean up listener on component unmount
        return () => {
            prefersDark.removeEventListener("change", mediaQueryListener);
        };
    }, []);
    
    // Update HTML class when darkMode changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);
    
    function toggleTheme() {
        setDarkMode(!darkMode);
    }

    function getMeal(date) {
        setIsLoading(true);
        fetch(`/meal?today=${date}`)
            .then((res) => res.json())
            .then(({ meal, cal }) => {
                setMeal(meal);
                setCal(cal);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching meal data:", err);
                setIsLoading(false);
            });
    }

    function goToDate(date) {
        setToday(date);
        getMeal(date);

        // Check if the selected date is today
        const currentDate = getDates().today;
        setIsCurrentDay(date === currentDate);
    }

    function goToToday() {
        const { today } = getDates();
        goToDate(today);
        setIsCurrentDay(true);
    }

    useEffect(() => {
        goToToday();
    }, []);

    const formatDate = (dateString) => {
        return {
            year: dateString.slice(0, 4),
            month: dateString.slice(4, 6),
            day: dateString.slice(6),
        };
    };

    return (
        <div className={`app ${darkMode ? "dark-theme" : "light-theme"}`}>
            <div className="app-container">
                <div className="header">
                    <h1 className="app-title">양천고 급식</h1>
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
                        {darkMode ? (
                            <i className="bi bi-moon-fill"></i>
                        ) : (
                            <i className="bi bi-sun-fill"></i>
                        )}
                    </button>
                </div>
                
                <div className="date-navigator">
                    <div className="current-date">
                        {today && (
                            <>
                                <span className="date-year">
                                    {formatDate(today).year}년
                                </span>
                                <span className="date-monthday">
                                    {formatDate(today).month}월{" "}
                                    {formatDate(today).day}일
                                </span>
                                <span className="date-weekday">
                                    ({getDayOfWeek(today)})
                                </span>
                            </>
                        )}
                    </div>

                    <div className="date-actions">
                        <button
                            className="icon-button"
                            onClick={() => {
                                const { yesterday } = getDates(today);
                                goToDate(yesterday);
                            }}
                            aria-label="Previous day"
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        <button
                            className={`today-button ${
                                isCurrentDay ? "inactive" : "active"
                            }`}
                            onClick={goToToday}
                            disabled={isCurrentDay}
                            aria-label="Go to today"
                        >
                            오늘
                        </button>

                        <button
                            className="icon-button"
                            onClick={() => {
                                const { tomorrow } = getDates(today);
                                goToDate(tomorrow);
                            }}
                            aria-label="Next day"
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>

                <div className="meal-type-selector">
                    <div className="ios-segmented-control">
                        <div
                            className={`segment ${
                                mealType === 0 ? "active" : ""
                            }`}
                            onClick={() => setMealType(0)}
                        >
                            점심
                        </div>
                        <div
                            className={`segment ${
                                mealType === 1 ? "active" : ""
                            }`}
                            onClick={() => setMealType(1)}
                        >
                            저녁
                        </div>
                    </div>
                </div>

                <div className="meal-container">
                    {isLoading ? (
                        <div className="loading-indicator">
                            <div className="spinner"></div>
                            <p>급식 정보를 불러오는 중...</p>
                        </div>
                    ) : (
                        <>
                            <div className="meal-header">
                                <h2>{mealType === 0 ? "점심" : "저녁"} 메뉴</h2>
                                {cal && cal[mealType] && (
                                    <div className="calorie-badge">
                                        {cal[mealType]}
                                    </div>
                                )}
                            </div>

                            <div className="meal-list">
                                {meal &&
                                meal[mealType] &&
                                meal[mealType].length > 0 ? (
                                    <ul>
                                        {meal[mealType].map((item, index) => (
                                            <li
                                                key={index}
                                                style={{ "--index": index }}
                                            >
                                                <span className="menu-item">
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="no-meal">
                                        <i className="bi bi-calendar-x"></i>
                                        <p>급식이 없는 날입니다</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function getDates(dateString = "") {
    const date = dateString
        ? new Date(
              dateString.slice(0, 4),
              dateString.slice(4, 6) - 1,
              dateString.slice(6)
          )
        : new Date();
    const yesterday = new Date(date.setDate(date.getDate() - 1));
    const today = new Date(date.setDate(date.getDate() + 1));
    const tomorrow = new Date(date.setDate(date.getDate() + 1));
    return {
        yesterday: `${yesterday.getFullYear()}${(
            "0" +
            (yesterday.getMonth() + 1)
        ).slice(-2)}${("0" + yesterday.getDate()).slice(-2)}`,
        today: `${today.getFullYear()}${("0" + (today.getMonth() + 1)).slice(
            -2
        )}${("0" + today.getDate()).slice(-2)}`,
        tomorrow: `${tomorrow.getFullYear()}${(
            "0" +
            (tomorrow.getMonth() + 1)
        ).slice(-2)}${("0" + tomorrow.getDate()).slice(-2)}`,
    };
}

function getDayOfWeek(dateString) {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const year = dateString.slice(0, 4);
    const month = Number(dateString.slice(4, 6)) - 1;
    const day = dateString.slice(6, 8);
    const date = new Date(year, month, day);
    const dayOfWeekIndex = date.getDay();
    return daysOfWeek[dayOfWeekIndex];
}

export default App;