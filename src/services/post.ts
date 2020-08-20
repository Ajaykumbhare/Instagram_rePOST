import Post from "../models/Post";
import User from "../models/User";
import Bluebird from "bluebird";
import { uploadPhoto, uploadVideo, uploadAlbums } from "./services";
import seconds from "../utilities/seconds";
import sleep from "../utilities/sleep";
import _ from "lodash";
import { hashTag } from "../hashTag";

const getURL = (post: any): string | null =>
  Array.isArray(post)
    ? post
        .map((x: any) => (x.candidates ? x.candidates[0].url : null))
        .toString()
    : post.candidates
    ? post.candidates[0].url
    : null;

const getCarousel = (c: any) =>
  c.map((x: any) =>
    x.media_type === 1
      ? { media_type: x.media_type, image_versions2: getURL(x.image_versions2) }
      : {
          media_type: x.media_type,
          image_versions2: getURL(x.image_versions2),
          video_versions: x.video_versions,
        }
  );

const isIGTV = (post: any): boolean =>
  post.additional_candidates ? true : false;

const flatPosts = (obj: any) =>
  obj.media_type === 1
    ? {
        media_type: obj.media_type,
        image_versions2: getURL(obj.image_versions2),
        code: obj.code,
        user: obj.user,
        caption: obj.caption,
      }
    : obj.media_type === 2
    ? {
        media_type: obj.media_type,
        image_versions2: getURL(obj.image_versions2),
        video_versions: obj.video_versions,
        code: obj.code,
        user: obj.user,
        caption: obj.caption,
        isIGTV: isIGTV(
          Array.isArray(obj.image_versions2)
            ? obj.image_versions2[0]
            : obj.image_versions2
        ),
      }
    : {
        media_type: obj.media_type,
        carousel_media: getCarousel(obj.carousel_media),
        code: obj.code,
        user: obj.user,
        caption: obj.caption,
      };

const caption = (post: any) => `repost from @${post.user.username} \u2063\n ${
  post.caption
} \u2063\n ${_.sampleSize(
  hashTag.hashtags,
  Math.floor(Math.random() * (5 - 3 + 1)) + 3
)
  .toString()
  .replace(/,/g, " ")}
          `;

const handleUplaod = async (posts: any) =>
  await Bluebird.mapSeries(posts, async (post: any) => {
    switch (post.media_type) {
      case 1:
        await uploadPhoto("./cookie.json", post.image_versions2, caption(post))
          .then(
            async () =>
              await Post.findOneAndUpdate(
                { code: post.code.trim() },
                { status: 1 }
              ).then(() => console.log(`${post.code} uploaded`))
          )
          .catch(async (e) => {
            console.log(e);
            await Post.findOneAndUpdate(
              { code: post.code.trim() },
              { status: 2 }
            );
          });
        await sleep(seconds(40, 60));
        break;

      case 2:
        await uploadVideo(
          "./cookie.json",
          post.video_versions,
          post.image_versions2,
          caption(post),
          post.isIGTV
        )
          .then(
            async () =>
              await Post.findOneAndUpdate(
                { code: post.code.trim() },
                { status: 1 }
              ).then(() => console.log(`${post.code} uploaded`))
          )
          .catch(async (e) => {
            console.log(e);
            await Post.findOneAndUpdate(
              { code: post.code.trim() },
              { status: 2 }
            );
          });
        await sleep(seconds(40, 60));
        break;

      case 8:
        await uploadAlbums("./cookie.json", caption(post), post.carousel_media)
          .then(
            async () =>
              await Post.findOneAndUpdate(
                { code: post.code.trim() },
                { status: 1 }
              ).then(() => console.log(`${post.code} uploaded`))
          )
          .catch(async (e) => {
            console.log(e);
            await Post.findOneAndUpdate(
              { code: post.code.trim() },
              { status: 2 }
            );
          });
        await sleep(seconds(40, 60));
        break;

      default:
        break;
    }
  });

const find = () =>
  Post.find({ status: 0 })
    .sort({ timestamp: "desc" })
    .populate({ path: "user", select: "username", model: User })
    .limit(2)
    .then((posts) => posts);

export { find, flatPosts, handleUplaod };
