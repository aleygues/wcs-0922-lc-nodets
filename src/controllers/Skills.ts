import datasource from "../utils";
import express from "express";
import { Skill } from "../entities/Skill";

export default {
  create: (req: express.Request, res: express.Response): void => {
    const repository = datasource.getRepository("Skill");

    repository
      .query("INSERT INTO skill(name) VALUES (?)", [req.body.name])
      .then(
        (id) => {
          repository.query("SELECT * FROM skill WHERE id=?", [id]).then(
            (data) => {
              res.json(data[0]);
            },
            (err) => console.error(err)
          );
        },
        (err) => {
          console.error("Error: ", err);
          res.json({ success: false });
        }
      );
  },
  findAll: async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    const repository = datasource.getRepository(Skill);

    // With SQL raw query
    /* repository.query("SELECT * FROM skill").then((data) => {
      res.json(data);
    }); */

    const skills = await repository.find({
      relations: ["upvotes", "upvotes.wilder"],
    });
    res.json(skills);
  },
  find: (req: express.Request, res: express.Response): void => {
    const skillId = req.params.skillId;

    // find 1 skill by its ID
  },
  update: (req: Request, res: Response): void => {
    /**
     * 2 options:
     * - raw SQL → UPDATE
     * - TypeORM: find + save
     */
  },
  delete: (req: Request, res: Response): void => {
    /**
     * 2 options:
     * - raw SQL → DELETE
     * - TypeORM: find + remove
     */
  },
};
