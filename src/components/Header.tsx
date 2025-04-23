import { NavLink } from "react-router-dom";
import HeaderModuleStyle from "./HeaderStyle.module.css";
import { useEffect, useState } from "react";

//Nav-meny interface
interface MenuLink {
    href: string;
    pageText: string;
}

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
                                    <a href={link.href}>
                                        {link.pageText}
                                    </a>
                                </li>
                            ))}
                        </ul>

                    </nav>

                    <NavLink to="/">Test</NavLink>

                    <nav className={`${HeaderModuleStyle.navMain} ${showMenu ? HeaderModuleStyle.navMobil : ""}`}>

                        {

                        }
                        <ul>
                            <li><NavLink to="/" onClick={toggleMenuBar} className={({ isActive }) => isActive ? HeaderModuleStyle.active : ""}>Start</NavLink></li>

                            <li>
                                <NavLink to="/mypage" onClick={toggleMenuBar} className={({ isActive }) => isActive ? HeaderModuleStyle.active : ""}>Ayurveda</NavLink>
                            </li>

                            <li>
                                <NavLink to="/login" onClick={toggleMenuBar} className={({ isActive }) => isActive ? HeaderModuleStyle.active : ""}>Keramik</NavLink>
                            </li>
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