require("dotenv").config();

const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
  cluster.on("exit", () => {
    cluster.fork();
  });
} else {
  const bcrypt = require("bcrypt");
  const express = require("express");
  const cors = require("cors");
  const { MongoClient, ObjectId } = require("mongodb");
  const path = require("path");

  const app = express();
  app.use(cors());
  app.use(express.json());

  //jwt token generation and authentication functions
  const jwt = require("jsonwebtoken");

  function generateJWTAccessToken(data) {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "86400s" });
  }
  function authenticateJWTAccessToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) return res.sendStatus(403);

      req.userid = data["userid"];

      next();
    });
  }

  /**
   *
   * @param {string} connection_string
   * @returns mongodb connection
   */
  async function getMongoClient(connection_string) {
    return new Promise(async (resolve, reject) => {
      try {
        const uri = connection_string;
        const client = new MongoClient(uri);
        await client.connect();
        resolve(client);
      } catch (error) {
        reject(error);
      }
    });
  }

  true;
  let mongoClient;
  (async function () {
    try {
      mongoClient = await getMongoClient(process.env.MONGODB_CONNECTION_LINK);
    } catch (error) {
      console.log("Error in connecting to database");
      console.log(error);
    }
  })();

  /**
   *
   * @param {string} password
   * @param {string} password_hash
   * @returns boolean true if password and password_hash matches else false
   */
  async function comparePasswordHash(password, password_hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, password_hash, function (err, result) {
        err ? reject(err) : resolve(result);
      });
    });
  }
  app.post("/login", async (req, res) => {
    const { username, password } = { ...req.body };
    if (username && password) {
      //check if username exists
      const userDocument = await mongoClient
        .db("easy_survey")
        .collection("users")
        .findOne({ username: username }, { forms: 0 });

      if (userDocument) {
        const passwordMatched = await comparePasswordHash(
          password,
          userDocument["password_hash"]
        );
        if (passwordMatched) {
          res.json({
            success: true,
            authToken: generateJWTAccessToken({ userid: userDocument["_id"] }),
          });
        }
      } else {
        res.json({ success: false, error: "INVALID_USERNAME_OR_PASSWORD" });
      }
    }
    //compare the hash and given password
    //if match generate the jwt token token and pass it to user
  });

  app.get("/authenticate-token", authenticateJWTAccessToken, (req, res) => {
    res.json({ success: true });
  });

  /**
   *
   * @param {string} password
   * @returns string, hashed password
   */
  async function generatePasswordHash(password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function (err, hash) {
        err ? reject(err) : resolve(hash);
      });
    });
  }
  app.post("/register-user", async (req, res) => {
    const { username, password } = { ...req.body };
    if (username && password) {
      //check if username already exists
      const user_doc = await mongoClient
        .db("easy_survey")
        .collection("users")
        .findOne({ username: username }, { projection: { _id: 1 } });
      //if not store the data in db
      if (!user_doc) {
        const newUseDataWritAcknowedgement = await mongoClient
          .db("easy_survey")
          .collection("users")
          .insertOne({
            username: username,
            password_hash: await generatePasswordHash(password),
            forms: [],
          });
        if (newUseDataWritAcknowedgement["acknowledged"]) {
          res.json({ success: true });
        } else {
          res.json({
            success: false,
            error: "INTERNAL_SERVER_ERROR",
          });
        }
      } else {
        //case whan username already exists
        res.json({ success: false, error: "USERNAME_ALREADY_EXISTS" });
      }
    }
  });

  app.get("/form-schema", async (req, res) => {
    const { formid } = { ...req.query };
    if (formid) {
      //check if form id exists in database form_schema collection
      const formSchemaDocument = await mongoClient
        .db("easy_survey")
        .collection("schema_collections")
        .findOne({ _id: new ObjectId(formid) }, { projection: { schema: 1 } });
      if (formSchemaDocument) {
        res.json({ success: true, data: formSchemaDocument });
      } else {
        res.json({ success: false, error: "INVALID_FORM_ID" });
      }
    } else {
      res.json({ success: false, error: "MISSING_FORM_ID" });
    }
  });

  app.post("/submit-user-form", async (req, res) => {
    const { formid } = { ...req.query };
    const formData = req.body;
    if (formid && formData) {
      //check if formid exists

      //get data document id from schema document
      const { data_id } = await mongoClient
        .db("easy_survey")
        .collection("schema_collections")
        .findOne(
          { _id: new ObjectId(formid) },
          { projection: { _id: 0, data_id: 1 } }
        );
      if (data_id) {
        // const data_document = await mongoClient
        //   .db("easy_survey")
        //   .collection("data_collections")
        //   .findOne({ _id: new ObjectId(data_id) });
        // console.log(JSON.stringify(data_document));
        // console.log(formData);
        for (const prompt in formData) {
          if (Object.hasOwnProperty.call(formData, prompt)) {
            const promptResponse = formData[prompt];
            const dataDocumentUpdate = await mongoClient
              .db("easy_survey")
              .collection("data_collections")
              .updateOne(
                {
                  _id: new ObjectId(data_id),
                  data: {
                    $elemMatch: {
                      title: prompt,
                    },
                    $elemMatch: {
                      "options.option": promptResponse,
                    },
                  },
                },
                { $inc: { "data.$[i].options.$[j].value": 1 } },
                {
                  arrayFilters: [
                    { "i.title": prompt },
                    { "j.option": promptResponse },
                  ],
                }
              );
            if (!dataDocumentUpdate["acknowledged"]) {
              res.json({ success: false, error: null }); //suspicious for submision by user
              return;
            }
          }
        }
        res.json({ success: true });
      } else {
        //if formid does not exists -> send formid invalid response to client
        res.json({ success: false, error: "INVALID_FORM_ID" });
      }
      //update the data document accordingly
      //send success response to client
    } else {
      res.json({ success: false, error: "MISSING_FORM_ID" });
    }
  });

  app.get("/form-data", authenticateJWTAccessToken, async (req, res) => {
    const { formdataid } = { ...req.query };
    if (formdataid) {
      //check if formdata id belongs to userid
      const formDataIdBelongsToUserId = await mongoClient
        .db("easy_survey")
        .collection("users")
        .findOne(
          {
            _id: new ObjectId(req["userid"]),
            forms: { $elemMatch: { form_data_id: new ObjectId(formdataid) } },
          },
          {
            projection: { _id: 1, "forms.$": 1 },
          }
        );
      if (formDataIdBelongsToUserId) {
        const form_title = formDataIdBelongsToUserId["forms"][0]["form_title"];
        //the form data elongs to user, now send the form data to user
        const formData = await mongoClient
          .db("easy_survey")
          .collection("data_collections")
          .findOne({ _id: new ObjectId(formdataid) });
        if (formData) {
          const aa = {
            success: true,
            data: {
              form_title: "kkk",
              data: [
                {
                  options: [
                    { option: "adsf", value: 1 },
                    { option: "fd", value: 0 },
                    { option: "drg", value: 1 },
                    { option: "we", value: 1 },
                  ],
                  title: "asfasf",
                },
              ],
            },
          };

          res.json({
            success: true,
            data: { form_title: form_title, data: formData["data"] },
          });
        } else {
          res.json({ success: false, error: "MISSING_FORM_DATA" }); //---------------
        }
      } else {
        res.json({ success: false, error: "INVALID_FORMDATA_ID" });
      }
    } else {
      res.json({ success: false, error: "MISSING_FORMDATA_ID" });
    }
  });

  app.get(
    "/all-survey-forms-metadata",
    authenticateJWTAccessToken,
    async (req, res) => {
      //get forms array from user's document :- it contains form title, "form schema document id" and "form data document id"
      const userFormMetaData = await mongoClient
        .db("easy_survey")
        .collection("users")
        .findOne(
          { _id: new ObjectId(req["userid"]) },
          { projection: { _id: 0, forms: 1 } }
        );
      if (userFormMetaData) {
        res.json({ success: true, data: userFormMetaData["forms"] });
      } else {
        res.json({ success: false, error: "" }); //what should be error in this case......Interna;ServerError?
      }
    }
  );

  app.post(
    "/create-survey-form",
    authenticateJWTAccessToken,
    async (req, res) => {
      const data_document = { data: [] };
      const form_schema_data = req.body;
      form_schema_data["schema"].forEach((card_schema) => {
        if (card_schema["type"] === "prompt") {
          const prompt_data = { options: [] };
          prompt_data["title"] = card_schema["title"];
          if (
            card_schema["response"]["type"] === "checkboxes" ||
            card_schema["response"]["type"] === "options"
          ) {
            card_schema["response"]["options"].forEach((option) => {
              prompt_data["options"].push({ option: option, value: 0 });
            });
          } else if (card_schema["response"]["type"] === "int") {
            for (
              let i = Number(card_schema["response"]["min"]);
              i <= Number(card_schema["response"]["max"]);
              i++
            ) {
              prompt_data["options"].push({ option: `${i}`, value: 0 });
            }
          }
          data_document["data"].push(prompt_data);
        }
      });
      try {
        const formDataWriteOperation = await mongoClient
          .db("easy_survey")
          .collection("data_collections")
          .insertOne(data_document);

        if (formDataWriteOperation["acknowledged"] === true) {
          const formSchemaWriteOperation = await mongoClient
            .db("easy_survey")
            .collection("schema_collections")
            .insertOne({
              created_at: new Date(),
              title: form_schema_data["title"],
              schema: form_schema_data["schema"],
              data_id: formDataWriteOperation["insertedId"],
            });
          if (formSchemaWriteOperation["acknowledged"] === true) {
            await mongoClient
              .db("easy_survey")
              .collection("users")
              .updateOne(
                { _id: new ObjectId(req["userid"]) },
                {
                  $push: {
                    forms: {
                      form_title: form_schema_data["title"],
                      form_schema_id: formSchemaWriteOperation["insertedId"],
                      form_data_id: formDataWriteOperation["insertedId"],
                    },
                  },
                }
              );
          }
        }
        res.json({ success: true });
      } catch (error) {
        console.log(error);
        res.json({ success: false });
      }
    }
  );

  app.delete("/survey-form", authenticateJWTAccessToken, (req, res) => {});

  app.listen(process.env.PORT, () => {
    console.log("listning to port " + process.env.PORY);
  });
}
