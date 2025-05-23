import { useEffect, useState } from 'react'
import LoadingSpinnerStyle from '../LoadingSpinner/LoadingSpinnerStyle.module.css';
import parse from 'html-react-parser';
import doshaPostsStyle from './DoshaPosts.module.css'

function DoshaPostsQuiz() {

    const [doshaPosts, setDoshaPosts] = useState<string>("");
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [error, setError] = useState("");



    const getDoshaPagePosts = async () => {
        setLoadingSpinner(true);
        try {
            const response = await fetch("http://localhost:8002/wp-json/wp/v2/pages?slug=ayurveda-dosha-quiz&_fields=content", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);

                console.log(data[0].content.rendered);

                if (data.length > 0) {
                    setDoshaPosts(data[0].content.rendered);
                    setLoadingSpinner(false);
                    console.log("Dosha inlägg content:", doshaPosts);

                } else {
                    setError("Ingen information i Om sidan är tillgänglig");
                }
            }
        } catch (error) {
            setError("Kunde inte ladda Om sidans innehåll.");
        } finally {
            setLoadingSpinner(false);
        }
    }

    //useEffect för att hämta in Om sida innehåll
    useEffect(() => {
        getDoshaPagePosts();
    }, []);

    return (
        <>
            {loadingSpinner ? (
                <div className={LoadingSpinnerStyle.loadingSpinner}></div>
            ) : (
                <div>
                    {error ? (
                        <p>{error}</p>
                    ) : (
                        <div className={doshaPostsStyle.doshaPostsContainer}>
                            {doshaPosts && parse(doshaPosts)}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}


export default DoshaPostsQuiz