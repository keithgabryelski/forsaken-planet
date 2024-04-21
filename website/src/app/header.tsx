import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";

export default function Header() {
  const items: MenuItem[] = [
    {
      label: "Home",
      icon: "pi pi-home",
      url: "/",
    },
    {
      label: "Wiki",
      icon: "pi pi-book",
      url: "/mediawiki",
    },
    {
      label: "Meanderings",
      icon: "pi pi-code",
      items: [
        {
          label: "Mystical Mumblings",
          icon: "pi pi-ellipsis-h",
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
          label: "Damage Type Pie Chart",
          icon: "pi pi-chart-pie",
          url: "/damage-type-pie-chart",
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
