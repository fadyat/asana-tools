import {useState} from "react";
import {Box, CircularProgress, Dialog, Fab, Typography} from "@mui/material";
import {Check, Close, Delete} from "@mui/icons-material";
import {GridCellParams} from "@mui/x-data-grid";

export type DeleteActionProps = {
    params: GridCellParams,
    rowId: number | null,
    setRowId: (v: number | null) => void,
    onClickFunc(params: GridCellParams): void,
}

export const DeleteAction = ({params, rowId, setRowId, onClickFunc}: DeleteActionProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [areYouSure, setAreYouSure] = useState<boolean>(false);

    return (
        <Box sx={{
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
                 disabled={params.id !== rowId || loading}
                 onClick={() => {
                     setAreYouSure(true);
                 }}
            >
                <Delete/>
            </Fab>

            {
                areYouSure && (
                    <Box sx={{
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        zIndex: 1,
                    }}
                    >
                        <Dialog open={areYouSure}>
                            <Typography variant={'h6'}
                                        sx={{
                                            margin: '10px 10px 5px 10px',
                                        }}
                            >
                                Are you sure?
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    margin: '10px',
                                }}
                            >
                                <Fab color="primary"
                                     sx={{
                                         width: 40,
                                         height: 40,
                                     }}
                                     onClick={() => {
                                         setAreYouSure(false);
                                         setLoading(true);

                                         setTimeout(() => {
                                             onClickFunc(params);
                                             setLoading(false);
                                             setRowId(null);
                                         }, 2000)
                                     }}
                                >
                                    <Check/>
                                </Fab>
                                <Fab color="primary"
                                     sx={{
                                         width: 40,
                                         height: 40,
                                     }}
                                     onClick={() => setAreYouSure(false)}
                                >
                                    <Close/>
                                </Fab>
                            </Box>
                        </Dialog>
                    </Box>
                )
            }

            {
                loading && (
                    <CircularProgress
                        size={52}
                        sx={{
                            position: 'absolute',
                            top: -6,
                            left: -6,
                            zIndex: 1,
                        }}
                    />
                )
            }
        </Box>
    )
};