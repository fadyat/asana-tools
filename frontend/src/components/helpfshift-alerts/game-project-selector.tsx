import React, {useEffect} from 'react';
import {GameProject, getGameProjects} from "../../api/helpshift/project";
import {helpshiftAlertsUrl, helpshiftApiKey} from "../../templates/consts";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";


export type GameProjectState = {
    projects: GameProject[],
    setProjects: (v: GameProject[]) => void,

    selectedProject: number,
    setSelectedProject: (v: number) => void,
}

const GameProjectSelector = ({projects, setProjects, selectedProject, setSelectedProject}: GameProjectState) => {
    useEffect(() => {
        getGameProjects(helpshiftAlertsUrl, helpshiftApiKey)
            .then((gameProjects) => setProjects(gameProjects))
    }, []);

    return (
        <FormControl sx={{minWidth: '250px'}}>
            <InputLabel id="game-project-label">Select a project</InputLabel>
            <Select
                labelId="game-project-label"
                id="game-project-select"
                value={selectedProject}
                label="Select a project"
                onChange={(e) => {
                    setSelectedProject(parseInt(e.target.value as string))
                }}
            >
                {
                    projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                            {project.name}
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )
}

export default GameProjectSelector;