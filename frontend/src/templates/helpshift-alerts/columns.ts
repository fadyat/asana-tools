import {GridColDef} from "@mui/x-data-grid/models/colDef/gridColDef";
import {TextFieldProps} from "@mui/material";

export const helpshiftCreateLimitsColumns: TextFieldProps[] = [
    {name: 'name', label: 'Name', placeholder: 'Default Limit'},
    {name: 'daysOfWeek', label: 'Days of Week', placeholder: '1,2,3,4,5'},
    {name: 'timeOfDay', label: 'Time of Day', placeholder: '00:00:00'},
    {name: 'duration', label: 'Duration', placeholder: '00:00:00'},
    {name: 'pollingInterval', label: 'Polling Interval', placeholder: '00:00:00'},
    {name: 'smsLimit', label: 'SMS Limit', placeholder: '10'},
    {name: 'callLimit', label: 'Call Limit', placeholder: '10'}
]

export const helpshiftLimitsColumns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 75, type: 'number'},
    {field: 'name', headerName: 'Name', width: 150, editable: true},
    {field: 'isEnabled', headerName: 'Enabled', width: 75, type: 'boolean', editable: true},
    {field: 'daysOfWeek', headerName: 'Days of week', width: 150, editable: true},
    {field: 'timeOfDay', headerName: 'Time of day', width: 150, editable: true},
    {field: 'duration', headerName: 'Duration', width: 150, editable: true},
    {field: 'pollingInterval', headerName: 'Polling interval', width: 150, editable: true},
    {field: 'smsLimit', headerName: 'SMS limit', width: 150, type: 'number', editable: true},
    {field: 'callLimit', headerName: 'Call limit', width: 150, type: 'number', editable: true},
]

export const helpshiftLimitsSlackChannelColumns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 75, type: 'number'},
    {field: 'name', headerName: 'Name', width: 300, editable: true},
    {field: 'type', headerName: 'Type', width: 150, editable: true, type: 'number'},
    {field: 'url', headerName: 'URL', width: 700, editable: true},
]

export const helpshiftLimitsSubscriberColumns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 75, type: 'number'},
    {field: 'name', headerName: 'Name', width: 300, editable: true},
    {field: 'phone', headerName: 'Phone', width: 150, editable: true},
    {field: 'sms', headerName: 'SMS', width: 150, editable: true, type: 'boolean'},
    {field: 'calls', headerName: 'Calls', width: 150, editable: true, type: 'boolean'},
]

export const helpshiftCreateSubscriberColumns: TextFieldProps[] = [
    {name: 'name', label: 'Name', placeholder: 'Ryan Gosling'},
    {name: 'phone', label: 'Phone', placeholder: '+88005553535'},
    {name: 'sms', label: 'SMS', placeholder: 'true'},
    {name: 'calls', label: 'Calls', placeholder: 'true'},
]

export const helpshiftCreateSlackChannelColumns: TextFieldProps[] = [
    {name: 'name', label: 'Name', placeholder: 'Slack Channel'},
    {name: 'type', label: 'Type', placeholder: '1'},
    {name: 'url', label: 'URL', placeholder: 'https://hooks.slack.com/services/...'},
]