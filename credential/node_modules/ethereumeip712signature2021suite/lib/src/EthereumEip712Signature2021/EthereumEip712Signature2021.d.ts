import Web3 from "web3";
declare const suites: any;
import { SignatureSuiteOptions, SuiteVerifyOptions } from "../types/SuiteOptions";
import { CreateProofOptions } from "../types/ProofOptions";
import { SuiteSignOptions } from "../types/SuiteSignType";
import { VerifyProofOptions, VerifyProofResult } from "../types/VerifyProofOptions";
declare class EthereumEip712Signature2021 extends suites.LinkedDataSignature {
    index: number;
    web3: Web3;
    wallet: any;
    account: any;
    mnemonic: string;
    proof: Record<string, any>;
    LDKeyClass: any;
    signer: any;
    proofSignatureKey: string;
    constructor(options: SignatureSuiteOptions, web3?: Web3);
    getMnemonic(): string;
    generateKeyPair(seed?: string): Promise<{
        publicKey: string;
        privateKey: string;
        address: string;
    }>;
    fromPrivateKey(privateKey: string): {
        address: string;
        privateKey: string;
    };
    switchAccount(index: number): Promise<{
        publicKey: string;
        privateKey: string;
        address: string;
    }>;
    toJWK(): Error;
    canonicalizationHash(message: object): Promise<string>;
    createProof(options: CreateProofOptions): Promise<any>;
    verifyProof(options: VerifyProofOptions): Promise<VerifyProofResult>;
    canonize(input: any): Record<string, any>;
    canonizeProof(proof: any): Record<string, any>;
    createVerifyData(options: {
        document: any;
        proof: any;
    }): Promise<Record<string, any>[]>;
    getVerificationMethod(proof: any): string;
    sign(options: SuiteSignOptions): Promise<Record<string, any>>;
    verifySignature(options: SuiteVerifyOptions): boolean;
    extractAddressFromDID(did: string): string;
    getSignFromMetamask(method: string, params: any[], provider: any): Promise<unknown>;
}
export default EthereumEip712Signature2021;
//# sourceMappingURL=EthereumEip712Signature2021.d.ts.map