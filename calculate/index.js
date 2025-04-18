import express from "express";
import axios from "axios";

const app = express();

app.use(express.json());

const window = [];
const size = 10;
const apiUrl = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand",
};

const average = (nums) => {
  const sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length;
};

const details = await axios.post(
  "http://20.244.56.144/evaluation-service/auth",
  {
    email: "harshit.rathore_cs22@gla.ac.in",
    name: "harshit singh rathore",
    rollNo: "2215000778",
    accessCode: "CNneGT",
    clientID: "aace9ec2-a571-40a9-bc53-00cbf629ddae",
    clientSecret: "rkwVVAZgqUutnhXJ",
  }
);

console.log(details);

app.get("/numbers/:id", async (req, res) => {
  const id = req.params.id;

  console.log(id);

  const call = apiUrl[id];
  const windowPrevState = [...window];
  const bearer = details.data.access_token;
  console.log(bearer)
    let nums = [];
  try {
    const response = await axios.get(call, {
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
        timeout: 500
      });
      nums = response.data.numbers;
  } catch (error) {
    console.error("Error fetching numbers:", error.message);
    return res.json({
      windowPrevState,
      windowCurrState: window,
      average: average(window),
      numbers: []
    });
  }

  for (const num of nums) {
    if (!window.includes(num)) {
      if (window.length >= size) {
        window.shift();
      }
      window.push(num);
    }
  }

  const windowCurrState = [...window];
  const avg = average(windowCurrState);

  res.json({
    windowPrevState,
    windowCurrState,
    average: avg,
    numbers: nums
  });
});

app.listen(3000, () => {
  console.log("server started successfully");
});
