import { tokens } from "@equinor/eds-tokens";
import styled from "styled-components";

export const FieldsContainer = styled.div`
  width: 800px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  column-gap: ${tokens.spacings.comfortable.xx_large};
  row-gap: ${tokens.spacings.comfortable.medium};

  h4 {
    margin-bottom: 0;
    text-decoration: underline;
  }

  h6 {
    margin-bottom: 0;
  }
`;

export const DiscoveriesContainer = styled.div`
  padding: ${tokens.spacings.comfortable.small};
  border: solid 1px ${tokens.colors.ui.background__medium.hex};
  border-radius: ${tokens.shape.corners.borderRadius};
  background: ${tokens.colors.ui.background__light.hex};

  & > div:not(:last-of-type){
    margin-bottom: ${tokens.spacings.comfortable.small};
  }
`;
