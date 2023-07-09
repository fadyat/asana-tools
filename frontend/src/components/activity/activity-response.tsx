import {ActivitySuccessResponse} from "../../api/asana/activity";
import "./activity-response.css"
import {Paper, Table, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";

const ActivityResponse = (props: ActivitySuccessResponse) => {

    return (
        <TableContainer component={Paper}
                        sx={{width: '100%', marginTop: '20px'}}
        >
            <Table size="small"
                   aria-label="a dense table"
                   sx={{width: '100%'}}
            >
                <TableHead>
                    <TableCell>Email</TableCell>
                    <TableCell>Actions</TableCell>
                </TableHead>

                {
                    props.result.map((item, index) => {
                        return (
                            <TableRow
                                key={index}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell key={index}>{item.user_email}</TableCell>
                                <TableCell key={index}>{item.actions_cnt}</TableCell>
                            </TableRow>
                        )
                    })
                }
            </Table>
        </TableContainer>
    )
}

export default ActivityResponse;