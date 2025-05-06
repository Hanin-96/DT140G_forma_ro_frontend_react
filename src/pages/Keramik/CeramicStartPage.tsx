import { useState } from "react";

function CeramikStartPage() {
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
    return (
        <>
        </>
    )
}

export default CeramikStartPage