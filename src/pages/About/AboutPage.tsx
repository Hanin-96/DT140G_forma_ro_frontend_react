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

        if (data.length > 0) {
          setAboutInfo(data);
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

  //useEffect för att hämta in Om sida innehåll
  useEffect(() => {
    getAboutPageInfo();
    getAboutPosts();
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
                  aboutInfo.map((page: any) => (
                    <div key={page.id} className={AboutStyle.aboutContent}>
                      <div className={AboutStyle.aboutText}>

                        <div>
                          <h1 className="mt-10">{page.title.rendered}</h1>
                          {parse(page.content.rendered)}
                        </div>
                      </div>
                      <div className={AboutStyle.aboutImg}>
                        <img src={page._embedded["wp:featuredmedia"][0].source_url} alt={page._embedded["wp:featuredmedia"][0].alt_text || "Thumbnail"} className="max-w-[1050px] w-full" />
                      </div>

                    </div>
                  ))
                ) : (
                  <p>Ingen kontaktinformation är tillgänglig</p>
                )}
              </div>

              <div className="max-w-[100rem] w-full mx-auto p-8">
                <div>
                  {aboutPosts.length > 0 ? (
                    aboutPosts.map((post: any) =>
                      post.title.rendered.toLowerCase().includes("keramik") && (
                        <div key={post.id} className={`${AboutStyle.aboutPosts}`}>
                          <div>
                              {parse(post.content.rendered)}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p>Inga inlägg</p>
                  )}
                </div>
              </div>

              <div className={`max-w-[100rem] w-full mx-auto p-8`}>
                <div>
                  {aboutPosts.length > 0 ? (
                    aboutPosts.map((post: any) =>
                      post.title.rendered.toLowerCase().includes("ayurveda") && (
                        <div key={post.id} className={`${AboutStyle.aboutPosts}`}>
                          <div>
                              {parse(post.content.rendered)}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p>Inga inlägg</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default AboutPage