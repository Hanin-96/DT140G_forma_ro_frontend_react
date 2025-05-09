import { useEffect, useState } from "react";
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';
import { Link } from "react-router-dom";
import { ChevronsRight } from "lucide-react";

function GalleriPage() {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [loadingSpinnerPosts, setLoadingSpinnerPosts] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [ceramicProducts, setCeramicProducts] = useState<any>([]);
  const [productCategories, setProductCategories] = useState<string[]>([]);

  const isLoading = loadingSpinner || loadingSpinnerPosts;
  const getCeramicProducts = async () => {
    setLoadingSpinnerPosts(true);

    try {
      const response = await fetch("http://localhost:8002/wp-json/wp/v2/product?_fields=title,product_price,product_description,product_thumbnail,id,date, product_category", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);


        if (data.length > 0) {
          const sortedData = data.sort((a: { date: string }, b: { date: string }) => new Date(b.date).getTime() - new Date(a.date).getTime());

          setCeramicProducts(sortedData);
          setLoadingSpinnerPosts(false);

          //setProductCategories(data.product_category.name);
          //const categories = data.map((product: any) => product.product_category.name)


          //console.log("kategorier:", categories);
          //setProductCategories(categories);
          console.log("hej")
          const uniqueCategories = setCategoriesList(sortedData);
          setProductCategories(uniqueCategories)

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

  //Hämtar alla kategorier och filtrerar ut unika kategorier
  const setCategoriesList = (products: any) => {
    let categoryList: string[] = [];
    console.log(products);
    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < products[i].product_category.length; j++) {
        categoryList.push(products[i].product_category[j].name);
      }
    }
    const uniqueCategories = [...new Set(categoryList)];
    console.log("lista", uniqueCategories);
    return uniqueCategories;
  }

  //useEffect för att hämta in alla produkter i galleriet
  useEffect(() => {
    getCeramicProducts();
  }, []);
  return (
    <>
      {isLoading && (
        <div className={LoadingSpinnerStyle.loadingSpinner}></div>
      )}

      {!loadingSpinnerPosts && (

        <div>
          {productsError ? (
            <p>{productsError}</p>
          ) : (
            <div className="mx-auto max-w-[100rem]">

              <h1 className="mt-20 mb-10">Galleri</h1>

              <div>
                <div>
                  <label htmlFor="SortOptions">Kategorier:</label>
                  <select name="sortOptions" id="sortOptions">
                    {productCategories.map((category: string) => (
                      category &&
                      <option value={category} key={category}>{category}</option>
                    ))}
                    <option value={"Alla produkter"}></option>
                  </select>
                </div>
                <div>
                  <label htmlFor="SortOptions">Sortera efter:</label>
                  <select name="sortOptions" id="sortOptions">
                    <option value=""></option>
                  </select>
                </div>

              </div>
              <div className="flex flex-wrap gap-16 justify-start">
                {ceramicProducts.map((product: any) => (
                  product && (
                    <Link key={product.id} to={`/keramik-produkt/${product.id}`}>
                      <article className="border-[1px] border-forma_ro_grey rounded-2xl text-center">
                        <img src={product.product_thumbnail} alt={product.product_thumbnail_alt} className="rounded-t-2xl max-w-[30rem] max-h-[30rem] object-cover" />
                        <h4 className="text-[20px] p-2 font-semibold">{product.title.rendered}</h4>
                        <p className="p-2">{product.product_price}:-</p>
                        <button className="flex gap-1 justify-center mx-auto p-2 text-[18px]">Se produkt  <ChevronsRight className="color-forma_ro_black" /></button>
                      </article>
                    </Link>
                  )
                ))}
              </div>


            </div>
          )}
        </div>

      )
      }

    </>
  )
}

export default GalleriPage