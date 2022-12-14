import PageDescription from "./main";

export default function MassTasksDescription() {
    const header = "Mass Tasks";
    const points = [
        "This page allows you to create multiple tasks at once.",
    ];

    return (
        <PageDescription
            pageHeader={header}
            pagePoints={points}
        />
    );
}