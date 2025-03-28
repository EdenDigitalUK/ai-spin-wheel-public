const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    // Call Groq API with the user's prompt
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates options for a spin wheel based on the user's prompt. Provide a list of options, one per line. Each option should be very concise (maximum 4 words). Ensure the options are clean and child-friendly, suitable for a 12-year-old audience. Don't number the items or use bullet points. Just provide the raw list of items."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    const data = await response.json();
    
    // Check if the API returned an error
    if (data.error) {
      console.error('Groq API error:', data.error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error from Groq API: ' + data.error.message })
      };
    }
    
    // Parse the response to extract options
    const content = data.choices[0].message.content;
    const options = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('*') && !line.match(/^\d+\./));

    // If no options were generated or the parsing failed
    if (options.length === 0) {
      // Fallback to simple parsing in case the AI didn't follow instructions
      const fallbackOptions = content
        .replace(/[•*-]/g, '')  // Remove bullets
        .replace(/\d+\.\s*/g, '')  // Remove numbered lists
        .split(/[,.;]|\n/)  // Split by common separators
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      if (fallbackOptions.length > 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            options: fallbackOptions,
            provider: "groq"
          })
        };
      }
      
      return {
        statusCode: 422,
        body: JSON.stringify({ error: 'Failed to extract options from AI response' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        options,
        provider: "groq"
      })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate options: ' + error.message })
    };
  }
};
