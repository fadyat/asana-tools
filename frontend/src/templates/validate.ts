/*
 Returns an object with two properties: value and err.
 Value can be returned only if err is undefined.

 Example:
 const {value, err} = parseNumber('123')
 value === 123, err === undefined

 const {value, err} = parseNumber('abc')
 value === undefined, err === 'Not a number'

 */
export type valueWithError<T> = {
    value?: T
    err: string
}

export type validationStatus = { [key: string]: string }

export type parser<T> = (value: string) => valueWithError<T>

export const parseString: parser<string> = (value: string): valueWithError<string> => {
    if (value.length === 0) return {err: 'Empty string is not allowed'}

    return {value: value, err: ''}
}

export const parsePhoneNumber: parser<string> = (value: string): valueWithError<string> => {
    if (value.length === 0) return {err: 'Empty string is not allowed'}

    const phoneRegex = /^\+?[1-9]\d{8,14}$/
    return phoneRegex.test(value) ? {value: value, err: ''} : {err: 'Not a valid phone number'}
}

export const parseBoolean: parser<boolean> = (value: string): valueWithError<boolean> => {
    const v = `${value}`.toLowerCase()

    if (v === 'true') return {value: true, err: ''}
    if (v === 'false') return {value: false, err: ''}

    return {err: 'true/false expected'}
}

export const parseUrl: parser<string> = (value: string): valueWithError<string> => {
    try {
        new URL(value)
        return {value: value, err: ''}
    } catch (_) {
        return {err: 'Not a valid URL'}
    }
}

export const parseNumber: parser<number> = (value: string): valueWithError<number> => {
    if (value === '') {
        return {err: `\`${value}\` is not a number`}
    }

    const numberRegex = /^-?\d+\.?\d*$/
    if (!numberRegex.test(value)) {
        return {err: `\`${value}\` is not a number`}
    }

    return {value: Number(value), err: ''}
}

export const parseMoreThanZeroNumber: parser<number> = (value: string): valueWithError<number> => {
    const {value: parsed, err} = parseNumber(value)
    if (err !== '') {
        return {err: err}
    }

    if (parsed! <= 0) {
        return {err: 'Value must be more than 0'}
    }

    return {value: parsed!, err: ''}
}

export const parseArrayOfNumbers: parser<number[]> = (value: string): valueWithError<number[]> => {
    value = value.toString()
    if (value === '') {
        return {err: 'Empty array is not allowed'}
    }

    const parsed = value.split(',').map((v) => parseNumber(v))
    const notANumbers = parsed.filter((v) => v.err !== '').map((v) => v.err)

    const errMsg = notANumbers.join(', ')
    return errMsg ? {err: errMsg} :
        {value: parsed.map((v) => v.value!), err: ''}
}

export const parseTimeString: parser<string> = (value: string): valueWithError<string> => {
    const dateRegex = /^\d{2}:\d{2}:\d{2}$/

    if (!dateRegex.test(value)) {
        return {err: 'Not a valid date'}
    }

    return {value: value, err: ''}
}