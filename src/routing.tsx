import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import AyurvedaStartPage from "./pages/Ayurveda/AyurvedaStartPage";
import DoshaPage from "./pages/Ayurveda/DoshaPage";
import HomePage from "./pages/Home/HomePage";
import PageContentPage from "./pages/PageContentPage"


const router = createBrowserRouter([
    {
        path: "/hem",
        element: (
            <HomePage />
        ),
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: ":slug",
                element: (
                    <PageContentPage />
                ),
            },
            //Ayurveda sidor
            {
                path: "/ayurveda-start",
                element: (
                    <AyurvedaStartPage />
                ),
            },
            {
                path: "/ayurveda-inlagg",
                element: (
                    <div>Ayurveda inlägg</div>
                )
            },
            {
                path: "/ayurveda-inlagg/:id",
                element: (
                    <div>Ayurveda specifik inlägg</div>
                )
            },
            {
                path: "/dosha-quiz",
                element: (
                    <DoshaPage />
                )
            },

            //Keramik sidor
            {
                path: "/keramik-start",
                element: (
                    <div>Keramik start</div>
                )
            },
        ]
    }


]);

export default router;
