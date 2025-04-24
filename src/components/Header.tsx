import { NavLink } from "react-router-dom";
import HeaderModuleStyle from "./HeaderStyle.module.css";
import { useEffect, useState } from "react";
import { MenuLink } from "../types/MenuLinks";

function Header() {
    const [showMenu, setMenu] = useState(false);

    //Toggla meny
    const toggleMenuBar = () => {

        setMenu(value => !value)
    }

    const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);

    const getNavLinks = async (): Promise<void> => {
        try {
            const response = await fetch("http://localhost:8002/wp-json/wp/v2/pages?_fields=title,slug", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                const data = await response.json();

                const links = data
                    .map((page: { slug: string; title: { rendered: string } }) => ({
                        href: page.slug,
                        pageText: page.title.rendered,
                    }));

                setMenuLinks(links)
                //console.log("data:", data);
                console.log("menylänkar:", links);

            }

        } catch (error) {
            console.log("error", error)
        }
    }

    //useEffect för att hämta in poster
    useEffect(() => {
        getNavLinks();
    }, []);

    return (
        <>
            <header className={HeaderModuleStyle.header}>
                <div className={HeaderModuleStyle.headerContainer}>

                    <nav>
                        <ul>
                            {menuLinks.map((link, index) => (
                                <li key={index}>
                                    <NavLink to={link.href}>{link.pageText}</NavLink>
                                </li>
                            ))}
                        </ul>
                        <div className={`${HeaderModuleStyle.hamburger} ${showMenu ? HeaderModuleStyle.hamburger && HeaderModuleStyle.active : ""}`} onClick={toggleMenuBar}>
                            <span className={HeaderModuleStyle.bar}></span>
                            <span className={HeaderModuleStyle.bar}></span>
                            <span className={HeaderModuleStyle.bar}></span>
                        </div>

                    </nav>


                </div>
            </header>
        </>
    )
}

export default Header