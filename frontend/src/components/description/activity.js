import PageDescription from "./main";

export default function ActivityDescription() {
    const header = "Users activity"
    const points = [
        "Allows you to count the number of tasks in which the user is a follower.",
        "We only consider completed and modified tasks in the passed range."
    ];

    return (
        <PageDescription
            pageHeader={header}
            pagePoints={points}
        />
    );
}