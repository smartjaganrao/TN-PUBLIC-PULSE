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
import { db } from './firebase';

export interface VoteData {
  nickname?: string;
  district: string;
  party: string;
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

const DEVICE_ID_KEY = 'tn_2026_device_id';
const VOTE_FLAG_KEY = 'tn_2026_voted';

export const getDeviceId = () => {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
};

export const hasVotedLocally = () => {
  return localStorage.getItem(VOTE_FLAG_KEY) === 'true';
};

// --- Votes ---
export const submitVote = async (data: VoteData) => {
  const deviceId = getDeviceId();
  
  // Check if already voted in Firestore (optional but good for security)
  const votesRef = collection(db, 'votes');
  const q = query(votesRef, where('deviceId', '==', deviceId));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    throw new Error('ALREADY_VOTED');
  }

  await addDoc(votesRef, {
    ...data,
    deviceId,
    timestamp: serverTimestamp()
  });

  localStorage.setItem(VOTE_FLAG_KEY, 'true');
};

export const getOverallResults = async () => {
  const votesRef = collection(db, 'votes');
  const querySnapshot = await getDocs(votesRef);
  
  if (querySnapshot.empty) return null;
  
  const results: any = { totalVotes: querySnapshot.size };
  querySnapshot.forEach((doc) => {
    const v = doc.data();
    results[v.party] = (results[v.party] || 0) + 1;
  });

  return results;
};

export const getDistrictResults = async (district: string) => {
  const votesRef = collection(db, 'votes');
  const q = query(votesRef, where('district', '==', district));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;

  const results: any = { totalVotes: querySnapshot.size };
  querySnapshot.forEach((doc) => {
    const v = doc.data();
    results[v.party] = (results[v.party] || 0) + 1;
  });

  return results;
};

// --- Comments ---
export const getComments = async (): Promise<Comment[]> => {
  const commentsRef = collection(db, 'comments');
  const q = query(commentsRef, orderBy('timestamp', 'desc'), limit(50));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Comment));
};

export const postComment = async (nickname: string, content: string, partyId?: string) => {
  const commentsRef = collection(db, 'comments');
  await addDoc(commentsRef, {
    nickname,
    content,
    partyId: partyId || null,
    timestamp: serverTimestamp(),
    replyCount: 0
  });
};

export const postCommentReply = async (commentId: string, nickname: string, content: string) => {
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
};

export const likeComment = async (commentId: string) => {
  const commentRef = doc(db, 'comments', commentId);
  await updateDoc(commentRef, {
    likes: increment(1)
  });
};

export const likeCommentReply = async (commentId: string, replyId: string) => {
  const replyRef = doc(db, 'comments', commentId, 'replies', replyId);
  await updateDoc(replyRef, {
    likes: increment(1)
  });
};

// --- Shouts (Battle Arena) ---
export const getShouts = async (): Promise<{ partyId: string; count: number }[]> => {
  const shoutsRef = collection(db, 'shouts');
  const querySnapshot = await getDocs(shoutsRef);
  return querySnapshot.docs.map(doc => ({
    partyId: doc.id,
    count: doc.data().count || 0
  }));
};

export const postShout = async (partyId: string) => {
  const shoutRef = doc(db, 'shouts', partyId);
  await setDoc(shoutRef, { count: increment(1) }, { merge: true });
};

// --- Forum ---
export const getForumTopics = async (): Promise<ForumTopic[]> => {
  const topicsRef = collection(db, 'forum_topics');
  const q = query(topicsRef, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as ForumTopic));
};

export const getForumTopic = async (id: string): Promise<ForumTopic> => {
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
};

export const postForumTopic = async (nickname: string, title: string, content: string, category: string) => {
  const topicsRef = collection(db, 'forum_topics');
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
};

export const postForumReply = async (topicId: string, nickname: string, content: string) => {
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
};

export const upvoteForumTopic = async (id: string) => {
  const topicRef = doc(db, 'forum_topics', id);
  await updateDoc(topicRef, {
    upvotes: increment(1)
  });
};

// --- Blog ---
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const blogRef = collection(db, 'blog_posts');
  const q = query(blogRef, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const blogRef = collection(db, 'blog_posts');
  const q = query(blogRef, where('slug', '==', slug), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as BlogPost;
};

export const postBlogPost = async (post: Omit<BlogPost, 'id' | 'timestamp' | 'views'>) => {
  const blogRef = collection(db, 'blog_posts');
  await addDoc(blogRef, {
    ...post,
    timestamp: serverTimestamp(),
    views: 0
  });
};

export const incrementBlogViews = async (id: string) => {
  const blogRef = doc(db, 'blog_posts', id);
  await updateDoc(blogRef, {
    views: increment(1)
  });
};

// --- Real-time Listeners ---
export const subscribeToOverallResults = (callback: (results: any) => void) => {
  const votesRef = collection(db, 'votes');
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
  });
};

export const subscribeToShouts = (callback: (shouts: { partyId: string; count: number }[]) => void) => {
  const shoutsRef = collection(db, 'shouts');
  return onSnapshot(shoutsRef, (snapshot) => {
    const shouts = snapshot.docs.map(doc => ({
      partyId: doc.id,
      count: doc.data().count || 0
    }));
    callback(shouts);
  });
};

export const subscribeToComments = (callback: (comments: Comment[]) => void) => {
  const commentsRef = collection(db, 'comments');
  const q = query(commentsRef, orderBy('timestamp', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment));
    callback(comments);
  });
};

export const subscribeToCommentReplies = (commentId: string, callback: (replies: CommentReply[]) => void) => {
  const repliesRef = collection(db, 'comments', commentId, 'replies');
  const q = query(repliesRef, orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const replies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CommentReply));
    callback(replies);
  });
};

export const subscribeToForumTopics = (callback: (topics: ForumTopic[]) => void) => {
  const topicsRef = collection(db, 'forum_topics');
  const q = query(topicsRef, orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const topics = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ForumTopic));
    callback(topics);
  });
};

// --- Admin Functions ---
export const getAllVotes = async () => {
  const votesRef = collection(db, 'votes');
  const q = query(votesRef, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllComments = async () => {
  const commentsRef = collection(db, 'comments');
  const q = query(commentsRef, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

// --- Dev Tools ---
export const clearAllData = async () => {
  localStorage.removeItem(VOTE_FLAG_KEY);
  localStorage.removeItem(DEVICE_ID_KEY);
};
