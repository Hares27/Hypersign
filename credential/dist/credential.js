"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hs_ssi_sdk_1 = require("hs-ssi-sdk");
const config_1 = require("./config");
const app = (0, express_1.default)();
const port = 3000;
app.set("view engine", "ejs");
app.use(express_1.default.urlencoded({ extended: true }));
const hypersignDID = new hs_ssi_sdk_1.HypersignDID();
let kp;
app.get('/', (req, res) => {
    res.render("index");
});
app.get("/generatekeys", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    kp = yield hypersignDID.generateKeys({});
    res.render("home", { kp });
}));
const signDocumentation = (privateKeyMultibase, didDocument, verificationMethodId, id) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        privateKeyMultibase: privateKeyMultibase,
        challenge: '1231231231',
        domain: 'www.hypersign.id',
        did: id,
        didDocument: didDocument,
        verificationMethodId: verificationMethodId,
    };
    const signedDocument = yield hypersignDID.sign(params);
});
app.get("/generateDocumentation", (req, res) => {
    res.render("generateDocumentation");
});
let didDocument;
app.post("/generateDocumentation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    didDocument = yield hypersignDID.generate({ publicKeyMultibase: req.body.publicKeyMultibase });
    console.log(didDocument);
    res.render("didDocument", { didDocument: didDocument });
}));
app.get("/signDocumentation", (req, res) => {
    res.render("signDocumentation");
});
app.post("/signDocumentation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield signDocumentation(req.body.privateKeyMultibase, JSON.parse(JSON.stringify(didDocument)), req.body.verificationMethodId, req.body.id);
}));
// on chain
let offlineSigner;
let hypersignSchema;
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        offlineSigner = yield (0, config_1.createWallet)(config_1.mnemonic);
        hypersignSchema = new hs_ssi_sdk_1.HypersignSchema({
            offlineSigner,
            nodeRestEndpoint: 'https://api.jagrat.hypersign.id',
            nodeRpcEndpoint: 'https://rpc.jagrat.hypersign.id',
            namespace: 'testnet',
        });
        yield hypersignSchema.init();
    });
})();
const generateSchema = (author) => __awaiter(void 0, void 0, void 0, function* () {
    const schemaBody = {
        name: 'testSchema',
        description: 'This is a test schema generation',
        author: author,
        fields: [{ name: 'name', type: 'string', isRequired: false }],
        additionalProperties: false,
    };
    const schema = yield hypersignSchema.generate(schemaBody);
    return schema;
});
const signSchema = (privateKeyMultibase, schema, verificationMethodId) => __awaiter(void 0, void 0, void 0, function* () {
    const signedSchema = yield hypersignSchema.sign({ privateKeyMultibase: privateKeyMultibase, schema: schema, verificationMethodId: verificationMethodId });
    return signedSchema;
});
app.get("/generateSchema", (req, res) => {
    res.render("generateSchema");
});
app.post("/generateSchema", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = yield generateSchema(req.body.author);
    const signedSchema = yield signSchema(req.body.privateKeyMultibase, schema, req.body.verificationMethodId);
    const registeredSchema = yield hypersignSchema.register({
        schema: signedSchema
    });
    res.send(registeredSchema);
}));
// Verifiable crdential
let hypersignVC;
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        offlineSigner = yield (0, config_1.createWallet)(config_1.mnemonic);
        hypersignVC = new hs_ssi_sdk_1.HypersignVerifiableCredential({
            offlineSigner,
            nodeRestEndpoint: 'https://api.jagrat.hypersign.id',
            nodeRpcEndpoint: 'https://rpc.jagrat.hypersign.id',
            namespace: 'testnet',
        });
        yield hypersignVC.init();
    });
})();
const generateVerifiableCredential = () => __awaiter(void 0, void 0, void 0, function* () {
    const credentialBody = {
        schemaId: 'sch:hid:testnet:zBYQgcT4gUaFZ9CDb8W3hitfZTpZ1XkXuUyyFwAJne5HQ:1.0',
        subjectDid: 'did:hid:testnet:zHsDWbJFbg96KvTsiyPkQGAx2ANs6bFn1SPnwCmHTxrAi',
        issuerDid: 'did:hid:testnet:zHsDWbJFbg96KvTsiyPkQGAx2ANs6bFn1SPnwCmHTxrAi',
        fields: { name: 'Arjun' },
        expirationDate: '2027-12-10T18:30:00.000Z',
    };
    const credential = yield hypersignVC.generate(credentialBody);
    return credential;
});
const issueCredentials = (credential) => __awaiter(void 0, void 0, void 0, function* () {
    const tempIssueCredentialBody = {
        credential,
        issuerDid: 'did:hid:testnet:zJ4aCsFKNtk2Ph4GzCiiqDDs2aAbDLbnRcRCrvjJWMq3X',
        verificationMethodId: 'did:hid:testnet:zJ4aCsFKNtk2Ph4GzCiiqDDs2aAbDLbnRcRCrvjJWMq3X#key-1',
        privateKeyMultibase: 'zrv4EUum4pk24tpCmWewukQeJXYKy47kiEt7Xqd9mofaXfYk6yF4XwEgynHxzNFhaMV4PVhm6g66ahpGrpT8eD8cVbP',
    };
    const issuedCredResult = yield hypersignVC.issue(tempIssueCredentialBody);
    const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } = issuedCredResult;
    return issuedCredResult;
});
// const verifyingyCredentials=async(signedCredential,didDocId,verificationMethodId)=>
// {
//   const params = {
//     credential: signedCredential,
//     issuerDid: didDocId,
//     verificationMethodId,
//   };
//   const verificationResult = await hypersignVC.verify(params);
// }
app.get("/generateVerifiableCredential", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const credentials = yield generateVerifiableCredential();
    res.render("generateVerifiableCredential", { credentials });
}));
app.post("/issuecredential", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const issuedCredResult = yield issueCredentials(req.body.credential);
    res.send(issuedCredResult);
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=credential.js.map