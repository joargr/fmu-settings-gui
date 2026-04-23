import type { StratigraphicUnit } from "#client";

export type ZoneMapping = {
  rmsName: string;
  smdaName: string;
  smdaUuid: string;
};

export type ZoneMappings = Record<string, ZoneMapping>;

export type SmdaZone = {
  name: string;
  uuid: string;
};

export type StratUnitRelation = Pick<
  StratigraphicUnit,
  "identifier" | "uuid"
> & {
  children: StratUnitRelation[];
};
