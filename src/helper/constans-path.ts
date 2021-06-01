export class Path {
    private path: string
    private order: string = ''
    private equals: string = ''

    constructor(path: string) {
        this.path = path
    }

    orderBy(order: string, equalTo: string): Path {
        this.order = order
        this.equals = equalTo
        return this
    }

    url(): string {
        var url = ""
        if (this.order === '' && this.equals === '') {
            url = this.path + '.json'
        } else {
            url = this.path + '.json?orderBy=' + `"${this.order}"` + '&equalTo=' +`"${this.equals}"`
        }
        return url
    }
}