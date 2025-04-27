app.post('/estimate', async (req, res) => {
  try {
    const userInput = req.body.taskDescription;

    const prompt = `You are a professional project estimator and planning expert.
When a user provides a project or task description, you must carefully and professionally estimate the following:
1. Project Overview Summary (in 2-3 sentences).
2. Time Estimate (in number of weeks or months).
3. Required Team Roles (specify role types and approximate number of people).
4. Approximate Project Cost (in INR) — break down major cost components intelligently based on the type of project.
   Always include a "Management and Miscellaneous Costs" category at the end.
5. Overall Risk Level (Low/Medium/High) based on project complexity.
6. After providing the structured estimate, briefly explain your reasoning for the estimates (in a short paragraph of 4-5 lines).

Follow this strict format exactly:
---
Project Overview: [your short summary here]

Time Estimate: [your estimate here]

Team Required:
- [Role 1]: [number of people]
- [Role 2]: [number of people]
- (Add more roles if needed)

Cost Breakdown (in INR):
- Major Cost 1: ₹[amount]
- Major Cost 2: ₹[amount]
- (Add more components if needed)
- Management and Miscellaneous: ₹[amount]

Total Estimated Cost: ₹[sum total]

Risk Level: [Low/Medium/High]

Reasoning: [your short explanation here in 4-5 lines]
---
The user input is:
${userInput}`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
