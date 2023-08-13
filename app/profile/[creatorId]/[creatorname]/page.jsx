'use client'

import {  useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import Profile from '@components/Profile';
import { useSession } from 'next-auth/react';

const MyProfile = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);
    const params = useParams();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`/api/users/${params?.creatorId}/posts`);
                
                const data = await response.json();
                
                setPosts(data);
            } catch (error) {
                console.log(error);
            }
        }
        if (params?.creatorId) fetchPosts();
    }, []);

    console.log(posts)
    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`);
      };
    
    const handleDelete = async (post) => {
        const hasConfirmed = confirm('Are you sure you want to delete this prompt');

        if (hasConfirmed) {
            try {
                await fetch(`api/prompt/${post._id.toString()}`, {
                    method: 'DELETE'
                })

                const filteredPosts = posts.filter((p) => p._id !== post._id)

                setPosts(filteredPosts);
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <Profile
            name={session?.user?.id === params?.creatorId ? 'My' : params.creatorname }
            desc= 'Welcome to your personalized profile page'
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    )
}

export default MyProfile;