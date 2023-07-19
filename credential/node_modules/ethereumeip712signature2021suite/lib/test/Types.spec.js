"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Eip712Types_1 = require("../src/TypedData/Eip712Types");
const typeVector1 = {
    "@context": ["https://schema.org", "https://w3id.org/security/v2"],
    "@type": "Person",
    "otherData": {
        "jobTitle": "Professor",
        "school": "University of ExampleLand"
    },
    "telephone": "(425) 123-4567",
    "email": "jane.doe@example.com",
    "name": {
        "first": "Jane",
        "last": "Doe"
    }
};
const typeOut1 = {
    "Document": [
        { "name": "@context", type: "string[]" },
        { "name": "@type", type: "string" },
        { "name": "email", type: "string" },
        { "name": "name", type: "Name" },
        { "name": "otherData", type: "OtherData" },
        { "name": "telephone", type: "string" }
    ],
    "Name": [
        { "name": "first", type: "string" },
        { "name": "last", type: "string" }
    ],
    "OtherData": [
        { "name": "jobTitle", type: "string" },
        { "name": "school", type: "string" }
    ]
};
const typeVector2 = {
    contents: 'Hello, Bob!',
    attachedMoneyInEth: 4.2,
    from: {
        name: 'Cow',
        wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
        ],
    },
    to: [
        {
            name: 'Bob',
            wallets: [
                '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
        },
    ],
};
const typeOut2 = {
    "From": [
        {
            "name": "name",
            "type": "string"
        },
        {
            "name": "wallets",
            "type": "string[]"
        }
    ],
    "Mail": [
        {
            "name": "attachedMoneyInEth",
            "type": "uint256"
        },
        {
            "name": "contents",
            "type": "string"
        },
        {
            "name": "from",
            "type": "From"
        },
        {
            "name": "to",
            "type": "To[]"
        }
    ],
    "To": [
        {
            "name": "name",
            "type": "string"
        },
        {
            "name": "wallets",
            "type": "string[]"
        }
    ]
};
describe('Types', () => {
    it('Should be able to generate a Types EIP712', () => {
        const types = new Eip712Types_1.EIP712TypedData().generateTypes(typeVector1, "Document");
        assert_1.default.deepStrictEqual(types, typeOut1);
    });
    //  https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec/#types-generation   WARNING: The current algorithm definition does not support auto generating types for arrays of structs. We need to work on that. 
    // But this implementation does support it.
    it('Should be able to generate a Types EIP712 Array of Struct', () => {
        const types = new Eip712Types_1.EIP712TypedData().generateTypes(typeVector2, "Mail");
        assert_1.default.deepStrictEqual(types, typeOut2);
    });
});
