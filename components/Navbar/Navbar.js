"use client";
import { navOptions } from '@/constants';
import { usePathname } from 'next/navigation';
import "./navbar.css"
const Navbar = () => {
    const pathname = usePathname();
    const name = "Burhan Ahmad";
    return (
        <div id="foremost-div">
            <div id="list-style">
                <div className="flex flex-col ml-4 mt-4">
                    <h1 className="text-3xl">Good morning, {name}</h1>
                    <h4>This is your finance report</h4>
                </div>
                <div>
                    <ul className="navLinksList">
                        {navOptions.map((option, index) => (
                            <li key={index}>
                                <a href={option.link}>
                                    <p className={`navLink ${pathname === option.link ? "active" : ""}`}>
                                        {option.title}
                                    </p>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    )
}
export default Navbar;