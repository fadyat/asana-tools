import {Theme} from "@mui/material/styles";
import {SxProps} from "@mui/system";
import React, {useEffect, useState} from "react";
import {SlackChannel, UpdateSlackChannelDto} from "../../../api/helpshift/slack";
import {DataGrid, GridCellParams} from "@mui/x-data-grid";
import {Box} from "@mui/material";
import {SaveAction} from "../../core/actions/save";
import {DeleteAction} from "../../core/actions/delete";
import {helpshiftLimitsSlackChannelColumns} from "../../../templates/helpshift-alerts/columns";
import {ApiAlertProps} from "../../core/api-alert";
import {GridRowModel} from "@mui/x-data-grid/models/gridRows";
import {hsClient} from "../../../api/helpshift/client";

export type ProjectSlackChannelsEditorProps = {
    setApiAlertProps: (v: ApiAlertProps | null) => void,
    selectedProject: number,
    sx?: SxProps<Theme>,
}

// todo: make it pretty
const toUpdatedSlackChannel = (row: GridRowModel): UpdateSlackChannelDto => {

    return {
        id: row.id,
        name: row.name,
        type: parseInt(row.type),
        url: row.url,
    }
}

// todo: make it pretty
const toSlackChannel = (row: GridRowModel): SlackChannel => {

    return {
        id: row.id,
        name: row.name,
        type: parseInt(row.type),
        url: row.url,
    }
}

const ProjectSlackChannelsEditor = (
    {selectedProject, sx, setApiAlertProps}: ProjectSlackChannelsEditorProps
) => {
    const [projectSlackChannels, setProjectSlackChannels] = useState<SlackChannel[]>([]);
    const [currentRowId, setCurrentRowId] = useState<number | null>(null);

    useEffect(() => {
        hsClient.slackChannels.getAll(selectedProject).then((r) => {
            if (!r.ok) {
                console.error(`Failed to get slack channels ${r.error}`);
                return
            }

            setProjectSlackChannels(r.data!);
        })
    }, [selectedProject]);

    const columns = [
        ...helpshiftLimitsSlackChannelColumns,
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
                                onClickFunc={() => {
                                    const dto = toUpdatedSlackChannel(params.row);

                                    hsClient.slackChannels.update(selectedProject, dto).then((v) => {
                                        if (v.ok) {
                                            setApiAlertProps({
                                                severity: 'success',
                                                message: 'Ok'
                                            });

                                            setProjectSlackChannels(projectSlackChannels.map(
                                                (channel) => channel.id === params.id ? toSlackChannel(params.row) : channel
                                            ))
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
                                  rowId={currentRowId}
                                  setRowId={setCurrentRowId}
                                  onClickFunc={() => {
                                      const [projectId, channelId] = [selectedProject, params.row.id];

                                      hsClient.slackChannels.delete(projectId, channelId).then((v) => {
                                          if (v.ok) {
                                              setApiAlertProps({
                                                  severity: 'success',
                                                  message: 'Ok'
                                              });
                                              setProjectSlackChannels(projectSlackChannels.filter(
                                                  (channel) => channel.id !== params.id
                                              ))
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
    ]

    return (
        <Box sx={{width: '100%', ...sx}}>
            <DataGrid
                rows={projectSlackChannels}
                columns={columns}
                getRowId={(channel) => channel.id}
                onCellClick={(params) => {
                    setCurrentRowId(params.id as number);
                }}
            />
        </Box>
    )
}

export default ProjectSlackChannelsEditor;