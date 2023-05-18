import logo from './logo.svg';
import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';


function App() {
    return (
        <div className="App">
            <Header />
            <Body />
            <Footer />
        </div>
    );
}


function Body() {
    let [today, setToday] = useState('');
    let [meal, setMeal] = useState('');
    let [cal, setCal] = useState('');


    useEffect(() => {
        const { today } = getDates();
        setToday(today);
        fetch(`/lunch?today=${today}`)
            .then((res) => res.json())
            .then(({ meal, cal }) => {
                setMeal(meal);
                setCal(cal);
            });
    }, []);
    
    console.log(meal && today === getDates().today);

    return (
        <div className="App-body">
            <div className="meal">
                <div className="meal-title">
                    <div className="meal-title-date">
                        <button onClick={() => {
                            const { yesterday } = getDates(today);
                            setToday(yesterday);
                            fetch(`/lunch?today=${yesterday}`)
                                .then((res) => res.json())
                                .then(({ meal, cal }) => {
                                    setMeal(meal);
                                    setCal(cal);
                                });
                        }}><i className="bi bi-caret-left-fill"></i></button>
                        <p>{today.slice(0, 4)}년 {today.slice(4, 6)}월 {today.slice(6)}일 ({ getDayOfWeek(today) })</p>
                        <button onClick={() => {
                            const { tomorrow } = getDates(today);
                            setToday(tomorrow);
                            fetch(`/lunch?today=${tomorrow}`)
                                .then((res) => res.json())
                                .then(({ meal, cal }) => {
                                    setMeal(meal);
                                    setCal(cal);
                                });
                        }}><i className="bi bi-caret-right-fill"></i></button>
                    </div>
                </div>
                <div className="meal-content">
                    <div className="meal-content-meal">
                        <h2>급식</h2>
                        {
                            meal ? meal.map((element, index) => {
                                return (
                                    <div className="meal-content-meal-element" key={index}>
                                        <p key={index}>{element}</p>
                                    </div>
                                    );
                            }) : <p>오늘은 급식이 없습니다</p>
                        }
                    </div>
                    <div className="meal-content-cal">
                        <h2>칼로리</h2>
                        {
                            cal ? <p>{cal}</p> : <p>오늘은 급식이 없습니다.</p>
                        }
                    </div>
                </div>
            </div>
            {
                meal && today === getDates().today ?
                    <div className="meal-feedback">
                        <p>오늘의 급식을 평가해주세요!</p>
                        <div className="meal-feedback-buttons">
                            <button className="feedback-button feedback-bad">
                                <i className="bi bi-emoji-frown"></i>
                                <span className="feedback-count feedback-count-bad">5</span>
                            </button>
                            <button className="feedback-button feedback-normal">
                                <i className="bi bi-emoji-neutral"></i>
                                <span className="feedback-count feedback-count-normal">5</span>
                            </button>
                            <button className="feedback-button feedback-good">
                                <i className="bi bi-emoji-smile"></i>
                                <span className="feedback-count feedback-count-good">5</span>
                            </button>
                        </div>
                    </div>
                    : null
            }
            <div></div>
        </div>
    );
}


function Header() {
    return (
        <div className="App-header">
            <h1>양천고 급식</h1>
        </div >
    );
}


function Footer() {
    return (
        <div className="App-footer">
            <p className="copyright">
                &copy; 2021 Yangcheon High School
            </p>
        </div>
    )
}


function getDates(dateString = '') {
    const date = dateString ? new Date(dateString.slice(0, 4), dateString.slice(4, 6) - 1, dateString.slice(6)) : new Date();
    const yesterday = new Date(date.setDate(date.getDate() - 1));
    const today = new Date(date.setDate(date.getDate() + 1));
    const tomorrow = new Date(date.setDate(date.getDate() + 1));
    return {
        yesterday: `${yesterday.getFullYear()}${('0' + (yesterday.getMonth() + 1)).slice(-2)}${('0' + yesterday.getDate()).slice(-2)}`,
        today: `${today.getFullYear()}${('0' + (today.getMonth() + 1)).slice(-2)}${('0' + today.getDate()).slice(-2)}`,
        tomorrow: `${tomorrow.getFullYear()}${('0' + (tomorrow.getMonth() + 1)).slice(-2)}${('0' + tomorrow.getDate()).slice(-2)}`,
    };
}

function getDayOfWeek(dateString) {
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const year = dateString.slice(0, 4);
    const month = Number(dateString.slice(4, 6)) - 1;
    const day = dateString.slice(6, 8);
    const date = new Date(year, month, day);
    const dayOfWeekIndex = date.getDay();
    return daysOfWeek[dayOfWeekIndex];
}

export default App;
