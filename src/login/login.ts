import { IgApiClient, IgCheckpointError } from "instagram-private-api";
import Bluebird from "bluebird";
import inquirer from "inquirer";
import fs from "fs";
const ig = new IgApiClient();

const login = async (username: string, password: string): Promise<any> => {
  try {
    Bluebird.try(async () => {
      ig.state.generateDevice(username);
      await ig.account.login(username, password);
      const cookies = await ig.state.serializeCookieJar();
      fs.writeFileSync(`cookie.json`, JSON.stringify(cookies));
    }).catch(IgCheckpointError, async () => {
      await ig.challenge.auto(true);
      const { code } = await inquirer.prompt([
        {
          type: "input",
          name: "code",
          message: "Enter OTP.",
        },
      ]);
      console.log(`You Entered ${code} OTP`);
      const cookies = await ig.state.serializeCookieJar();
      fs.writeFileSync(`cookie.json`, JSON.stringify(cookies));
    });
  } catch (e) {
    console.log(e);
  }
};

export default login;
