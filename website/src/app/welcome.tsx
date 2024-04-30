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
            Fan dedicated resources for Dungeons Of Eternity.
          </div>
          <div className="p-grid p-nogutter p-d-flex p-justify-center p-ai-center text-center">
            <p>How will you join the fray!?</p>
            <div className="flex flex-column">
              <div className="flex align-items-center justify-content-center h-4rem bg-primary font-bold border-round m-2">
                <Link
                  label="Primary"
                  className="mr-3 p-button pi pi-discord no-underline"
                  href="https://discord.gg/Wwc22C2KCS"
                >
                  &nbsp;Dungeons Of Eternity Discord
                </Link>
              </div>
              <div className="flex align-items-center justify-content-center h-4rem bg-primary font-bold border-round m-2">
                <Link
                  type="Primary"
                  className="mr-3 p-button pi pi-book no-underline"
                  href="/mediawiki"
                >
                  &nbsp;Forsaken Wiki
                </Link>
              </div>
              <div className="flex align-items-center justify-content-center h-4rem bg-primary font-bold border-round m-2">
                <Link
                  type="Primary"
                  className="mr-3 p-button pi pi-chart-bar no-underline"
                  href="/gallery"
                >
                  &nbsp;Forsaken Gallery
                </Link>
              </div>

              <div className="flex align-items-center justify-content-center h-4rem bg-primary font-bold border-round m-2">
                <Link
                  type="Primary"
                  className="mr-3 p-button pi pi-code no-underline"
                  href="/meanderings"
                >
                  &nbsp;Forsaken Meanderings
                </Link>
              </div>
              <div className="flex align-items-center justify-content-center h-4rem bg-primary font-bold border-round m-2">
                <Link
                  type="Primary"
                  className="mr-3 p-button pi pi-code no-underline"
                  href="/blog"
                >
                  &nbsp;Forsaken Blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
