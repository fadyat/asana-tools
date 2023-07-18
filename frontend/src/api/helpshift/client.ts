import {ProjectApiClient} from "./project";
import {helpshiftAlertsUrl} from "../../templates/consts";
import {LimitApiClient} from "./limit";
import {SlackChannelApiClient} from "./slack";
import {SubscribersApiClient} from "./subscriber";

export class HelpshiftClient {
    projects: ProjectApiClient
    limits: LimitApiClient
    slackChannels: SlackChannelApiClient
    subscribers: SubscribersApiClient

    constructor(url: string) {
        this.projects = new ProjectApiClient(url)
        this.limits = new LimitApiClient(url)
        this.slackChannels = new SlackChannelApiClient(url)
        this.subscribers = new SubscribersApiClient(url)
    }
}

export const hsClient = new HelpshiftClient(helpshiftAlertsUrl)