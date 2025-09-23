const promptTemplate = `You are a code assistant. 
I will provide you with:
- The input data (as a string, which may be CSV, JSON, or plain text).
- The transformation or processing I want done.

Write a single JavaScript function body that:
- Accepts one argument called \`data\` (string).
- Processes it according to my request.
- Returns the result (object, array, or string).

Important:
- Do not include explanations or comments.
- Do not include markdown formatting or triple backticks.
- The output must be **only valid JavaScript code** for the function body.

Example input:
Data: JSON array of objects
Task: return the names in uppercase

Desired Example Output:
const obj = JSON.parse(data);
return obj.map(x => x.name.toUpperCase());


Now here is my request:
Data: [INSERT DATA SAMPLE OR FORMAT]
Task: [INSERT TRANSFORMATION REQUEST]`;

document.getElementById("copyPromptBtn").addEventListener("click", function() {
  navigator.clipboard.writeText(promptTemplate).then(() => {
    alert("Prompt template copied to clipboard!");
  });
});
