import { TypedDataField } from "@ethersproject/abstract-signer";

export interface VerifyProofOptions {
  domain?: any;
  types?: Record<string, TypedDataField[]> | string;
  readonly proof: any;
  readonly document: any;
  readonly purpose: any;
  documentLoader?: Function;
  expansionMap?: Function;
  primaryType?: string;
}


export interface VerifyProofResult {
  verified: boolean;
  results?:Array<{
    proof: any,
    verified: boolean
    verficationMethod: any,
    purposeResult: any,



  }>,

  error?: any;
}