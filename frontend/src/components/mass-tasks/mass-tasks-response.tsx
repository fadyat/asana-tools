import {MassTasksSuccessResponse} from "../../api/asana/mass-tasks";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MassTasksResponse = (props: MassTasksSuccessResponse) => {

    return (
        <TableContainer component={Paper}
                        sx={{width: '100%', marginTop: '20px'}}
        >
            <Table size="small"
                   aria-label="a dense table"
                   sx={{width: '100%'}}
            >
                <TableHead>
                    <TableCell>Status</TableCell>
                    <TableCell>Task</TableCell>
                    <TableCell>Link</TableCell>
                    <TableCell>Reason</TableCell>
                </TableHead>

                <TableBody>
                    {
                        props.created_tasks.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell><CheckCircleIcon style={{color: 'green'}}/></TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.permalink_url}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))
                    }
                    {
                        props.failed_tasks.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell><CloseIcon style={{color: 'red'}}/></TableCell>
                                <TableCell>{row.task.name}</TableCell>
                                <TableCell>{row.task.permalink_url}</TableCell>
                                <TableCell>{row.error}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default MassTasksResponse;