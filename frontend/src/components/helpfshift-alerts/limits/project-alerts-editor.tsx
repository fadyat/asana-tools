import React, {useEffect, useMemo, useState} from "react";
import {
    deleteProjectLimit,
    getProjectLimits,
    ProjectLimit, updateProjectLimit,
    UpdateProjectLimit,
} from "../../../api/helpshift/limit";
import {helpshiftAlertsUrl, helpshiftApiKey} from "../../../templates/consts";
import {DataGrid, GridCellParams} from '@mui/x-data-grid';
import {Box} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {helpshiftLimitsColumns} from "../../../templates/helpshift-alerts/columns";
import {SaveAction} from "../../core/actions/save";
import {DeleteAction} from "../../core/actions/delete";
import {ApiAlertProps} from "../../core/api-alert";
import {GridRowModel} from "@mui/x-data-grid/models/gridRows";


export type ProjectLimitsEditorProps = {
    setApiAlertProps: (v: ApiAlertProps | null) => void,
    selectedProject: number,
    sx?: SxProps<Theme>,
}


// todo: make it pretty
export const toUpdateProjectLimit = (row: GridRowModel): UpdateProjectLimit => {
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
        projectId: row.projectId
    }
}

// todo: make it pretty
export const toProjectLimit = (row: GridRowModel): ProjectLimit => {
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
        projectId: row.projectId,
        subscribers: row.subscribers
    }
}


const ProjectLimitsEditor = ({setApiAlertProps, selectedProject, sx}: ProjectLimitsEditorProps) => {
    const [projectLimits, setProjectLimits] = useState<ProjectLimit[]>([]);
    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 25})
    const [currentRowId, setCurrentRowId] = useState<number | null>(null);

    useEffect(() => {
        getProjectLimits(helpshiftAlertsUrl, helpshiftApiKey, selectedProject)
            .then((projectLimits) => setProjectLimits(projectLimits))
    }, [selectedProject]);

    const columns = useMemo(() => [
        ...helpshiftLimitsColumns,
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 180,
            renderCell: (params: GridCellParams) => {
                return <>
                    <SaveAction params={params}
                                rowId={currentRowId}
                                setRowId={setCurrentRowId}
                                onClickFunc={(params: GridCellParams) => {
                                    const updatedProjectLimit = toUpdateProjectLimit(params.row);
                                    const response = updateProjectLimit(helpshiftAlertsUrl, helpshiftApiKey, updatedProjectLimit)

                                    response.then((v) => {
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
                                            message: `Failed: ${updatedProjectLimit.name}\n${v.error}`,
                                        });
                                    })

                                    setTimeout(() => setApiAlertProps(null), 5000);
                                }}
                    />
                    <DeleteAction params={params}
                                  rowId={currentRowId}
                                  setRowId={setCurrentRowId}
                                  onClickFunc={(params: GridCellParams) => {
                                      const [projectId, limitId] = [selectedProject, params.row.id];
                                      const response = deleteProjectLimit(helpshiftAlertsUrl, helpshiftApiKey, projectId, limitId);

                                      response.then((v) => {
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
                </>
            },
        }
    ], [currentRowId]);


    return (
        <Box sx={{...sx}}>
            <DataGrid
                rows={projectLimits}
                columns={columns}
                getRowId={(projectLimit) => projectLimit.id}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onCellEditStop={(params) => {
                    setCurrentRowId(params.id as number);
                }}
            />
        </Box>
    );

}

export default ProjectLimitsEditor;