import { useEffect, useState } from "react";
import { AboutData } from "../../types/AboutData";
import parse, {DOMNode, domToReact} from 'html-react-parser';
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';
import AboutStyle from './AboutStyle.module.css';
import { Link } from 'react-router-dom';


function AboutPage() {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [error, setError] = useState("");
  const [aboutInfo, setAboutInfo] = useState<string>("");
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

        console.log(data[0].content.rendered);

        if (data.length > 0) {
          setAboutInfo(data[0].content.rendered);
          setLoadingSpinner(false);
          console.log("AboutInfo content:", aboutInfo);

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
            <div className={AboutStyle.aboutContainer}>
            {aboutInfo &&
              parse(aboutInfo, {
                replace: (node: any) => {
                  if (node.name === "a" && node.attribs?.href) {
                    const href = node.attribs.href;
                    const isInternal = href.startsWith("/")
          
                    if (isInternal) {
                      return (
                        <Link to={href}>
                          {domToReact(node.children)}
                        </Link>
                      );
                    }
                  }
           
                },
              })}
          </div>
          )}
        </div>
      )}
    </>
  )
}

export default AboutPage