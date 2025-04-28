import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import AyurvedaStartPage from "./pages/Ayurveda/AyurvedaStartPage";
import DoshaPage from "./pages/Ayurveda/DoshaPage";
import HomePage from "./pages/Home/HomePage";
import ContactPage from "./pages/ContacttPage";
import AboutPage from "./pages/AboutPage";
import CeramicStartPage from "./pages/Keramik/CeramicStartPage";
import GalleriPage from "./pages/Keramik/GalleriPage";
import AyurvedaPostsPage from "./pages/Ayurveda/AyurvedaPostsPage";
import ProductPage from "./pages/Keramik/ProductPage";
import PostPage from "./pages/Ayurveda/PostPage";


const router = createBrowserRouter([

    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/:slug",
                element: (
                    <div>Valfri default sida</div>
                ),
            },
            {
                path: "/hem",
                element: (
                    <HomePage />
                ),
            },
            {
                path: "/kontakt",
                element: (
                    <ContactPage />
                ),
            },
            {
                path: "/om",
                element: (
                    <AboutPage />
                ),
            },
            //Ayurveda sidor
            {
                path: "/ayurveda",
                element: (
                    <AyurvedaStartPage />
                ),
            },
            {
                path: "/ayurveda/inlagg",
                element: (
                    <AyurvedaPostsPage />
                )
            },
            {
                path: "/ayurveda/inlagg/:id",
                element: (
                    <PostPage />
                )
            },
            {
                path: "/ayurveda/dosha-quiz",
                element: (
                    <DoshaPage />
                )
            },
            {
                path: "/ayurveda/:slug",
                element: (
                    <div>Valfri default ayurveda sida</div>
                )
            },

            //Keramik sidor
            {
                path: "/keramik",
                element: (
                    <CeramicStartPage />
                )
            },
            {
                path: "/keramik/galleri",
                element: (
                    <GalleriPage />
                )
            },
            {
                path: "/keramik/produkt/:id",
                element: (
                    <ProductPage />
                )
            },
            {
                path: "/keramik/:slug",
                element: (
                    <div>Valfri default keramik sida</div>
                )
            },
        ]
    }


]);

export default router;
