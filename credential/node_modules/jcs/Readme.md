![Build](https://github.com/hypersign-protocol/JCS/workflows/Build/badge.svg)


# JSON Canonicalization Scheme (JCS)  [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785)

Canonicalization is the process of converting data that has more than one possible representation into a "standard" canonical representation.  This can be done to compare different representations for equivalence, to count the number of distinct data structures, to improve the efficiency of various algorithms by eliminating repeated calculations, or to make it possible to impose a meaningful sorting order.

### JCS (RFC 8785) :
Cryptographic operations like hashing and signing depend on that the target data does not change during serialization, transport, or parsing. By applying JCS, the data can be canonicalized before the cryptographic operation is performed. This ensures that the data is not changed during the cryptographic operation.


### Sample Code  1

```Javascript

const JCS = require('jcs');
const jsondata=[
  56,
  {
    "d": true,
    "10": null,
    "1": [ ]
  }
]

JSON.canonify=JCS.cannonicalize;

const cannonicalized=JSON.canonify(jsondata);

console.log(cannonicalized);

```

### Output

```bash
[56,{"1":[],"10":null,"d":true}]
```





### Sample Code  2

```Javascript



const JCS = require('jcs');

const jsondata=[
  56,
  {
    "d": true,
    "10": null,
    "1": [ ]
  }
]

const jcsObj=new JCS(jsondata);

const cannonicalized=jcsObj.cannonicalize();

console.log(cannonicalized);

```

### Output

```bash
[56,{"1":[],"10":null,"d":true}]
```



