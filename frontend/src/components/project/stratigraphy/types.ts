import type { StratigraphicUnit } from "#client";

export type ZoneMapping = {
  rmsName: string;
  smdaName: string;
  smdaUuid: string;
  aliases: string[];
};

export type ZoneMappings = Record<string, ZoneMapping>;

export type StratUnitRelation = Pick<
  StratigraphicUnit,
  "identifier" | "uuid"
> & {
  children: StratUnitRelation[];
};
