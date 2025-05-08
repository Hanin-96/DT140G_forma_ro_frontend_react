import { useEffect, useState } from "react";
import parse from 'html-react-parser';
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';
import ceramicStartStyle from './CeramicStartStyle.module.css';
import { ChevronsRight } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

function CeramikStartPage() {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [loadingSpinnerPosts, setLoadingSpinnerPosts] = useState(false);
  const [pageError, setPageError] = useState("");
  const [productsError, setProductsError] = useState("");
  const [ceramicInfo, setCeramicInfo] = useState<string>("");
  const [ceramicProducts, setCeramicProducts] = useState<any>([]);

  const isLoading = loadingSpinner || loadingSpinnerPosts;


  const getceramicPageInfo = async () => {
    setLoadingSpinner(true);
    try {
      const response = await fetch("http://localhost:8002/wp-json/wp/v2/pages?slug=keramik&fields=id,title,content,_embedded", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);


        if (data.length > 0) {
          setCeramicInfo(data[0].content.rendered);
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

  const getCeramicProducts = async () => {
    setLoadingSpinnerPosts(true);

    try {
      const response = await fetch("http://localhost:8002/wp-json/wp/v2/product?_fields=title,product_price,product_description,product_thumbnail,id,date", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);


        if (data.length > 0) {
          const sortedData = data.sort((a: { date: string }, b: { date: string }) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

          setCeramicProducts(sortedData);
          setLoadingSpinnerPosts(false);

        } else {
          setProductsError("Kunde inte ladda produkterna.");
        }
      }
    } catch (error) {
      setProductsError("Kunde inte ladda produkterna.");
    } finally {
      setLoadingSpinnerPosts(false);
    }

  }

  //useEffect för att hämta in Om sida innehåll
  useEffect(() => {
    getceramicPageInfo();
    getCeramicProducts();
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
            <div className={ceramicStartStyle.ceramicContainer}>
              {ceramicInfo && parse(ceramicInfo)}
            </div>
          )}
        </div>
      )}

      {!loadingSpinnerPosts && (

        <div>
          {productsError ? (
            <p>{productsError}</p>
          ) : (
            <div className="mx-auto max-w-[100rem]">
              <h3 className="text-center mt-40 mb-4">Senaste keramik</h3>
              <div className="flex gap-8 justify-between">
                {ceramicProducts.map((product: any) => (
                  product && (
                    <Link key={product.id} to={`/keramik-produkt/${product.id}`} className={ceramicStartStyle.ceramicProductLink}>
                      <article className="border-[1px] border-forma_ro_grey rounded-2xl">
                        <img src={product.product_thumbnail} alt={product.product_thumbnail_alt} className="rounded-t-2xl max-w-[30rem] max-h-[30rem] object-cover" />
                        <h4 className="text-[20px] p-2 font-semibold">{product.title.rendered}</h4>
                        <p className="p-2">{product.product_price}:-</p>
                        <p className="p-2">{product.product_description}</p>
                        <button className="flex gap-1 justify-center mx-auto p-2 text-[18px]">Se produkt  <ChevronsRight className="color-forma_ro_black" /></button>
                      </article>
                    </Link>
                  )
                ))}
              </div>
              <Link to={`/keramik-galleri`} className="flex gap-1 justify-center mx-auto p-4 text-[20px] mt-20 bg-forma_ro_red w-full rounded-2xl">
                Se alla produkter <ChevronsRight className="color-forma_ro_black" />
              </Link>
              
            </div>
          )}
        </div>

      )
      }
    </>
  )
}

export default CeramikStartPage