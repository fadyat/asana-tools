import {DataGrid, GridCellParams} from "@mui/x-data-grid";
import React, {useState} from "react";
import {Subscriber} from "../../../api/helpshift/subscriber";
import {Box, Dialog, Fab, Typography} from "@mui/material";
import {Add, Close, EmojiPeople} from "@mui/icons-material";
import {helpshiftLimitsSubscriberColumns} from "../../../templates/helpshift-alerts/columns";
import {SaveAction} from "../../core/actions/save";
import {DeleteAction} from "../../core/actions/delete";
import {CreateProjectSub} from "./create-project-sub";

export type SubsActionsProps = {
    params: GridCellParams,
    rowId: number | null,
    setRowId: (v: number | null) => void,
    selectedProject: number,
}

export const SubsAction = ({params, rowId, setRowId, selectedProject}: SubsActionsProps) => {
    const [subs, setSubs] = useState<Subscriber[]>([{
        id: 1,
        name: 'mocked-name',
        phone: '+88005553535',
        sms: true,
        calls: true,
    }]);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                m: 1,
                margin: '0 5px'
            }}
        >
            <Fab color="primary"
                 sx={{
                     width: 40,
                     height: 40,
                     boxShadow: 'none',
                 }}
                 onClick={() => {
                     // getProjectSubscribers(helpshiftAlertsUrl, helpshiftApiKey, selectedProject)
                     //     .then((subscribers) => setSubs(subscribers))

                     setIsOpen(!isOpen)
                 }}
            >
                <EmojiPeople/>
            </Fab>

            <Dialog open={isOpen}
                    onClose={() => setIsOpen(false)}
            >
                {
                    subs && (
                        <RenderSubscribers subscribers={subs}/>
                    )
                }

            </Dialog>
        </Box>
    )
}

const RenderSubscribers = ({subscribers}: { subscribers: Subscriber[] }) => {
    const [rowId, setRowId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const columns = [
        ...helpshiftLimitsSubscriberColumns,
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 180,
            renderCell: (params: GridCellParams) => {
                return <>
                    <SaveAction params={params}
                                rowId={rowId}
                                setRowId={setRowId}
                                onClickFunc={(_) => {
                                    console.log('mock save')
                                }}
                    />

                    <DeleteAction params={params}
                                  rowId={rowId}
                                  setRowId={setRowId}
                                  onClickFunc={(_) => {
                                      console.log('mock delete')
                                  }}
                    />
                </>
            },
        }
    ]

    console.log(subscribers)

    return (
        <Box sx={{
            alignItems: 'center',
            position: 'relative',
            margin: '15px',
            minHeight: '500px',
        }}>
            {
                subscribers.length ? (
                    <DataGrid
                        rows={subscribers}
                        columns={columns}
                        getRowId={(sub) => sub.id}
                        onCellEditStop={(params) => {
                            setRowId(params.id as number);
                        }}
                    />
                ) : (
                    <Typography>
                        No subscribers
                    </Typography>
                )
            }

            <Fab color="primary"
                 sx={{
                     width: 40,
                     height: 40,
                     boxShadow: 'none',
                     position: 'absolute',
                     bottom: 0,
                     right: 0,
                 }}
                 onClick={() => setIsOpen(!isOpen)}
            >
                <Add/>
            </Fab>

            <Dialog open={isOpen}
                    onClose={() => setIsOpen(false)}
            >
                <Fab color="primary"
                     aria-label="add"
                     onClick={() => setIsOpen(!isOpen)}
                     size={"small"}
                     style={{position: "absolute", top: 0, right: 0, margin: 5}}
                >
                    <Close/>
                </Fab>

                <CreateProjectSub
                    setIsOpen={setIsOpen}
                />

            </Dialog>
        </Box>
    )
}