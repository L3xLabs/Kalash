import { promises as fs } from "fs";
import path from "path";
import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Team {
  teamId: string;
  members: string[];
  teamStrengths: string[];
}

async function createTeams() {
  try {
    // Read the JSON files
    const questionsPath = path.join(process.cwd(), "db/Question.json");
    const answersPath = path.join(process.cwd(), "db/Quiz.json");

    const [questionsData, answersData] = await Promise.all([
      fs.readFile(questionsPath, "utf-8"),
      fs.readFile(answersPath, "utf-8"),
    ]);

    const questions: Question[] = JSON.parse(questionsData);
    const answers: Answer[] = JSON.parse(answersData);

    const mappedAnswers = answers.map((answer) => ({
      username: answer.username,
      answers: answer.answers.map((ans, index) => {
        const question = questions[index];
        if (question.type === "radio") {
          // Return the selected option for radio-type questions
          return question.options[Number(ans)];
        } else if (question.type === "slider") {
          // Return the numeric value for slider-type questions
          return `Rated ${ans} on a scale of 1-10`;
        }
        return ans; // Fallback, should not happen with given data
      }),
    }));

    // Prepare data for OpenAI analysis
    const analysisPrompt = `
        Based on the following questions and user answers, create balanced teams of 5 people each.
        Consider diversity in skills, experience, and problem-solving approaches.
        
        Questions:
        ${questions.map((q) => `${q.id}. ${q.question} (${q.type})`).join("\n")}
        
        User Answers:
        ${mappedAnswers
          .map(
            (a) => `
          Username: ${a.username}
          ${a.answers.map((ans, i) => `Q${questions[i].id}: ${ans}`).join("\n")}
        `
          )
          .join("\n")}
        
        Create balanced teams of 5 people each. Analyze their responses and group them based on complementary skills and experiences.
        Provide the response in this exact format, with exactly these keys:
        {
          "teams": [
            {
              "teamId": "Team1",
              "members": ["username1", "username2", "username3", "username4", "username5"],
              "teamStrengths": ["strength1", "strength2", "strength3"]
            }
          ]
        }
      `;

    // Make OpenAI API call
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a team formation expert who analyzes responses and creates balanced teams. Always respond in valid JSON format.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    // Parse the response
    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error("No response content from OpenAI");
    }

    // Parse the JSON response
    const teamsData = JSON.parse(responseContent);

    // Write to Teams.json
    const teamsPath = path.join(process.cwd(), "db/Teams.json");
    await fs.writeFile(teamsPath, JSON.stringify(teamsData, null, 2));

    console.log("Teams have been created and saved successfully!");
    return teamsData;
  } catch (error) {
    console.error("Error creating teams:", error);
    throw error;
  }
}

// API route handler
export async function POST() {
  try {
    const teams = await createTeams();
    return new Response(JSON.stringify(teams), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create teams",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
