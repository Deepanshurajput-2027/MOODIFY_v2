import ai from '../../config/gemini.js';

export const streamChat = async (req, res) => {
  try {
    const { history, currentMood, requestedTone } = req.body;
    
    // Extract user name
    const userName = req.user?.profile?.displayName || req.user?.username || 'User';

    // Set necessary headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const systemInstruction = `You are a human-like music companion on the Moodify app.
Your user's name is ${userName}.
Their current detected mood is: ${currentMood || 'unknown'}.
The tone you should adopt is: ${requestedTone || 'friendly and supportive'}.`;

    // Construct the chat contents. We expect the frontend to send an array
    // formatted for the Gemini API (e.g., [{role: 'user', parts: [{text: '...'}]}])
    // If not provided, we add a fallback greeting message.
    const chatContents = history?.length > 0 ? history : [{ role: 'user', parts: [{ text: 'Hello!' }] }];

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: chatContents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }

    res.end();
  } catch (error) {
    console.error('Error in streamChat controller: ', error.message);
    // Write an error message to the stream before ending
    res.write('Error: Could not generate response.');
    res.end();
  }
};
