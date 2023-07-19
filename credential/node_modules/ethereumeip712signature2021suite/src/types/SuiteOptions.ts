import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { EIP712SignatureOptions } from "./EIP712SignatureOptions";

export interface SignatureSuiteOptions {
  readonly signer?: TypedDataSigner;
  readonly proof?: any;
  readonly LDKeyClass?: any;
}



export interface SuiteVerifyOptions extends EIP712SignatureOptions {
  signature: string;
  verificationMethod: string;
}
