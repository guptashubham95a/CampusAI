const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { getJson } = require("serpapi");
const config = require("config");
const elasticConfig = config.get("elastic");
const { Client } = require("@elastic/elasticsearch");

// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");

const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const client = new Client({
  cloud: {
    id: elasticConfig.cloudID,
  },
  auth: {
    username: elasticConfig.username,
    password: elasticConfig.password,
  },
});
client.info();
// .then((response) => console.log(response))
// .catch((error) => console.error(error));

app.get("/api/fetchData/:index", async (req, res) => {
  try {
    const { index } = req.params;
    console.log("req.params", index);
    const response = await fetchDataFromAPI(index);
    console.log("/api/fetchData", response.hits.hits);
    res.status(200).send("Data indexed successfully");
  } catch (error) {
    console.error("Error /api/fetchData:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/indexData", async (req, res) => {
  try {
    const { index, data } = req.body; // Extract index, character, and sports from request body

    // {
    //   character: "Test this",
    //   sports: [
    //     "guptashubh@gmail.com",
    //     "1@gmail.com",
    //     "2@gmail.com",
    //     "3@gmail.com",
    //   ],
    // }

    console.log("/api/indexData req.body", req.body);
    const response = await indexDataIntoElasticsearch(index, data);
    // console.log("/api/indexData", response);

    await client.indices.refresh({ index });

    res.status(200).send("Data indexed successfully");
  } catch (error) {
    console.error("Error indexing data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/api/updateData", async (req, res) => {
  try {
    const { category, email, wantToSubscribe } = req.body;

    const response = await client.updateByQuery({
      index: "subscription-details",
      body: {
        script: {
          source: wantToSubscribe
            ? `
              if (ctx._source.containsKey('${category}')) {
                ctx._source['${category}'].add(params.email);
              } else {
                ctx._source['${category}'] = [params.email];
              }
            `
            : `
              for (int i = ctx._source['${category}'].size() - 1; i >= 0; i--) {
                if (ctx._source['${category}'][i] == params.email) {
                  ctx._source['${category}'].remove(i);
                }
              }
            `,
          params: { email },
        },
        query: { exists: { field: category } },
      },
    });

    console.log("/api/updateData", response);
    res.status(200).send("Data updated successfully");
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to get all email data for a particular category
app.get("/api/getEmailData/:category", async (req, res) => {
  try {
    const { category } = req.params; // Extract category from request parameters

    // Search for documents with the given category field
    const response = await client.search({
      index: "subscription-details", // Replace 'your_index_name' with the actual index name
      body: {
        query: {
          exists: { field: category },
        },
      },
    });

    // Extract email data from the documents
    const emailData = [];
    const hits = response.hits.hits;
    for (const hit of hits) {
      const doc = hit._source;
      emailData.push(...doc[category]);
    }

    res.status(200).json(emailData);
    console.log(`/api/getEmailData/`, emailData);
  } catch (error) {
    console.error("Error getting email data:", error);
    res.status(500).send("Internal Server Error");
  }
});

//          To check if the user is subscribed to category or not
// Endpoint to check if a given email ID is present in the list associated with a specific category
app.post("/api/checkEmail", async (req, res) => {
  try {
    const category = "sports";
    const email = "2@gmail.com";
    // const { category, email } = req.body; // Extract category and email from request body

    // Search for documents with the given category containing the specified email ID
    const response = await client.search({
      index: "game-of-thrones", // Replace 'your_index_name' with the actual index name
      body: {
        query: {
          exists: { field: category },
        },
      },
    });
    // Check if any documents were found with the specified category
    if (response.hits.total.value > 0) {
      console.log("checkEmail", response.hits.hits);
      // Iterate through the documents to check if the email exists in the category array
      const hits = response.hits.hits;
      for (const hit of hits) {
        const doc = hit._source;
        if (doc[category].includes(email)) {
          res.status(200).json(true);
          return;
        }
      }
    }
    res.status(200).json(false);
    // const isEmailPresent = response; // Check if any documents match the query
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function fetchDataFromAPI(index) {
  try {
    const response = await client.search({ index: index });
    // console.log("fetchDataFromAPI", response.hits.hits);
    return response;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
}

//  store all the post data
//  store new created post
//  add subscription logic to index

async function indexDataIntoElasticsearch(index, data) {
  await client.index({
    index: index,
    body: data,
  });

  await client.indices.refresh({ index: index });
}

app.get("/search/restaurants", async (req, res) => {
  // const { q, latitude, longitude } = req.query;
  try {
    const { q, latitude, longitude } = req.query;
    console.log("logging q, latitude, longitude ", q, latitude, longitude);
    const response = await fetchDataFromAPI(q, latitude, longitude);
    // const response = await fetchDataFromAPI("Alinea", 41.9134, -87.6487);
    console.log("/search/restaurants", response);
    res.json(response);
  } catch (error) {
    console.error("Error fetching data from SERP API:", error);

    res.status(500).send("Error fetching data from SERP API:");
  }
});
app.get("/search/events", async (req, res) => {
  try {
    const { q, city } = req.query;
    const response = await fetchEventDataFromAPI(q, city);
    // console.log("/search/events", response);
    res.json(response);
  } catch (error) {
    console.error("Error fetching data from events API:", error);
    res.status(500).send("Error fetching data from events API:");
  }
});
async function fetchEventDataFromAPI(q, city) {
  const SERP_API_KEY =
    "3ff9e88ac6baecd35716b0e1b5224400d1d7640c84945a4c5117f9df24e04720";
  try {
    const json = await new Promise((resolve, reject) => {
      getJson(
        {
          engine: "google_events",
          api_key: SERP_API_KEY,
          q: q,
          location: city,
        },
        (data) => {
          resolve(data);
        }
      );
    });
    if (!json || !json["events_results"]) {
      return null;
    }
    console.log(
      `json[events_results] for ${q}`,
      json["events_results"][0].date.when
    );
    return json["events_results"];
  } catch (error) {
    console.error("Error fetching data from events API:", error);
    throw error;
  }
}

async function fetchDataFromAPI(q, latitude, longitude) {
  // serp API key
  // 92ed427efacf59f14e8a20571838439d7ff08214bf2170b9072d6c88fbfcf48f
  const SERP_API_KEY =
    "3ff9e88ac6baecd35716b0e1b5224400d1d7640c84945a4c5117f9df24e04720";
  try {
    // const { q, latitude, longitude } = req.query;
    // console.log("logging q, latitude, longitude ", q, latitude, longitude);
    const json = await new Promise((resolve, reject) => {
      getJson(
        {
          engine: "google_maps",
          api_key: SERP_API_KEY,
          q: q,
          location: `${latitude},${longitude}`,
        },
        (data) => {
          resolve(data);
        }
      );
    });
    if (!json || !json["local_results"]) {
      return null;
    }
    return json["local_results"][0];
    // res.json(data);
    // return response;
  } catch (error) {
    console.error("Error fetching data from SERP API:", error);

    throw error;
  }
}

async function main() {
  console.log("fetching DataFromAPI ");
  try {
    // await fetchDataFromAPI("Alinea", 41.9134, -87.6487);
    // await fetchEventDataFromAPI(
    //   "Chicago Bears vs. Green Bay Packers ",
    //   "Chicago"
    // );
  } catch (error) {
    console.error("An error occurred:", error);
  }

  // try {
  //   //   const data = await fetchDataFromAPI();
  //   // await indexDataIntoElasticsearch();
  //   await fetchDataFromAPI();
  //   console.log("indexDataIntoElasticsearch done");
  // } catch (error) {
  //   console.error("An error occurred:", error);
  // }
}

// main();

app.listen(3001, () => {
  console.log("Backend server is running on port 3001");
});
