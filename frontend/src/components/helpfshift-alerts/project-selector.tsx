import React, {useEffect, useState} from 'react';
import {Project} from "../../api/helpshift/project";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {hsClient} from "../../api/helpshift/client";


type selectorProps = {
    projectId: number,
    setProjectId: (v: number) => void,
}

const HelpshiftProjectSelector = ({projectId, setProjectId}: selectorProps) => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        hsClient.projects.getAll().then((r) => {
            if (!r.ok) {
                console.error(`Failed to get projects: ${r.error}`)
                return
            }

            setProjects(r.data!)
        })
    }, []);

    return (
        <FormControl sx={{minWidth: '250px'}}>
            <InputLabel id="project-label">Select a project</InputLabel>
            <Select
                labelId="project-label"
                id="project-selector"
                value={projectId}
                label="Select a project"
                onChange={(e) => setProjectId(parseInt(e.target.value as string))}
            >
                {
                    projects.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                            {p.name}
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )
}

export default HelpshiftProjectSelector;