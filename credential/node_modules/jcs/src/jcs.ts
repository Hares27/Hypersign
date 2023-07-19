
// JSON Canonicalization Scheme  (JCS)  (RFC 8785)
// https://tools.ietf.org/html/rfc8785
 class JCS{
    private buffer: string = '';
    constructor(object: any){
        this.serialize(object);
    }


    private serialize(object:any) {
        if (object === null || typeof object !== 'object' ||
            object.toJSON != null) {
            this.buffer += JSON.stringify(object);

        } else if (Array.isArray(object)) {
            this.buffer += '[';
            let next = false;
            object.forEach((element) => {
                if (next) {
                    this.buffer += ',';
                }
                next = true;
                this.serialize(element);
            });
            this.buffer += ']';

        } else {
            this.buffer += '{';
            let next = false;
            Object.keys(object).sort().forEach((property) => {
                if (next) {
                    this.buffer += ',';
                }
                next = true;
                this.buffer += JSON.stringify(property);
                this.buffer += ':';
                this.serialize(object[property]);
            });
            this.buffer += '}';
        }
    }

    public cannonicalize(): string{
        return this.buffer;
    }


    public static cannonicalize(object: any): string{
        return new JCS(object).cannonicalize();
    }


    // other schemes related to JCS if added to rfc8785 will be added here

}


export default JCS;