import { useEffect, useState } from "react";
import { AboutData } from "../../types/AboutData";
import parse from 'html-react-parser';
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';
import AboutStyle from './AboutStyle.module.css';

function AboutPage() {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [error, setError] = useState("");
  const [aboutInfo, setAboutInfo] = useState<any>([]);
  const [aboutPosts, setAboutPosts] = useState<any>([]);



  const getAboutPageInfo = async () => {
    setLoadingSpinner(true);
    try {
      const response = await fetch("http://localhost:8002/wp-json/wp/v2/pages?slug=om&_embed&fields=id,title,content,_embedded", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const extractedBlockGroups = extractBlockGroups(data[0].content.rendered);
        console.log(extractedBlockGroups);

        if (data.length > 0) {
          setAboutInfo(extractedBlockGroups);
          setLoadingSpinner(false);

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

  const extractBlockGroups = (html: string) => {
    const container = document.createElement("div");
    container.innerHTML = html;
    return Array.from(container.querySelectorAll(".wp-block-group")).map(
      (el) => el.outerHTML
    );
  }

  /*
  const getAboutPosts = async () => {
    setLoadingSpinner(true);
    try {

      const response = await fetch("http://localhost:8002/wp-json/wp/v2/posts?categories=8,9", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Posts", data);

        if (data.length > 0) {
          setAboutPosts(data);
          setLoadingSpinner(false);
        }
      }
    } catch (error) {

    } finally {
      setLoadingSpinner(false);
    }
  }
    */

  //useEffect för att hämta in Om sida innehåll
  useEffect(() => {
    getAboutPageInfo();
    //getAboutPosts();
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
            <>
              <div className={AboutStyle.aboutContainer}>
                {aboutInfo.length > 0 ? (
                  aboutInfo.map((block: any, index: number) => (
                    <div
                      key={index}
                      className={
                        index === 0
                          ? AboutStyle.blockOne
                          : index === 1
                            ? AboutStyle.blockTwo
                            : index === 2
                              ? AboutStyle.blockThree
                              : AboutStyle.blockFour
                      }
                    >
                      <div className="wpBlockWrapper">{parse(block)}</div>
                    </div>
                  ))
                ) : (
                  <p>Ingen kontaktinformation är tillgänglig</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default AboutPage