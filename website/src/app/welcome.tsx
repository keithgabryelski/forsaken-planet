import { Image } from "primereact/image";
import Link from "next/link";
import styles from "./hero.module.css";
import hero from "@/assets/images/forsaken-planet-hero.jpg";

export default function Welcome() {
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image
          src={hero.src}
          alt="Forsaken Planet Hero"
          className="md:ml-auto block md:h-full max-w-30rem"
          style={{ clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" }}
        />
      </div>
      <div className={styles.text}>
        <section>
          <span className="block text-6xl font-bold mb-1">
            Welcome to Forsaken Planet!
          </span>
          <div className="text-6xl text-primary font-bold mb-3">
            Dungeons Of Eternity resources and meanderings.
          </div>
          <p>How will you join the fray!?</p>
          <Link
            className="mr-3 p-button pi pi-discord no-underline"
            href="https://discord.gg/Wwc22C2KCS"
          >
            &nbsp;Dungeons Of Eternity Discord
          </Link>
          <Link
            type="Primary"
            className="mr-3 p-button pi pi-book no-underline"
            href="https://forsaken-planet.com/mediawiki/index.php?title=Dungeons_Of_Eternity"
          >
            &nbsp;Forsaken Wiki
          </Link>
          <Link
            type="Primary"
            className="mr-3 p-button pi pi-chart-bar no-underline"
            href="/gallery"
          >
            &nbsp;Forsaken Gallery
          </Link>
          <Link
            type="Primary"
            className="mr-3 p-button pi pi-code no-underline"
            href="/meanderings"
          >
            &nbsp;Forsaken Meanderings
          </Link>
          <Link
            type="Primary"
            className="mr-3 p-button pi pi-code no-underline"
            href="/blog"
          >
            &nbsp;Forsaken Blog
          </Link>
        </section>
      </div>
    </div>
  );
}
