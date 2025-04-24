import { useEffect, useState } from 'react';
import logotyp from '../assets/logo/logotyp_forma_ro_200x160.svg';
import Footer from '../components/Footer';

function HomePage() {
    const [images, setImages] = useState<{ src: string; alt: string; caption: string }[]>([]);
    const [errorContent, setErrorContent] = useState("");

    const getHomePage = async () => {
        try {
            const response = await fetch("http://localhost:8002/wp-json/wp/v2/pages?slug=hem&_fields=content");
            if (!response.ok) throw new Error("Response not ok");

            const data = await response.json();
            const html = data.length > 0 ? data[0].content.rendered : "";

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Hämta bilder + bildtexter från figure
            const figures = Array.from(doc.querySelectorAll("figure.wp-block-image"));
            const imgs = figures.map(figure => {
                const img = figure.querySelector("img");
                const caption = figure.querySelector("figcaption");

                return {
                    src: img?.getAttribute("src") || "",
                    alt: img?.getAttribute("alt") || "",
                    caption: caption?.textContent || "",
                };
            });

            setImages(imgs);
        } catch (error) {
            setErrorContent("Kunde inte ladda startsidans innehåll.");
        }
    };

    useEffect(() => {
        getHomePage();
    }, []);

    return (
        <>
            <div className='p-4'>
                <img src={logotyp} alt="logotyp" style={{ maxWidth: "150px", width: "100%", margin: "0 auto" }} />
            </div>

            <div className=' max-w-width_1000 mx-auto px-4 mb-[200px] mt-[100px]'>
                {errorContent && <p>{errorContent}</p>}

                <div className='mx-auto flex justify-center gap-[50px]'>
                    <div>
                        {images.map((img, i) => (
                            img.caption.toLowerCase().includes("ayurveda") && (
                                <div key={`ayurveda-${i}`} className="w-[300px] h-[300px] max-w-full mx-auto">
                                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover shadow-md rounded-full" />
                                </div>
                            )
                        ))}
                        <button className='w-full mt-6'>Se Ayurveda</button>
                    </div>


                    <div>
                        {images.map((img, i) => (
                            img.caption.toLowerCase().includes("keramik") && (
                                <div key={`keramik-${i}`} className="w-[300px] h-[300px] max-w-full mx-auto">
                                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover shadow-md rounded-full" />
                                </div>
                            )
                        ))}
                        <button className='w-full mt-6'>Se Keramik</button>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}

export default HomePage;
