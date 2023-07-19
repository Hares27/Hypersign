"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const web3_1 = __importDefault(require("web3"));
const { suites } = require('jsonld-signatures');
//@ts-ignore
const jsonld_1 = __importDefault(require("jsonld"));
const crypto_1 = __importDefault(require("crypto"));
const nodeDocumentLoader = jsonld_1.default.documentLoader;
const ethers_1 = require("ethers");
const bip39 = __importStar(require("bip39"));
const utils_1 = require("../utils");
const Eip712Types_1 = require("../TypedData/Eip712Types");
const v1_1 = require("../Context/v1");
const eth_sig_util_1 = require("eth-sig-util");
const docloader = (url, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (url in v1_1.CONTEXTS) {
        return {
            contextUrl: null,
            document: v1_1.CONTEXTS[url],
            documentUrl: url // this is the actual context URL after redirects
        };
    }
    // call the default documentLoader
    return nodeDocumentLoader(url);
});
const { JCS } = require('jcs');
// @ts-ignore
JSON.canonify = JCS.cannonicalize;
class EthereumEip712Signature2021 extends suites.LinkedDataSignature {
    constructor(options, web3) {
        // web3 send web3 wrapper arround webwallet
        super({ type: "EthereumEip712Signature2021" });
        this.index = 0;
        this.mnemonic = "";
        if (web3) {
            this.web3 = web3;
        }
        else {
            this.web3 = new web3_1.default();
        }
        const { signer, LDKeyClass } = options;
        this.proof = {
            type: "EthereumEip712Signature2021",
        };
        this.LDKeyClass = LDKeyClass;
        if (signer) {
            this.signer = signer;
        }
        this.proofSignatureKey = "proofValue";
    }
    getMnemonic() {
        if (this.mnemonic === "") {
            throw new Error("Mnemonic is not set");
        }
        return this.mnemonic;
    }
    generateKeyPair(seed) {
        return __awaiter(this, void 0, void 0, function* () {
            if (seed) {
                this.mnemonic = seed;
            }
            else {
                // @ts-ignore
                this.mnemonic = yield bip39.generateMnemonic(256, crypto_1.default.randomBytes);
            }
            const mnemonic = yield ethers_1.Mnemonic.fromPhrase(this.mnemonic);
            const wallet = yield ethers_1.HDNodeWallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${this.index}`);
            this.wallet = wallet;
            const account = yield this.web3.eth.accounts.privateKeyToAccount(wallet.privateKey);
            this.account = account;
            this.signer = wallet;
            return {
                publicKey: wallet.publicKey,
                privateKey: wallet.privateKey,
                address: account.address
            };
        });
    }
    fromPrivateKey(privateKey) {
        const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        this.account = account;
        this.signer = new ethers_1.BaseWallet(new ethers_1.SigningKey(privateKey));
        this.wallet = this.signer;
        return {
            address: account.address,
            privateKey: privateKey,
        };
    }
    switchAccount(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const mnemonic = yield ethers_1.Mnemonic.fromPhrase(this.getMnemonic());
            const wallet = yield ethers_1.HDNodeWallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${index}`);
            this.wallet = wallet;
            const account = yield this.web3.eth.accounts.privateKeyToAccount(wallet.privateKey);
            this.account = account;
            return {
                publicKey: wallet.publicKey,
                privateKey: wallet.privateKey,
                address: account.address
            };
        });
    }
    toJWK() {
        return new Error("Not Implemented");
    }
    canonicalizationHash(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const c14nDocument = yield jsonld_1.default.canonize(message, {
                algorithm: "URDNA2015",
                format: "application/n-quads",
                useNative: false,
                documentLoader: docloader
            });
            const sha256 = crypto_1.default.createHash('sha256');
            let hash = sha256.update(c14nDocument);
            return hash.digest('hex');
        });
    }
    createProof(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let proof = {
                type: this.type,
            };
            let embed = options.embed ? options.embed : true;
            if (options.verificationMethod !== undefined && typeof options.verificationMethod !== "string") {
                throw TypeError(`"verificationMethod" must be a URI string`);
            }
            let date = options.date ? new Date(options.date).getTime() : undefined;
            if (date === undefined) {
                date = Date.now();
            }
            if (date !== undefined && typeof date !== "string") {
                date = (0, utils_1.w3cDate)(date);
            }
            if (date !== undefined) {
                proof.created = date;
            }
            proof.verificationMethod = options.verificationMethod;
            proof = yield options.purpose.update(proof, {
                document: options.document,
                suite: this,
                documentLoader: options.documentLoader,
                expansionMap: options.expansionMap,
            });
            let domain = options.domain ? options.domain : {};
            const primaryType = (_a = options.primaryType) !== null && _a !== void 0 ? _a : "Document";
            const eip712TypedData = new Eip712Types_1.EIP712TypedData();
            let types = options.types ? options.types : eip712TypedData.generateTypes(options.document, primaryType);
            const toBeSignedDocument = {
                types,
                domain,
                primaryType,
                message: options.document,
            };
            proof.canonicalizationHash = yield this.canonicalizationHash(toBeSignedDocument.message);
            const [canonizeProof, canonizeDocument] = yield this.createVerifyData({ document: toBeSignedDocument, proof });
            let signOptions = {
                proof: canonizeProof,
                verifyData: canonizeDocument,
                embed: embed,
            };
            proof = yield this.sign(signOptions);
            return proof;
        });
    }
    verifyProof(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { proof, document } = options;
            let domain = options.domain ? options.domain : {};
            const primaryType = (_a = options.primaryType) !== null && _a !== void 0 ? _a : "Document";
            const eip712TypedData = new Eip712Types_1.EIP712TypedData();
            let types = options.types ? options.types : eip712TypedData.generateTypes(options.document, primaryType);
            if (typeof types === "string") {
                if (options.documentLoader === undefined) {
                    throw new Error("documentLoader must be defined for remote types");
                }
                types = yield options.documentLoader(types).document;
            }
            const toBeVerifiedDocument = {
                types: types,
                domain,
                primaryType: "Document",
                message: document,
            };
            try {
                const [canonizeProof, canonizeDocument] = yield this.createVerifyData({
                    proof,
                    document: toBeVerifiedDocument,
                });
                const vm = this.getVerificationMethod(canonizeProof);
                const canonicalizationHashVerified = proof.canonicalizationHash ? (yield this.canonicalizationHash(document)) === proof.canonicalizationHash : null;
                const verified = this.verifySignature({
                    signature: proof[this.proofSignatureKey],
                    verificationMethod: vm,
                    domain: canonizeDocument.domain,
                    types: canonizeDocument.types,
                    message: canonizeDocument.message,
                    primaryType: canonizeDocument.primaryType,
                });
                if (!verified) {
                    throw Error(`Invalid signature`);
                }
                const purposeResult = (yield options.purpose.validate(canonizeProof, {
                    verificationMethod: {
                        id: vm,
                    },
                    documentLoader: options.documentLoader
                }));
                if (!purposeResult.valid) {
                    throw Error(purposeResult);
                }
                const returnObj = {
                    verified: true,
                    results: [
                        {
                            proof,
                            verified,
                            verficationMethod: vm,
                            purposeResult: { valid: purposeResult.valid },
                        }
                    ],
                    statusResult: {
                        canonicalizationHashVerified,
                        signatureVerified: verified,
                    }
                };
                if (proof.canonicalizationHash && canonicalizationHashVerified === false) {
                    throw Error(`Invalid canonicalizationHash`);
                }
                return returnObj;
            }
            catch (error) {
                return { verified: false,
                    error: error };
            }
        });
    }
    canonize(input) {
        // @ts-ignore
        return JSON.parse(JSON.canonify(input));
    }
    canonizeProof(proof) {
        proof = Object.assign({}, proof);
        delete proof[this.proofSignatureKey];
        return this.canonize(proof);
    }
    createVerifyData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { proof, document } = options;
            // JCS   RFC 8785
            const canonizeProof = this.canonizeProof(proof);
            const canonizeDocument = this.canonize(document);
            return [canonizeProof, canonizeDocument];
        });
    }
    getVerificationMethod(proof) {
        let verificationMethod = proof.verificationMethod;
        if (typeof verificationMethod === "object") {
            verificationMethod = verificationMethod.id;
        }
        if (!verificationMethod) {
            throw new Error('No "verificationMethod" found in proof.');
        }
        // TODO: resolve DID to check if DID belongs to the controller of the proof or the status of the DID
        return verificationMethod;
    }
    sign(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { verifyData, proof } = options;
            let proofValue;
            //@ts-ignore
            if (this.web3._provider !== undefined && this.web3._provider !== null) {
                //@ts-ignore
                const from = yield this.web3._provider.selectedAddress;
                const params = [from, JSON.stringify(verifyData)];
                const method = 'eth_signTypedData_v4';
                //@ts-ignore
                proofValue = yield this.getSignFromMetamask(method, params, this.web3._provider);
            }
            else if (!this.signer) {
                throw new Error("A Web3 Signer API has not been specified");
            }
            else {
                {
                    //@ts-ignore
                    proofValue = yield (0, eth_sig_util_1.signTypedData_v4)(Buffer.from(this.wallet.privateKey.replace('0x', ''), 'hex'), { data: verifyData });
                }
            }
            proof[this.proofSignatureKey] = proofValue;
            if (options.embed) {
                proof["eip712"] = {
                    domain: options.verifyData.domain,
                    types: options.verifyData.types,
                    primaryType: options.verifyData.primaryType,
                };
            }
            return proof;
        });
    }
    verifySignature(options) {
        const recoveredAddress = (0, eth_sig_util_1.recoverTypedSignature_v4)({
            //@ts-ignore
            data: {
                domain: options.domain,
                message: options.message,
                types: options.types,
                primaryType: options.primaryType,
            }, sig: options.signature
        });
        // TODO: add DID resolver (did-resolver)
        if (recoveredAddress.toLowerCase() ===
            this.extractAddressFromDID(options.verificationMethod).toLowerCase()) {
            return true;
        }
        return false;
    }
    extractAddressFromDID(did) {
        const didParts = did.split(":");
        // last elem of array
        let address = didParts[didParts.length - 1];
        address = address.split("#")[0];
        return address.toLocaleLowerCase();
    }
    getSignFromMetamask(method, params, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                provider.sendAsync({
                    method,
                    params,
                    from: provider.selectedAddress,
                }, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result.result);
                    }
                });
            });
        });
    }
}
exports.default = EthereumEip712Signature2021;
//mesh short coral rescue height arrive bitter improve lift mystery point invite
