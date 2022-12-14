import PageDescription from "./main";

export default function ContractorPageDescription() {
    const header = "Contractor Page";
    const points = [
        "This page allows you to see all the tasks assigned to a contractor.",
        "You can filter the tasks by project.",
    ]

    return (
        <PageDescription
            pageHeader={header}
            pagePoints={points}
        />
    );
}