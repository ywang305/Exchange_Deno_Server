import { Context, helpers } from "https://deno.land/x/oak/mod.ts";

export async function getTwitts(context: Context) {
  const { lat, lng, radius = 1, lang = "" } = helpers.getQuery(context);

  console.info({ lat, lng, radius, lang });

  const resp = await fetch(
    "https://api.twitter.com" +
      `/1.1/search/tweets.json?geocode=${lat},${lng},${radius}km&result_type=recent&count=100&lang=${lang}`,
    {
      headers: {
        Authorization:
          "Bearer " +
          "AAAAAAAAAAAAAAAAAAAAAAoRGQEAAAAAVK2dIH5SF3FzIcZOZ8a5IKqZArc%3DxqUez8vakfPyTinWxj8jTqiHTt0G6XF20RkG1e8Vy0MADshDsn",
      },
    }
  );
  const data = await resp.json();

  console.log("get data: ", data);

  const tweets = data.statuses.map(
    ({
      created_at,
      id,
      id_str,
      text,
      user,
      place,
      entities,
      extended_entities,
    }: any) => {
      let media = null;
      if (
        extended_entities &&
        extended_entities.media &&
        extended_entities.media.length
      ) {
        media = extended_entities.media[0];
      } else if (entities && entities.media && entities.media.length) {
        media = entities.media[0];
      }

      return {
        created_at,
        id,
        id_str,
        text,
        user_name: user.name,
        screen_name: user.screen_name,
        place,
        media,
      };
    }
  );

  context.response.body = tweets;
}
