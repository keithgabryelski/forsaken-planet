import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";

export default function Header() {
  const items: MenuItem[] = [
    {
      label: "Home",
      icon: "pi pi-home",
      url: "/",
      prefetch: false,
    },
    {
      label: "Wiki",
      icon: "pi pi-book",
      url: "/mediawiki",
    },
    {
      label: "Attack Simulator",
      icon: "pi pi-bullseye",
      url: "/simulator",
    },
    {
      label: "Drop Rates",
      icon: "pi pi-bolt",
      items: [
        {
          label: "Gear Calcuator",
          icon: "pi pi-calculator",
          url: "/drop-rate-calculator",
        },
        {
          label: "Gear Pie Chart",
          icon: "pi pi-chart-pie",
          url: "/drop-rate-pie-chart",
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
      ],
    },
    {
      label: "Meanderings",
      icon: "pi pi-code",
      items: [
        {
          label: "Element Pie Chart",
          icon: "pi pi-chart-pie",
          url: "/element-pie-chart",
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
          prefetch: false,
        },
        {
          label: "Statistics GitHub Repository (R Code)",
          icon: "pi pi-github",
          url: "https://github.com/keithgabryelski/dungeons-of-eternity-statistics",
          prefetch: false,
        },
        {
          label: "Original data (google sheets)",
          icon: "pi pi-table",
          url: "http://bit.ly/dungeons-of-eternity-statistics",
          prefetch: false,
        },
        {
          label: "This Site's GitHub Repository",
          icon: "pi pi-github",
          url: "https://github.com/keithgabryelski/forsaken-planet",
          prefetch: false,
        },
        {
          label: "Blog",
          icon: "pi pi-link",
          url: "/blog",
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
