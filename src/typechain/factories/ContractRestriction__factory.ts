/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  ContractRestriction,
  ContractRestrictionInterface,
} from "../ContractRestriction";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "address[]",
        name: "_contracts",
        type: "address[]",
      },
      {
        internalType: "bool[]",
        name: "_statuses",
        type: "bool[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "ContractWhiteListUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_contracts",
        type: "address[]",
      },
      {
        internalType: "bool[]",
        name: "_statuses",
        type: "bool[]",
      },
    ],
    name: "batchUpdateContractWhiteList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "txType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "from",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "to",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasPerPubdataByteLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymaster",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256[4]",
            name: "reserved",
            type: "uint256[4]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "factoryDeps",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "paymasterInput",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "reservedDynamic",
            type: "bytes",
          },
        ],
        internalType: "struct Transaction",
        name: "_transaction",
        type: "tuple",
      },
    ],
    name: "canPayForTransaction",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "contractWhitelist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_contractAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_status",
        type: "bool",
      },
    ],
    name: "updateContractWhiteList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x000c0000000000020000008003000039000000400030043f00000000030100190000006003300270000000f40330019700000001022001900000001f0000c13d000000040230008c000003920000413d000000000201043b000000e002200270000001020420009c0000002b0000213d000001080420009c0000015d0000213d0000010b0420009c000001a90000613d0000010c0220009c000003920000c13d0000000002000416000000000202004b000003920000c13d000000040230008a000000200220008c000003920000413d0000000401100370000000000101043b000000fa0210009c000003920000213d0000017b0000013d0000000002000416000000000202004b000003920000c13d000000f502300041000000f60220009c000000370000213d000001130100004100000000001004350000004101000039000000040010043f0000011401000041000003cb00010430000001030420009c000001880000213d000001060420009c000001bc0000613d000001070120009c000003920000c13d0000000001000416000000000101004b000003920000c13d000000000100041a000000fa01100197000001850000013d0000009f02300039000000f702200197000000400020043f0000001f0230018f0000000504300272000000460000613d00000000050000190000000506500210000000000761034f000000000707043b000000800660003900000000007604350000000105500039000000000645004b0000003e0000413d000000000502004b000000550000613d0000000504400210000000000141034f00000003022002100000008004400039000000000504043300000000052501cf000000000525022f000000000101043b0000010002200089000000000121022f00000000012101cf000000000151019f0000000000140435000000600130008c000003920000413d000000800500043d000000f80150009c000003920000213d00000080013000390000009f02500039000000000212004b000003920000813d00000080045000390000000002040433000000f80620009c000000250000213d0000003f06200039000000200a00008a0000000006a6016f000000400900043d0000000006690019000000000796004b00000000070000190000000107004039000000f80860009c000000250000213d0000000107700190000000250000c13d000000400060043f000000000b2904360000000005250019000000a005500039000000000515004b000003920000213d000000000502004b0000007e0000613d00000000050000190000000006b500190000002005500039000000000745001900000000070704330000000000760435000000000625004b000000770000413d00000000022b00190000000000020435000000a00200043d000000f80420009c000003920000213d0000001f04200039000000f905000041000000000634004b00000000060000190000000006058019000000f904400197000000000704004b0000000005008019000000f90440009c000000000506c019000000000405004b000003920000c13d00000080042000390000000004040433000000f80540009c000000250000213d00000005054002100000003f065000390000000006a6016f000000400700043d0000000006670019000900000007001d000000000776004b00000000070000190000000107004039000000f80860009c000000250000213d0000000107700190000000250000c13d000000400060043f00000009060000290000000006460436000800000006001d000000a0022000390000000005250019000000000615004b000003920000213d000000000404004b000000b10000613d00000008040000290000000026020434000000fa0760009c000003920000213d0000000004640436000000000652004b000000ab0000413d000000c00200043d000000f80420009c000003920000213d0000001f04200039000000f905000041000000000334004b00000000030000190000000003054019000000f904400197000000000604004b000000000500a019000000f90440009c000000000503c019000000000305004b000003920000613d00000080032000390000000003030433000000f80430009c000000250000213d00000005043002100000003f054000390000000005a5016f000000400600043d0000000005560019000700000006001d000000000665004b00000000060000190000000106004039000000f80750009c000000250000213d0000000106600190000000250000c13d000000400050043f00000007050000290000000005350436000600000005001d000000a0022000390000000004240019000000000114004b000003920000213d000000000103004b000000e50000613d00000006010000290000000023020434000000000503004b0000000005000019000000010500c039000000000553004b000003920000c13d0000000001310436000000000342004b000000dc0000413d000000000200041a000000fb012001970000000006000411000000000161019f000000000010041b000000f4010000410000000003000414000000f40430009c0000000003018019000000c001300210000000fc011001c7000000fa052001970000800d020000390000000303000039000000fd04000041000500000006001d000c00000009001d000b0000000a001d000a0000000b001d03c903bf0000040f0000000c030000290000000101200190000003920000613d0000000001030433000400000001001d000000f80110009c000000250000213d0000000101000039000300000001001d000000000101041a000000010210019000000001011002700000007f0310018f000000000301c019000200000003001d0000001f0130008c00000000010000190000000101002039000000010110018f000000000112004b000001b80000c13d0000000201000029000000200110008c0000012e0000413d00000003010000290000000000100435000000f4010000410000000002000414000000f40320009c0000000002018019000000c001200210000000fe011001c7000080100200003903c903c40000040f0000000102200190000003920000613d00000004030000290000001f023000390000000502200270000000200330008c0000000002004019000000000301043b00000002010000290000001f01100039000000050110027000000000011300190000000002230019000000000312004b0000012e0000813d000000000002041b0000000102200039000000000312004b0000012a0000413d00000004010000290000001f0110008c000003200000a13d00000003010000290000000000100435000000f4010000410000000002000414000000f40320009c0000000002018019000000c001200210000000fe011001c7000080100200003903c903c40000040f00000001022001900000000c060000290000000b02000029000003920000613d00000004032001800000002002000039000000000101043b0000014d0000613d0000002002000039000000000400001900000000056200190000000005050433000000000051041b000000200220003900000001011000390000002004400039000000000534004b000001450000413d000000040330006c000001590000813d00000004030000290000000303300210000000f80330018f000000010400008a000000000334022f000000000343013f0000000c022000290000000002020433000000000232016f000000000021041b0000000401000029000000010110021000000001011001bf0000032d0000013d000001090420009c000001f90000613d0000010a0220009c000003920000c13d0000000002000416000000000202004b000003920000c13d000000040330008a000000200230008c000003920000413d0000000402100370000000000202043b000000f80420009c000003920000213d0000000003230049000000f904000041000002600530008c00000000050000190000000005044019000000f903300197000000000603004b000000000400a019000000f90330009c000000000405c019000000000304004b000003920000c13d0000004402200039000000000121034f000000000101043b000000fa0110019700000000001004350000000201000039000000200010043f0000004002000039000000000100001903c903a90000040f000000000101041a000000ff011001900000000001000019000000010100c039000000800010043f0000011601000041000003ca0001042e000001040420009c0000020e0000613d000001050220009c000003920000c13d0000000002000416000000000202004b000003920000c13d000000040230008a000000200220008c000003920000413d0000000401100370000000000601043b000000fa0160009c000003920000213d000000000100041a000000fa021001970000000005000411000000000252004b000002c90000c13d000000000206004b0000030f0000c13d0000010d01000041000000800010043f0000002001000039000000840010043f0000002601000039000000a40010043f0000010e01000041000000c40010043f0000010f01000041000000e40010043f0000011001000041000003cb000104300000000001000416000000000101004b000003920000c13d0000000103000039000000000103041a000000010410019000000001051002700000007f0250018f000000000205c0190000001f0520008c00000000050000190000000105002039000000000551013f0000000105500190000002d20000613d000001130100004100000000001004350000002201000039000000280000013d0000000002000416000000000202004b000003920000c13d000000040230008a000000400220008c000003920000413d0000000402100370000000000302043b000000fa0230009c000003920000213d0000002401100370000000000401043b000000000104004b0000000001000019000000010100c039000000000114004b000003920000c13d000000000100041a000000fa011001970000000002000411000000000121004b000002c90000c13d00000000003004350000000201000039000000200010043f000000f4050000410000000001000414000000f40210009c0000000001058019000000c001100210000000ff011001c70000801002000039000c00000003001d000b00000004001d03c903c40000040f0000000b040000290000000c050000290000000102200190000003920000613d000000000101043b000000000201041a000001000300008a000000000232016f000000000242019f000000000021041b000000400100043d00000000004104350000000002000414000000f40320009c000000f4040000410000000002048019000000f40310009c00000000010480190000004001100210000000c002200210000000000112019f000000fe011001c70000800d02000039000000020300003900000100040000410000031b0000013d0000000001000416000000000101004b000003920000c13d000000000100041a000000fa021001970000000005000411000000000252004b000002c90000c13d000000fb01100197000000000010041b000000f4010000410000000002000414000000f40320009c0000000002018019000000c001200210000000fc011001c70000800d020000390000000303000039000000fd0400004100000000060000190000031b0000013d0000000002000416000000000202004b000003920000c13d000000040230008a000000400220008c000003920000413d0000000402100370000000000402043b000000f80240009c000003920000213d0000002302400039000000f905000041000000000632004b00000000060000190000000006058019000000f902200197000000000702004b0000000005008019000000f90220009c000000000506c019000000000205004b000003920000c13d0000000402400039000000000221034f000000000602043b000000f80260009c000000250000213d0000000505600210000000bf07500039000000200200008a000000000727016f000000f80870009c000000250000213d000000400070043f000000800060043f00000024044000390000000005450019000000000735004b000003920000213d000000000606004b000002400000613d000000a006000039000000000741034f000000000707043b000000fa0870009c000003920000213d00000000067604360000002004400039000000000754004b000002380000413d0000002404100370000000000404043b000000f80540009c000003920000213d0000002305400039000000f906000041000000000735004b00000000070000190000000007064019000000f905500197000000000805004b000000000600a019000000f90550009c000000000607c019000000000506004b000003920000613d0000000405400039000000000551034f000000000505043b000000f80650009c000000250000213d00000005065002100000003f07600039000000000227016f000000400700043d0000000002270019000900000007001d000000000772004b00000000070000190000000107004039000000f80820009c000000250000213d0000000107700190000000250000c13d000000400020043f00000009020000290000000002520436000800000002001d00000024024000390000000004260019000000000334004b000003920000213d000000000305004b000002780000613d0000000803000029000000000521034f000000000505043b000000000605004b0000000006000019000000010600c039000000000665004b000003920000c13d00000000035304360000002002200039000000000542004b0000026d0000413d000000000100041a000000fa011001970000000002000411000700000002001d000000000121004b000003940000c13d00000009010000290000000002010433000000800100043d000000000221004b000003400000c13d000000000101004b0000031e0000613d000600020000003d000580100000003d00040100000000920003800d0000003d000c00000000001d0000000c030000290000000501300210000000a0021000390000000002020433000000fa0420019700000009020000290000000002020433000000000232004b000003a50000a13d00000008011000290000000001010433000000000101004b0000000001000019000000010100c039000b00000001001d000000000100041a000000fa01100197000000070110006c000003940000c13d00000000004004350000000601000029000000200010043f0000000001000414000000f40210009c000000f401008041000000c001100210000000ff011001c70000000502000029000a00000004001d03c903c40000040f0000000102200190000003920000613d000000000101043b000000000201041a000000040220017f0000000b03000029000000000232019f000000000021041b000000400100043d00000000003104350000000002000414000000f40320009c000000f4040000410000000002048019000000f40310009c00000000010480190000004001100210000000c002200210000000000112019f000000fe011001c70000000203000039000000030200002900000100040000410000000a0500002903c903bf0000040f0000000101200190000003920000613d0000000c02000029000c00010020003d000000800100043d0000000c0110006b0000028a0000413d0000031e0000013d0000010d01000041000000800010043f0000002001000039000000840010043f000000a40010043f0000011501000041000000c40010043f0000011701000041000003cb00010430000000800020043f000000000404004b000002dc0000c13d000001000300008a000000000131016f000000a00010043f000000000102004b000000c001000039000000a001006039000002eb0000013d0000000000300435000000a001000039000000000302004b000002f10000613d000001180100004100000000040000190000000003040019000000000401041a000000a005300039000000000045043500000001011000390000002004300039000000000524004b000002e20000413d000000c0013000390000001f01100039000000200200008a000000000121016f00000119021000410000011a0220009c000000250000413d000000400010043f00000020020000390000000003210436000000800200043d00000000002304350000004003100039000000000402004b000003010000613d00000000040000190000000005340019000000a006400039000000000606043300000000006504350000002004400039000000000524004b000002fa0000413d000000000332001900000000000304350000005f02200039000000200300008a000000000232016f000000f403000041000000f40420009c0000000002038019000000f40410009c000000000103801900000040011002100000006002200210000000000112019f000003ca0001042e000000fb01100197000000000161019f000000000010041b000000f4010000410000000002000414000000f40320009c0000000002018019000000c001200210000000fc011001c70000800d020000390000000303000039000000fd0400004103c903bf0000040f0000000101200190000003920000613d0000000001000019000003ca0001042e000000040100006b0000000001000019000003250000613d0000000a01000029000000000101043300000004040000290000000302400210000000010300008a000000000223022f000000000232013f000000000121016f0000000102400210000000000121019f0000000302000029000000000012041b000000000100041a000000fa01100197000000050110006c000003940000c13d0000000901000029000000000101043300000007020000290000000002020433000000000221004b000003400000c13d000000000101004b0000034c0000c13d0000002001000039000001000010044300000120000004430000010101000041000003ca0001042e000000400100043d0000004402100039000001110300004100000000003204350000002402100039000000180300003900000000003204350000010d020000410000000000210435000000040210003900000020030000390000039e0000013d000400020000003d000380100000003d00020100000000920001800d0000003d0000000004000019000000050140021000000008021000290000000002020433000000fa0520019700000007020000290000000002020433000000000242004b000000f403000041000003a50000a13d000b00000004001d00000006011000290000000001010433000000000101004b0000000001000019000000010100c039000c00000001001d000000000100041a000000fa01100197000000050110006c000003940000c13d00000000005004350000000401000029000000200010043f0000000001000414000000f40210009c0000000001038019000000c001100210000000ff011001c70000000302000029000a00000005001d03c903c40000040f0000000102200190000003920000613d000000000101043b000000000201041a000000020220017f0000000c03000029000000000232019f000000000021041b000000400100043d00000000003104350000000002000414000000f40320009c000000f4040000410000000002048019000000f40310009c00000000010480190000004001100210000000c002200210000000000121019f000000fe011001c70000000203000039000000010200002900000100040000410000000a0500002903c903bf0000040f0000000101200190000003920000613d0000000b04000029000000010440003900000009010000290000000001010433000000000114004b000003510000413d0000033b0000013d0000000001000019000003cb00010430000000400100043d0000004402100039000001150300004100000000003204350000010d02000041000000000021043500000024021000390000002003000039000000000032043500000004021000390000000000320435000000f402000041000000f40310009c0000000001028019000000400110021000000112011001c7000003cb00010430000001130100004100000000001004350000003201000039000000280000013d000000f403000041000000f40410009c00000000010380190000004001100210000000f40420009c00000000020380190000006002200210000000000112019f0000000002000414000000f40420009c0000000002038019000000c002200210000000000112019f000000fc011001c7000080100200003903c903c40000040f0000000102200190000003bd0000613d000000000101043b000000000001042d0000000001000019000003cb00010430000003c2002104210000000102000039000000000001042d0000000002000019000000000001042d000003c7002104230000000102000039000000000001042d0000000002000019000000000001042d000003c900000432000003ca0001042e000003cb00010430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000009fffffffffffffffffffffffffffffffffffffffffffffffff000000000000007f00000000000000000000000000000000000000000000000000000001ffffffe0000000000000000000000000000000000000000000000000ffffffffffffffff8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000008be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0020000000000000000000000000000000000002000000000000000000000000002000000000000000000000000000000000000400000000000000000000000007627b272139194613ef490db7b6292652da67bb4eb21d5855cffb7cc358b9a7f0000000200000000000000000000000000000040000001000000000000000000000000000000000000000000000000000000000000000000000000008bab995d00000000000000000000000000000000000000000000000000000000a0ac590600000000000000000000000000000000000000000000000000000000a0ac590700000000000000000000000000000000000000000000000000000000f2fde38b000000000000000000000000000000000000000000000000000000008bab995e000000000000000000000000000000000000000000000000000000008da5cb5b00000000000000000000000000000000000000000000000000000000715018a500000000000000000000000000000000000000000000000000000000715018a60000000000000000000000000000000000000000000000000000000086a0d67a0000000000000000000000000000000000000000000000000000000006fdde03000000000000000000000000000000000000000000000000000000004c999f5e08c379a0000000000000000000000000000000000000000000000000000000004f776e61626c653a206e6577206f776e657220697320746865207a65726f2061646472657373000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000840000008000000000000000004172726179206c656e67746873206d757374206d61746368000000000000000000000000000000000000000000000000000000640000000000000000000000004e487b710000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000004f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657200000000000000000000000000000000000000200000008000000000000000000000000000000000000000000000000000000064000000800000000000000000b10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6ffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000ffffffffffffffffffffffffffffffffffffffffffffffff0000000000000080000000000000000000000000000000000000000000000000000000000000000047d898d7bc7b6a7575970e350cdb5c64c9f18fe64bf53bfda36c83eaedb848f1";

type ContractRestrictionConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ContractRestrictionConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ContractRestriction__factory extends ContractFactory {
  constructor(...args: ContractRestrictionConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _name: string,
    _contracts: AddressLike[],
    _statuses: boolean[],
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _name,
      _contracts,
      _statuses,
      overrides || {}
    );
  }
  override deploy(
    _name: string,
    _contracts: AddressLike[],
    _statuses: boolean[],
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _name,
      _contracts,
      _statuses,
      overrides || {}
    ) as Promise<
      ContractRestriction & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): ContractRestriction__factory {
    return super.connect(runner) as ContractRestriction__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ContractRestrictionInterface {
    return new Interface(_abi) as ContractRestrictionInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ContractRestriction {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ContractRestriction;
  }
}