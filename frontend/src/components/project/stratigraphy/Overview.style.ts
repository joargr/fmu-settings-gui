import { tokens } from "@equinor/eds-tokens";
import styled from "styled-components";

export const ZoneItem = styled.div`
  margin: ${tokens.spacings.comfortable.x_small};
	border-radius: ${tokens.shape.corners.borderRadius};
  background: ${tokens.colors.infographic.primary__moss_green_21.hex};

  display: flex;
	flex-direction: column;
`;

export const ZoneSystems = styled.div`
	flex: 1;
  padding: ${tokens.spacings.comfortable.x_small};
	padding-bottom: 0;

	display: flex;
	gap: ${tokens.spacings.comfortable.small};
`;

export const ZoneActions = styled.div`
	flex-shrink: 0;
	height: 24px;
	cursor: pointer;

	display: flex;
	justify-content: center;
	align-items: center;
`;

export const ZoneSystem = styled.div`
		flex: 1;
		padding: ${tokens.spacings.comfortable.x_small};
		border-radius: ${tokens.shape.corners.borderRadius};

		display: grid;
		place-items: center;
`;

export const ZoneInfo = styled.div`
	cursor: default;
`;

export const ZoneSystemName = styled.div`
	width: fit-content;
	padding: 0 ${tokens.spacings.comfortable.small} 0 ${tokens.spacings.comfortable.small};
	border-radius: ${tokens.shape.corners.borderRadius};
	border-bottom-left-radius: 0%;
	border-bottom-right-radius: 0%;
	background: #ffffff;

	color: black;
	font-size: 10px;
	line-height: ${tokens.typography.navigation.button.lineHeight};
`;

export const ZoneName = styled.div.attrs<{ $targetSystem?: boolean }>(
  (props) => ({
    $targetSystem: props.$targetSystem ?? false,
  }),
)`
	padding: ${tokens.spacings.comfortable.x_small} ${tokens.spacings.comfortable.small};
	background: ${(props) =>
    props.$targetSystem
      ? tokens.colors.infographic.substitute__blue_overcast.hex
      : tokens.colors.infographic.primary__mist_blue.hex};
	border-radius: ${tokens.shape.corners.borderRadius};
	border-top-left-radius: 0%;

	color: ${(props) =>
    props.$targetSystem
      ? tokens.colors.text.static_icons__primary_white.hex
      : tokens.colors.text.static_icons__default.hex};
	font-size: ${tokens.typography.navigation.button.fontSize};
	font-weight: ${tokens.typography.navigation.button.fontWeight};
	line-height: ${tokens.typography.navigation.button.lineHeight};
	white-space: nowrap;
`;
