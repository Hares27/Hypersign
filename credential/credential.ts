import express from 'express';
import { HypersignDID,HypersignSchema,HypersignVerifiableCredential} from 'hs-ssi-sdk';
import { createWallet,mnemonic } from './config';
const app = express();
const port = 3000;

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));

const hypersignDID = new HypersignDID();

let kp;


app.get('/', (req, res) => {
  res.render("index");
});
app.get("/generatekeys",async(req,res)=>
{
    kp = await hypersignDID.generateKeys({});
    res.render("home",{kp});

})

const signDocumentation=async(privateKeyMultibase,didDocument,verificationMethodId,id)=>{
  const params = {
    privateKeyMultibase: privateKeyMultibase,
    challenge: '1231231231',
    domain: 'www.hypersign.id',
    did: id,
    didDocument: didDocument,
    verificationMethodId: verificationMethodId,
  };
  
  const signedDocument = await hypersignDID.sign(params);
  
}

app.get("/generateDocumentation",(req,res)=>
{
    res.render("generateDocumentation");
})
let didDocument;
app.post("/generateDocumentation",async(req,res)=>
{
     didDocument = await hypersignDID.generate({ publicKeyMultibase:req.body.publicKeyMultibase });
    console.log(didDocument);
    
    res.render("didDocument",{didDocument:didDocument});
   
});
app.get("/signDocumentation",(req,res)=>
{
  res.render("signDocumentation");
})
app.post("/signDocumentation",async(req,res)=>
{
  await signDocumentation(req.body.privateKeyMultibase,JSON.parse(JSON.stringify(didDocument)),req.body.verificationMethodId,req.body.id);
})



// on chain
let offlineSigner;
let hypersignSchema;
(async function(){
    offlineSigner = await createWallet(mnemonic);
     hypersignSchema = new HypersignSchema({
      offlineSigner,                    
      nodeRestEndpoint: 'https://api.jagrat.hypersign.id', 
      nodeRpcEndpoint: 'https://rpc.jagrat.hypersign.id',   
      namespace: 'testnet',   
    });
    await hypersignSchema.init();

})();
 
const generateSchema=async(author)=>
{
  const schemaBody = {
    name: 'testSchema',
    description: 'This is a test schema generation',
    author: author,
    fields: [{ name: 'name', type: 'string', isRequired: false }],
    additionalProperties: false,
  }
  const schema = await hypersignSchema.generate(schemaBody);
  return schema;
}

const signSchema=async(privateKeyMultibase,schema,verificationMethodId)=>
{
  const signedSchema = await hypersignSchema.sign({ privateKeyMultibase: privateKeyMultibase, schema: schema, verificationMethodId: verificationMethodId });
   return signedSchema;
}

app.get("/generateSchema",(req,res)=>
{
  res.render("generateSchema");

});

app.post("/generateSchema",async(req,res)=>
{
  const schema=await generateSchema(req.body.author);
  const signedSchema=await signSchema(req.body.privateKeyMultibase,schema,req.body.verificationMethodId);
  const registeredSchema = await hypersignSchema.register({
    schema: signedSchema
});
  res.send(registeredSchema);
});



// Verifiable crdential

let hypersignVC;

(async function(){
  offlineSigner = await createWallet(mnemonic);
   hypersignVC = new HypersignVerifiableCredential({
    offlineSigner, 
    nodeRestEndpoint: 'https://api.jagrat.hypersign.id', 
    nodeRpcEndpoint: 'https://rpc.jagrat.hypersign.id', 
    namespace: 'testnet', 
  });
  await hypersignVC.init();
})();

 

const generateVerifiableCredential=async()=>
{
  const credentialBody = {
    schemaId: 'sch:hid:testnet:zBYQgcT4gUaFZ9CDb8W3hitfZTpZ1XkXuUyyFwAJne5HQ:1.0',
    subjectDid: 'did:hid:testnet:zHsDWbJFbg96KvTsiyPkQGAx2ANs6bFn1SPnwCmHTxrAi',
    issuerDid: 'did:hid:testnet:zHsDWbJFbg96KvTsiyPkQGAx2ANs6bFn1SPnwCmHTxrAi',
    fields: { name: 'Arjun' },
    expirationDate: '2027-12-10T18:30:00.000Z',
  };
  const credential = await hypersignVC.generate(credentialBody);
  return credential;
};

const issueCredentials=async(credential)=>
{
  const tempIssueCredentialBody = {
    credential, 
    issuerDid: 'did:hid:testnet:zJ4aCsFKNtk2Ph4GzCiiqDDs2aAbDLbnRcRCrvjJWMq3X',
    verificationMethodId: 'did:hid:testnet:zJ4aCsFKNtk2Ph4GzCiiqDDs2aAbDLbnRcRCrvjJWMq3X#key-1',
    privateKeyMultibase: 'zrv4EUum4pk24tpCmWewukQeJXYKy47kiEt7Xqd9mofaXfYk6yF4XwEgynHxzNFhaMV4PVhm6g66ahpGrpT8eD8cVbP',
  };
  
  const issuedCredResult = await hypersignVC.issue(tempIssueCredentialBody);
  const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } =
    issuedCredResult;

    return issuedCredResult;
};


// const verifyingyCredentials=async(signedCredential,didDocId,verificationMethodId)=>
// {
//   const params = {
//     credential: signedCredential,
//     issuerDid: didDocId,
//     verificationMethodId,
//   };
//   const verificationResult = await hypersignVC.verify(params);
// }





app.get("/generateVerifiableCredential",async(req,res)=>
{
  const credentials=await generateVerifiableCredential();
  
  res.render("generateVerifiableCredential",{credentials});
});

app.post("/issuecredential",async(req,res)=>
{
  const issuedCredResult=await issueCredentials(req.body.credential);
  res.send(issuedCredResult);
})

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});