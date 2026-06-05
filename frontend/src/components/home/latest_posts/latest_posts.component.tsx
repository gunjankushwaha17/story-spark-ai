import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import { Post } from "../../../models/post";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { formatDateShort } from "../../../utils/time-formate";

const LatestPostsComponent = () => {
  const navigate = useNavigate();

  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // Back to real API
  const { data, isLoading } = useGetLatestListsQuery(undefined);

  const toggleAccordion = (postId: string) => {
    setExpandedPostId((prevId) =>
      prevId === postId ? null : postId
    );
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="w-full">
      <h2 className="mb-6 text-3xl font-bold text-gray-200">
        Latest Posts
      </h2>

      {/* Featured Story */}
      <div className="mb-8 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-600 to-pink-500 p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="max-w-3xl">
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-pink-100">
              Featured Story
            </p>

            <h3 className="mb-4 text-5xl font-bold text-white">
              Discover New Worlds
            </h3>

            <p className="text-lg leading-relaxed text-pink-100">
              Explore immersive stories created by talented writers from
              across the community.
            </p>
          </div>

          <div className="hidden text-8xl md:block">
            ✨
          </div>
        </div>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {(data?.posts?.length ?? 0) > 0 ? (
          data?.posts?.map((post: Post) => {
            const isExpanded = expandedPostId === post._id;

            return (
              <div
                key={post._id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#132347] p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
              >
                {/* Header */}
                <div className="mb-4 flex items-center">
                  <SSProfile
                    name={post.author?.name || "Unknown User"}
                    size="h-10 w-10"
                  />

                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300">
                      {post.author?.name || "Unknown User"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {formatDateShort(post.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Accordion */}
                <div
                  onClick={() => toggleAccordion(post._id)}
                  className="w-full cursor-pointer text-left"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-100">
                      {post.title}
                    </h3>

                    <span className="text-2xl text-cyan-300">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      isExpanded
                        ? "mt-4 max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="leading-relaxed text-gray-400">
                      {post.content}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/post/${post._id}`);
                      }}
                      className="mt-5 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400"
                    >
                      Read Full Story
                    </button>
                  </div>
                </div>

                {/* Topics */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.topic?.map((topic: any) => (
                    <span
                      key={topic._id}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${topic.color}`}
                    >
                      {topic.title}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400">
            Posts are not available.
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestPostsComponent;