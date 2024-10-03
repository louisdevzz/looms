import { useEffect, useState } from "react";
import ContentCommentReply from "./ContentCommentReply";
import { getUserId } from "@/utils/auth";
const ReplyContent = ({post, comment}: {post: Post, comment: Comment}) => {
    const {
        content,
        commentId,
        createdAt,
        userId,
        postId
    } = comment;
    const [images, setImages] = useState([]);
    const [timeAgoPost, setTimeAgoPost] = useState('');
    const [timeAgoComment, setTimeAgoComment] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isLikedReply, setIsLikedReply] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentContent, setCommentContent] = useState<string|null>(null);
    const [commentCount, setCommentCount] = useState<number>(0);
    const [isReposted, setIsReposted] = useState(false);
    const [repostCountReply, setRepostCountReply] = useState(0);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [replyContent, setReplyContent] = useState<string|null>(null);
    const [issShow, setIssShow] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [localLikeCount, setLocalLikeCount] = useState<number>(0);
    const [totalReplies, setTotalReplies] = useState(0);
    const [timeAgo, setTimeAgo] = useState<string>('');
    const [isRepostedReply, setIsRepostedReply] = useState<boolean>(false);
    const [repostCount, setRepostCount] = useState<number>(0);

    const getImagesForPost = async () => {
        if (!post.postId) return;

        try {
            const response = await fetch(`/api/photo?postId=${post.postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setImages(result.photos);
            } else {
                console.error('Failed to fetch images for post');
            }
        } catch (error) {
            console.error('Error fetching images for post:', error);
        }
    };

    const userAccountId = getUserId()

    const handleLike = async () => {
        if (!userId) return; // Ensure user is logged in

        try {
            const response = await fetch('/api/like/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post_id: post.postId, user_id: userId }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.message === "Post liked successfully") {
                    setIsLiked(true);
                    setLikeCount(prevCount => prevCount + 1);
                } else if (result.message === "Like removed successfully") {
                    setIsLiked(false);
                    setLikeCount(prevCount => prevCount - 1);
                }
            } else {
                console.error('Failed to like/unlike post');
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };

    const handleRepost = async () => {
        if (!userAccountId || !post.postId || !content) return;

        try {
            const response = await fetch(`/api/post/repost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userAccountId, post_id: post.postId,post_content:content }),
            });

            if (response.ok) {
                console.log('Post successfully reposted');
                window.location.reload();
            } else {
                console.error('Failed to repost');
            }
        } catch (error) {
            console.error('Error reposting:', error);
        }
    };
    
    const checkIsReposted = async () => {
        if (!userAccountId || !post.postId) return;
    
        try {
            const response = await fetch(`/api/post/repost/isReposted?postId=${post.postId}&userId=${userAccountId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const result = await response.json();
                setIsReposted(result.isReposted);
            } else {
                console.error('Failed to check if post is reposted');
            }
        } catch (error) {
            console.error('Error checking if post is reposted:', error);
        }
    };
    
    const getTotalReposts = async () => {
        if (!post.postId) return;

        try {
            const response = await fetch(`/api/post/repost?postId=${post.postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setRepostCount(result.repostCount);
            } else {
                console.error('Failed to get total reposts');
            }
        } catch (error) {
            console.error('Error getting total reposts:', error);
        }
    };

    const checkIsLiked = async () => {
        if (!userAccountId || !post.postId) return;
    
        try {
            const response = await fetch(`/api/like/post/isLiked?postId=${post.postId}&userId=${userAccountId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const result = await response.json();
                setIsLiked(result.isLiked);
            } else {
                console.error('Failed to check if post is liked');
            }
        } catch (error) {
            console.error('Error checking if post is liked:', error);
        }
    };

    const getTotalLikes = async () => {
        if (!post.postId) return;

        try {
            const response = await fetch(`/api/like/post?postId=${post.postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setLikeCount(result.total_likes);
            } else {
                console.error('Failed to fetch total likes');
            }
        } catch (error) {
            console.error('Error fetching total likes:', error);
        }
    };

    useEffect(() => {
        getTotalLikes();
    }, [post.postId]);

    useEffect(() => {
        checkIsLiked();
        checkIsReposted();
        getTotalReposts();
    }, [post.postId, userAccountId]);

    useEffect(() => {
        const calculateTimeAgo = () => {
            const now = new Date().getTime();
            const diffInSeconds = Math.floor((now - Number(createdAt)) / 1000);

            if (diffInSeconds < 60) {
                setTimeAgoPost(`${diffInSeconds} giây`);
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                setTimeAgoPost(`${minutes} phút`);
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                setTimeAgoPost(`${hours} giờ`);
            } else {
                const days = Math.floor(diffInSeconds / 86400);
                setTimeAgoPost(`${days} ngày`);
            }
        };

        calculateTimeAgo();
        const timer = setInterval(calculateTimeAgo, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [post.create_at]);

    useEffect(() => {
        const calculateTimeAgo = () => {
            const now = new Date().getTime();
            const diffInSeconds = Math.floor((now - Number(createdAt)) / 1000);

            if (diffInSeconds < 60) {
                setTimeAgoComment(`${diffInSeconds} giây`);
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                setTimeAgoComment(`${minutes} phút`);
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                setTimeAgoComment(`${hours} giờ`);
            } else {
                const days = Math.floor(diffInSeconds / 86400);
                setTimeAgoComment(`${days} ngày`);
            }
        };

        calculateTimeAgo();
        const timer = setInterval(calculateTimeAgo, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [createdAt]);

    useEffect(() => {
        getImagesForPost();
    }, [post.postId]);

    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }

    const createComment = async () => {
        if (!post.post_id || !userId) return;

        try {
            const response = await fetch('/api/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: post.post_id,
                    user_id: userId,
                    comment_content: commentContent
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Comment created successfully:', result);
                setCommentContent('');
                toggleModal()
                // You might want to update the UI here, e.g., add the new comment to a list of comments
            } else {
                console.error('Failed to create comment');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const getTotalComments = async () => {
        if (!post.post_id) return;

        try {
            const response = await fetch(`/api/comment?postId=${post.post_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setCommentCount(result.comments.length);
            } else {
                console.error('Failed to fetch total comments');
            }
        } catch (error) {
            console.error('Error fetching total comments:', error);
        }
    };

    useEffect(() => {
        getTotalComments();
    }, [post.post_id]);

    const handleLikeComment = async () => {
        if (!commentId) return; // Ensure user is logged in

        try {
            const response = await fetch('/api/like/comment', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment_id: commentId, user_id: userAccountId }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.message === "Comment liked successfully") {
                    setIsLiked(true);
                    setLocalLikeCount(prevCount => prevCount + 1);
                } else if (result.message === "Like removed successfully") {
                    setIsLiked(false);
                    setLocalLikeCount(prevCount => prevCount - 1);
                }
            } else {
                console.error('Failed to like/unlike post');
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };

    const getTotalLikeComment = async () => {
        if (!commentId) return;

        try {
            const response = await fetch(`/api/like/comment?commentId=${commentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setLocalLikeCount(result.total_likes);
            } else {
                console.error('Failed to fetch total likes for comment');
            }
        } catch (error) {
            console.error('Error fetching total likes for comment:', error);
        }
    };

    useEffect(() => {
        getTotalLikeComment();
    }, [commentId]);

    const handleReplyComment = async () => {
        if (!commentId || !userId) return;

        try {
            const response = await fetch('/api/comment/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment_id: commentId,
                    user_id: userAccountId,
                    reply_content: replyContent,
                    post_id: postId
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Reply posted successfully:', result);
                setReplyContent(''); 
                getTotalCommentReplies();
                setIsShow(false)
            } else {
                console.error('Failed to post reply');
            }
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    const getTotalCommentReplies = async () => {
        if (!commentId) return;

        try {
            const response = await fetch(`/api/comment/reply?commentId=${commentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setTotalReplies(result.total_replies);
            } else {
                console.error('Failed to fetch total replies for comment');
            }
        } catch (error) {
            console.error('Error fetching total replies for comment:', error);
        }
    };

    useEffect(() => {
        getTotalCommentReplies();
    }, [commentId]);

    const checkIsLikedReply = async () => {
        if (!userAccountId || !commentId) return;
    
        try {
            const response = await fetch(`/api/like/comment/isLiked?commentId=${commentId}&userId=${userAccountId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const result = await response.json();
                setIsLikedReply(result.isLikedReply);
            } else {
                console.error('Failed to check if post is liked');
            }
        } catch (error) {
            console.error('Error checking if post is liked:', error);
        }
    };
    
    const handleRepostReply = async () => {
        if (!userAccountId || !commentId || !commentContent) return;

        try {
            const response = await fetch(`/api/comment/repost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userAccountId, comment_id: commentId, comment_content: commentContent }),
            });

            if (response.ok) {
                console.log('Comment successfully reposted');
                setIsRepostedReply(true);
                setRepostCountReply(prevCount => prevCount + 1);
            } else {
                console.error('Failed to repost comment');
            }
        } catch (error) {
            console.error('Error reposting comment:', error);
        }
    };
    
    const checkIsRepostedReply = async () => {
        if (!userAccountId || !commentId) return;
    
        try {
            const response = await fetch(`/api/comment/repost/isReposted?commentId=${commentId}&userId=${userAccountId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const result = await response.json();
                setIsRepostedReply(result.isRepostedReply);
            } else {
                console.error('Failed to check if comment is reposted');
            }
        } catch (error) {
            console.error('Error checking if comment is reposted:', error);
        }
    };
    
    const getTotalRepostsReply = async () => {
        if (!commentId) return;

        try {
            const response = await fetch(`/api/comment/repost?commentId=${commentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setRepostCountReply(result.repostCount);
            } else {
                console.error('Failed to get total reposts for reply');
            }
        } catch (error) {
            console.error('Error getting total reposts for reply:', error);
        }
    };

    useEffect(() => {
        if (commentId && userAccountId) {
            checkIsLikedReply();
            checkIsRepostedReply();
            getTotalRepostsReply();
        }
    }, [commentId, userAccountId]);

    return(
        <div className="relative w-full border-b border-gray-400 px-4" >
            <div className="flex items-start mb-4 ">
                <img src="https://placehold.co/40x40" alt="User profile picture" className="rounded-full w-10 h-10 mr-3"/>
                <div>
                    <div className="flex items-center mb-1">
                        <span className="font-bold mr-2">{post.user_id}</span>
                        <span className="text-gray-500 text-sm">{timeAgoPost}</span>
                    </div>
                    <p className="mb-3">{JSON.parse(post.post_content)}</p>
                    <div className="flex overflow-x-scroll gap-2 ">
                        {images.map((image:Image,index) => {
                            return(
                                <div key={index} className="rounded-lg w-64 h-64 bg-gray-200 flex items-center justify-center">
                                    <img src={image.photo_content} alt={`image`} className="object-cover w-full h-full rounded-lg" />
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex mt-5 md:ml-[16px] justify-center md:justify-start items-center text-sm font-thin gap-5 mb-3 ">
                        <div className="flex gap-1 p-2">
                            <button onClick={handleLike} className="hover:bg-slate-100 rounded-3xl">
                                <img
                                    width={20}
                                    src={isLiked ? "/assets/redheart.svg" : "/assets/heartonarticle.svg"}
                                    alt={isLiked ? "redheart" : "heart"}
                                />
                            </button>
                            <small className={`${isLiked ? "text-red-600" : ""}`}>{likeCount}</small>
                        </div>
                        <button onClick={()=>setIsShow((prv)=>!prv)} className="flex gap-1 hover:bg-slate-100 p-2 rounded-3xl">
                            <img width={20} src="/assets/comment.svg" alt="" />
                            <small>{commentCount}</small>
                        </button>
                        <button onClick={handleRepost} className={`flex gap-1 hover:bg-slate-100 p-2 rounded-3xl ${isReposted ? "bg-opacity-50 hover:bg-green-100" : ""}`}>
                            <img width={20} src={isReposted ? "/assets/replay-green.svg" : "/assets/replay.svg"} alt="" />
                            <small className={`${isReposted ? "text-green-600" : ""}`}>{repostCount}</small>
                        </button>
                        <button className="flex gap-1 hover:bg-slate-100 p-1 rounded-3xl">
                            <img width={30} src="/assets/share.svg" alt="" />
                            <small>100</small>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                            {
                                
                                    <ContentCommentReply  key={commentId} {...comment} postId={post.postId as string}/>
                                
                            }
                        </div>
        </div>
    )
}

export default ReplyContent;