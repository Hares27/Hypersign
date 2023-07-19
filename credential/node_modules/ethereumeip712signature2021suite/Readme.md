
![Build](https://github.com/hypersign-protocol/EthereumEip712Signature2021Suite/workflows/Build/badge.svg)
# EthereumEip712Signature2021Suite 
### Supports only the `eth_signTypedData_v4` signature method.



## Install

```bash
npm i https://github.com/hypersign-protocol/EthereumEip712Signature2021Suite.git
```

## Usage

```js
import {EthereumEip712Signature2021Suite} from 'EthereumEip712Signature2021Suite';
import { purposes } from 'jsonld-signatures'

// can pass baseWallet from ethers
// new EthereumEip712Signature2021Suite(baseWalletObj);
// or can use metamask object
// var web3=new Web3(window.ethereum);
// new EthereumEip712Signature2021Suite({},web3);
const suite = new EthereumEip712Signature2021Suite({});

const kp=await EthereumEip712Signature2021obj.fromPrivateKey('0x149195a4059ac8cafe2d56fc612f613b6b18b9265a73143c9f6d7cfbbed76b7e');



const customDocLoader = (url: string): any => {
  //@ts-ignore
  const context = documents[url];

  if (context) {
    return {
      contextUrl: null, 
      document: context, 
      documentUrl: url, 
    };
  }

    return jsonld.documentLoaders.node()(url);
    // jsonld version : 3.1.1 
};

const inputData={
    "@context": ["https://schema.org", "https://w3id.org/security/v2"],
    "@type": "Person",
    "data": {
      "name": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "job": {
        "jobTitle": "Professor",
        "employer": "University of Waterloo"
      }
    },
    "telephone": "(425) 123-4567"
  }

 const inputOptions={
    "date": "2021-08-30T13:28:02Z",
    "verificationMethod": "did:hid:testnet:0xAED7EA8035eEc47E657B34eF5D020c7005487443#key-1",
    "domain": {
      "name": "Test"
    }
 }



const proof = await EthereumEip712Signature2021obj.createProof({
      document: inputData,
      purpose: new purposes.AssertionProofPurpose(),
      verificationMethod: vector1.inputOptions.verificationMethod,
      date: inputOptions.date,
      domain: inputOptions.domain,
      documentLoader: customDocLoader,


    })

 const result = await EthereumEip712Signature2021obj.verifyProof({
      proof,
      document: inputData,
      types: proof.eip712.types,
      domain: proof.eip712.domain,
      purpose: new purposes.AssertionProofPurpose(),
      documentLoader: customDocLoader,
    })   

```


```bash
"proof": {
    "canonicalizationHash": "5c78f22ed4f5617ed2cfe8feec7a14ec9d23e7fa28ffc70291d141de169844f7",
    "created": "2021-08-30T13:28:02Z",
    "proofPurpose": "assertionMethod",
    "type": "EthereumEip712Signature2021",
    "verificationMethod": "did:hid:testnet:0xAED7EA8035eEc47E657B34eF5D020c7005487443#key-1",
    "proofValue": "0xd8ced27b921866a9cb6fb859503714ad4be03ae70706237d05c9f113da7f4a1d7f74f9f9df4301571f5c4f253c09e1b5119a85f00760f33924d72a07d31881ec1b",
    "eip712": {
      "domain": {
        "name": "Test"
      },
      "types": {
        "Data": [
          {
            "name": "job",
            "type": "Job"
          },
          {
            "name": "name",
            "type": "Name"
          }
        ],
        "Job": [
          {
            "name": "employer",
            "type": "string"
          },
          {
            "name": "jobTitle",
            "type": "string"
          }
        ],
        "Name": [
          {
            "name": "firstName",
            "type": "string"
          },
          {
            "name": "lastName",
            "type": "string"
          }
        ],
        "Document": [
          {
            "name": "@context",
            "type": "string[]"
          },
          {
            "name": "@type",
            "type": "string"
          },
          {
            "name": "data",
            "type": "Data"
          },
          {
            "name": "telephone",
            "type": "string"
          }
        ]
      },
      "primaryType": "Document"
    }
  }
```
## License
[MIT License](LICENSE) © Hypersign-Protocol














