const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route to handle estimate request
app.post('/estimate', async (req, res) => {
  try {
    const userInput = req.body.taskDescription;

    const prompt = `You are a highly experienced Senior IT Project Estimator and Planner.

When a user provides a project description, you must create a realistic, detailed, and professionally structured project estimate specifically for IT, software, web, and mobile app projects.

STRICT OUTPUT STRUCTURE:

Time Estimate: [In weeks or months]

Team Composition:
- [Role 1]: [Number of people]
- [Role 2]: [Number of people]
(Add more if necessary)

Work Phases:
- Phase 1: [Brief description]
- Phase 2: [Brief description]
- (Add more phases if needed)

Cost Breakdown (INR ₹):
- Development Costs: ₹[amount]
- UI/UX Design Costs: ₹[amount]
- Testing & QA Costs: ₹[amount]
- Management & Miscellaneous Costs: ₹[amount]

Total Estimated Project Cost: ₹[sum]

Risk Level: [Low / Medium / High] (with short reason)

Assumptions Made:
- [Assumption 1]
- [Assumption 2]
- (Add more if needed)


IMPORTANT NOTES:
- Always keep estimates realistic for the Indian market (in INR ₹).
- Always adapt slightly based on the type: Mobile App / Website / SaaS / Automation Tools.
- Always use bullet points and clear headings.
- Never hallucinate non-technical items (like construction, event management).
- Always sound like a real IT consulting company.

The user input is:
${userInput}
`;
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const aiReply = response.data.choices[0].message.content;

    res.json({ estimate: aiReply });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate estimate' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
