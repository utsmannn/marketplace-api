import { definable } from "./validator"

export class Path {
    private path: string
    private order: string = ''
    private equals: string | undefined = undefined
    private limitDown: number = 10
    private limitUp: number = 2

    constructor(path: string) {
        this.path = path
    }

    orderBy(order: string, equalTo?: string): Path {
        this.order = order
        this.equals = equalTo
        return this
    }

    raw(raw: string): string {
        return this.path + '.json' + raw
    }

    url(): string {
        var url = ""
        if (this.order === '' && (this.equals === '' || this.equals === undefined)) {
            url = this.path + '.json'
        } else {
            url = this.path + '.json?orderBy=' + `"${this.order}"` + '&equalTo=' + `"${this.equals}"`
        }
        return url
    }

    page(startAt?: string, limit?: number): string {
        definable.onDefined(limit, limit => {
            this.limitDown = limit
        })
        var url = ""
        if (this.order === '' && startAt === undefined) {
            url = this.path + '.json'
        } else if (startAt === undefined) {
            url = this.path + '.json?orderBy=' + `"${this.order}"` + '&limitToFirst=' + `${this.limitDown}`
        } else {
            url = this.path + '.json?orderBy=' + `"${this.order}"` + '&limitToFirst=' + `${this.limitDown}` + `&startAt="${startAt}"`
        }
        return url
    }
}