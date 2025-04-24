import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import AyurvedaStartPage from "./pages/Ayurveda/AyurvedaStartPage";
import DoshaPage from "./pages/Ayurveda/DoshaPage";
import HomePage from "./pages/HomePage";


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
                path: ":id",
                element: (
                    <div>Default dynamisk sida</div>
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
        ]
    }


]);

export default router;
