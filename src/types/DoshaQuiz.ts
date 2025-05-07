//Nav-meny interface
export interface DoshaQuiz {
    question: string;
    vata: string;
    pitta: string;
    kapha: string;
}

export interface Question {
    id: number;
    title: {
        rendered: string
    };
    dosha_answers: 
    { answer: string };
}