import Event from "../models/Event.js";
import Stream from "../models/Stream.js";
import User from "../models/User.js";
import Forum from "../models/Forum.js";


export async function searchPlatform(query){

  const events = await Event.find({
    $text:{ $search: query }
  }).limit(10);

  const users = await User.find({
    $text:{ $search: query }
  }).limit(10);

  const posts = await Forum.find({
    $text:{ $search: query }
  }).limit(10);

  return {
    events,
    users,
    posts
  };

}



export const globalSearch = async (query) => {
  const regex = new RegExp(query, "i");

  const [events, streams, users, posts] = await Promise.all([
    Event.find({ title: regex }).limit(10),
    Stream.find({ title: regex }).limit(10),
    User.find({ username: regex }).limit(10),
    Forum.find({ title: regex }).limit(10)
  ]);

  return { events, streams, users, posts };
};