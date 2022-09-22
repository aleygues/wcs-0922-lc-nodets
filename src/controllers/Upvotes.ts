import datasource from "../utils";
import { Request, Response } from "express";
import { Upvote } from "../entities/Upvote";

export default {
  create: async (req: Request, res: Response): Promise<void> => {
    const repository = datasource.getRepository(Upvote);
    const upvotes: Upvote[] = [];

    for (const skillId of req.body.skillsIds) {
      const exitingUpvote = await repository.findOne({
        where: {
          skill: { id: skillId },
          wilder: { id: req.body.wilderId },
        },
      });

      if (exitingUpvote !== null) {
        upvotes.push(exitingUpvote);
      } else {
        const upvote = await repository.save({
          wilder: { id: req.body.wilderId },
          skill: { id: skillId },
        });
        upvotes.push(upvote);
      }
    }

    res.json(upvotes);
  },
  upvote: async (req: Request, res: Response): Promise<void> => {
    const repository = datasource.getRepository(Upvote);

    const exitingUpvote = await repository.findOne({
      where: {
        id: Number(req.params.upvoteId),
      },
    });

    if (exitingUpvote !== null) {
      exitingUpvote.upvotes = exitingUpvote.upvotes + 1;

      await repository.save(exitingUpvote);

      res.json(exitingUpvote);
    } else {
      throw new Error("Doest not exist");
    }
  },
};
