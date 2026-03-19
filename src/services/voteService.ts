import { v4 as uuidv4 } from 'uuid';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  increment, 
  serverTimestamp,
  onSnapshot,
  setDoc,
  runTransaction,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface VoteData {
  nickname?: string | null;
  district: string;
  constituency: string;
  party: string;
  ageGroup?: string;
  demographic?: 'Urban' | 'Rural';
}

export interface Comment {
  id: string;
  nickname: string;
  content: string;
  partyId?: string;
  timestamp: any;
  replyCount?: number;
  likes?: number;
}

export interface CommentReply {
  id: string;
  commentId: string;
  nickname: string;
  content: string;
  timestamp: any;
  likes?: number;
}

export interface ForumTopic {
  id: string;
  nickname: string;
  title: string;
  content: string;
  category: string;
  upvotes: number;
  replyCount: number;
  timestamp: any;
  replies?: ForumReply[];
}

export interface ForumReply {
  id: string;
  topicId: string;
  nickname: string;
  content: string;
  timestamp: any;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  imageUrl: string;
  timestamp: any;
  views: number;
}

export interface GameChallenge {
  id: string;
  creatorNickname: string;
  timestamp: any;
  scores: ChallengeScore[];
}

export interface ChallengeScore {
  id: string;
  nickname: string;
  score: number;
  timestamp: any;
}

const DEVICE_ID_KEY = 'tn_2026_device_id';
const VOTE_FLAG_KEY = 'tn_2026_voted';

const VOTE_HISTORY_KEY = 'tn_2026_voted_parties';

export const getDeviceId = () => {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
};

export const getVotedPartiesLocally = (): string[] => {
  const history = localStorage.getItem(VOTE_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const hasVotedForPartyLocally = (partyId: string) => {
  return getVotedPartiesLocally().includes(partyId);
};

// --- Votes ---
export const submitVote = async (data: VoteData) => {
  const deviceId = getDeviceId();
  const path = 'votes';
  
  try {
    // Check if already voted for THIS specific party in Firestore
    const votesRef = collection(db, path);
    const q = query(votesRef, where('deviceId', '==', deviceId), where('party', '==', data.party));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('ALREADY_VOTED_FOR_PARTY');
    }

    await addDoc(votesRef, {
      ...data,
      deviceId,
      timestamp: serverTimestamp(),
      ageGroup: data.ageGroup || 'Not Specified',
      demographic: data.demographic || 'Not Specified'
    });

    const votedParties = getVotedPartiesLocally();
    if (!votedParties.includes(data.party)) {
      votedParties.push(data.party);
      localStorage.setItem(VOTE_HISTORY_KEY, JSON.stringify(votedParties));
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'ALREADY_VOTED_FOR_PARTY') throw error;
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getOverallResults = async () => {
  const path = 'votes';
  try {
    const votesRef = collection(db, path);
    const querySnapshot = await getDocs(votesRef);
    
    if (querySnapshot.empty) return null;
    
    const results: any = { totalVotes: querySnapshot.size };
    querySnapshot.forEach((doc) => {
      const v = doc.data();
      results[v.party] = (results[v.party] || 0) + 1;
    });

    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const getDistrictResults = async (district: string) => {
  const path = 'votes';
  try {
    const votesRef = collection(db, path);
    const q = query(votesRef, where('district', '==', district));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;

    const results: any = { totalVotes: querySnapshot.size };
    querySnapshot.forEach((doc) => {
      const v = doc.data();
      results[v.party] = (results[v.party] || 0) + 1;
    });

    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const getConstituencyResults = async (constituency: string) => {
  const path = 'votes';
  try {
    const votesRef = collection(db, path);
    const q = query(votesRef, where('constituency', '==', constituency));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;

    const results: any = { totalVotes: querySnapshot.size };
    querySnapshot.forEach((doc) => {
      const v = doc.data();
      results[v.party] = (results[v.party] || 0) + 1;
    });

    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const getDemographicInsights = async () => {
  const path = 'votes';
  try {
    const votesRef = collection(db, path);
    const querySnapshot = await getDocs(votesRef);
    
    const insights: {
      ageGroups: { [key: string]: { [key: string]: number } };
      areas: { [key: string]: { [key: string]: number } };
    } = {
      ageGroups: {},
      areas: {}
    };

    querySnapshot.forEach((doc) => {
      const v = doc.data();
      const party = v.party;
      const ageGroup = v.ageGroup || 'Not Specified';
      const area = v.demographic || 'Not Specified';

      // Age Group Breakdown
      if (!insights.ageGroups[ageGroup]) insights.ageGroups[ageGroup] = {};
      insights.ageGroups[ageGroup][party] = (insights.ageGroups[ageGroup][party] || 0) + 1;

      // Area Breakdown
      if (!insights.areas[area]) insights.areas[area] = {};
      insights.areas[area][party] = (insights.areas[area][party] || 0) + 1;
    });

    return insights;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

// --- Comments ---
export const getComments = async (): Promise<Comment[]> => {
  const path = 'comments';
  try {
    const commentsRef = collection(db, path);
    const q = query(commentsRef, orderBy('timestamp', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};

export const postComment = async (nickname: string, content: string, partyId?: string) => {
  const path = 'comments';
  try {
    const commentsRef = collection(db, path);
    await addDoc(commentsRef, {
      nickname,
      content,
      partyId: partyId || null,
      timestamp: serverTimestamp(),
      replyCount: 0
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const postCommentReply = async (commentId: string, nickname: string, content: string) => {
  const path = `comments/${commentId}/replies`;
  try {
    const commentRef = doc(db, 'comments', commentId);
    const repliesRef = collection(db, 'comments', commentId, 'replies');

    await runTransaction(db, async (transaction) => {
      const commentDoc = await transaction.get(commentRef);
      if (!commentDoc.exists()) throw new Error("Comment does not exist!");

      transaction.set(doc(repliesRef), {
        nickname,
        content,
        timestamp: serverTimestamp()
      });

      transaction.update(commentRef, {
        replyCount: increment(1)
      });
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const likeComment = async (commentId: string) => {
  const path = `comments/${commentId}`;
  try {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, {
      likes: increment(1)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const likeCommentReply = async (commentId: string, replyId: string) => {
  const path = `comments/${commentId}/replies/${replyId}`;
  try {
    const replyRef = doc(db, 'comments', commentId, 'replies', replyId);
    await updateDoc(replyRef, {
      likes: increment(1)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// --- Shouts (Battle Arena) ---
export const getShouts = async (): Promise<{ partyId: string; count: number }[]> => {
  const path = 'shouts';
  try {
    const shoutsRef = collection(db, path);
    const querySnapshot = await getDocs(shoutsRef);
    return querySnapshot.docs.map(doc => ({
      partyId: doc.id,
      count: doc.data().count || 0
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};

export const postShout = async (partyId: string) => {
  const path = `shouts/${partyId}`;
  try {
    const shoutRef = doc(db, 'shouts', partyId);
    await setDoc(shoutRef, { count: increment(1) }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// --- Forum ---
export const getForumTopics = async (): Promise<ForumTopic[]> => {
  const path = 'forum_topics';
  try {
    const topicsRef = collection(db, path);
    const q = query(topicsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ForumTopic));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};

export const getForumTopic = async (id: string): Promise<ForumTopic> => {
  const path = `forum_topics/${id}`;
  try {
    const topicRef = doc(db, 'forum_topics', id);
    const topicDoc = await getDoc(topicRef);
    
    if (!topicDoc.exists()) throw new Error('Topic not found');
    
    const repliesRef = collection(db, 'forum_topics', id, 'replies');
    const q = query(repliesRef, orderBy('timestamp', 'asc'));
    const repliesSnapshot = await getDocs(q);
    
    const replies = repliesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ForumReply));

    return {
      id: topicDoc.id,
      ...topicDoc.data(),
      replies
    } as ForumTopic;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    throw error;
  }
};

export const postForumTopic = async (nickname: string, title: string, content: string, category: string) => {
  const path = 'forum_topics';
  try {
    const topicsRef = collection(db, path);
    const docRef = await addDoc(topicsRef, {
      nickname,
      title,
      content,
      category: category || 'General',
      upvotes: 0,
      replyCount: 0,
      timestamp: serverTimestamp()
    });
    return { id: docRef.id };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

export const postForumReply = async (topicId: string, nickname: string, content: string) => {
  const path = `forum_topics/${topicId}/replies`;
  try {
    const topicRef = doc(db, 'forum_topics', topicId);
    const repliesRef = collection(db, 'forum_topics', topicId, 'replies');

    await runTransaction(db, async (transaction) => {
      const topicDoc = await transaction.get(topicRef);
      if (!topicDoc.exists()) throw new Error("Topic does not exist!");

      transaction.set(doc(repliesRef), {
        nickname,
        content,
        timestamp: serverTimestamp()
      });

      transaction.update(topicRef, {
        replyCount: increment(1)
      });
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const upvoteForumTopic = async (id: string) => {
  const path = `forum_topics/${id}`;
  try {
    const topicRef = doc(db, 'forum_topics', id);
    await updateDoc(topicRef, {
      upvotes: increment(1)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// --- Blog ---
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const path = 'blog_posts';
  try {
    const blogRef = collection(db, path);
    const q = query(blogRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};

export const getLatestBlogPosts = async (count: number = 3): Promise<BlogPost[]> => {
  const path = 'blog_posts';
  try {
    const blogRef = collection(db, path);
    const q = query(blogRef, orderBy('timestamp', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const path = 'blog_posts';
  try {
    const blogRef = collection(db, path);
    const q = query(blogRef, where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as BlogPost;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

export const postBlogPost = async (post: Omit<BlogPost, 'id' | 'timestamp' | 'views'>) => {
  const path = 'blog_posts';
  try {
    const blogRef = collection(db, path);
    await addDoc(blogRef, {
      ...post,
      timestamp: serverTimestamp(),
      views: 0
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const updateBlogPost = async (id: string, post: Partial<BlogPost>) => {
  const path = `blog_posts/${id}`;
  try {
    const blogRef = doc(db, 'blog_posts', id);
    await updateDoc(blogRef, {
      ...post,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const incrementBlogViews = async (id: string) => {
  const path = `blog_posts/${id}`;
  try {
    const blogRef = doc(db, 'blog_posts', id);
    await updateDoc(blogRef, {
      views: increment(1)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// --- Game Challenges ---
export const createChallenge = async (nickname: string) => {
  const path = 'challenges';
  try {
    const challengesRef = collection(db, path);
    const docRef = await addDoc(challengesRef, {
      creatorNickname: nickname,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

export const getChallenge = async (challengeId: string): Promise<GameChallenge> => {
  const path = `challenges/${challengeId}`;
  try {
    const challengeRef = doc(db, 'challenges', challengeId);
    const challengeDoc = await getDoc(challengeRef);
    
    if (!challengeDoc.exists()) throw new Error('Challenge not found');
    
    const scoresRef = collection(db, 'challenges', challengeId, 'scores');
    const q = query(scoresRef, orderBy('score', 'desc'), orderBy('timestamp', 'asc'), limit(10));
    const scoresSnapshot = await getDocs(q);
    
    const scores = scoresSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ChallengeScore));

    return {
      id: challengeDoc.id,
      ...challengeDoc.data(),
      scores
    } as GameChallenge;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    throw error;
  }
};

export const submitChallengeScore = async (challengeId: string, nickname: string, score: number) => {
  const path = `challenges/${challengeId}/scores`;
  try {
    const scoresRef = collection(db, 'challenges', challengeId, 'scores');
    await addDoc(scoresRef, {
      nickname,
      score,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const subscribeToChallengeScores = (challengeId: string, callback: (scores: ChallengeScore[]) => void) => {
  const path = `challenges/${challengeId}/scores`;
  const scoresRef = collection(db, 'challenges', challengeId, 'scores');
  const q = query(scoresRef, orderBy('score', 'desc'), orderBy('timestamp', 'asc'), limit(10));
  return onSnapshot(q, (snapshot) => {
    const scores = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ChallengeScore));
    callback(scores);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

// --- Real-time Listeners ---
export const subscribeToOverallResults = (callback: (results: any) => void) => {
  const path = 'votes';
  const votesRef = collection(db, path);
  return onSnapshot(votesRef, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }
    const results: any = { totalVotes: snapshot.size };
    snapshot.forEach((doc) => {
      const v = doc.data();
      results[v.party] = (results[v.party] || 0) + 1;
    });
    callback(results);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const subscribeToShouts = (callback: (shouts: { partyId: string; count: number }[]) => void) => {
  const path = 'shouts';
  const shoutsRef = collection(db, path);
  return onSnapshot(shoutsRef, (snapshot) => {
    const shouts = snapshot.docs.map(doc => ({
      partyId: doc.id,
      count: doc.data().count || 0
    }));
    callback(shouts);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const subscribeToComments = (callback: (comments: Comment[]) => void) => {
  const path = 'comments';
  const commentsRef = collection(db, path);
  const q = query(commentsRef, orderBy('timestamp', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment));
    callback(comments);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const subscribeToCommentReplies = (commentId: string, callback: (replies: CommentReply[]) => void) => {
  const path = `comments/${commentId}/replies`;
  const repliesRef = collection(db, 'comments', commentId, 'replies');
  const q = query(repliesRef, orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const replies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CommentReply));
    callback(replies);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const subscribeToForumTopics = (callback: (topics: ForumTopic[]) => void) => {
  const path = 'forum_topics';
  const topicsRef = collection(db, path);
  const q = query(topicsRef, orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const topics = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ForumTopic));
    callback(topics);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

// --- Stats & Visitors ---
export const incrementVisitorCount = async () => {
  const path = 'stats/visitors';
  const visitorRef = doc(db, 'stats', 'visitors');
  const visitedKey = 'tn_pulse_visited';
  
  if (!sessionStorage.getItem(visitedKey)) {
    try {
      await setDoc(visitorRef, { count: increment(1) }, { merge: true });
      sessionStorage.setItem(visitedKey, 'true');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};

export const subscribeToVisitorCount = (callback: (count: number) => void) => {
  const path = 'stats/visitors';
  const visitorRef = doc(db, 'stats', 'visitors');
  return onSnapshot(visitorRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data().count || 0);
    } else {
      callback(0);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

// --- Admin Functions ---
export const getAllVotes = async () => {
  const path = 'votes';
  try {
    const votesRef = collection(db, path);
    const q = query(votesRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};

export const getAllComments = async () => {
  const path = 'comments';
  try {
    const commentsRef = collection(db, path);
    const q = query(commentsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};

export const deleteDocument = async (collectionName: string, id: string) => {
  const path = `${collectionName}/${id}`;
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// --- Dev Tools ---
export const clearAllData = async () => {
  localStorage.removeItem(VOTE_FLAG_KEY);
  localStorage.removeItem(DEVICE_ID_KEY);
};
