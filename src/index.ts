import express, { Request, Response } from "express";
import cors from "cors";
import datasource from "./utils";
import wildersController from "./controllers/Wilders"; // → objet (key-value)
import skillsController from "./controllers/Skills";
import upvotesController from "./controllers/Upvotes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello you!");
});

// High order function = function that returns a function
type Controller = (req: Request, res: Response) => void;
const asyncHandler = (controller: Controller): Controller => {
  return async function (req: Request, res: Response): Promise<void> {
    try {
      await controller(req, res);
    } catch (err: any) {
      console.error("Error: ", err);
      res.status(500).json({ error: err.message || "Error occured" });
    }
  };
};

// Pur function, same input = same output
function sum(a: number, b: number): number {
  return a + b;
}

/**
 * Wilders Routes
 */
app.post("/api/wilders", wildersController.create);
app.get("/api/wilders", wildersController.findAll);
app.get("/api/wilders/:wilderId", asyncHandler(wildersController.find));
app.put("/api/wilders/:wilderId", asyncHandler(wildersController.update));
app.delete("/api/wilders/:wilderId", wildersController.delete);

/**
 * Skills Routes
 */
app.post("/api/skills", skillsController.create);
app.get("/api/skills", skillsController.findAll);

/**
 * Upvotes Routes
 */
app.post("/api/upvotes", asyncHandler(upvotesController.create));
app.put(
  "/api/upvotes/:upvoteId/upvote",
  asyncHandler(upvotesController.upvote)
);

// end of request

app.listen(5000, async () => {
  console.log("Server started, youpi!");

  /**
   * datasource.initialize()
   *  .then(() => console.log("I'm connected!"))
   *  .catch(() => console.log("Dommage"))
   */

  try {
    await datasource.initialize();
    console.log("I'm connected!");
  } catch (err) {
    console.log("Dommage");
    console.error(err);
  }
});

// 2 bonuses
// → add upvotes to wilder skill
// → uploaded un avatar, package → multer
