// https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec/#types-generation


const { JCS } = require('jcs')
// add canonnicalize to JSON

// @ts-ignore
JSON.canonify = JCS.cannonicalize




class EIP712TypedData {
    private keys: Map<string, number> = new Map<string, number>()
    finalOutput: any = {}
    private BFS(input: any, type: string, finalOutput: any) {
        let out: any = []
        let queue = []
        queue.push(type)
        while (queue.length > 0) {

            let current = queue.shift()
            Object.keys(input).forEach((key, index) => {
                const type = typeof input[key]

                if (type == "object") {
                    if (Array.isArray(input[key])) {
                        const isString = input[key].length > 0 && input[key].every((value: any) => {
                            return typeof value == "string"
                        });

                        const isBool = input[key].length > 0 && input[key].every((value: any) => {
                            return typeof value == "boolean"
                        });

                        const isNumber = input[key].length > 0 && input[key].every((value: any) => {
                            return typeof value == "number"
                        });

                        if (isString) {
                            out.push({
                                name: key,
                                type: "string[]"
                            })
                        } else if (isBool) {
                            out.push({
                                name: key,
                                type: "bool[]"
                            })
                        } else if (isNumber) {
                            out.push({
                                name: key,
                                type: "uint256[]"
                            })

                        } else {

                            // throw new Error("Array of objects not supported")



                            let output = {}
                            out.push({
                                name: key,
                                type: key.charAt(0).toUpperCase() + key.slice(1) + "[]"
                            })
                            return this.generateTypes(input[key][0], key.charAt(0).toUpperCase() + key.slice(1))
                            // return this.BFS(input[key], key,output,key.charAt(0).toUpperCase() + key.slice(1))

                        }
                    } else {


                        out.push({
                            name: key,
                            type: key.charAt(0).toUpperCase() + key.slice(1)
                        })

                        this.BFS(input[key], key, finalOutput)
                    }

                }
                if (type == "string") {


                    out.push({
                        name: key,
                        type: "string"
                    })
                }
                if (type == "boolean") {
                    out.push({
                        name: key,
                        type: "bool"
                    })
                }
                if (type == "number") {
                    out.push({
                        name: key,
                        type: "uint256"
                    })
                }


            })
        }
        this.finalOutput[type.charAt(0).toUpperCase() + type.slice(1)] = out
    }

    public generateTypes(input: any, primaryType?: string) {


        if (primaryType == undefined) {
            primaryType = "Document"
        }
        // DFS is used to traverse graph dependencies but we need to explore first object properties first so we use BFS


        // Canonicalize the type names
        //@ts-ignore
        input = JSON.parse(JSON.canonify(input))
        let out: any = this.BFS(input, primaryType, this.finalOutput)
        this.finalOutput = this.finalOutput

        //@ts-ignore
        out = JSON.canonify(this.finalOutput)



        return JSON.parse(out)
    }

}



export { EIP712TypedData }
