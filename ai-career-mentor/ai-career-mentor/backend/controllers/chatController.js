const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');
const Analytics = require('../models/Analytics');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAMkDs1SIaTHsVHaxVbD1GlBdnnQbaWkKg');

const SYSTEM_CONTEXT = `You are an expert AI Career Mentor. You help users with:
- Career guidance and planning
- Resume writing and optimization  
- Interview preparation and mock interviews
- Skill gap analysis
- Career roadmap generation
- Job search strategies
- Professional development advice
Be concise, practical, and encouraging. Format responses with clear sections when helpful.`;

// @POST /api/chat/message
exports.sendMessage = async (req, res) => {
  try {
    const { message, chatId, careerInterest, skillLevel } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required.' });

    const userContext = `User profile: Career Interest: ${careerInterest || req.user.careerInterest}, Skill Level: ${skillLevel || req.user.skillLevel}, Role: ${req.user.role}`;
    const prompt = `${SYSTEM_CONTEXT}\n\n${userContext}\n\nUser: ${message}`;

    let aiResponse = '';
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      aiResponse = result.response.text();
    } catch (aiError) {
      console.error('Gemini API error:', aiError.message);
      // Fallback responses
      aiResponse = getFallbackResponse(message, req.user);
    }

    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId: req.user._id });
      if (chat) {
        chat.messages.push({ role: 'user', content: message });
        chat.messages.push({ role: 'assistant', content: aiResponse });
        await chat.save();
      }
    }

    if (!chat) {
      chat = await Chat.create({
        userId: req.user._id,
        title: message.substring(0, 60),
        messages: [
          { role: 'user', content: message },
          { role: 'assistant', content: aiResponse }
        ]
      });
    }

    await Analytics.create({ userId: req.user._id, event: 'chat_message', data: { chatId: chat._id } });

    res.json({ response: aiResponse, chatId: chat._id, chat });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
  }
};

// @GET /api/chat/history
exports.getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select('title category updatedAt messages');
    res.json({ chats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history.' });
  }
};

// @GET /api/chat/:id
exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ error: 'Chat not found.' });
    res.json({ chat });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat.' });
  }
};

// @DELETE /api/chat/:id
exports.deleteChat = async (req, res) => {
  try {
    await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Chat deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chat.' });
  }
};

function getFallbackResponse(message, user) {
  const msg = message.toLowerCase();
  if (msg.includes('resume') || msg.includes('cv')) {
    return `**Resume Tips for ${user.careerInterest || 'your field'}:**\n\n1. **Tailor it** - Customize for each job posting\n2. **Quantify achievements** - Use numbers and metrics\n3. **Strong summary** - 2-3 sentences highlighting your value\n4. **Keywords** - Mirror the job description language\n5. **Clean format** - Use ATS-friendly templates\n\nWould you like me to review your specific resume? Upload it using the Resume Analyzer feature!`;
  } else if (msg.includes('interview')) {
    return `**Interview Preparation Guide:**\n\n**Before the Interview:**\n- Research the company thoroughly\n- Prepare STAR method stories (Situation, Task, Action, Result)\n- Practice common questions\n\n**Common Questions:**\n- Tell me about yourself\n- Why this company?\n- What's your biggest achievement?\n- Where do you see yourself in 5 years?\n\n**Tips:**\n- Arrive 10 mins early (or log in early for virtual)\n- Ask thoughtful questions\n- Send a thank-you email within 24 hours`;
  } else if (msg.includes('roadmap') || msg.includes('career path')) {
    return `**Career Roadmap for ${user.careerInterest || 'Technology'}:**\n\n**Phase 1 (0-6 months):** Build foundations\n- Core technical skills\n- Portfolio projects\n\n**Phase 2 (6-18 months):** Gain experience\n- Entry-level positions or internships\n- Networking and mentorship\n\n**Phase 3 (18-36 months):** Grow expertise\n- Specialization\n- Leadership opportunities\n\nWhat specific area would you like a more detailed roadmap for?`;
  }
  return `As your AI Career Mentor, I'm here to help with your ${user.careerInterest || 'career'} journey! I can assist with:\n\n- 📄 **Resume Review** - Upload your resume for detailed feedback\n- 🗺️ **Career Roadmap** - Custom plan based on your goals\n- 🎯 **Skill Gap Analysis** - Know what to learn next\n- 🎤 **Interview Prep** - Practice common questions\n\nWhat would you like to focus on today?`;
}

