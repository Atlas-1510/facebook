import React from "react";
import WhiteBox from "../../components/common/WhiteBox";
import SecondaryButton from "../../components/common/SecondaryButton";
import { Link } from "react-router-dom";
import PostPrompt from "../../components/common/PostPrompt";
import axios from "axios";
import { useQuery } from "react-query";
import { PostInterface } from "../../types/PostInterface";
import Post from "../../components/common/Post/Post";
import SkeletonPost from "../../components/common/Post/SkeletonPost";

const Posts = () => {
  const getPosts = async () => {
    try {
      const { data } = await axios.get("/api/posts/newsfeed");
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const { status, data: newsfeed } = useQuery("newsfeed", getPosts);

  return (
    <>
      <div className=" col-span-2 hidden md:flex flex-col justify-end">
        <div className="space-y-3 sticky bottom-3 flex flex-col ">
          <WhiteBox>
            <h2 className=" text-zinc-800 font-medium text-lg mb-2">Intro</h2>
            <div className=" space-y-3">
              <SecondaryButton className="w-full">
                <span>Add Bio</span>
              </SecondaryButton>
            </div>
          </WhiteBox>
          <WhiteBox>
            <div className=" flex justify-between items-baseline">
              <h2 className=" text-zinc-800 font-medium text-lg mb-2">
                Photos
              </h2>
              <Link to="photos" className=" text-facebook-blue text-sm">
                See All Photos
              </Link>
            </div>

            <ul className="  grid grid-cols-3 grid-rows-3 gap-2">
              <li className="aspect-square bg-cyan-300">1</li>
              <li className="aspect-square bg-cyan-300">2</li>
              <li className="aspect-square bg-cyan-300">3</li>
              <li className="aspect-square bg-cyan-300">4</li>
              <li className="aspect-square bg-cyan-300">5</li>
              <li className="aspect-square bg-cyan-300">6</li>
              <li className="aspect-square bg-cyan-300">7</li>
              <li className="aspect-square bg-cyan-300">8</li>
              <li className="aspect-square bg-cyan-300">9</li>
            </ul>
          </WhiteBox>
          <WhiteBox>
            <div className=" flex justify-between items-baseline">
              <h2 className=" text-zinc-800 font-medium text-lg mb-2">
                Photos
              </h2>
              <Link to="photos" className=" text-facebook-blue text-sm">
                See All Friends
              </Link>
            </div>
            <ul className="  grid grid-cols-3 grid-rows-3 gap-2">
              <li className="aspect-square bg-cyan-300">1</li>
              <li className="aspect-square bg-cyan-300">2</li>
              <li className="aspect-square bg-cyan-300">3</li>
              <li className="aspect-square bg-cyan-300">4</li>
              <li className="aspect-square bg-cyan-300">5</li>
              <li className="aspect-square bg-cyan-300">6</li>
              <li className="aspect-square bg-cyan-300">7</li>
              <li className="aspect-square bg-cyan-300">8</li>
              <li className="aspect-square bg-cyan-300">9</li>
            </ul>
          </WhiteBox>
        </div>
      </div>
      <div className="  col-span-5 md:col-span-3">
        <div>
          <PostPrompt />
          {status === "loading" && (
            <>
              <SkeletonPost />
              <SkeletonPost />
              <SkeletonPost />
              <SkeletonPost />
              <SkeletonPost />
            </>
          )}
          {status === "error" && <div>Unable to retrieve posts</div>}
          {status === "success" &&
            newsfeed &&
            newsfeed.map((post: PostInterface) => (
              <Post key={post._id} post={post} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Posts;
