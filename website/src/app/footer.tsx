import Link from "next/link";
import { Image } from "primereact/image";
import background from "@/assets/images/forsaken-planet-hero.jpg";

export default function Footer() {
  return (
    <footer>
      <div
        className="surface-section px-4 md:px-6 lg:px-8"
        style={{
          backgroundImage: `url(${background.src})`,
        }}
      >
        <div className="py-1 flex flex-column sm:flex-row justify-content-between text-right vertical-align-middle">
          <div>
            <Link
              style={{ textDecoration: "none", color: "#fff" }}
              href="https://forsaken-planet.com"
            >
              forsaken-planet.com
            </Link>
          </div>
          <div>
            © 2024 OCD Software, LLC. (software we HAD to write) All rights
            reserved.
          </div>
          <div className="mt-3 sm:mt-0">
            <a className="cursor-pointer text-500 transition-colors transition-duration-150 hover:text-700">
              <i className="pi pi-twitter text-xl"></i>
            </a>
            <a className="cursor-pointer text-500 ml-3 transition-colors transition-duration-150 hover:text-700">
              <i className="pi pi-facebook text-xl"></i>
            </a>
            <a className="cursor-pointer text-500 ml-3 transition-colors transition-duration-150 hover:text-700">
              <i className="pi pi-github text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
