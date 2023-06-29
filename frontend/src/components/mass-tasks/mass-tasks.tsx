import PageDescription from "../core/page-description";
import React, {FC, memo} from "react";
import MassTasksForm from "./mass-tasks-form";

const MassTasks: FC = memo(() => {
    return (
        <>
            <MassTasksForm/>

            <PageDescription
                title="Mass Tasks"
                points={[
                    "This page allows you to create multiple tasks at once.",
                ]}
            />
        </>
    )
});

export default MassTasks;