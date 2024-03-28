import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import image01 from "./assets/charts/drop-rates.png";
import image02 from "./assets/charts/Damage MIN_MAX by Category.png";
import image03 from "./assets/charts/Damage MIN_MAX by Name.png";
import image04 from "./assets/charts/Drop Rate Differences between Rare and Legendary Weapon Categories.png";
import image05 from "./assets/charts/Drop Rate Differences between Rare and Legendary Weapons.png";
import image06 from "./assets/charts/Dungeons of Eternity_ Axe Drop Rate By Damage.png";
import image07 from "./assets/charts/Dungeons of Eternity_ Bow Drop Rate By Damage.png";
import image08 from "./assets/charts/Dungeons of Eternity_ Crossbow Drop Rate By Damage.png";
import image09 from "./assets/charts/Dungeons of Eternity_ Dagger Drop Rate By Damage.png";
import image10 from "./assets/charts/Dungeons of Eternity_ Hammer Drop Rate By Damage.png";
import image11 from "./assets/charts/Dungeons of Eternity_ Legendary Axe Drop Rate By Damage.png";
import image12 from "./assets/charts/Dungeons of Eternity_ Perk Chances By Weapon Type 2.png";
import image13 from "./assets/charts/Dungeons of Eternity_ Sword Drop Rate By Damage.png";
import image14 from "./assets/charts/Legendary Weapon Damage Ranges.png";
import image15 from "./assets/charts/Weapon Damage Ranges.png";
import image16 from "./assets/charts/drop-rates.png";

const charts = [
  {
    original: image01,
    originalTitle: "Drop Rates",
    width: 2742,
    height: 1652,
  },
  {
    original: image02,
    originalTitle: "Damage MIN_MAX by Category",
  },
  {
    original: image03,
    originalTitle: "Damage MIN_MAX by Name",
  },
  {
    original: image04,
    originalTitle:
      "Drop Rate Differences between Rare and Legendary Weapon Categories",
  },
  {
    original: image05,
    originalTitle: "Drop Rate Differences between Rare and Legendary Weapons",
  },
  {
    original: image06,
    originalTitle: "Axe Drop Rate By Damage",
  },
  {
    original: image07,
    originalTitle: "Bow Drop Rate By Damage",
  },
  {
    original: image08,
    originalTitle: "Crossbow Drop Rate By Damage",
  },
  {
    original: image09,
    originalTitle: "Dagger Drop Rate By Damage",
  },
  {
    original: image10,
    originalTitle: "Hammer Drop Rate By Damage",
  },
  {
    original: image11,
    originalTitle: "Legendary Axe Drop Rate By Damage",
  },
  {
    original: image12,
    originalTitle: "Perk Chances By Weapon Type",
  },
  {
    original: image13,
    originalTitle: "Sword Drop Rate By Damage",
  },
  {
    original: image14,
    originalTitle: "Legendary Weapon Damage Ranges",
  },
  {
    original: image15,
    originalTitle: "Weapon Damage Ranges",
  },
  {
    original: image16,
    originalTitle: "Drop Rates",
  },
].map((chart) => {
  return Object.assign(chart, {
    thumbnail: chart.original,
    originalAlt: chart.originalTitle,
    thumbnailAlt: chart.originalTitle,
    thumbnailTitle: chart.originalTitle,
  });
});

function ChartGallery() {
  return <ImageGallery items={charts} />;
}

export default ChartGallery;
