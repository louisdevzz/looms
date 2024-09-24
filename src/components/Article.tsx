"use client"
import Link from "next/link"
import { useEffect, useState } from "react";
import {Buffer} from "buffer" 

export default function Article({ user_id, content,postId }: ArticleProps) {
    const [isShow, setIsShow] = useState<boolean>(false);
    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }
    const [issShow, setIssShow] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState<string|null>(null);
    const [commentCount, setCommentCount] = useState<number>(0);
    const [isReposted, setIsReposted] = useState<boolean>(false);
    const [repostCount, setRepostCount] = useState<number>(0);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    const getImagesForPost = async () => {
        if (!postId) return;

        try {
            const response = await fetch(`/api/photo?postId=${postId}`, {
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

    useEffect(() => {
        getImagesForPost();
    }, [postId]);

    const handleLike = async () => {
        if (!userId) return; // Ensure user is logged in

        try {
            const response = await fetch('/api/like/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post_id: postId, user_id: userId }),
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

    const getTotalLikes = async () => {
        if (!postId) return;

        try {
            const response = await fetch(`/api/like/post?postId=${postId}`, {
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
    }, [postId]);

    const createComment = async () => {
        if (!postId || !userId) return;

        try {
            const response = await fetch('/api/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: postId,
                    user_id: userId,
                    comment_content: commentContent
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Comment created successfully:', result);
                setCommentContent('');
                toggleModal()
                window.location.reload();
                // You might want to update the UI here, e.g., add the new comment to a list of comments
            } else {
                console.error('Failed to create comment');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const getTotalComments = async () => {
        if (!postId) return;

        try {
            const response = await fetch(`/api/comment?postId=${postId}`, {
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
    }, [postId]);


    const checkIsLiked = async () => {
        if (!userId || !postId) return;
    
        try {
            const response = await fetch(`/api/like/post/isLiked?postId=${postId}&userId=${userId}`, {
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
    
    useEffect(() => {
        checkIsLiked();
    }, [postId, userId]);

    const handleRepost = async () => {
        if (!userId || !postId || !content) return;

        try {
            const response = await fetch(`/api/post/repost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, post_id: postId,post_content:content }),
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
        if (!userId || !postId) return;
    
        try {
            const response = await fetch(`/api/post/repost/isReposted?postId=${postId}&userId=${userId}`, {
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
        if (!postId) return;

        try {
            const response = await fetch(`/api/post/repost?postId=${postId}`, {
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

    useEffect(() => {
        checkIsReposted();
        getTotalReposts()
    }, [postId, userId]);

    

    return(
        <div>
            <div className="border-b border-gray-200 w-full px-2">
                {/* <header> */}
                <div className="flex flex-row gap-3 w-full">
                    <img className="rounded-full w-8 h-8 bg-cover" src="/assets/avt.png" alt="avatar" />
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between w-full items-center">
                            <Link href={`/@${user_id}`}>
                                <span className="text-sm font-semibold hover:underline">{user_id?user_id:""}</span>
                            </Link>
                            <div className="flex relative">
                                <button onClick={()=>setIssShow((prv)=>!prv)} className="z-0 hover:bg-slate-100 p-2 rounded-full">
                                    <img width={10} src="/assets/optiononarticle.svg" alt="icon" />
                                </button>
                                {
                                    issShow&&(
                                        <div className="absolute top-7 translate-x-[-230px] flex flex-col gap-1 shadow-md p-4 px-2 w-64 h-auto rounded-lg bg-white border border-gray-200">
                                            <div className="flex flex-col border-solid border-b-2 ">
                                                <button className=" flex justify-between hover:bg-slate-200 px-2 py-3 rounded-lg">
                                                    <span className="text-sm font-bold">Lưu</span>
                                                    <img width={30} src="/assets/save.svg" alt="" />
                                                </button>
                                                <button className="flex justify-between hover:bg-slate-200 px-2 py-3 rounded-lg">
                                                    <span className="text-sm font-bold">Không quan tâm</span>
                                                    <img width={25} src="/assets/eye.svg" alt="" />
                                                </button>
                                            </div>
                                            <div className="flex flex-col border-solid border-b-2 ">
                                                <button className=" flex justify-between hover:bg-slate-200 px-2 py-3 rounded-lg">
                                                    <span className="text-sm font-bold">Tắt thông báo</span>
                                                    <img width={30} src="/assets/bell.svg" alt="" />
                                                </button>
                                                <button className="flex justify-between hover:bg-slate-200 px-2 py-3 rounded-lg">
                                                    <span className="text-sm text-red-600 font-bold">Chặn</span>
                                                    <img width={25} src="/assets/block.svg" alt="" />
                                                </button>
                                                <button className="flex justify-between hover:bg-slate-200 px-2 py-3 rounded-lg">
                                                    <span className="text-sm font-bold text-red-600">Báo cáo</span>
                                                    <img width={25} src="/assets/warning.svg" alt="" />
                                                </button>
                                            </div>
                                            <div className="flex flex-col ">
                                                <button className=" flex justify-between hover:bg-slate-200 px-2 py-3 rounded-lg">
                                                    <span className="text-sm font-bold">Sao chép liên kết</span>
                                                    <img width={20} src="/assets/link.svg" alt="" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <Link href={`/@${user_id}/post/${postId}`} className="flex flex-col gap-3">
                            <span>{content?JSON.parse(content as string):""}</span>
                            <div className="flex overflow-x-scroll gap-2 ">
                                {images.map((image:Image,index) => {
                                    return(
                                        <div key={index} className="rounded-lg w-52 h-52 bg-gray-200 flex items-center justify-center">
                                            <img src={image.photo_content} alt={`image`} className="object-cover w-full h-full rounded-lg" />
                                        </div>
                                    )
                                })}
                            </div>
                        </Link>
                    </div>
                </div>
                {/* footer */}
                <div className="flex mt-5 md:ml-[60px] justify-center md:justify-start items-center text-sm font-thin gap-5 mb-3 ">
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
            {
                isShow && (
                    <div className="z-20 fixed top-0 left-0 w-full h-full bg-white md:bg-black md:bg-opacity-60" onClick={toggleModal}>
                        <div className="absolute md:left-16 md:right-0 h-full flex flex-col items-center md:justify-center">
                            <div className="py-5 flex flex-row ">
                                <div onClick={(e) => {e.stopPropagation();toggleModal();}}  className="w-[120px] md:hidden pl-[20px]">Huỷ</div>
                                <span className=" w-[120px]text-black md:text-white font-bold">Thread trả lời</span>
                                <div className="w-[120px] md:hidden"></div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className=" md:bg-white px-4 md:p-3 md:rounded-lg md:shadow-lg w-[340px] h-full md:h-[500px] md:w-[600px]">
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row gap-2 mt-2 ml-0 ">
                                        <div>
                                            <img className=" rounded-full z-0 w-8 h-8 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgFPzdgOy4CJfBOVER-gmHRQJjVfNd3LMf-Q&s" alt="" />                                                
                                        </div>
                                        <div>
                                            <div className="flex flex-row gap-3">
                                                <Link href={`/chien_ha`} className="font-bold text-sm">
                                                    <span>{user_id}</span>
                                                </Link>
                                                <span className="text-sm text-gray-400">20 giờ</span>
                                            </div>
                                            <div className="text-sm">
                                                <p>{content}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* body  */}
                                <div className="flex flex-row">
                                    <div className="h-[img] w-[4px] bg-slate-500 mx-4"></div>
                                    {/* <div className="ml-[40px] mr-[60px] flex overflow-x-scroll gap-2 ">
                                        <img className="rounded-lg " src="data:image/jpeg;base64,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" alt="" />
                                        <img className="rounded-lg " src="data:image/jpeg;base64,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" alt="" />
                                        <img className="rounded-lg " src="data:image/jpeg;base64,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" alt="" />
                                        <img className="rounded-lg " src="data:image/jpeg;base64,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" alt="" />
                                        <img className="rounded-lg " src="data:image/jpeg;base64,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" alt="" />
                                    </div> */}
                                </div>
                                <div className="flex flex-row items-center">
                                    <img width={30} className="mr-2 rounded-full w-8 h-8 bg-cover " src="data:image/jpeg;base64,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" alt="" />
                                    <div className="flex flex-col ">
                                        <span className="text-sm">{userId}</span>
                                        <input onChange={(e)=>setCommentContent(e.target.value)} className="focus outline-none text-sm font-light w-full" type="text" placeholder={`Trả lời ${userId} ...`} />
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="h-[25px] w-[2px] bg-slate-500 mx-4"></div>
                                    <div>
                                        <button className="px-2">
                                            <img width={20} src="/assets/album.svg" className="" alt="icon" />
                                        </button >   
                                        <button className="px-2">
                                            <img width={15} src="/assets/gif.svg" alt="" />
                                        </button>
                                        <button className="px-2">
                                            <img width={15} src="/assets/number.svg" alt="" />
                                        </button>
                                        <button className="px-2">
                                            <img width={20} src="/assets/bargraph.svg" alt="" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="px-2">
                                        <img width={30} className="rounded-full w-4 h-4  bg-cover" src="data:image/jpeg;base64,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" alt="" />
                                    </div>
                                    <div className="text-slate-500 text-sm font-light">
                                        <button>Thêm vào threads</button>
                                    </div>
                                </div>
                                <div className="pt-10 flex flex-row  items-center justify-between translate-y-[200px] gap-5 md:translate-y-0">
                                    <div className="text-slate-400 text-sm font-light">
                                        <button>Bất kỳ ai cũng có thể trả lời và trích dẫn</button>
                                    </div>
                                    <div>
                                        <button onClick={createComment} className="w-20 h-10 flex justify-center items-center bg-gray-400  md:mr-[40px] border border-gray-4 00 rounded-full md:rounded-lg md:bg-white">
                                            <span className="font-semibold text-white md:text-gray-400">Đăng</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                               
                )
            }      
        </div>  
    )
}