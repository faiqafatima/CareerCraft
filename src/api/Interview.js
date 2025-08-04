const Interview = async (role) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Check for farewell
  const farewellRegex = /\b(bye|goodbye|see you|exit|quit|thanks|thank you)\b/i;
  let prompt;
  if (farewellRegex.test(role)) {
    prompt = `The user said '${role}'. End the interview politely and do not ask further questions.`;
  } else {
    prompt = `Act as an interviewer for the role of ${role}. Ask me interview questions one by one and wait for my answer after each question. Start with the first question or continue the interview.`;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || 'No response from Gemini AI.';
  } catch (error) {
    console.error('Error:', error);
    return 'AI request failed. Please try again.';
  }
};

export default Interview;