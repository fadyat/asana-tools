import React, {useEffect, useState} from "react";
import {Limit, UpdateLimitDto} from "../../../api/helpshift/limit";
import {DataGrid, GridCellParams} from '@mui/x-data-grid';
import {Box, Dialog} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {helpshiftLimitsColumns} from "../../../templates/helpshift-alerts/columns";
import {SaveAction} from "../../core/actions/save";
import {DeleteAction} from "../../core/actions/delete";
import {ApiAlertProps} from "../../core/api-alert";
import {GridRowModel} from "@mui/x-data-grid/models/gridRows";
import {RenderSubscribers, SubsAction} from "../subscribers/subscribers-actions";
import {hsClient} from "../../../api/helpshift/client";


export type ProjectLimitsEditorProps = {
    setApiAlertProps: (v: ApiAlertProps | null) => void,
    selectedProject: number,
    sx?: SxProps<Theme>,
}


// todo: make it pretty
export const toUpdateProjectLimit = (row: GridRowModel): UpdateLimitDto => {
    let daysOfWeek = row.daysOfWeek;
    if (typeof daysOfWeek === 'string') {
        daysOfWeek = daysOfWeek.split(',').map((day: string) => parseInt(day));
    }

    return {
        id: row.id,
        name: row.name,
        daysOfWeek: daysOfWeek,
        timeOfDay: row.timeOfDay,
        duration: row.duration,
        pollingInterval: row.pollingInterval,
        isEnabled: row.isEnabled,
        smsLimit: row.smsLimit,
        callLimit: row.callLimit,
        slackLimit: row.slackLimit,
        slackChannelName: row.slackChannelName,
    }
}

// todo: make it pretty
export const toProjectLimit = (row: GridRowModel): Limit => {
    let daysOfWeek = row.daysOfWeek;
    if (typeof daysOfWeek === 'string') {
        daysOfWeek = daysOfWeek.split(',').map((day: string) => parseInt(day));
    }

    return {
        id: row.id,
        name: row.name,
        daysOfWeek: daysOfWeek,
        timeOfDay: row.timeOfDay,
        duration: row.duration,
        pollingInterval: row.pollingInterval,
        isEnabled: row.isEnabled,
        smsLimit: row.smsLimit,
        callLimit: row.callLimit,
        subscribers: row.subscribers,
        slackLimit: row.slackLimit,
        slackChannelName: row.slackChannelName,
    }
}


const ProjectLimitsEditor = ({setApiAlertProps, selectedProject, sx}: ProjectLimitsEditorProps) => {
    const [projectLimits, setProjectLimits] = useState<Limit[]>([]);
    const [saveRowId, setSaveRowId] = useState<number | null>(null);
    const [deleteRowId, setDeleteRowId] = useState<number | null>(null);
    const [subsRowId, setSubsRowId] = useState<number | null>(null);
    const [isSubsOpen, setIsSubsOpen] = useState(false);

    useEffect(() => {
        hsClient.limits.getAll(selectedProject).then((r) => {
            if (!r.ok) {
                console.error(`Failed to get limits: ${r.error}`)
                return
            }

            setProjectLimits(r.data!)
        })
    }, [selectedProject]);

    const columns = [
        ...helpshiftLimitsColumns,
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 180,
            renderCell: (params: GridCellParams) => {
                return <>
                    <SaveAction params={params}
                                rowId={saveRowId}
                                setRowId={setSaveRowId}
                                onClickFunc={(params: GridCellParams) => {
                                    const dto = toUpdateProjectLimit(params.row);

                                    hsClient.limits.update(selectedProject, dto).then((v) => {
                                        if (v.ok) {
                                            setApiAlertProps({
                                                severity: 'success',
                                                message: 'Ok'
                                            });

                                            setProjectLimits(projectLimits.map(
                                                (l) => l.id === params.row.id ? toProjectLimit(params.row) : l)
                                            );
                                            return;
                                        }

                                        setApiAlertProps({
                                            severity: 'error',
                                            message: `Failed: ${dto.name}\n${v.error}`,
                                        });
                                    })

                                    setTimeout(() => setApiAlertProps(null), 5000);
                                }}
                    />
                    <DeleteAction params={params}
                                  rowId={deleteRowId}
                                  setRowId={setDeleteRowId}
                                  onClickFunc={(params: GridCellParams) => {
                                      const [projectId, limitId] = [selectedProject, params.row.id];

                                      hsClient.limits.delete(projectId, limitId).then((v) => {
                                          if (v.ok) {
                                              setApiAlertProps({
                                                  severity: 'success',
                                                  message: 'Ok'
                                              });
                                              setProjectLimits(projectLimits.filter((l) => l.id !== limitId));
                                              return;
                                          }

                                          setApiAlertProps({
                                              severity: 'error',
                                              message: `Failed!\n${v.error}`,
                                          });
                                      })

                                      setTimeout(() => setApiAlertProps(null), 5000);
                                  }}
                    />
                    <SubsAction params={params}
                                onClickFunc={(params: GridCellParams) => {
                                    setIsSubsOpen(true);
                                    setSubsRowId(params.row.id as number);
                                }}
                    />
                </>
            },
        }]

    return (
        <Box sx={{...sx}}>
            <DataGrid
                rows={projectLimits}
                columns={columns}
                getRowId={(projectLimit) => projectLimit.id}
                onCellEditStop={(params) => {
                    setSaveRowId(params.id as number);
                }}
                onCellClick={(params) => {
                    setDeleteRowId(params.id as number);
                }}
            />

            <Dialog open={isSubsOpen}
                    onClose={() => {
                        setIsSubsOpen(false)
                        setSubsRowId(null)
                    }}
                    sx={{
                        "& .MuiDialog-container": {
                            "& .MuiPaper-root": {
                                maxWidth: "800px",
                            },
                        },
                    }}
            >
                {/* when clicking to a human icon, currentRowId is set to the limit id */}
                <RenderSubscribers limitId={subsRowId!}
                                   setApiAlertProps={setApiAlertProps}
                />

            </Dialog>

        </Box>
    );

}

export default ProjectLimitsEditor;