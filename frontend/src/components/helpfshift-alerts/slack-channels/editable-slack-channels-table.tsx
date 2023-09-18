import React, {useEffect, useState} from "react";
import {
    DeletedSlackChannelDto,
    SlackChannel,
    UpdatedSlackChannelDto,
    UpdateSlackChannelDto
} from "../../../api/helpshift/slack";
import {ApiResponse} from "../../../api/client";
import {helpshiftLimitsSlackChannelColumns} from "../../../templates/helpshift-alerts/columns";
import {DataGrid, GridCellParams} from "@mui/x-data-grid";
import {Box} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {SaveAction} from "../../core/actions/save";
import {GridRowModel} from "@mui/x-data-grid/models/gridRows";
import {DeleteAction} from "../../core/actions/delete";

type editableSlackChannelsProps = {
    fetchFn: () => Promise<ApiResponse<SlackChannel[]>>
    sx?: SxProps<Theme>,
    saveFn?: (row: SlackChannel) => Promise<ApiResponse<UpdatedSlackChannelDto>>
    deleteFn?: (row: SlackChannel) => Promise<ApiResponse<DeletedSlackChannelDto>>
    setApiAlertProps?: (v: any) => void
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

export const EditableSlackChannelsTable = function (
    {fetchFn, sx, saveFn, deleteFn, setApiAlertProps}: editableSlackChannelsProps
) {
    const [channels, setChannels] = useState<SlackChannel[]>([]);
    const [saveRowId, setSaveRowId] = useState<number | null>(null);
    const [deleteRowId, setDeleteRowId] = useState<number | null>(null);

    useEffect(() => {
        fetchFn().then((r) => {
            if (!r.ok) {
                console.error(`Failed to get slack channels ${r.error}`);
                return
            }

            setChannels(r.data!);
        })
    }, [fetchFn]);

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
                                rowId={saveRowId}
                                setRowId={setSaveRowId}
                                onClickFunc={() => {
                                    const dto = toUpdatedSlackChannel(params.row);

                                    saveFn!(dto).then((v) => {
                                        if (v.ok) {
                                            setApiAlertProps!({
                                                severity: 'success',
                                                message: 'Ok'
                                            });

                                            setChannels(channels.map(
                                                (channel) => channel.id === params.id ? toSlackChannel(params.row) : channel
                                            ))
                                            return;
                                        }

                                        setApiAlertProps!({
                                            severity: 'error',
                                            message: `Failed: ${dto.name}\n${v.error}`,
                                        });
                                    })

                                    setTimeout(() => setApiAlertProps!(null), 5000);
                                }}
                    />
                    <DeleteAction params={params}
                                  rowId={deleteRowId}
                                  setRowId={setDeleteRowId}
                                  onClickFunc={() => {
                                      deleteFn!(params.row).then((v) => {
                                          if (v.ok) {
                                              setApiAlertProps!({
                                                  severity: 'success',
                                                  message: 'Ok'
                                              });
                                              setChannels(channels.filter(
                                                  (channel) => channel.id !== params.id
                                              ))
                                              return;
                                          }

                                          setApiAlertProps!({
                                              severity: 'error',
                                              message: `Failed!\n${v.error}`,
                                          });
                                      })

                                      setTimeout(() => setApiAlertProps!(null), 5000);
                                  }}
                    />
                </>
            }
        }
    ]

    return (
        <Box sx={{width: '100%', ...sx}}>
            <DataGrid
                rows={channels}
                columns={columns}
                getRowId={(channel) => channel.id}
                onCellEditStop={(params) => {
                    setSaveRowId(params.id as number);
                }}
                onCellClick={(params) => {
                    setDeleteRowId(params.id as number);
                }}
            />
        </Box>
    )
}
