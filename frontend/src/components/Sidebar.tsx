import { SideBar as EdsSideBar } from "@equinor/eds-core-react";
import {
  account_circle,
  dashboard,
  folder,
  settings,
  shuffle,
} from "@equinor/eds-icons";
import { Link } from "@tanstack/react-router";

import { useProject } from "../services/project";

type AccordianSubItem = {
  label: string;
  to: string;
};

export function Sidebar() {
  const { data: project } = useProject();

  const ProjectSubItems: AccordianSubItem[] = [];
  if (project.status) {
    ProjectSubItems.push({ label: "SMDA", to: "/general/smda" });
  }

  return (
    <EdsSideBar open>
      <EdsSideBar.Content>
        <EdsSideBar.Link label="Home" icon={dashboard} as={Link} to="/" />
        <EdsSideBar.Accordion label="User" icon={account_circle}>
          <EdsSideBar.AccordionItem
            label="API keys"
            as={Link}
            to="/user/keys"
          />
        </EdsSideBar.Accordion>
        <EdsSideBar.Link
          label="Directory"
          icon={folder}
          as={Link}
          to="/directory"
        />
        <EdsSideBar.Accordion label="General" icon={settings}>
          <EdsSideBar.AccordionItem label="Overview" as={Link} to="/general" />
          {ProjectSubItems.map((item) => (
            <EdsSideBar.AccordionItem
              key={item.to}
              label={item.label}
              as={Link}
              to={item.to}
            />
          ))}
        </EdsSideBar.Accordion>
        <EdsSideBar.Accordion label="Mappings" icon={shuffle}>
          <EdsSideBar.AccordionItem label="Overview" as={Link} to="/mappings" />
        </EdsSideBar.Accordion>
      </EdsSideBar.Content>
    </EdsSideBar>
  );
}
