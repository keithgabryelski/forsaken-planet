import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";

export default function Header() {
  const items: MenuItem[] = [
    {
      label: "Forsaken Planet",
      icon: "pi pi-home",
      url: "/",
    },
    {
      label: "Wiki",
      icon: "pi pi-book",
      url: "https://forsaken-planet.com/wiki/Dungeons_Of_Eternity",
    },
    {
      label: "Gear Calcuator",
      icon: "pi pi-calculator",
      url: "/drop-rate-calculator",
    },
    {
      label: "Combat Simulator",
      icon: "pi pi-bullseye",
      url: "/simulator",
    },
    {
      label: "Drop Rates",
      icon: "pi pi-bolt",
      items: [
        {
          label: "Gear Sunburst",
          icon: "pi pi-chart-pie",
          url: "/drop-rate-sunburst",
        },
        {
          label: "Perk Radar Chart",
          icon: "pi pi-star",
          url: "/perk-drop-rate-radar",
        },
        {
          label: "Drops Interrogator",
          icon: "pi pi-table",
          url: "/drops-interrogator",
        },
      ],
    },
    {
      label: "Damage Ranges",
      icon: "pi pi-asterisk",
      items: [
        {
          label: "MIN/MAX",
          icon: "pi pi-chart-bar",
          url: "/damage-min-max",
        },
        {
          label: "MIN/MAX Grouped",
          icon: "pi pi-chart-bar",
          url: "/damage-min-max-grouped",
        },
        {
          label: "Scatter Plot",
          icon: "pi pi-chart-scatter",
          url: "/damage-scatter-plot",
        },
        {
          label: "Histogram",
          icon: "pi pi-chart-bar",
          url: "/damage-histogram",
        },
      ],
    },
    {
      label: "What we're reading..",
      icon: "pi pi-book",
      items: [
        {
          label: "Mystical Mumblings",
          icon: "pi pi-ellipsis-h",
          url: "/meanderings",
        },
        {
          label: "Statistics GitHub Repository (R Code)",
          icon: "pi pi-github",
          url: "https://github.com/keithgabryelski/dungeons-of-eternity-statistics",
        },
        {
          label: "Current data (google sheets) level 60 + Spears",
          icon: "pi pi-table",
          url: "https://docs.google.com/spreadsheets/d/1jm1ADn_4syrVwkKI_aWd3xJoVkQAw6n3Ej6SM9J-gJw",
        },
        {
          label: "Original data (google sheets) level 60",
          icon: "pi pi-table",
          url: "https://docs.google.com/spreadsheets/d/1x9NlXY6hP0rW3-0F6-AJnJfk6phA4IGze5WE72grH9w",
        },
        {
          label: "Original data (google sheets) level 50",
          icon: "pi pi-table",
          url: "http://bit.ly/dungeons-of-eternity-statistics",
        },
        {
          label: "This Site's GitHub Repository",
          icon: "pi pi-github",
          url: "https://github.com/keithgabryelski/forsaken-planet",
        },
        {
          label: "Blog",
          icon: "pi pi-link",
          url: "/blog",
        },
        {
          label: "Element Pie Chart",
          icon: "pi pi-chart-pie",
          url: "/element-pie-chart",
        },
      ],
    },
  ];
  return (
    <header>
      <Menubar model={items} />
    </header>
  );
}
