import {DataGrid, GridCellParams} from "@mui/x-data-grid";
import React, {useEffect, useState} from "react";
import {Subscriber, UpdateSubscriberDto} from "../../../api/helpshift/subscriber";
import {Box, Dialog, Fab} from "@mui/material";
import {Add, Close, EmojiPeople} from "@mui/icons-material";
import {helpshiftLimitsSubscriberColumns} from "../../../templates/helpshift-alerts/columns";
import {SaveAction} from "../../core/actions/save";
import {DeleteAction} from "../../core/actions/delete";
import {CreateLimitSub} from "./create-limit-sub";
import {ApiAlertProps} from "../../core/api-alert";
import {GridRowModel} from "@mui/x-data-grid/models/gridRows";
import {hsClient} from "../../../api/helpshift/client";

export type SubsActionsProps = {
    params: GridCellParams,
    onClickFunc: (row: GridCellParams) => void,
}

export const SubsAction = ({params, onClickFunc}: SubsActionsProps) => {

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
                 onClick={() => onClickFunc(params)}
            >
                <EmojiPeople/>
            </Fab>
        </Box>
    )
}

export type RenderSubscribersProps = {
    limitId: number,
    setApiAlertProps: (v: ApiAlertProps | null) => void,
}


const toUpdatedSubscriber = (row: GridRowModel): UpdateSubscriberDto => {

    return {
        id: row.id,
        name: row.name,
        phone: row.phone,
        sms: row.sms,
        calls: row.calls,
    }
}

const toSubscriber = (row: GridRowModel): Subscriber => {

    return {
        id: row.id,
        name: row.name,
        phone: row.phone,
        sms: row.sms,
        calls: row.calls,
    }
}

export const RenderSubscribers = ({limitId, setApiAlertProps}: RenderSubscribersProps) => {
    const [rowId, setRowId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [subs, setSubs] = useState<Subscriber[]>([]);

    useEffect(() => {
        hsClient.subscribers.getAll(limitId).then(r => {
            if (!r.ok) {
                console.error(`Failed to get subscribers ${r.error}`)
                return
            }

            setSubs(r.data!)
        })

    }, [])

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
                                    const dto = toUpdatedSubscriber(params.row);

                                    hsClient.subscribers.update(limitId, dto).then((v) => {
                                        if (v.ok) {
                                            setApiAlertProps({
                                                severity: 'success',
                                                message: 'Ok'
                                            });

                                            setSubs(subs.map((sub) => {
                                                if (sub.id === dto.id) {
                                                    return toSubscriber(params.row);
                                                }

                                                return sub;
                                            }));
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
                                  rowId={rowId}
                                  setRowId={setRowId}
                                  onClickFunc={() => {
                                      const subId = params.row.id;

                                      hsClient.subscribers.delete(limitId, subId).then((v) => {
                                          if (v.ok) {
                                              setApiAlertProps({
                                                  severity: 'success',
                                                  message: 'Ok'
                                              });
                                              setSubs(subs.filter((sub) => sub.id !== subId));
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
        <Box sx={{
            alignItems: 'center',
            position: 'relative',
            margin: '15px',
            minHeight: '500px',
        }}>
            {
                <DataGrid
                    rows={subs}
                    columns={columns}
                    getRowId={(sub) => sub.id}
                    sx={{minHeight: '300px'}}
                    onCellEditStop={(params) => {
                        setRowId(params.id as number);
                    }}
                />
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

                <CreateLimitSub
                    setIsOpen={setIsOpen}
                    limitId={limitId}
                    setApiAlertProps={setApiAlertProps}
                />

            </Dialog>
        </Box>
    )
}