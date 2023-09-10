import {GridColDef} from "@mui/x-data-grid/models/colDef/gridColDef";
import {TextFieldProps} from "@mui/material";
import {
    parseNumber,
    valueWithError,
    parseString,
    parseUrl,
    validationStatus,
    parsePhoneNumber,
    parseBoolean, parseArrayOfNumbers, parseTimeString, parseMoreThanZeroNumber
} from "../validate";
import {SetStateAction} from "react";
import {ApiAlertProps} from "../../components/core/api-alert";

export type TextFieldPropsWithValidate = TextFieldProps & {
    validate: (value: any) => valueWithError<any>
}

export function getErrors<T>(columns: TextFieldPropsWithValidate[], values: T): validationStatus[] {
    return columns.map((field) => {
        const {err} = field.validate(values[field.name as keyof T]);
        return {[field.name!]: err}
    })
}

export function areErrorsPresent(errors: validationStatus[]): boolean {
    return errors.some((error) => Object.values(error)[0] !== '')
}

export function notifyAboutErrors(
    errors: validationStatus[],
    validation: validationStatus,
    setValidation: (value: SetStateAction<validationStatus>) => void,
    setApiAlertProps: (value: ApiAlertProps | null) => void
): boolean {
    if (areErrorsPresent(errors)) {
        setValidation({
            ...validation,
            ...errors.reduce((acc, v) => {
                return {...acc, ...v}
            }, {})
        })

        setApiAlertProps({
            severity: 'error',
            message: 'Please fix errors',
        })

        setTimeout(() => setApiAlertProps(null), 5000);
        return true
    }

    return false
}

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
    {field: 'slackChannelName', headerName: 'Slack channel', width: 150, editable: true},
    {field: 'slackLimit', headerName: 'Slack limit', width: 150, type: 'number', editable: true},
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

export const helpshiftCreateLimitsColumns: TextFieldPropsWithValidate[] = [
    {
        name: 'name',
        label: 'Name',
        placeholder: 'Default Limit',
        validate: parseString,
    },
    {
        name: 'daysOfWeek',
        label: 'Days of Week',
        placeholder: '1,2,3,4,5',
        validate: parseArrayOfNumbers,
    },
    {
        name: 'timeOfDay',
        label: 'Time of Day',
        placeholder: '00:00:00',
        validate: parseTimeString,
    },
    {
        name: 'duration',
        label: 'Duration',
        placeholder: '00:00:00',
        validate: parseTimeString,
    },
    {
        name: 'pollingInterval',
        label: 'Polling Interval',
        placeholder: '00:00:00',
        validate: parseTimeString,
    },
    {
        name: 'smsLimit',
        label: 'SMS Limit',
        placeholder: '10',
        validate: parseMoreThanZeroNumber,
    },
    {
        name: 'callLimit',
        label: 'Call Limit',
        placeholder: '10',
        validate: parseMoreThanZeroNumber,
    },
    {
        name: 'isEnabled',
        label: 'Enabled',
        placeholder: 'true',
        validate: parseBoolean,
    }
]

export const helpshiftCreateSubscriberColumns: TextFieldPropsWithValidate[] = [
    {
        name: 'name',
        label: 'Name',
        placeholder: 'Ryan Gosling',
        validate: parseString,
    },
    {
        name: 'phone',
        label: 'Phone',
        placeholder: '+88005553535',
        validate: parsePhoneNumber,
    },
    {
        name: 'sms',
        label: 'SMS',
        placeholder: 'true',
        validate: parseBoolean,
    },
    {
        name: 'calls',
        label: 'Calls',
        placeholder: 'true',
        validate: parseBoolean,
    },
]

export const helpshiftCreateSlackChannelColumns: TextFieldPropsWithValidate[] = [
    {
        name: 'name',
        label: 'Name',
        placeholder: 'Slack Channel',
        validate: parseString,
    },
    {
        name: 'type',
        label: 'Type',
        placeholder: '1',
        validate: parseNumber,
    },
    {
        name: 'url',
        label: 'URL',
        placeholder: 'https://hooks.slack.com/services/...',
        validate: parseUrl,
    },
]