import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../../models/post";
import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import CommunitySpotlightSkeleton from "../community_spotlight/CommunitySpotlightSkeleton";

type SpotlightWriter = {
  author: Post["author"];
  storiesCount: number;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  bookmarksCount: number;
  engagementScore: number;
  topPost: Post;
};

const TOP_WRITERS_LIMIT = 3;

const getBookmarkCount = (post: Post) => post.bookmarksCount ?? 0;

const getPostEngagementScore = (post: Post) =>
  (post.likesCount ?? 0) * 3 +
  (post.commentsCount ?? 0) * 2 +
  getBookmarkCount(post) * 2 +
  (post.viewsCount ?? 0);

const getWriterEngagementScore = (
  writer: Omit<SpotlightWriter, "engagementScore">,
) =>
  writer.likesCount * 3 +
  writer.commentsCount * 2 +
  writer.bookmarksCount * 2 +
  writer.viewsCount +
  writer.storiesCount * 5;

const rankStyles = [
  {
    badge:
      "bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-xl shadow-amber-500/50 ring-2 ring-amber-300",
    ring: "ring-amber-400/80",
    label: "Community Leader",
    accent: "text-amber-500",
  },
  {
    badge:
      "bg-gradient-to-br from-slate-300 to-slate-400 text-slate-950 shadow-xl shadow-slate-400/50 ring-2 ring-slate-200",
    ring: "ring-slate-300/70",
    label: "Rising Favorite",
    accent: "text-slate-400",
  },
  {
    badge:
      "bg-gradient-to-br from-amber-700 to-orange-700 text-white shadow-xl shadow-orange-500/40 ring-2 ring-orange-600/50",
    ring: "ring-orange-500/40",
    label: "Reader Pick",
    accent: "text-orange-400",
  },
];

const formatMetric = (value: number) =>
  new Intl.NumberFormat("en", { notation: "compact" }).format(value);

const CommunitySpotlightComponent = () => {
  const { data, isLoading, isError } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();

  const topWriters = useMemo<SpotlightWriter[]>(() => {
    const writers = new Map<string, Omit<SpotlightWriter, "engagementScore">>();

    data?.posts?.forEach((post: Post) => {
      if (!post.author) return;
      const authorKey =
        post.author._id || post.author.email || post.author.name;
      if (!authorKey) return;

      const existingWriter = writers.get(authorKey);
      const postScore = getPostEngagementScore(post);

      if (!existingWriter) {
        writers.set(authorKey, {
          author: post.author,
          storiesCount: 1,
          likesCount: post.likesCount ?? 0,
          commentsCount: post.commentsCount ?? 0,
          viewsCount: post.viewsCount ?? 0,
          bookmarksCount: getBookmarkCount(post),
          topPost: post,
        });
        return;
      }

      existingWriter.storiesCount += 1;
      existingWriter.likesCount += post.likesCount ?? 0;
      existingWriter.commentsCount += post.commentsCount ?? 0;
      existingWriter.viewsCount += post.viewsCount ?? 0;
      existingWriter.bookmarksCount += getBookmarkCount(post);

      if (postScore > getPostEngagementScore(existingWriter.topPost)) {
        existingWriter.topPost = post;
      }
    });

    return Array.from(writers.values())
      .map((writer) => ({
        ...writer,
        engagementScore: getWriterEngagementScore(writer),
      }))
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, TOP_WRITERS_LIMIT) as SpotlightWriter[];
  }, [data?.posts]);

  if (isLoading) {
    return (
      <section className="px-5 py-10 text-slate-100">
        <h2 className="mb-6 text-3xl font-bold">Community Spotlight</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <CommunitySpotlightSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 box-border">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.02] p-5 text-center text-sm font-semibold text-red-500 dark:text-red-400">
          Failed to load spotlight stories from the ecosystem database.
        </div>
      </div>
    );
  }

  const spotlightPosts = data?.posts ?? [];
  const [topWriter, ...restWriters] = topWriters;

  return (
    <section className="w-full box-border py-6 sm:py-10 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full box-border">
        {/* Section Header */}
        <div className="mb-10 max-w-2xl text-left px-0.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/10 dark:border-white/10 bg-blue-500/5 text-blue-600 dark:text-blue-400 mb-4 select-none shadow-sm dark:shadow-none">
            <i className="fa-solid fa-star text-xs" aria-hidden="true" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              Curated Showcase
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Community Spotlight
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Explore highly engaging interactive story modules written by
            collaborative system authors.
          </p>
        </div>

        {/* Top Featured Creators */}
        <div className="mb-14">
          <h3 className="text-lg sm:text-xl font-bold mb-6 tracking-tight border-b border-slate-100 dark:border-white/5 pb-3">
            Top Storytellers
          </h3>

          {topWriters.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* #1 Hero Card */}
              {topWriter && (
                <div className="lg:col-span-7">
                  <button
                    type="button"
                    onClick={() => navigate(`/post/${topWriter.topPost._id}`)}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-amber-200 bg-white/90 p-8 text-left shadow-xl backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-amber-900/30 dark:bg-slate-900/90"
                  >
                    <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />

                    <div className="mb-8 flex items-start justify-between">
                      <div className="flex items-center gap-5">
                        <div
                          className={`rounded-2xl ring-8 ring-offset-4 ring-offset-white dark:ring-offset-slate-900 ${rankStyles[0].ring} transition-transform group-hover:scale-105`}
                        >
                          <SSProfile
                            name={topWriter.author.name || "Unknown"}
                            size="h-20 w-20 text-2xl"
                          />
                        </div>
                        <div>
                          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {topWriter.author.name || "Unknown User"}
                          </p>
                          <p
                            className={`mt-1 text-sm font-semibold uppercase tracking-widest ${rankStyles[0].accent}`}
                          >
                            {rankStyles[0].label}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-2xl px-6 py-2 text-3xl font-black tracking-tighter shadow-2xl ${rankStyles[0].badge}`}
                      >
                        #1
                      </span>
                    </div>

                    <div className="mb-8 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 dark:border-amber-900/30 dark:from-amber-950/50">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                        TOP STORY
                      </p>
                      <h4 className="line-clamp-3 text-xl font-semibold leading-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {topWriter.topPost.title}
                      </h4>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 p-5 text-white">
                        <p className="text-4xl font-bold tracking-tighter">
                          {formatMetric(topWriter.engagementScore)}
                        </p>
                        <p className="text-sm opacity-90">Engagement Score</p>
                      </div>
                      <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                          {formatMetric(topWriter.storiesCount)}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Stories
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all group-hover:bg-blue-700 group-active:scale-[0.985]">
                      Read Top Story
                      <i
                        className="fas fa-arrow-right transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                </div>
              )}

              {/* #2 and #3 Cards */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {restWriters.map((writer, index) => {
                  const rank = index + 2;
                  const style = rankStyles[rank - 1];
                  return (
                    <button
                      key={writer.author._id || writer.author.email}
                      onClick={() => navigate(`/post/${writer.topPost._id}`)}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl hover:border-blue-200 dark:border-slate-700 dark:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <div
                        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${rank === 2 ? "from-slate-400 to-slate-500" : "from-orange-500 to-amber-600"}`}
                      />

                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`rounded-full ring-4 ${style.ring} transition-transform group-hover:scale-105`}
                          >
                            <SSProfile
                              name={writer.author.name || "Unknown"}
                              size="h-14 w-14"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                              {writer.author.name || "Unknown User"}
                            </p>
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                              {style.label}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-4 py-1 text-lg font-black shadow-md ${style.badge}`}
                        >
                          #{rank}
                        </span>
                      </div>

                      <div className="mb-5">
                        <p className="text-xs uppercase tracking-widest text-slate-500 mb-1 dark:text-slate-400">
                          TOP STORY
                        </p>
                        <h4 className="line-clamp-2 font-semibold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {writer.topPost.title}
                        </h4>
                      </div>

                      <div className="mt-auto grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="font-bold text-lg text-slate-900 dark:text-white">
                            {formatMetric(writer.engagementScore)}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Score
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-lg text-slate-900 dark:text-white">
                            {formatMetric(writer.storiesCount)}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Stories
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-lg text-slate-900 dark:text-white">
                            {formatMetric(writer.likesCount)}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Likes
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-100 px-5 py-5 text-slate-700 dark:border-slate-700/70 dark:bg-slate-900/40 dark:text-slate-300">
              No top contributors available.
            </div>
          )}
        </div>

        {/* Recent Spotlight Content Grid */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-6 tracking-tight border-b border-slate-100 dark:border-white/5 pb-3">
            Trending Works
          </h3>

          {spotlightPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 w-full box-border">
              {spotlightPosts.slice(0, 6).map((post: Post) => {
                const authorName = post.author?.name || "Unknown User";
                return (
                  <button
                    key={post._id}
                    onClick={() => navigate(`/post/${post._id}`)}
                    className="w-full text-left bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-200 hover:scale-[1.01] hover:border-blue-500/20 dark:hover:border-blue-500/30 cursor-pointer outline-none select-none flex flex-col justify-between box-border group"
                  >
                    <div className="w-full box-border">
                      <div className="mb-4 flex items-center gap-3 w-full box-border">
                        <div className="shrink-0 border border-slate-200/80 dark:border-white/10 rounded-full overflow-hidden">
                          <SSProfile name={authorName} size="h-8 w-8 text-xs" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 truncate tracking-tight">
                            {authorName}
                          </p>
                        </div>
                      </div>
                      <h4 className="mb-2 text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="line-clamp-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        {post.content}
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-1 text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider select-none">
                      Read Story
                      <i
                        className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-10 sm:p-14 text-center box-border max-w-full">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-5 border border-slate-200/60 dark:border-white/5 select-none">
                <i
                  className="fa-solid fa-layer-group text-slate-400 dark:text-slate-500 text-xl"
                  aria-hidden="true"
                />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
                No Spotlight Stories available
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto leading-normal">
                Check back shortly as system engines process content records
                into the stream.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommunitySpotlightComponent;
