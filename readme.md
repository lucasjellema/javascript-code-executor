# The JavaScript Code Executor



## What
A web application that allows the user to upload ( or paste) a data file ( text string, csv or json) as well as paste and execute a JavaScript code block to process that data. The result is shown, can be copied to clipboard and can be downloaded.

## Why
When working with data sets, you may want to invoke the help of an LLM backed ChatBot to do some of the manipulation, enriching, filtering etc for you. However, there are some reasons why that is not viable:
* the data is confidential and the Chatbot isa public service
* the Chatbot is not capabable of understanding or executing your request
* the Chatbot is too slow or too expensive 
* you will have to perform the same operation many times and having an LLM chew on it every time is slow and not really responsible use of AI

There a fairly simple solution that deals with all of these challenges: ask the Chatbot not to manipulate your data but to generate a piece of JavaScript to do so. You will have to tell the Chatbot once what your data looks like (not even your real data, just something similar and only a small portion of it) and describe what you want to have done to it and what the result should look like. Using a well structured prompt like the one shown below it is not hard at all to get ChatGPT, Gemini, Copilot or Le CHat to generate a piece of JavaScript. 

However, until now the challenge was for many users: how can I run that piece of code? And how can I have it work against my data? And this is precisely what this simple little app is for. In it, you bring together the code (courtesy of the LLM) and your data (paste it or upload it) - and you then run the code against the data. The output is visible in the browser page, can be copied to the clipboard and can be downloaded.

Once it has been proven to work well, the same code can be executed in the same way many times - against different sets of data - without revisiting the LLM/Chatbot. The user can save the code with a description to the local library for easy future reuse. When it first opens, the app comes with a sample library. The samples show for several use cases the prompt, the LLM generated code based on that prompt, the input data and the output. These samples illustrate how you could work with the prompt and the chatbot to craft code that processes your data in the desired way - without the user having to write or even understand JavaScript.

It is important to understand that this browser application runs entirely locally inside the browser. No data is sent to external party. Nothing needs to be installed. You open the app from the URL on GitHub. The app can be started and downloaded from GitHub Pages into your browser and from that point on runs entirely locally. Also note that currently the app only can run JavaScript. Using WebAssemly and the Python emulator for WASM, it may be fairly straightforward to also allow generated Python code.  

## How

The user can upload a file or paste data (CSV, JSON, text).

The user pastes some JavaScript code that processes that data.

They click "Run", and the result is shown.

The result can be copied or downloaded.

All of this happens client-side (no backend).




## Prompt Template

``` 
You are a code assistant. 
I will provide you with:
- The input data (as a string, which may be CSV, JSON, or plain text).
- The transformation or processing I want done.

Write a single JavaScript function body that:
- Accepts one argument called `data` (string).
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
Task: [INSERT TRANSFORMATION REQUEST]
```





## Examples

###
Using the template prompt and inserting this request:

```
Data: CSV with columns first name, last name,age, city
Task: return only the names of people older than 30 as a JSON array or living in Berlin
```

Response from LLM (Gemini):
```
const rows = data.split('\n').map(row => row.trim()).filter(row => row !== '');
return rows.filter(row => {
  const [, , age, city] = row.split(',').map(item => item.trim());
  return parseInt(age, 10) > 30 || city === 'Berlin';
}).map(row => {
  const [firstName, lastName] = row.split(',').map(item => item.trim());
  return `${firstName} ${lastName}`;
});
``` 


### people.csv

"free format" Prompt:

I have a data set with people that looks like this:

``` 
First Name,Last Name,Birth Date,City
Elijah,Lopez,1992-06-20,Houston
Olivia,Rodriguez,1986-04-11,Philadelphia
Elijah,Davis,1993-07-01,San Jose
``` 

Can you generate Javascript that processes this data and create an HTML bullet list that a concatenation of first name and last name with their age between parentheses, like:
``` 
<ul>
<li>Elijah Lopez (33)</li>
<li>Olivia Rodriguez(39)</li>
</ul>
``` 

Only generate the JavaScript - nothing else.


Response from LLM:
```

// Parse CSV
const rows = data.trim().split("\n").slice(1);
const people = rows.map(line => {
  const [firstName, lastName, birthDate] = line.split(",");
  return { firstName, lastName, birthDate };
});

// Helper: calculate age
function getAge(birthDateStr) {
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Build HTML list
let html = "<ul>\n";
people.forEach(p => {
  html += `<li>${p.firstName} ${p.lastName} (${getAge(p.birthDate)})</li>\n`;
});
html += "</ul>";
return html
``` 

### Result

after pasting the data from people.csv and the response from the LLM and running the code, here is the result:

``` 
<ul>
<li>Elijah Lopez (33)</li>
<li>Olivia Rodriguez (39)</li>
<li>Elijah Davis (32)</li>
<li>Sophia Wilson (43)</li>
<li>Isabella Davis (34)</li>
<li>Isabella Gonzalez (37)</li>
<li>Amelia Gonzalez (32)</li>
<li>Ethan Smith (53)</li>
<li>Sophia Gonzalez (25)</li>
<li>Lucas Smith (37)</li>
<li>Mia Williams (55)</li>
<li>Noah Johnson (19)</li>
<li>Liam Martinez (48)</li>
<li>Isabella Rodriguez (40)</li>
<li>Ethan Johnson (34)</li>
</ul>
``` 

### Popular Children Names

Another free format Prompt for LLM:

generate  JavaScript for creating a list of 50 random popular Dutch names for boys and girls

Generated JavaScript code:
```

const dutchFirstNames = [
  "Daan", "Emma", "Noah", "Julia", "Sem", "Mila", "Luuk", "Tess", "Finn", "Sophie",
  "Liam", "Zoë", "Jesse", "Sara", "Jayden", "Lotte", "Thijs", "Eva", "Mees", "Anna",
  "Bram", "Nina", "Milan", "Isa", "Tijn", "Evi", "Gijs", "Luna", "Siem", "Fleur",
  "Sam", "Yara", "Tom", "Liv", "Boaz", "Elin", "Ruben", "Noor", "Cas", "Maud",
  "Julian", "Saar", "Levi", "Jasmijn", "Benjamin", "Amélie", "David", "Lina", "Joep", "Roos"
];

function getRandomNames(count) {
  const shuffled = dutchFirstNames.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const randomDutchNames = getRandomNames(50);
console.log("Random Dutch Names:");
return randomDutchNames;
``` 

Result after running code:
```
[
  "Daan",
  "Milan",
  "Emma",
  "Jayden",
  "Joep",
  "Mila",
  "Lina",
  "Bram",
  "Evi",
  "Julia",
  "Siem",
  "David",
  "Ruben",
  "Thijs",
  "Isa",
  "Elin",
  "Noah",
  "Luna",
  "Sem",
  "Jasmijn",
  "Zoë",
  "Nina",
  "Tess",
  "Julian",
  "Levi",
  "Amélie",
  "Sara",
  "Sophie",
  "Saar",
  "Liv",
  "Tijn",
  "Mees",
  "Anna",
  "Maud",
  "Luuk",
  "Jesse",
  "Fleur",
  "Sam",
  "Boaz",
  "Finn",
  "Yara",
  "Liam",
  "Cas",
  "Benjamin",
  "Tom",
  "Lotte",
  "Roos",
  "Noor",
  "Gijs",
  "Eva"
]
``` 

### Age calculator

Using the standard prompt with the actual instruction at the end to return a list of first names and ages:

```
You are a code assistant. 
I will provide you with:
- The input data (as a string, which may be CSV, JSON, or plain text).
- The transformation or processing I want done.

Write a single JavaScript function body that:
- Accepts one argument called `data` (string).
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


Now here is my request: here is data (revenue per customer per month)
Data: 
Jan de Bruin,23-03-1969
Christa Jansen,11-10-1989
Jochem van Zuilen,26-12-2001 


Task: Give me a list of people (first name only) with their current age and their next birthday including the name of the weekday:

Jan,56,maandag 23 maart 2026
Christa,35,woensdag 11 oktober 2025
Jochem,24,26 december 2025
```

ChatGPT returned:

``` 
const lines = data.trim().split('\n');
const months = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
const weekdays = ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];
const today = new Date();
return lines.map(line => {
const [fullName, dobStr] = line.split(',');
const [day, month, year] = dobStr.trim().split('-').map(Number);
const birthDate = new Date(year, month - 1, day);
const thisYear = today.getFullYear();
let nextBirthday = new Date(thisYear, month - 1, day);
if (nextBirthday < today) nextBirthday.setFullYear(thisYear + 1);
const age = thisYear - year - (today < new Date(thisYear, month - 1, day) ? 1 : 0);
const weekday = weekdays[nextBirthday.getDay()];
const formattedDate = `${day} ${months[month - 1]} ${nextBirthday.getFullYear()}`;
return `${fullName.split(' ')[0]},${age},${weekday} ${formattedDate}`;
});
``` 

Running this on "actual" data:
```
Jan de Bruin,23-03-1969
Christa Jansen,11-10-1989
Jochem van Zuilen,26-12-2001 
Erik van de Berg,21-06-1975
Jitse het Hert,30-01-2003
``` 

returned this result:

```
[
  "Jan,56,maandag 23 maart 2026",
  "Christa,35,zaterdag 11 oktober 2025",
  "Jochem,23,vrijdag 26 december 2025",
  "Erik,50,zondag 21 juni 2026",
  "Jitse,22,vrijdag 30 januari 2026"
]
```


### Customer Revenue

Prompt:

You are a code assistant. 
I will provide you with:
- The input data (as a string, which may be CSV, JSON, or plain text).
- The transformation or processing I want done.

Write a single JavaScript function body that:
- Accepts one argument called `data` (string).
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


Now here is my request: here is data (revenue per customer per month)
Data: 
Customer,J,F,M,A,M,J,J, 
Customer A,23,45,12,,21,24,11,
Customer B,2,415,112,76,1,,1,
Customer A,2,15,8,,11,224,16,2
Customer D,2,415,112,76,1,,1,

Task: Produce CSV with revenue per customer (deduplicated) per quarter and per year

Customer,Q1,Q2,Q3,Y 
Customer A,23,45,3,211
Customer B,567,54,2,1,
Customer D,167,524,21,1121,



Response from Gemini:
```
const lines = data.split('\n').map(line => line.trim()).filter(line => line !== '');
const revenueData = {};
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(',').map(part => part.trim());
  const customer = parts[0];
  const monthlyRevenues = parts.slice(1);
  const q1 = (parseFloat(monthlyRevenues[0]) || 0) + (parseFloat(monthlyRevenues[1]) || 0) + (parseFloat(monthlyRevenues[2]) || 0);
  const q2 = (parseFloat(monthlyRevenues[3]) || 0) + (parseFloat(monthlyRevenues[4]) || 0) + (parseFloat(monthlyRevenues[5]) || 0);
  const q3 = (parseFloat(monthlyRevenues[6]) || 0) + (parseFloat(monthlyRevenues[7]) || 0) + (parseFloat(monthlyRevenues[8]) || 0);
  const total = q1 + q2 + q3;
  if (!revenueData[customer]) {
    revenueData[customer] = {
      Q1: 0,
      Q2: 0,
      Q3: 0,
      Y: 0
    };
  }
  revenueData[customer].Q1 += q1;
  revenueData[customer].Q2 += q2;
  revenueData[customer].Q3 += q3;
  revenueData[customer].Y += total;
}
const resultCsv = ["Customer,Q1,Q2,Q3,Y"];
for (const customer in revenueData) {
  const { Q1, Q2, Q3, Y } = revenueData[customer];
  resultCsv.push(`${customer},${Q1},${Q2},${Q3},${Y}`);
}
return resultCsv.join('\n');
``` 

Using the data in examples\customer-revenue.csv

the result:

Customer,Q1,Q2,Q3,Y
Customer A,105,280,29,414
Customer B,529,77,1,607
Customer D,529,77,1,607
Jan de Vries,948,594,422,1964
Sanne Jansen,840,657,195,1692
Pieter Bakker,699,130,136,965
Lisa de Jong,912,1926,266,3104
Bram Smit,1228,1262,521,3011
Eva Meijer,776,726,480,1982
Tom Mulder,373,671,113,1157
Daan de Boer,1167,704,216,2087
Lotte Hendriks,455,1140,460,2055



## Under the hood

The Application really is very simple. 

The files favorites=modal.html and favorites.js support the code snippets savet by the user (to the local storage in the browser)
The files samples=modal.css and samples-modal.js support usage of the shipped samples that are defined in file samples.json

The JavaScript executed my the application is created as a function that is invoked with a parameter called "data"; the function is defined as synchronous. . Whatever the function returns is presented to the end user. A simple example of valid code:  `return data.length` - assuming that parameter data holds an array.

The JavaScript cannot currently import or make use of any 3rd party libraries. Whatever is available in the browser is whatever the code can leverage. 

# Next Steps

Some suggested next pieces of functionality

* Add a DIV for the code to use as target for an SVG object or a Leaflet Map
* Add (configurable/selectable) support for loading 3rd party libraries such as d3, Leaflet, 
* Update the suggested prompt with instructions regarding 3rd party libraries and target containers for displayable results
* Support JavaScript execution in Web Worker (better separation, safer)
* Integration with LLM directly (have code generated through an API call to an LLM from this web app)

### Integrate directly with LLM to provide code (no copy & paste)
(see ChatGPT conversation https://chatgpt.com/share/68d296e1-0b94-8005-b772-f3183c10b356)

how your web app could call an LLM (like OpenAI API) and automatically fill the code box with its response, so the user can just hit Run?
make your scratchpad a “data + request → code → run” playground 🎉.
Here’s how you can hook in an LLM (say OpenAI API, but it works similarly for others).

Workflow

*User pastes or uploads data.
* User types a natural language request (“Give me the list of unique email domains”).
* App builds a prompt using the template I gave you.
* Send it to the LLM API.
* LLM responds with a JavaScript function body.

Your app drops that into the code textarea → user hits Run (or auto-runs).

1. New JS Function 

function buildPrompt(data, task) {
  return `
You are a code assistant.
I will provide you with:
- The input data (as a string, which may be CSV, JSON, or plain text).
- The transformation or processing I want done.

Write a single JavaScript function body that:
- Accepts one argument called data (string).
- Processes it according to my request.
- Returns the result (object, array, or string).

Important:
- Do not include explanations or comments.
- Do not include markdown formatting or triple backticks.
- The output must be only valid JavaScript code for the function body.

Data: ${data.slice(0, 500)}  <!-- sample, truncate to avoid giant prompts -->
Task: ${task}
`;
}



add in index.html

<h2>API Key</h2>
  <input type="password" id="apiKeyInput" placeholder="Paste your OpenAI API key">
  <button id="saveKeyBtn">Save Key</button>
  <button id="clearKeyBtn">Clear Key</button>
  <div id="keyStatus"></div>

  <h2>Task</h2>
  <input type="text" id="taskInput" placeholder="e.g. Extract all unique email domains">

  <h2>Generated JavaScript Code</h2>
  <textarea id="codeInput" placeholder="Generated code will appear here"></textarea>
  
  <button id="generateBtn">Generate Code</button>
  <button id="runBtn">Run</button>
  <button id="copyBtn">Copy Result</button>
  <button id="downloadBtn">Download Result</button>

in css:
 input[type="password"], input[type="text"] { width: 60%; }

 in js:

 // ---- API KEY HANDLING ----
    const apiKeyInput = document.getElementById("apiKeyInput");
    const keyStatus = document.getElementById("keyStatus");

    function getApiKey() {
      return localStorage.getItem("openai_api_key") || "";
    }

    function saveApiKey(key) {
      localStorage.setItem("openai_api_key", key);
      keyStatus.textContent = "✅ API key saved in browser";
    }

    function clearApiKey() {
      localStorage.removeItem("openai_api_key");
      keyStatus.textContent = "❌ API key cleared";
    }
    // Init
    if (getApiKey()) {
      apiKeyInput.value = getApiKey();
      keyStatus.textContent = "✅ API key loaded from browser";
    }

    document.getElementById("saveKeyBtn").onclick = () => saveApiKey(apiKeyInput.value);
    document.getElementById("clearKeyBtn").onclick = () => clearApiKey();

    // ---- LLM PROMPT BUILDER ----
    function buildPrompt(data, task) {
      return `
You are a code assistant.
I will provide you with:
- The input data (as a string, which may be CSV, JSON, or plain text).
- The transformation or processing I want done.

Write a single JavaScript function body that:
- Accepts one argument called data (string).
- Processes it according to my request.
- Returns the result (object, array, or string).

Important:
- Do not include explanations or comments.
- Do not include markdown formatting or triple backticks.
- The output must be only valid JavaScript code for the function body.

Data: ${data.slice(0, 500)} 
Task: ${task}
`;
    }

    // ---- CALL OPENAI API ----
    async function fetchCodeFromLLM(data, task) {
      const apiKey = getApiKey();
      if (!apiKey) {
        alert("Please provide your OpenAI API key.");
        return "";
      }

      const prompt = buildPrompt(data, task);

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0
        })
      });

      const json = await response.json();
      return json.choices?.[0]?.message?.content?.trim() || "";
    }

    // ---- GENERATE CODE ----
    document.getElementById("generateBtn").addEventListener("click", async () => {
      const data = document.getElementById("dataInput").value;
      const task = document.getElementById("taskInput").value;

      document.getElementById("codeInput").value = "// Generating code...";
      const code = await fetchCodeFromLLM(data, task);
      document.getElementById("codeInput").value = code || "// No code returned";
    });


### Add WebWorker processing

in HTML
<pre id="logs"></pre>
<pre id="result"></pre>

add new worker.js

// worker.js
self.console = {
  log: (...args) => self.postMessage({ type: "log", message: args.join(" ") }),
  error: (...args) => self.postMessage({ type: "error", message: args.join(" ") })
};

self.onmessage = function(e) {
  const { code, data } = e.data;
  try {
    const fn = new Function("data", code);
    const result = fn(data);
    self.postMessage({ type: "result", result });
  } catch (err) {
    self.postMessage({ type: "error", message: err.message });
  }
};


in main.js
<script>
  let worker;

  function runInWorker(code, data) {
    if (worker) worker.terminate(); // kill old worker
    worker = new Worker("worker.js");

    const logsEl = document.getElementById("logs");
    const resultEl = document.getElementById("result");
    logsEl.textContent = "";
    resultEl.textContent = "";

    worker.onmessage = (e) => {
      const { type, message, result } = e.data;
      if (type === "log") {
        logsEl.textContent += "[log] " + message + "\n";
      } else if (type === "error") {
        logsEl.textContent += "[error] " + message + "\n";
      } else if (type === "result") {
        const formatted = (typeof result === "object")
          ? JSON.stringify(result, null, 2)
          : String(result);
        resultEl.textContent = formatted;
      }
    };

    worker.postMessage({ code, data });
  }

  // Example button hook:
  document.getElementById("runBtn").addEventListener("click", () => {
    const code = document.getElementById("codeInput").value;
    const data = document.getElementById("dataInput").value;
    runInWorker(code, data);
  });
</script>

