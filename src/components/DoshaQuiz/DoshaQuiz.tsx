import React, { useEffect, useState } from 'react'
import { Question } from '../../types/DoshaQuiz'

function DoshaQuiz() {
    const [questions, setQuestions] = useState<Question[]>([]);
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

    //Hantera svar

    //Hantera klicka på nästa

    //Hantera klicka på föregående

    //Räkna ut dominant dosha --> resultat

    //Hantera rensning av quiz




    return (
        <>
            <h1>Dosha quiz</h1>

            <div>
                <div>
                    {questions.map((question) => (
                        <div key={question.id}>
                            <h2>{question.title.rendered}</h2>
                            {Object.values(question.dosha_answers).map((answer, index) => (
                                <p key={index}>{answer}</p>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

        </>
    )
}

export default DoshaQuiz