import { connectToDB } from "@utils/database";

import Prompt from '@models/prompt';

export const POST = async (req) => {
    const { userId, prompt, tag} = await req.json();
    console.log('hi', userId)
    try {
        await connectToDB(); // it is a lambda => do its job and die
        const newPrompt = new Prompt({
            creator: userId,
            prompt,
            tag
        })

        await newPrompt.save();

        return new Response(JSON.stringify(newPrompt), { status: 201 });
    } catch (err) {
        return new Response('Failed to create new prompt', { status: 500 });
    }
}