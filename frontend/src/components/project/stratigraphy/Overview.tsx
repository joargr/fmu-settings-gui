import { Dialog, Icon } from "@equinor/eds-core-react";
import { edit } from "@equinor/eds-icons";
import { createFormHook } from "@tanstack/react-form";
import { useState } from "react";

import type { RmsProject } from "#client";
import { CancelButton, GeneralButton } from "#components/form/button";
import { TextField } from "#components/form/field";
import { EditDialog, PageSectionSpacer, PageText } from "#styles/common";
import { fieldContext, formContext } from "#utils/form";
import { useFrameworkData } from "../stratigraphicFramework/functions";
import { StratigraphicFramework } from "../stratigraphicFramework/StratigraphicFramework";
import {
  ZoneActions,
  ZoneInfo,
  ZoneItem,
  ZoneName,
  ZoneSystem,
  ZoneSystemName,
  ZoneSystems,
} from "./Overview.style";

export function Zones({
  smdaHealthStatus,
  projectReadOnly,
  editMode,
}: {
  smdaHealthStatus: boolean;
  projectReadOnly: boolean;
  editMode: boolean;
}) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const frameworkData = useFrameworkData();

  const { useAppForm: useAppFormZoneName } = createFormHook({
    fieldComponents: {
      TextField,
    },
    formComponents: {},
    fieldContext,
    formContext,
  });

  const form = useAppFormZoneName({
    defaultValues: { smdaName: currentName, aliases: "" },
  });

  const editClick = (name: string) => {
    if (editMode && smdaHealthStatus) {
      setCurrentName(name);
      form.reset();
      setEditDialogOpen(true);
    }
  };

  return (
    <>
      <EditDialog open={editDialogOpen}>
        <form>
          <Dialog.Header>Edit zone name: {currentName}</Dialog.Header>

          <Dialog.CustomContent>
            <form.AppField name="smdaName">
              {(field) => <field.TextField label="SMDA name" />}
            </form.AppField>

            <PageSectionSpacer />

            <form.AppField name="aliases">
              {(field) => <field.TextField label="RMS aliases" />}
            </form.AppField>
          </Dialog.CustomContent>

          <Dialog.Actions>
            <GeneralButton
              label="Update"
              onClick={() => {
                setEditDialogOpen(false);
              }}
            />
            <CancelButton
              onClick={() => {
                setEditDialogOpen(false);
              }}
            />
          </Dialog.Actions>
        </form>
      </EditDialog>

      {frameworkData.zones.map((zone) => {
        const grid = frameworkData.zoneGridPlacement.get(zone.name);
        const temp_show_zone_colors =
          (zone.stratigraphic_column_name?.length ?? 0) < 0; // > shows colours, < doesn't

        if (!grid) {
          return null;
        }

        return (
          <ZoneItem key={zone.name} $zoneGrid={grid}>
            <ZoneSystems>
              <ZoneSystem
                style={temp_show_zone_colors ? { background: "lightblue" } : {}}
              >
                <ZoneInfo>
                  <ZoneSystemName>RMS</ZoneSystemName>
                  <ZoneName>{zone.name}</ZoneName>
                </ZoneInfo>
              </ZoneSystem>

              <ZoneSystem
                style={temp_show_zone_colors ? { background: "salmon" } : {}}
              >
                <ZoneInfo>
                  <ZoneSystemName>SMDA</ZoneSystemName>
                  <ZoneName $targetSystem={true}>{zone.name}</ZoneName>
                </ZoneInfo>
              </ZoneSystem>
            </ZoneSystems>

            {editMode && !projectReadOnly && smdaHealthStatus && (
              <ZoneActions>
                <Icon
                  data={edit}
                  title="Edit"
                  size={16}
                  onClick={() => {
                    editClick(zone.name);
                  }}
                />
              </ZoneActions>
            )}
          </ZoneItem>
        );
      })}
    </>
  );
}

export function Overview({
  rmsProject,
  smdaHealthStatus,
  projectReadOnly,
  editMode,
}: {
  rmsProject: RmsProject;
  smdaHealthStatus: boolean;
  projectReadOnly: boolean;
  editMode: boolean;
}) {
  return (
    <>
      <PageText>
        The following are the mappings for zones, showing zone names in RMS and
        SMDA.
      </PageText>

      {rmsProject.horizons !== undefined &&
      rmsProject.horizons !== null &&
      rmsProject.zones !== undefined &&
      rmsProject.zones !== null ? (
        <StratigraphicFramework
          horizons={rmsProject.horizons}
          zones={rmsProject.zones}
        >
          <Zones
            smdaHealthStatus={smdaHealthStatus}
            projectReadOnly={projectReadOnly}
            editMode={editMode}
          />
        </StratigraphicFramework>
      ) : (
        <PageText>No horizons exist.</PageText>
      )}
    </>
  );
}
