import React from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {HelpshiftAlertsPages} from "./helpshift-alerts";


export type HelpshiftPageSelectorProps = {
    selectedPage: HelpshiftAlertsPages;
    setSelectedPage: (v: HelpshiftAlertsPages) => void;
    extraSet(v: HelpshiftAlertsPages): void;
}


const HelpshiftPageSelector = ({selectedPage, setSelectedPage, extraSet}: HelpshiftPageSelectorProps) => {
    return (
        <FormControl sx={{minWidth: '250px'}}>
            <InputLabel id="helpshift-page-label">Select a page</InputLabel>
            <Select
                labelId="helpshift-page-label"
                id="helpshift-page-select"
                value={selectedPage}
                label="Select a page"
                onChange={(e) => {
                    setSelectedPage(`${e.target.value}` as HelpshiftAlertsPages)
                    extraSet(`${e.target.value}` as HelpshiftAlertsPages)
                }}
            >
                {
                    Object.values(HelpshiftAlertsPages)
                        .map((page) => (
                            <MenuItem key={page}
                                      value={page}
                            >
                                {page}
                            </MenuItem>
                        ))
                }
            </Select>
        </FormControl>
    );
};


export default HelpshiftPageSelector