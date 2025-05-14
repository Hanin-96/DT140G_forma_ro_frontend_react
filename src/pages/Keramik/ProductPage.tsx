import { observer } from "mobx-react-lite"
import { productStore } from "../../stores/ProductStore";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';
import ProductOrderForm from "../../components/ProductOrderForm/ProductOrderForm";

const ProductPage = observer(() => {

    const { productId } = useParams();
    console.log("Id:", productId);

    useEffect(() => {
        if (productId) {
            productStore.getProductById(productId);
            productStore.getCeramicProducts(productId);
        }
    }, [productId])
    return (
        <>
            {productStore.loading && <div className={LoadingSpinnerStyle.loadingSpinner}></div>}
            {productStore.product ? (
                <div className="max-w-[100rem] w-full mx-auto">
                    <div>
                        <h1>{productStore.product.title.rendered}</h1>
                        <img src={productStore.product.product_thumbnail} alt={productStore.product.product_thumbnail_alt} />
                        <p>{productStore.product.product_price}</p>
                        <p>{productStore.product.product_description}</p>

                        {productStore.product.product_category.map((category, index) => (
                            <p key={index}>{category.name}</p>
                        ))}
                    </div>

                    <ProductOrderForm />

                    <div>
                        <h2>Andra produkter</h2>
                        <div className="flex justify-between gap-8">
                            {productStore.products.slice(0, 3).map((product) => (
                                <Link key={product.id} to={`/keramik-produkt/${product.id}`}>
                                    <article>
                                        <h4>{product.title.rendered}</h4>
                                        <img src={product.product_thumbnail} alt={product.product_thumbnail_alt} className="max-w-[30rem] w-full max-h-[30rem] h-full object-cover " />
                                    </article>
                                </Link>
                            ))}
                        </div>

                    </div>

                </div>
            ) : <p>{productStore.error}</p>}

        </>
    )
})

export default ProductPage