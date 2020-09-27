import { fetchAccountDetails, fetchPosts, fetchFollow } from "./services";
import User from "../models/User";
import Post from "../models/Post";
import Follow from "../models/Follow";
import Bluebird from "bluebird";
import seconds from "../utilities/seconds";
import sleep from "../utilities/sleep";

const updateProfile = async () => {
  try {
    const users = await User.find().then((res) =>
      res.map(({ username }) => username)
    );

    await Bluebird.mapSeries(users, async (uname: string) => {
      await sleep(seconds(40, 60));
      const {
        username,
        full_name,
        is_private,
        profile_pic_url,
        is_verified,
        media_count,
        follower_count,
        following_count,
        biography,
        external_url,
        is_business,
      } = await fetchAccountDetails("./cookie.json", uname);
      await User.findOneAndUpdate(
        { username: uname },
        {
          username,
          full_name,
          is_private,
          profile_pic_url,
          is_verified,
          media_count,
          follower_count,
          following_count,
          biography,
          external_url,
          is_business,
          status: 1,
        },
        { upsert: true }
      ).then(() => console.log(`updating user`));
    });
  } catch (e) {
    console.log(e);
  }
};

const saveTodayPosts = async () => {
  try {
    const users = await User.find().then((res) =>
      res.map(({ username }) => username)
    );

    await Bluebird.mapSeries(users, async (uname: string) => {
      await sleep(seconds(40, 60));
      const posts = await fetchPosts("./cookie.json", uname);
      if (posts.length === 0) return;
      await Bluebird.mapSeries(posts, async (posts: any) => {
        const userId = await User.findOne({ username: uname }).then(
          (res) => res?._id
        );
        const checkPostinDB = await Post.find({ code: posts.code });
        if (checkPostinDB.length === 0)
          await Post.findOneAndUpdate(
            { code: posts.code },
            {
              user: userId,
              code: posts.code,
              media_type: posts.media_type,
              image_versions2: posts.image_versions2,
              caption: posts.caption,
              video_versions: posts.video_versions,
              carousel_media: posts.carousel_media,
              status: 0,
              timestamp: new Date().getTime(),
            },
            { upsert: true }
          ).then(() => console.log(`saving posts`));
      });
    }).catch((e) => console.log(e));
  } catch (e) {
    console.log(e);
  }
};

const saveFollowers = async () => {
  try {
    const users = await User.find().then((res) =>
      res.map(({ username }) => username)
    );

    await Bluebird.mapSeries(users, async (uname: string) => {
      await sleep(seconds(40, 60));
      const followers = await fetchFollow("./cookie.json", uname);
      if (followers && followers.length > 0) {
        await Bluebird.mapSeries(followers, async (follower) => {
          const userId = await Follow.findOne({ username: uname });
          if (!userId) {
            const follow = new Follow({
              username: follower.username,
              full_name: follower.full_name,
            });
            await follow.save();
          }
        });
      } else {
        return;
      }
    }).catch((e) => console.log(e));
  } catch (e) {
    console.log(e);
  }
};

export { updateProfile, saveTodayPosts, saveFollowers };
