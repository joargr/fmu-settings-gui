import type {
  DataSystem,
  MappingGroupResponse,
  MappingType,
  StratigraphicUnit,
  StratigraphyIdentifierMapping,
} from "#client";
import type { OptionProps } from "#components/form/field";
import type {
  SmdaZone,
  StratUnitRelation,
  ZoneMapping,
  ZoneMappings,
} from "./types";

export function createRmsZonesLookup(mappings: MappingGroupResponse[]) {
  const lookup: Record<string, SmdaZone> = {};

  mappings.forEach((sz) => {
    sz.mappings.forEach((rz) => {
      if (rz.relation_type === "primary" || rz.relation_type === "equivalent") {
        lookup[rz.source_id] = {
          name: sz.official_name,
          uuid: sz.target_uuid ?? "",
        };
      }
    });
  });

  return lookup;
}

function getLabelForSmdaName(name: string, level: number) {
  const indent = "\xA0\xA0 ".repeat(level > 1 ? level - 1 : 0);

  return `${indent}${name}`;
}

function getOptionPropsForChildren(
  stratUnits: StratUnitRelation[],
  level: number,
) {
  const options: OptionProps[] = [];

  stratUnits.forEach((unit) => {
    options.push({
      value: unit.uuid,
      label: getLabelForSmdaName(unit.identifier, level),
    });
    if (unit.children.length) {
      options.push(...getOptionPropsForChildren(unit.children, level + 1));
    }
  });

  return options;
}

export function createSmdaNameOptions(stratUnits: StratigraphicUnit[]) {
  const lookup: { [key: string]: StratUnitRelation } = {};
  for (const stratUnit of stratUnits) {
    lookup[stratUnit.identifier] = {
      identifier: stratUnit.identifier,
      uuid: stratUnit.uuid,
      children: [],
    };
  }

  const relations: StratUnitRelation[] = [];
  for (const stratUnit of stratUnits) {
    const unit = lookup[stratUnit.identifier];
    if (stratUnit.strat_unit_parent === null) {
      relations.push(unit);
    } else {
      const parent = lookup[stratUnit.strat_unit_parent];
      parent.children.push(unit);
    }
  }

  return getOptionPropsForChildren(relations, 1);
}

export function updateZoneMappings(
  zoneMappings: ZoneMappings,
  value: ZoneMapping,
  stratUnit?: StratigraphicUnit,
) {
  return {
    ...zoneMappings,
    [value.rmsName]: { ...value, smdaName: stratUnit?.identifier ?? "" },
  } as ZoneMappings;
}

export function createMutationValue(
  zoneMappings: ZoneMappings,
  mappingType: MappingType,
  sourceSystem: DataSystem,
  targetSystem: DataSystem,
) {
  const result: StratigraphyIdentifierMapping[] = [];

  Object.values(zoneMappings).forEach((mapping) => {
    if (mapping.smdaUuid !== "") {
      result.push({
        mapping_type: mappingType,
        source_system: sourceSystem,
        target_system: targetSystem,
        relation_type: "primary",
        source_id: mapping.rmsName,
        target_id: mapping.smdaName,
        target_uuid: mapping.smdaUuid,
      } as StratigraphyIdentifierMapping);
    }
  });

  return result;
}
