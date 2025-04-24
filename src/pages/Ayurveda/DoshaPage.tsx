import { useEffect, useState } from "react";
import { DoshaQuiz } from "../../types/DoshaQuiz";

function DoshaPage() {
    const [doshaQuiz, setDoshaQuiz] = useState<DoshaQuiz[]>([]);

    const getDosha = async (): Promise<void> => {
        try {
            const response = await fetch("http://localhost:8002/wp-json/wp/v2/dosha_question?_fields=dosha_questions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();

                const allQuestions: DoshaQuiz[] = data

                    .flatMap((post: { dosha_questions: DoshaQuiz[] }) => post.dosha_questions || [])
                    .filter((q: DoshaQuiz) =>
                        //Filtrera bort tomma fält
                        q.question.trim() !== "" ||
                        q.vata.trim() !== "" ||
                        q.pitta.trim() !== "" ||
                        q.kapha.trim() !== ""
                    )

                setDoshaQuiz(allQuestions);
                console.log("Alla frågor:", allQuestions);
            }
        } catch (error) {
            console.log("error", error);
        }
    };


    //useEffect för att hämta in poster
    useEffect(() => {
        getDosha();
    }, []);
  return (
    <>
     <div>
            <h2>Dosha Quiz Frågor</h2>
            {doshaQuiz.length === 0 && <p>Inga frågor hittades.</p>}
            <div>
                {doshaQuiz.map((dosha, index) => (
                    <div key={index}>
                        <label htmlFor="question-dosha">{dosha.question}</label>

                        <br />
                        <div>
                            <input type="radio" name="answer" value={dosha.vata} id="choice-1" />
                            <label htmlFor="choice-1">{dosha.vata}</label>
                        </div>

                        <br />

                        <div>
                            <input type="radio" name="answer" value={dosha.pitta} id="choice-2" />
                            <label htmlFor="choice-2">{dosha.pitta}</label>

                        </div>

                        <br />

                        <div>
                            <input type="radio" name="answer" value={dosha.kapha} id="choice-3" />
                            <label htmlFor="choice-3">{dosha.kapha}</label>

                        </div>

                    </div>
                ))}
            </div>
        </div>
    </>
  )
}

export default DoshaPage