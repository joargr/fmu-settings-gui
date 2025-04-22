import { Button, TopBar } from "@equinor/eds-core-react";
import { Link } from "@tanstack/react-router";

import fmuLogo from "../assets/fmu_logo.png";
import { AppTitle, FmuLogo, HeaderContainer } from "./Header.style";

export function Header() {
  return (
    <HeaderContainer>
      <TopBar>
        <TopBar.Header>
          <Button
            variant="ghost"
            as={Link}
            to="/"
            style={{ backgroundColor: "inherit" }}
          >
            <FmuLogo src={fmuLogo} />
          </Button>
          <AppTitle>FMU Settings</AppTitle>
        </TopBar.Header>
      </TopBar>
    </HeaderContainer>
  );
}
