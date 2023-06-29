import {ActivitySuccessResponse} from "../../api/asana/activity";
import "./activity-response.css"

const ActivityResponse = (props: ActivitySuccessResponse) => {
    return (
        <div className="activity-response">
            <h3 className="activity-response-total"> Total users: {props.length}</h3>
            {
                props.result.map((item, index) => {
                    return (
                        <div key={index} className="activity-response-item">
                            {item.user_email}: {item.actions_cnt}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ActivityResponse;