import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";


const router = createBrowserRouter([
    {
        //Huvudrouting
        path: "/",
        element: <Layout />,
        children: [
            {
                //Huvudrouting
                path: "/",
                element: (
                    <div>My Page Content</div>

                ),
            },
            {
                path: ":id",
                element: (
                    <div>My Page Content</div>

                ),
            },
            {
                path: "/login",
                element: (
                    <div>My Page Content</div>

                ),
            },
            {
                path: "/mypage",
                element: (
                    <div>My Page Content</div>
                )
            },

        ]

    }


]);

export default router;
