import { writeFileSync, readFileSync, existsSync } from "fs";

const RELEVANT_ABIS = [
  "Party",
  "PartyBid",
  "PartyBuy",
  "PartyCollectionBuy",
  "PartyCrowdfundFactory",
  "PartyFactory",
  "PartyGovernance",
  "PartyGovernanceNFT",
  "PartyHelpers",
  "ProposalExecutionEngine",
  "TokenDistributor",
];

// AFileName -> a_file_name
const camelCaseToUnderscoreCase = (camelCaseString: string) => {
  return camelCaseString
    .replace("NFT", "Nft")
    .split(/\.?(?=[A-Z])/)
    .join("_")
    .toLowerCase();
};

const saveAbis = async () => {
  const output: {
    [filename: string]: any;
  } = {};

  RELEVANT_ABIS.forEach((filename) => {
    const fileLoc = `./out/${filename}.sol/${filename}.json`;
    if (!existsSync(fileLoc) {
      console.warn(`${fileLoc} does not exist`);
      return;
    }
    const contents = readFileSync(fileLoc).toString();
    const foundAbi = JSON.parse(contents)["abi"];
    if (!foundAbi) {
      throw new Error(`couldnt find expected abi in ${fileLoc}`);
    }

    const newFilename = camelCaseToUnderscoreCase(filename);
    output[newFilename] = foundAbi;
  });

  Object.keys(output).forEach((newFilename) => {
    writeFileSync(
      `./deploy/deployed-contracts/abis/${newFilename}.json`,
      JSON.stringify(output[newFilename])
    );
  });
};

saveAbis().then(() => {
  process.stdout.write("0x0000000000000000000000000000000000000001");
  process.exit();
});
