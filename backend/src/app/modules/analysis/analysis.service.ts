import { SUBSCRIPTION_TYPE } from "../../../enums/subscription_type";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { USER_STATUS } from "../../../enums/user_status";
import { IPost } from "../post/post.interface";
import { Post } from "../post/post.model";
import { User } from "../user/user.model";

const getDashboardAnalysis = async () => {
  // get all users
  const users = await User.find({});
  const totalUsers = users.length;
  const activeUsers = users.filter(
    (u) => u.status === USER_STATUS.ACTIVE
  ).length;
  const inactiveUsers = users.filter(
    (u) => u.status === USER_STATUS.INACTIVE
  ).length;
  const blockedUsers = users.filter(
    (u) => u.status === USER_STATUS.BLOCKED
  ).length;
  const writers = users.filter((u) => u.role === ENUM_USER_ROLE.WRITER).length;
  const applyForWriter = users.filter(
    (u) => u.isApplyForWriter === true
  ).length;

  // user subscription types
  const freeUsers = users.filter(
    (u) => u.subscriptionType === SUBSCRIPTION_TYPE.FREE
  ).length;
  const proUsers = users.filter(
    (u) => u.subscriptionType === SUBSCRIPTION_TYPE.PRO
  ).length;
  const premiumUsers = users.filter(
    (u) => u.subscriptionType === SUBSCRIPTION_TYPE.PREMIUM
  ).length;

  // get all posts
  const posts = await Post.find({});
  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.isPublished).length;
  const featuredPosts = posts.filter((p) => p.isFeaturedPost).length;

  const postsPerMonth: { [key: string]: number } = {};
  posts.forEach((post: IPost) => {
    const month: string | undefined = post?.publishedAt
      ?.toISOString()
      .substring(0, 7);
    if (month) {
      postsPerMonth[month] = (postsPerMonth[month] || 0) + 1;
    }
  });

  const topicCount: { [title: string]: number } = {};
  posts.forEach((post) => {
    post.topic.forEach((t) => {
      topicCount[t.title] = (topicCount[t.title] || 0) + 1;
    });
  });

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      blocked: blockedUsers,
      writers: writers,
      applyForWriter: applyForWriter,
    },
    subscriptionTypes: {
      free: freeUsers,
      pro: proUsers,
      premium: premiumUsers,
    },
    posts: {
      total: totalPosts,
      published: publishedPosts,
      featured: featuredPosts,
      perMonth: postsPerMonth,
      topics: topicCount,
    },
  };
};

export const AnalysisService = {
  getDashboardAnalysis,
};
