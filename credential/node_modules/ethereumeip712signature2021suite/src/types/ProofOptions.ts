import { TypedDataDomain, TypedDataField } from "ethers";


//@ts-ignore
import { purposes } from 'jsonld-signatures'

export interface CreateProofOptions {
    domain?: TypedDataDomain;
    types?: Record<string, TypedDataField[]>;
    primaryType?: string;
    readonly verificationMethod?: string;
    readonly date?: string | Date;
    readonly document: any;
    readonly purpose: purposes ;
    embed?: boolean;
    documentLoader?: Function;
    expansionMap?: Function;
  }
  

