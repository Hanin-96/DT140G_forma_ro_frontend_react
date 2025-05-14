import { observer } from "mobx-react-lite"
import { productStore } from "../../stores/ProductStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';

const ProductPage = observer(() => {

    const { productId } = useParams();
    console.log("Id:", productId);

    useEffect(() => {
        if (productId) {
            productStore.getProductById(productId);
        }
    }, [])
    return (
        <>
            {productStore.loading && <div className={LoadingSpinnerStyle.loadingSpinner}></div>}
            {productStore.product ? (
                <div>
                    <p>{productStore.product.title.rendered}</p>
                    <img src={productStore.product.product_thumbnail} alt={productStore.product.product_thumbnail_alt} />
                    <p>{productStore.product.product_price}</p>
                    <p>{productStore.product.product_description}</p>

                </div>
            ) : <p>{productStore.error}</p>}

        </>
    )
})

export default ProductPage