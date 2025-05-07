import React, { useState, useEffect } from 'react';
import './doshaQuiz.css';

function Quiz() {
    interface Question {
        id: number;
        title: { rendered: string };
        dosha_answers: { [key: string]: string };
    }

    const [questions, setQuestions] = useState<Question[]>([]);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
    const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: string }>({});
    const [showResult, setShowResult] = useState(false);
    const [doshaCount, setDoshaCount] = useState<{ [dosha: string]: number }>({
        vata: 0,
        pitta: 0,
        kapha: 0,
    });

    const [error, setError] = useState("");

    const getQuizData = async () => {
        try {
            const response = await fetch("http://localhost:8002/wp-json/wp/v2/dosha_quiz?_fields=title,dosha_answers,id", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);

                if (data.length > 0) {
                    setQuestions(data);
                }
            }

        } catch (error) {
            setError("Ingen quiz information är tillgänglig")
        }
    }

    //Hämta quizdata via getQuizData
    useEffect(() => {
        getQuizData();
    }, []);

        if (questions.length === 0) return <div>Laddar frågor...</div>;

    const current = questions[activeQuestion];
    const doshaAnswers = current.dosha_answers;

    //När användaren väljer ett svar
    const handleAnswer = (doshaKey: string, index: number, questionId: number) => {
        setSelectedAnswerIndex(index);
        setUserAnswers((prev) => ({ ...prev, [questionId]: doshaKey }));
    };

    const onClickNext = () => {
        setSelectedAnswerIndex(null);

        if (activeQuestion < questions.length - 1) {
            setActiveQuestion((prev) => prev + 1);
        } else {
            //Räkna dosha-val
            const result = { vata: 0, pitta: 0, kapha: 0 };
            Object.values(userAnswers).forEach((dosha) => {
                if (result[dosha as keyof typeof result] !== undefined) result[dosha as keyof typeof result]++;
            });
            setDoshaCount(result);
            setShowResult(true);
        }
    };

    const addLeadingZero = (num: number) => (num > 9 ? num : `0${num}`);

    const getDominantDosha = () => {
        const sorted = Object.entries(doshaCount).sort((a, b) => b[1] - a[1]);
        return sorted.length > 0 ? sorted[0][0] : 'Ingen'; // Returnerar doshan med flest svar eller 'Ingen'
    };

    const handlePrevious = () => {
        setActiveQuestion((prev) => prev - 1);
        const prevQuestionId = questions[activeQuestion - 1].id;
        const prevDosha = userAnswers[prevQuestionId];
        const index = Object.keys(questions[activeQuestion - 1].dosha_answers).indexOf(prevDosha);
        setSelectedAnswerIndex(index !== -1 ? index : null);
    };

    const resetQuiz = () => {
        setActiveQuestion(0);
        setSelectedAnswerIndex(null);
        setUserAnswers({});
        setShowResult(false);
        setDoshaCount({ vata: 0, pitta: 0, kapha: 0 });
    };



    return (
        <div className="quiz-container">
            {!showResult ? (
                <div>
                    <div>
                        <span className="active-question-no">{addLeadingZero(activeQuestion + 1)}</span>
                        <span className="total-question">/{addLeadingZero(questions.length)}</span>
                    </div>
                    <h2>{current.title.rendered}</h2>
                    <ul>
                        {Object.entries(doshaAnswers).map(([doshaKey, answerText], index) => (
                            <li
                                key={doshaKey}
                                onClick={() => handleAnswer(doshaKey, index, current.id)}
                                className={selectedAnswerIndex === index ? 'selected-answer' : undefined}
                            >
                                {answerText}
                            </li>
                        ))}
                    </ul>
                    <div className="flex-right">
                        {activeQuestion > 0 && (
                            <button className="prev-button" onClick={handlePrevious}>
                                Tillbaka
                            </button>
                        )}
                        <button onClick={onClickNext} disabled={selectedAnswerIndex === null}>
                            {activeQuestion === questions.length - 1 ? 'Visa Resultat' : 'Nästa'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="result">
                    <h3>Din dominerande dosha är:</h3>
                    <p className="highlight-dosha">{getDominantDosha().toUpperCase()}</p>
                    <div>
                        <p>Vata: {doshaCount.vata}</p>
                        <p>Pitta: {doshaCount.pitta}</p>
                        <p>Kapha: {doshaCount.kapha}</p>
                    </div>
                    <button onClick={resetQuiz}>Gör om testet</button>
                </div>
            )}
        </div>
    );
}

export default Quiz;
