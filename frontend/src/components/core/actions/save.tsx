import {useState} from "react";
import {Box, CircularProgress, Fab} from "@mui/material";
import {Check, Save} from "@mui/icons-material";
import {GridCellParams} from "@mui/x-data-grid";

export type SaveActionProps = {
    params: GridCellParams,
    rowId: number | null,
    setRowId: (v: number | null) => void,
    onClickFunc(params: GridCellParams): void,
}

export const SaveAction = ({params, rowId, setRowId, onClickFunc}: SaveActionProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

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
            {
                success ? (
                    <Fab color="primary"
                         sx={{
                             width: 40,
                             height: 40,
                             boxShadow: 'none',
                         }}
                    >
                        <Check/>
                    </Fab>
                ) : (
                    <Fab color="primary"
                         sx={{
                             width: 40,
                             height: 40,
                             boxShadow: 'none',
                         }}
                         disabled={params.id !== rowId || loading}
                         onClick={() => {
                             setLoading(true);

                             setTimeout(() => {
                                 onClickFunc(params);
                                 setLoading(false);
                                 setSuccess(true);
                                 setRowId(null);
                             }, 2000)

                             setTimeout(() => setSuccess(false), 2000)
                         }}
                    >
                        <Save/>
                    </Fab>
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
}