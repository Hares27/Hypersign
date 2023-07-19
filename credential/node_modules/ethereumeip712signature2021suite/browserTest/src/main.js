
import { purposes } from 'jsonld-signatures'
import { EthereumEip712Signature2021 } from 'ethereumeip712signature2021suite';

const Web3 = require("web3");
const ethEnabled = async () => {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    window.web3 = new Web3(window.ethereum);
    return true;
  }
  return false;
}
const vector1 = {
  "inputDocument": {
    "@context": ["https://schema.org", "https://w3id.org/security/v2"],
    "@type": "Person",
    "firstName": "Jane",
    "lastName": "Does",
    "jobTitle": "Professor",
    "telephone": "(425) 123-4567",
    "email": "jane.doe@example.com"
  },
  "inputOptions": {
    "date": "2021-08-30T13:28:02Z",
    "verificationMethod": "did:hid:testnet:0xd234956e0d196effafb0169cb2822b0c89d0fff3#key-1",
    "domain": {
      "name": "Test"
    }
  },
  "proof": {
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
            "name": "email",
            "type": "string"
          },
          {
            "name": "firstName",
            "type": "string"
          },
          {
            "name": "jobTitle",
            "type": "string"
          },
          {
            "name": "lastName",
            "type": "string"
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
}

const customDocLoader = (url) => {
  //@ts-ignore
  const context = documents[url];

  if (context) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: context, // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  }

  throw new Error(
    `Error attempted to load document remotely, please cache '${url}'`
  );
};

document.getElementById("initiate").addEventListener("click", async () => {
  await ethEnabled()

  const ethereumeip712signature2021suite = new EthereumEip712Signature2021({}, window.web3)
  const proof = await ethereumeip712signature2021suite.createProof({
    document: vector1.inputDocument,
    purpose: new purposes.AssertionProofPurpose(),
    verificationMethod: vector1.inputOptions.verificationMethod,
    date: vector1.inputOptions.date,
    domain: vector1.inputOptions.domain,
    documentLoader: customDocLoader,


  })
  document.getElementById('proof').innerHTML = JSON.stringify(proof, null, 2)


console.log(proof)
  const verificationResult = await ethereumeip712signature2021suite.verifyProof({
    proof: proof,
    document: vector1.inputDocument,
    types: proof.eip712.types,
    domain: proof.eip712.domain,
    purpose: new purposes.AssertionProofPurpose(),
    documentLoader: customDocLoader,
  });
  console.log(verificationResult);
  document.getElementById('verificationResult').innerHTML = JSON.stringify(verificationResult, null, 2)


})