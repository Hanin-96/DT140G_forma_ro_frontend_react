import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';
import { useEffect, useState } from "react";
import parse from 'html-react-parser';
import { Link } from "react-router-dom";
import AyurvedaStyle from './AyurvedaStyle.module.css';

function AyurvedaStartPage() {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [loadingSpinnerPosts, setLoadingSpinnerPosts] = useState(false);
  const [pageError, setPageError] = useState("");
  const [ayurvedaPostsError, setAyurvedaPostsError] = useState("");
  const [ayurvedaPosts, setAyurvedaPosts] = useState<any[]>([]);
  const [ayurvedaPage, setAyurvedaPage] = useState("");


  const isLoading = loadingSpinner || loadingSpinnerPosts;

  const getAyurvedaPageInfo = async () => {
    setLoadingSpinner(true);
    try {
      const response = await fetch("http://localhost:8002/wp-json/wp/v2/pages?slug=ayurveda&_fields=content", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);


        if (data.length > 0) {
          setAyurvedaPage(data[0].content.rendered);
          setLoadingSpinner(false);

        } else {
          setPageError("Kunde inte ladda Keramik sidans innehåll.");
        }
      }
    } catch (error) {
      setPageError("Kunde inte ladda Keramik sidans innehåll.");
    } finally {
      setLoadingSpinner(false);
    }
  }

  const getAyurvedaPosts = async () => {
    setLoadingSpinnerPosts(true);

    try {
      const response = await fetch("http://localhost:8002/wp-json/wp/v2/posts?categories=37&_fields=id,title,content&orderby=date&order=desc&per_page=3", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();

        if (data.length > 0) {
          setAyurvedaPosts(data);
          console.log("posts: ", data);
        } else {
          setAyurvedaPostsError("Kunde inte ladda produkterna.");
        }
      }
    } catch (error) {
      setAyurvedaPostsError("Kunde inte ladda produkterna.");
    } finally {
      setLoadingSpinnerPosts(false);
    }

  }

  //useEffect för att hämta in Om sida innehåll
  useEffect(() => {
    getAyurvedaPageInfo();
    getAyurvedaPosts();

  }, []);

  return (
    <>
      {isLoading && (
        <div className={LoadingSpinnerStyle.loadingSpinner}></div>
      )}

      {!loadingSpinner && (
        <div>
          {pageError ? (
            <p>{pageError}</p>
          ) : (
            <div className={AyurvedaStyle.ayurvedaContainer}>
              {ayurvedaPage && parse(ayurvedaPage)}
            </div>
          )}
        </div>
      )}

      {!loadingSpinnerPosts && (

        <div>
          {ayurvedaPostsError ? (
            <p>{ayurvedaPostsError}</p>
          ) : (
            <div>
              {ayurvedaPosts.map((post: any, index: number) => (
                <div key={index}>
                  {post && parse(post.content.rendered)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default AyurvedaStartPage