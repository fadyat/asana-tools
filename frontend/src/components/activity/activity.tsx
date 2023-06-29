import React, {FC, memo} from "react";
import PageDescription from "../core/page-description";
import CheckActivityForm from "./check-activity-form";

const Activity: FC = memo(() => {
    return (
        <>
            <CheckActivityForm/>

            <PageDescription
                title="Users activity"
                points={[
                    "Allows you to count the number of tasks in which the user is a follower.",
                    "We only consider completed and modified tasks in the passed range."
                ]}
            />
        </>
    )
});


export default Activity;