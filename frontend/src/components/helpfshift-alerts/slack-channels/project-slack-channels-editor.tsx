import {Theme} from "@mui/material/styles";
import {SxProps} from "@mui/system";
import React, {useEffect, useState} from "react";
import {getSlackChannels, SlackChannel} from "../../../api/helpshift/slack";
import {helpshiftAlertsUrl, helpshiftApiKey} from "../../../templates/consts";
import {DataGrid, GridCellParams} from "@mui/x-data-grid";
import {Box} from "@mui/material";
import {SaveAction} from "../../core/actions/save";
import {DeleteAction} from "../../core/actions/delete";
import {helpshiftLimitsSlackChannelColumns} from "../../../templates/helpshift-alerts/columns";

export type ProjectSlackChannelsEditorProps = {
    selectedProject: number,
    sx?: SxProps<Theme>,
}

const ProjectSlackChannelsEditor = ({selectedProject, sx}: ProjectSlackChannelsEditorProps) => {
    const [projectSlackChannels, setProjectSlackChannels] = useState<SlackChannel[]>([]);
    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 25,})
    const [currentRowId, setCurrentRowId] = useState<number | null>(null);

    useEffect(() => {
        getSlackChannels(helpshiftAlertsUrl, helpshiftApiKey, selectedProject)
            .then((slackChannels) => setProjectSlackChannels(slackChannels))
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
                                    console.log('mock save')
                                }}
                    />
                    <DeleteAction params={params}
                                  rowId={currentRowId}
                                  setRowId={setCurrentRowId}
                                  onClickFunc={() => {
                                      setProjectSlackChannels(projectSlackChannels.filter(
                                          (channel) => channel.id !== params.id
                                      ))
                                      console.log('mock delete')
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
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onCellEditStart={(params) => {
                    setCurrentRowId(params.id as number);
                }}
            />
        </Box>
    )
}

export default ProjectSlackChannelsEditor;