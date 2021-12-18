/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/order */
// This adds support for typescript paths mappings
import 'tsconfig-paths/register';

import { Signer, utils } from 'ethers';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@tenderly/hardhat-tenderly';
import 'hardhat-deploy';
// not required as we are using @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers

// import 'solidity-coverage';

import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';

import { Provider, TransactionRequest } from '@ethersproject/providers';

import { HardhatUserConfig, task } from 'hardhat/config';
import { HttpNetworkUserConfig } from 'hardhat/types';
import { HardhatRuntimeEnvironmentExtended, TEthers } from './helpers/types/hardhat-type-extensions';

declare module 'hardhat/types/runtime' {
  // This is an example of an extension to the Hardhat Runtime Environment.
  // This new field will be available in tasks' actions, scripts, and tests.
  export interface HardhatRuntimeEnvironment {
    ethers: TEthers;
  }
}

const privatekeys = [
  '0x3fc3c9EDF946F78561E4A7717329dF47A8884fb9',
  '0x41eb9843f80cb6c4a860da2708881f4d4ea2e58cc86a7c33c7707204a461a0f6',
  '0xAe4D6DDb2411984564bf50C9D072Dd918e89A4b7',
  '0x1bbfe126005c120885b16c843c3a57b8cb07d95e66fa1310f56c5ac3828901b9',
  '0xd5018347831f0FAe4E60949f99ba38EBE89e96DA',
  '0x0736d9d4b8edb9705e218ebc08ecec425be3a5760bb276d6b342a7d41aff203b',
  '0x6a81dF3466612DFD1aA297AD6eE8F8F2Df0B0f39',
  '0x8c49d07c821bbc09200cda98dc6fcc8b86bbb5e9be91ccd5f4511f6a54a40f74',
  '0x9A682d0B598E5077033D3d9B0674C3639Ab920A1',
  '0x8d6960c8adc88d57c26f050a9127d396e762b88360c5d3fc6e7db3acfaed98e0',
  '0x4faFda94FeC1883C925fA1188034F8ffA1970bcb',
  '0x9b3034402f8aafbfc0e4abd3ae3c4f3e44db2693de30f3f85eb2def9cc1bdcff',
  '0x917636222AFf778BA7205C3bb96714bbfE58Af66',
  '0x214e1049dbd00e53d9ef8baac2d67dc47c220fc93b2d6096b61803aa6f1d6e59',
  '0x8BD01206Ae39d2Aa15aA86b612780F6DDe18d6E3',
  '0x1c6de658077a1eb1e4735441b402a1bd5f037115eacc6029c69155b04e683b4f',
  '0x8d97265132d183302C505BC32bf772c85e3FA84B',
  '0xd762c8c0c58f0d11d7da5de87fca4318496ea38d9d924954acdba0238b60f42e',
  '0xB3251d20d4495e0D682D02C327d55B1839Dc452a',
  '0xc1131e005e581cc7a400b205dc2b2699fe603b4fa22ef409319e6269c241f76b',
  '0x973f9Dc5d5F9622a9fF08205c130C45807aB5cc0',
  '0xd474f27d11f3e80d56a77eec7ff8cb485531951b36845e9c9bba2546d7f77d28',
  '0xee09efc21cD722902c0357c06041F96d26366b20',
  '0x3172f191534a255cbd55fbff9f623428e18f693a4595a37744d9f5d5321689be',
  '0x6A9eeF93D98d2d0221dD2D32277063199558A18d',
  '0xd0f05c08a8e443c98a438e4a525b321b2cdf4d71aeba064cd6c916c452fc1d9e',
  '0x8e99f6b58E7AaD12308584788d8eA53aa8DF50D7',
  '0xe329e92958b1821a0047492b47eb01cff4bd20ad367634b24117a229edaf72e2',
  '0xB5519f3271161b866b762C53074f2a5429997C9d',
  '0xc1b63524d5b20c08957f0b10a1a79275c124626784e292285de862271337c501',
  '0x460959FD7671C57b13fd7Be4d88EC75BfD3DCFA9',
  '0x69270d1f6dedd9adfbb6586b26b410727996713d49dd7e0fa649c69cb0750eb1',
  '0x77609cC30a387A88DF0ec749BF4dD10bBCCA767D',
  '0xba843d56da87127912b9b6e03bea3f3dfdb38e762ba3727834da95005be208ed',
  '0x0a174187cA42aAd247bC928F635629Cec30Cf697',
  '0xbf11a4ae234fc9f62476864298f48e29b209dacff7e61a86c5f9351f79062ce9',
  '0x97163d152d327E8Ef53964588eDF39810A0c8F1B',
  '0x0a6d97077302f84cc6b4e73972a307597070eb9bd7d4c680235c204ad96d19ef',
  '0xdeda4346718C329d6Bf99425344f71862532a50f',
  '0x85b2f61f1e9e8c037c79d0ca61ef4457ada6ddc4f1bd5b47e084b1e9d9c65e96',
  '0xeF11D034CC8b4A396Fb1E28540aE2140bd68cb64',
  '0x284422903571dba53af269f02a781d913467389733994692f182f5bac125a435',
  '0x2b5930b513C41459D70833DE2A2418074aeD6947',
  '0xc1166c9eef4ebb8f9b00e340ede3ead0f254cee81f3e68249dcfc488e5f975cf',
  '0xE22f40CCCE484357B3F6F72C38D3CBCCD7e540De',
  '0xcd6a5be7641a735d2d5eafcece05dc6d396853117d7115e4daade55281543ed4',
  '0xf353Ff8835240c2B3d1E76065319eEdD77d5a6b0',
  '0xadd16b83ddbaea514c8c2564a8cccf6bf6c52b94696887a3a488da1e9ee1126f',
  '0x751d24752F4ce1C675d9d5F5C6C67B029EB2C7AF',
  '0xd48d0b93270b795fd249c8358565f8d5796513bf22a5c4b85c151bf56987b500',
  '0x4C0CC6c9902387a7901888840948071253DC8e47',
  '0x4e6d60224f8a605ad3dbaccf8874e1918942ebdd71589d8b5a3af8e454dbd0e9',
  '0x38BA312A7301bDc66D8FC5A84A7dF4C43045AeC7',
  '0xb222465ad280a91a10f202e928a8435ccdb7615e4bd78cb51dd66735b4cc778f',
  '0xb8B25229eEfa4f08220B7D9FbdD0AC0453939b1F',
  '0x12ee3d2ecf465b75683697228bfaa6a2477f351c1b2bb9a6bb544a3cb8cc5ec6',
  '0x2a54b614B131538D3956d1e3F6be63DB460342a2',
  '0xf9e6b7ad9e20be284d856a8b0a58efce3ca454d766a26e747afc71ea54f7cc9e',
  '0xAF8393d08b00A32996FfA3Bab2C1886fDcF0E52f',
  '0x52dcae1a08c8817a136009357974ee240ce893151f540fd9525081238cf16962',
  '0xF886045afC2B26533598e753857BD20C1046897c',
  '0x4febaed49961178b3c50f424b19042fa8951d853f9d940557d7eacb6f052cf09',
  '0x76c416b77905cE1aEb5FA15099E74bb4EDe89631',
  '0x1fe02c11b23fd131131a6a97aadf3213e5e52f7d72e253155bdb5681f80008ce',
  '0xEDa9bcEe70221eC2E7606A6d30bAE699361D444E',
  '0xe45ceca6fcef0f9df0c1df86102d08ff497e0482ee07a24b09366c17d45ec88d',
  '0x17fd11167651343c8324b4472Bf1D094CD744D63',
  '0x70ac7c199f0166b050be584ddae06eef11e3e07fe4d73f40fd270badc0017c8f',
  '0xE7971b92837865bE2Ac0EefA719413ABDB019363',
  '0x99d55ddecebc23c82406382ce4a8e90bb0027d570a35f115055caae524ef68aa',
  '0xCE4D4140111D14DAb19491444413d678Bb311251',
  '0x46d9db4f2c0b42234f93a4ef379f66cd809b03cbf7ef61e2499eefcfb5955687',
  '0x64899982f184b836F0347d5835e8D9b88C615909',
  '0x7e15b79bf1675180227359f16cb47aedd15f4ac13da384a234fe7bb3cdcce585',
  '0x59bB493f14F724BfEd055A5F64a300C7dcC17412',
  '0xba5bf5361cdebfc67cdc3f853ef01972ca162ae3436ccca364ff397ff6c1a09e',
  '0xB66a6408a4d8169f74699D7A580c658c216Cf21F',
  '0xe9f25ab4c76fd477e736403ae097d056107589aa15b472f29a91a6c5e1311b4b',
  '0x1D967Cb2dbdfa0880a855479Ba11f7F852b10901',
  '0x6d560263835ec45bf5ac10bf279b3fd61fbc97103eef3e3cc329d60e79b3dbea',
  '0x605814b95A1f19E38b917d360535c2def86C7c5E',
  '0x34c9feca809edcd394a256b0a186393929be3433f8826114053bb6f66c6482ef',
  '0x41b761bB62D1471061097276c7f2881a31C9ED6F',
  '0x4b5eef1f917930968ecfc24d1a41826ae41979bff22dfb1cbea21125a619e7e1',
  '0xDEbdF7FCE937Da726634f0ad9936F297a9670826',
  '0x4f0120337c6dc1869dc72317ebac311d19fcaaf57ae4f5f5cdcbd6386c32e79f',
  '0xC33dC482976F5bf64e763E2F9Ce97F55a62FD635',
  '0xe4bcc1506fe2fa40c175e3f2d68cb96c1dba1193df7d62e50805f7d53963e7f1',
  '0x4aAEe9f3Ed24814260C3Cf96324D509472727d2f',
  '0xc19a30a1cdbf036821508a7ddbfe761bc8d354f2113c24ad5c37bf4b229f8e71',
  '0x0BF152bFFa72171fEa2D1E4257c09FE0bEC00308',
  '0xa4a08fad7925f95617e376fbe01853860f179866ca4dc63ebab9cc0a3d50accd',
  '0x7eDE6c856F3677e878A7e428Cb1dA377AC622467',
  '0x50f05b681bc6eee8267a6062bc8ec5b52c38c5e67eb93a0d7930765dc7b4b806',
  '0xEce9AD9614e204057aE2179d4fE68f43F6821784',
  '0x9d42a1ebca38b9dae56619b107f136a4d0116f14c1a255da539096222485465c',
  '0x8559Df24118F76c8F26ce8C01c0b23de7b6173F2',
  '0x26d7599049ecdb4da03dae51f2214eadb6c3a1a3decdf3144356b28652ebe252',
  '0xEd138134E92CaFdFF7Cc62DdFbC8Fee3AF6Fb635',
  '0xddc9b3ce7fd41b485e4287f896fc3f9de2bd3023ea50f763800489fdfc6178d6',
  '0xe1C71CD1cf7de6145B7FA631b2F8eeB7ACf909F4',
  '0xca55c772c5ba1d3c1844427d9f088b55c70777bdf01d42d4b502ad63e8344920',
  '0xC1fF985b3647E52C4f252311CAb3Dd1A06106E97',
  '0x273462e5c286e3676651f13108b6f01360ce551fdc290b936b4fc5b9d4893ca5',
  '0x189946b7CDa99fE2aF57B7F155f2608AA5B3B460',
  '0x36acfd7780500f77d46f773bbce3fdabbc689c7cfe6e61206d7c234fb3190c94',
  '0x687A4362fa2748dc21e93Ed6A3c50a5625493d4E',
  '0x48a00f9306e302e12d7036b39852ed0e507e0784ede54a40b22b6502d4b96a97',
  '0x9F2556b42Dd01ffF964eC5b574A80D6789909849',
  '0x353158e0552c0b5942f4e4e8709cd57b1f6e667638e617228a38c2d6c1fc8e24',
  '0x6989C0Ae4eCa1cD66882d219D517374E05923191',
  '0xc29b3adb0c2e419938083c4bde12cd2d54e15496618c9b3cc5068807f094b2ff',
  '0xbE8713EE997736907aAf3f7A72396DdD64842cB4',
  '0xb09ec995a2b3e36996a9265b7246b2f18c389997a8a0f3811c65e7b35a860e6e',
  '0x7d26E976C2D8Fc9ac78C2Cb4F24A2f4b0f1d8E73',
  '0x4fd810ddf7d7a07cdb8b9ae048316f3d27722fb3ded7a204cef592d8bb4c0f9b',
  '0x048D7BFD0c61CA960db4732D85681b907fEc74EE',
  '0x7cec0d1c644aad736ab6cb080c19a5fbe93985bcd7e8cbc78659782094defc71',
  '0xA29befa69096eEd5764ff935EAEBf9460E03Be98',
  '0x4dba303b31c364802dcd8e93b5ed1239780f888d0f6d9d4b5fee39e654b54aa5',
  '0x6a96f4605C9566A2349524BaABfe8df9c0f8AB80',
  '0xf3694b32ff2f88a6a275ceb24720c59ac2effba2be2afbfe059429cd4da14b70',
  '0xcae778843C6dC7120E63E438AF5FA7503936774D',
  '0x4c408bad809e34252ec90cc2041b2620536047eb4a04e55033218a1823a6ee2d',
  '0xC99e8D3E29496187D9746B89B1FF5199B5304A1D',
  '0xc80053e8de57e21a1e181a123f9ab364c6bf2fd11f0a814cd5b904a3e4b29d94',
  '0xD6D6103B7D1F0fe0a282B83De7fa63691D745f73',
  '0x812d8b6d30d2707a814adfe85e4632e852bee98b2f688a9b045dcb089df58b50',
  '0x305dcB66DfB8E8488374CC4b322Deb8EAaC9848D',
  '0xa4883cd487c61e391360768513216cd9f045fab085f54a4700e8fb51a34001b3',
  '0xC4eD0630D0d8051878Fc0411B0782A6A1d947b5f',
  '0xfe7b494e1c3cea87f8e46dd18d8382517d33798ffdf6d29481c9f5ad71c7eee8',
  '0xe641f5dc2C7FE3EE32715CF9566d7dA21cbEA26f',
  '0xbb75ef7b82d510cb4ac339ac544df4aea546ce931fdc7762eefc8662b45a2481',
  '0x181DE1b7A08e03ea4F6084ED176000Ba1AAcac9E',
  '0x6a357da4b8d60a3ee611e2838319bdd6320874568c184fc98002c7d4e4202ed9',
  '0x0F49A2a67c76D26D5bCF0315142B7A5d7Bc801AD',
  '0xb1f10ed992e4e601262df543d3705a2a5c14ba2c12e1ad20b17ad641b0d06e71',
  '0xA63EFE20b17A393524774A5BA97eF7A07f796aD8',
  '0x19b5c571d5be3f8ffb6c270eb2dd1ad1a75db487aa2c8f894cdb0ed03267cdce',
  '0xFfd4827e09a92980343D3bC9a5Df52a68700A3d3',
  '0x36c7f42d9ac6b2930e407255155228959d9854de424d19c8d4e36fba67bbe673',
  '0x509d159A9950d2a297d95F8E70CD1435E2f3428B',
  '0xb0f77c2c89897d9e8cf8eed95cd7e2649a25201c9646eeaf6f7975da41222d0f',
  '0x592Bd5994559439678c07D2Efc5276f0140700D4',
  '0x5ea6d7c8429a5c7793a8a85c9abcfcc520b894c12efa5189ba350def97284d0f',
  '0x49b22094c16C0A27EF2a212343DE1624806A8332',
  '0x6f8a87e5613480078faad546447f5e27333b22c7dbecd723d2b633fa5c35f6c3',
  '0x748A0881fedE7d43815a2177694CAbe2d5DD1869',
  '0x74ec061dca1b311041bc7c522099b7e4f7baa9172e02a424243cb288c0a6d758',
  '0x39290a103b3404B3F76b2C502AB34e84428b6477',
  '0x1189adc0368ef77b25f455a154502d333c7cb21dff1aa359089c780a4b717f19',
  '0x7596B5cd4e33Fe1bEB56253e1CBF46435C75227C',
  '0x457499f4ab2991c2bb4ec3fdc10ac2bbeceb0bf8f6044e570b0bf72a0383ec22',
  '0x71550666C5376bFC2aAc3C372ef6061a1e148c15',
  '0xfd83bde07d42781a91942cf2fce73a0102ecd4d6102e604d633929724d9ef2a5',
  '0x84C109b79bCa8E9Cd2AE3da078c9F3d145833Ecf',
  '0x8f89651772f45f3d2e10d09d114c8977636fe1aef53cab1edeb142b28bcda72b',
  '0x1d1F9cBf501a169c5C7155B9f13Bb5cE3F6112EE',
  '0x8c0afa5a2c9a2e3b842afac4fc1d15f292d26320d25e57ec5ae5a448d91b7fac',
  '0x2A45b0CCa3436c2f4F7cC66810A36B46CCB268F3',
  '0xf3c33db6ea44303567adf3342d82f87ec49f866f4482ea0a47f81f8478693656',
  '0xfFC68c903494c4509fdc8467177221D615f76d0f',
  '0x4914f5c3dc8f0d1ba810ce9f2ca61d3ec33721c77ef25acb1f3b8bd8942bd1fd',
  '0xcf5D5Bcf49cE23caddAbD77DF21A1408ceFbaFAD',
  '0xaf5ad7fd610055a8ed28ec3ec9a9a4032f1d2d99b3bcbe7c6f9ab7d781470ac7',
  '0x550313AC4740928c1Ef512bc3D84616a49a672A7',
  '0x51ef283749d113b799e98ca8698bd2d69604b9eaa3ebb21fa4afc84d52980051',
  '0xF7912893f6d50C4e96382DD1d728aA1CE0fE44e8',
  '0x98e0e936c1081723a7c8640aa2cf8d942c25581b55e0e15c10dce59bb05a5983',
  '0x5264eBD8b31A32d48440975fEf4AA8A9689070C0',
  '0xe2575023aa413aa6611475f1e20846ee167d799eb086f2ff14a0c34d222ea9bf',
  '0xba61fF073E29F096769d6c65AfEDa2f81f643605',
  '0xbab65bcdad52ce3015d377f7b7c879233e5b0c4fdfbf3611c7c8456039368b2e',
  '0x5A794c298e87C4e1160C3D8bd4bB9B59511ee023',
  '0xe728c3f8c85adf968bb9260f0e8d274a14236dfaf091f39eeef0952296393941',
  '0xadF5228bF054c36933bAE5C10fa67B4A1060f32B',
  '0x77eea2f74e9596b2c992c3cb1a6628324977a928d29b5db97d0c8b26b3e28a66',
  '0x754E4646669164eD3e696aD7f3630d95159207FD',
  '0xb69e71505b60dec77447f286227cd1b702e314bb6910efffb9e593823c880722',
  '0x06A478ceEbC184063dE76eD82B2F3C53bA6e3411',
  '0xee611b4787b39884e44ec7866034d22810d388db53c97a426d163734f25de246',
  '0x456d7bD07A1FECB4b8F74755dFD6a3ec5e8ac664',
  '0x4ce8ae04dc2495a083caf14b7d1bf82cf923835e8d0ec3c6821ee795feccdb06',
  '0x6Cf9B478073a5FFbe690660Ad0638882b8019707',
  '0xd69257d7594b4d815c053a115034c3ccd70fb2a1d7e458f2f47818362a0a3318',
  '0x2115C6BCC34C1d5a6C653a95bE5649eE4537B3Cb',
  '0x09fbd4a15c941ffffeb135c4fc798c2bf6538118282f57d08d62c79dbb88893d',
  '0x0b5415a5821121C172e675a384e986B1E6bC195d',
  '0x3246587eb6ab25051ee9e3440e3568e8666411284d303b93a8c27998974f20d3',
  '0xE85b749232A964c53ED74C87c5Ae7B0dBa2d89fe',
  '0x2b3cbb70b59ae150cb75147836d1f54bc1eb90b23ef5168a89e48f9d95ada6cb',
  '0x374b72dC90760A917bdAbF5e44DCC164ddb8E523',
  '0xf914e4cccd8277efdff7122da4ee323ee299ca67fa3b55eb3e7fcb43e5deeac6',
  '0x37FFf735c35F2Af9Cf4348B857a30F0F5D76ec8c',
  '0xc7d68a2e8a6e58905068bde86e46377e5bcf3dd8b533aa21bfe3a23072194a1c',
  '0xDbD137C650D75F0E3Bf0D0E0c5C2529220305a24',
  '0x6e50ca738d0b607bdc2f7bbc6b6af19da8f21604b6e86b07dd641638af152eed',
  '0x684BE4b919B57d6DB3DFBf2963fD478Cef31602d',
  '0x95365540de9f03d74cfe279f526051dfd1be9f339bdf4be18d3604f5883adaeb',
];

const { isAddress, getAddress, formatUnits, parseUnits } = utils;
//
// Select the network you want to deploy to here:
//
const defaultNetwork = 'localhost';

const getMnemonic = () => {
  try {
    return fs.readFileSync('./mnemonic.secret').toString().trim();
  } catch (e) {
    // @ts-ignore
    if (defaultNetwork !== 'localhost') {
      console.log('☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`.');
    }
  }
  return '';
};

const config: HardhatUserConfig = {
  defaultNetwork,
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  // don't forget to set your provider like:
  // REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
  // (then your frontend will talk to your contracts on the live network!)
  // (you will need to restart the `yarn run start` dev server after editing the .env)

  networks: {
    localhost: {
      url: 'http://localhost:8545',
      /*
        if there is no mnemonic, it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      */
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    kovan: {
      url: 'https://kovan.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    mainnet: {
      url: 'https://mainnet.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts:
        //mnemonic: getMnemonic(),
        ['47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd'],
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    goerli: {
      url: 'https://goerli.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    xdai: {
      url: 'https://rpc.xdaichain.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    cache: './generated/cache',
    artifacts: './generated/artifacts',
    deployments: './generated/deployments',
  },
  typechain: {
    outDir: '../vite-app-ts/src/generated/contract-types',
  },
};
export default config;

const DEBUG = true;

function debug(text: string) {
  if (DEBUG) {
    console.log(text);
  }
}

task('wallet', 'Create a wallet (pk) link', async (_, { ethers }) => {
  const randomWallet = ethers.Wallet.createRandom();
  const { privateKey } = randomWallet._signingKey();
  console.log(`🔐 WALLET Generated as ${randomWallet.address}`);
  console.log(`🔗 http://localhost:3000/pk#${privateKey}`);
});

task('fetch', 'fetch balance of a wallet (pk) link', async (_, { ethers }) => {
  for (let index = 0; index < 100; index++) {
    //const randomWallet = ethers.Wallet.createRandom();
    //const { privateKey } = randomWallet._signingKey();
    //console.log(`'${randomWallet.address}',`);
    //console.log(`'${privateKey}',`);
    if (index % 2 === 0) {
      console.log(`${privatekeys[index]}`);
      const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad');
      console.log('🔗 Balance', await provider.getBalance(privatekeys[index]));
    }
  }
});

task('fundedwallet', 'Create a wallet (pk) link and fund it with deployer?')
  .addOptionalParam('amount', 'Amount of ETH to send to wallet after generating')
  .addOptionalParam('url', 'URL to add pk to')
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    hre.waffle;
    const randomWallet = ethers.Wallet.createRandom();
    const { privateKey } = randomWallet._signingKey();
    console.log(`🔐 WALLET Generated as ${randomWallet.address}`);
    const url = taskArgs.url ? taskArgs.url : 'http://localhost:3000';

    let localDeployerMnemonic: string | undefined;
    try {
      const mnemonic = fs.readFileSync('./mnemonic.secret');
      localDeployerMnemonic = mnemonic.toString().trim();
    } catch (e) {
      /* do nothing - this file isn't always there */
    }

    const amount = taskArgs.amount ? taskArgs.amount : '0.01';
    const tx = {
      to: randomWallet.address,
      value: ethers.utils.parseEther(amount),
    };

    // SEND USING LOCAL DEPLOYER MNEMONIC IF THERE IS ONE
    // IF NOT SEND USING LOCAL HARDHAT NODE:
    if (localDeployerMnemonic) {
      let deployerWallet = ethers.Wallet.fromMnemonic(localDeployerMnemonic);
      deployerWallet = deployerWallet.connect(ethers.provider as Provider);
      console.log(`💵 Sending ${amount} ETH to ${randomWallet.address} using deployer account`);
      const sendresult = await deployerWallet.sendTransaction(tx);
      console.log(`\n${url}/pk#${privateKey}\n`);
    } else {
      console.log(`💵 Sending ${amount} ETH to ${randomWallet.address} using local node`);
      console.log(`\n${url}/pk#${privateKey}\n`);
      return send(ethers.provider.getSigner() as Signer, tx);
    }
  });

task('generate', 'Create a mnemonic for builder deploys', async (_, { ethers }) => {
  const bip39 = require('bip39');
  const hdkey = require('ethereumjs-wallet/hdkey');
  const mnemonic = bip39.generateMnemonic();
  if (DEBUG) console.log('mnemonic', mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  if (DEBUG) console.log('seed', seed);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = "m/44'/60'/0'/0/";
  const account_index = 0;
  const fullPath = wallet_hdpath + account_index;
  if (DEBUG) console.log('fullPath', fullPath);
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = `0x${wallet._privKey.toString('hex')}`;
  if (DEBUG) console.log('privateKey', privateKey);
  const EthUtil = require('ethereumjs-util');
  const address = `0x${EthUtil.privateToAddress(wallet._privKey).toString('hex')}`;
  console.log(`🔐 Account Generated as ${address} and set as mnemonic in packages/hardhat`);
  console.log("💬 Use 'yarn run account' to get more information about the deployment account.");

  fs.writeFileSync(`./${address}.txt`, mnemonic.toString());
  fs.writeFileSync('./mnemonic.secret', mnemonic.toString());
});

task('mineContractAddress', 'Looks for a deployer account that will give leading zeros')
  .addParam('searchFor', 'String to search for')
  .setAction(async (taskArgs, { network, ethers }) => {
    let contract_address = '';
    let address;

    const bip39 = require('bip39');
    const hdkey = require('ethereumjs-wallet/hdkey');

    let mnemonic = '';
    while (contract_address.indexOf(taskArgs.searchFor) != 0) {
      mnemonic = bip39.generateMnemonic();
      if (DEBUG) console.log('mnemonic', mnemonic);
      const seed = await bip39.mnemonicToSeed(mnemonic);
      if (DEBUG) console.log('seed', seed);
      const hdwallet = hdkey.fromMasterSeed(seed);
      const wallet_hdpath = "m/44'/60'/0'/0/";
      const account_index = 0;
      const fullPath = wallet_hdpath + account_index;
      if (DEBUG) console.log('fullPath', fullPath);
      const wallet = hdwallet.derivePath(fullPath).getWallet();
      const privateKey = `0x${wallet._privKey.toString('hex')}`;
      if (DEBUG) console.log('privateKey', privateKey);
      const EthUtil = require('ethereumjs-util');
      address = `0x${EthUtil.privateToAddress(wallet._privKey).toString('hex')}`;

      const rlp = require('rlp');
      const keccak = require('keccak');

      const nonce = 0x00; // The nonce must be a hex literal!
      const sender = address;

      const input_arr = [sender, nonce];
      const rlp_encoded = rlp.encode(input_arr);

      const contract_address_long = keccak('keccak256').update(rlp_encoded).digest('hex');

      contract_address = contract_address_long.substring(24); // Trim the first 24 characters.
    }

    console.log(`⛏  Account Mined as ${address} and set as mnemonic in packages/hardhat`);
    console.log(`📜 This will create the first contract: ${chalk.magenta(`0x${contract_address}`)}`);
    console.log("💬 Use 'yarn run account' to get more information about the deployment account.");

    fs.writeFileSync(`./${address}_produces${contract_address}.txt`, mnemonic.toString());
    fs.writeFileSync('./mnemonic.secret', mnemonic.toString());
  });

task('account', 'Get balance informations for the deployment account.', async (_, { ethers }) => {
  const hdkey = require('ethereumjs-wallet/hdkey');
  const bip39 = require('bip39');
  const mnemonic = fs.readFileSync('./mnemonic.secret').toString().trim();
  if (DEBUG) console.log('mnemonic', mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  if (DEBUG) console.log('seed', seed);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = "m/44'/60'/0'/0/";
  const account_index = 0;
  const fullPath = wallet_hdpath + account_index;
  if (DEBUG) console.log('fullPath', fullPath);
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = `0x${wallet._privKey.toString('hex')}`;
  if (DEBUG) console.log('privateKey', privateKey);
  const EthUtil = require('ethereumjs-util');
  const address = `0x${EthUtil.privateToAddress(wallet._privKey).toString('hex')}`;

  const qrcode = require('qrcode-terminal');
  qrcode.generate(address);
  console.log(`‍📬 Deployer Account is ${address}`);
  for (const n in config.networks) {
    // console.log(config.networks[n],n)
    try {
      const { url } = config.networks[n] as HttpNetworkUserConfig;
      const provider = new ethers.providers.JsonRpcProvider(url);
      const balance = await provider.getBalance(address);
      console.log(` -- ${n} --  -- -- 📡 `);
      console.log(`   balance: ${ethers.utils.formatEther(balance)}`);
      console.log(`   nonce: ${await provider.getTransactionCount(address)}`);
    } catch (e) {
      if (DEBUG) {
        console.log(e);
      }
    }
  }
});

const findFirstAddr = async (ethers: TEthers, addr: string) => {
  if (isAddress(addr)) {
    return getAddress(addr);
  }
  const accounts = await ethers.provider.listAccounts();
  if (accounts !== undefined) {
    const temp = accounts.find((f: string) => f === addr);
    if (temp?.length) return temp[0];
  }
  throw `Could not normalize address: ${addr}`;
};

task('accounts', 'Prints the list of accounts', async (_, { ethers }) => {
  const accounts = await ethers.provider.listAccounts();
  accounts.forEach((account: any) => {
    console.log('address: ', account);
  });
});

task('blockNumber', 'Prints the block number', async (_, { ethers }) => {
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log(blockNumber);
});

task('balance', "Prints an account's balance")
  .addPositionalParam('account', "The account's address")
  .setAction(async (taskArgs, { ethers }) => {
    const balance = await ethers.provider.getBalance(await findFirstAddr(ethers, taskArgs.account));
    console.log(formatUnits(balance, 'ether'), 'ETH');
  });

function send(signer: Signer, txparams: any) {
  return signer.sendTransaction(txparams);
  //    , (error, transactionHash) => {
  //     if (error) {
  //       debug(`Error: ${error}`);
  //     }
  //     debug(`transactionHash: ${transactionHash}`);
  //     // checkForReceipt(2, params, transactionHash, resolve)
  //   });
}

task('send', 'Send ETH')
  .addParam('from', 'From address or account index')
  .addOptionalParam('to', 'To address or account index')
  .addOptionalParam('amount', 'Amount to send in ether')
  .addOptionalParam('data', 'Data included in transaction')
  .addOptionalParam('gasPrice', 'Price you are willing to pay in gwei')
  .addOptionalParam('gasLimit', 'Limit of how much gas to spend')

  .setAction(async (taskArgs, { network, ethers }) => {
    const from = await findFirstAddr(ethers, taskArgs.from);
    debug(`Normalized from address: ${from}`);
    const fromSigner = ethers.provider.getSigner(from);

    let to;
    if (taskArgs.to) {
      to = await findFirstAddr(ethers, taskArgs.to);
      debug(`Normalized to address: ${to}`);
    }

    const txRequest: TransactionRequest = {
      from: await fromSigner.getAddress(),
      to,
      value: parseUnits(taskArgs.amount ? taskArgs.amount : '0', 'ether').toHexString(),
      nonce: await fromSigner.getTransactionCount(),
      gasPrice: parseUnits(taskArgs.gasPrice ? taskArgs.gasPrice : '1.001', 'gwei').toHexString(),
      gasLimit: taskArgs.gasLimit ? taskArgs.gasLimit : 24000,
      chainId: network.config.chainId,
    };

    if (taskArgs.data !== undefined) {
      txRequest.data = taskArgs.data;
      debug(`Adding data to payload: ${txRequest.data}`);
    }
    debug(`${(txRequest.gasPrice as any) / 1000000000} gwei`);
    debug(JSON.stringify(txRequest, null, 2));

    return send(fromSigner as Signer, txRequest);
  });
