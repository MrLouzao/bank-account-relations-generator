console.log("##### Generation of relationships among bank accounts #####")

let counter = 0;
const generatedAccounts = [];
const numberOfLevelsToGenerate = process.argv[2];
const numberOfAccountsPerLevel = process.argv[3];

if(!numberOfLevelsToGenerate){
    throw Error("Number of levels not specified");
}
if(!numberOfAccountsPerLevel){
    throw Error("Number of accounts per levels not specified");
}
console.log(`Generating ${numberOfLevelsToGenerate} levels with ${numberOfAccountsPerLevel} accounts per level`);


const createAccount = (level, parent) => {
    counter++;
    const account = { acc: `ES${level}0000${counter}`, parent: parent};
    generatedAccounts.push(account);
    return account;
}


// Recursive generation of accounts
const generateLevel = (numberOfLevel, maxLevel, accountToGenerateInLevel, parentAccount, accumulator) => {
    for(let i=0; i<accountToGenerateInLevel; i++){
        const newAccount =  createAccount(numberOfLevel, parentAccount.acc);
        if(numberOfLevel+1<maxLevel){
            generateLevel(numberOfLevel+1, maxLevel, accountToGenerateInLevel, newAccount, accumulator);
        }
    }
}


// Start to generate accouns recursively from root
const rootAccount = createAccount(0);
generateLevel(1, numberOfLevelsToGenerate, numberOfAccountsPerLevel, rootAccount, generatedAccounts);


// Put results on file
const fs = require('fs');
const filename = `levels_${numberOfLevelsToGenerate}_perNode_${numberOfAccountsPerLevel}_${new Date().getTime()}.json`;
fs.mkdir(`${__dirname }/out`, {recursive: true}, err => {
    if(err) throw err;
    fs.writeFile(
        `${__dirname }/out/${filename}`,
        JSON.stringify(generatedAccounts),
        {flag: 'wx'},
        (err) => {
            if(err){
                console.log("Error while writing results to file");
                console.error(err);
            }
        })
})


// Print results
console.log(`Total accounts generated: ${generatedAccounts.length}`);
getAccountInLevel = (level) =>{
    return generatedAccounts
    .filter(acc => acc.acc.includes(`ES${level}`))
    .length;
}
for(var i=0; i<numberOfLevelsToGenerate; i++){
    console.log(`On level ${i}: ${getAccountInLevel(i)}`);
}