import { IgApiClient } from "instagram-private-api";
import { isToday } from "../utilities/isToday";
import env from "../env";
import fs from "fs";
import { get } from "request-promise";
import sleep from "../utilities/sleep";
import seconds from "../utilities/seconds";
import Follow from "../models/Follow";
const ig = new IgApiClient();

ig.state.generateDevice(env.USERNAME);

const mediaTypes = {
  image_media: 1,
  video_media: 2,
  carousel_media: 8,
};

const fetchAccountDetails = async (cookiePath: string, username: string) => {
  const cookie = fs.readFileSync(cookiePath, "utf8");
  await ig.state.deserializeCookieJar(cookie);
  const userId = await ig.user.getIdByUsername(username);
  const accountDetails = ig.user.info(userId);
  return accountDetails;
};

const fetchFollow = async (cookiePath: string, username: string) => {
  try {
    const cookie = fs.readFileSync(cookiePath, "utf8");
    await ig.state.deserializeCookieJar(cookie);
    const userId = await ig.user.getIdByUsername(username);
    const followersFeed = await ig.feed.accountFollowers(userId);
    return await followersFeed.items();
  } catch (e) {
    console.log(e);
  }
};

const fetchMediaDetails = async (cookiePath: string, mediaId: string) => {
  const cookie = fs.readFileSync(cookiePath, "utf8");
  await ig.state.deserializeCookieJar(cookie);
  const info = await ig.media.info(mediaId);
  return info;
};

const fetchPosts = async (cookiePath: string, username: string) => {
  const cookie = fs.readFileSync(cookiePath, "utf8");
  await ig.state.deserializeCookieJar(cookie);
  const userId = await ig.user.getIdByUsername(username);
  const posts = await ig.feed.user(userId).items();
  const todayPosts = posts.filter((x) => isToday(x.taken_at));
  const newPosts = todayPosts.map(
    ({
      media_type,
      code,
      image_versions2,
      caption,
      carousel_media,
      video_versions,
    }) => {
      if (media_type === mediaTypes.image_media) {
        return {
          media_type,
          code,
          image_versions2,
          caption: caption === null ? "" : caption.text,
        };
      } else if (media_type === mediaTypes.video_media) {
        return {
          media_type,
          code,
          image_versions2,
          caption: caption === null ? "" : caption.text,
          video_versions: !!video_versions ? video_versions[0].url : null,
        };
      } else if (media_type === mediaTypes.carousel_media) {
        const carousel_array = carousel_media?.map((x) => {
          if (x.media_type === 1) {
            return {
              media_type: x.media_type,
              image_versions2: x.image_versions2,
            };
          } else {
            return {
              media_type: x.media_type,
              image_versions2: x.image_versions2,
              video_versions: !!x.video_versions
                ? x.video_versions[0].url
                : null,
            };
          }
        });
        return {
          media_type,
          code,
          caption: caption === null ? "" : caption.text,
          carousel_media: carousel_array,
        };
      }
    }
  );
  return newPosts;
};

const fetchUserStories = async (cookiePath: string, username: string) => {
  const cookie = fs.readFileSync(cookiePath, "utf8");
  await ig.state.deserializeCookieJar(cookie);
  const userId = await ig.user.getIdByUsername(username);
  const stories = await ig.feed.userStory(userId).items();
  return stories.map(
    ({ code, image_versions2, media_type, video_versions }) => {
      return {
        code,
        image_versions2,
        media_type,
        video_versions: !!video_versions ? video_versions[0].url : null,
      };
    }
  );
};

const uploadPhoto = async (
  cookiePath: string,
  url: string,
  caption: string
) => {
  const cookie = fs.readFileSync(cookiePath, "utf8");
  await ig.state.deserializeCookieJar(cookie);

  const imageBuffer = await get({
    url: url,
    encoding: null,
  });

  await ig.publish.photo({
    file: imageBuffer,
    caption: caption,
  });
};

const uploadVideo = async (
  cookiePath: string,
  videoUrl: string,
  imageUrl: string,
  caption: string,
  isIGTV?: boolean
) => {
  const cookie = fs.readFileSync(cookiePath, "utf8");
  await ig.state.deserializeCookieJar(cookie);

  const imageBuffer = await get({
    url: imageUrl,
    encoding: null,
  });

  const videoBuffer = await get({
    url: videoUrl,
    encoding: null,
  });

  if (isIGTV) {
    await ig.publish
      .igtvVideo({
        video: videoBuffer,
        coverFrame: imageBuffer,
        title: caption,
      })
      .catch((e) => console.log(e));
  } else {
    await ig.publish
      .video({
        video: videoBuffer,
        coverImage: imageBuffer,
        caption: caption,
      })
      .catch((e) => console.log(e));
  }
};

const uploadAlbums = async (
  cookiePath: string,
  caption: string,
  items: any
) => {
  const cookie = fs.readFileSync(cookiePath, "utf8");
  await ig.state.deserializeCookieJar(cookie);

  const albumData: any = [];

  for await (const item of items) {
    if (item.media_type === 1) {
      const imageBuffer = await get({
        url: item.image_versions2,
        encoding: null,
      });
      albumData.push({
        file: imageBuffer,
      });
    } else {
      const videoBuffer = await get({
        url: item.video_versions,
        encoding: null,
      });
      const imageBuffer = await get({
        url: item.image_versions2,
        encoding: null,
      });
      albumData.push({ video: videoBuffer, coverImage: imageBuffer });
    }
  }

  ig.publish
    .album({
      caption,
      items: albumData,
    })
    .catch((e) => console.log(e));
};

const follow = async (cookiePath: string, username: string) => {
  try {
    const cookie = fs.readFileSync(cookiePath, "utf8");
    await ig.state.deserializeCookieJar(cookie);
    await sleep(seconds(40, 60));
    const userId = await ig.user.getIdByUsername(username);
    await ig.entity.profile(userId.toString()).checkFollow();
    await Follow.findOneAndUpdate(
      { username: username },
      { status: true }
    ).exec();
    console.log(`follow : ${username}`);
  } catch (e) {
    console.log(e);
  }
};

export {
  fetchAccountDetails,
  fetchFollow,
  fetchPosts,
  fetchUserStories,
  uploadPhoto,
  uploadVideo,
  uploadAlbums,
  fetchMediaDetails,
  follow,
};
