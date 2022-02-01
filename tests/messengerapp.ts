import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Messengerapp } from '../target/types/messengerapp';
import * as assert from 'assert';


const { SystemProgram } = anchor.web3;

describe("Testing our messaging app: ", function () {
  const provider = anchor.Provider.env();

  anchor.setProvider(provider);
  
  const program = anchor.workspace.Messengerapp;

  const baseAccount = anchor.web3.Keypair.generate();

  it("An account is initialized", async function () {
    await program.rpc.initialize("My first message", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    });
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Data: ', account.data);
    assert.ok(account.data === "My first message");
  });

  it("Update the account previously created: ", async function () {
    await program.rpc.update("My second message", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("Updated data: ", account.data);
    assert.ok(account.data === "My second message");
    console.log("All account data: ", account);
    console.log("All data: ", account.dataList);
    assert.ok(account.dataList.length === 2);
  });
});