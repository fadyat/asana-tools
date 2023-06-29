const asanaToolsUrl = process.env.REACT_APP_ASANA_TOOLS_HOST || ''
const helpshiftAlertsUrl = process.env.REACT_APP_HELPSHIFT_ALERTS_HOST || ''
const helpshiftApiKey = process.env.REACT_APP_HELPSHIFT_API_KEY || ''

const appVersion = process.env.REACT_APP_VERSION || '0.0.0'

if (asanaToolsUrl === '') {
    throw new Error('REACT_APP_ASANA_TOOLS_HOST env variable is not set')
}

if (helpshiftAlertsUrl === '') {
    throw new Error('REACT_APP_HELPSHIFT_ALERTS_HOST env variable is not set')
}

export {
    asanaToolsUrl, helpshiftAlertsUrl, helpshiftApiKey, appVersion
}